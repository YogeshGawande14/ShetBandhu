package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.domain.*;
import com.agroconnect.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.*;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class OrderService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private final OrderRepository orders;
    private final ProductRepository products;
    private final KendraRepository shops;
    private final UserRepository users;

    @Transactional
    public OrderResponse place(OrderRequest request, UUID farmerId) {
        User farmer = requireFarmer(farmerId);
        validateAddress(request.deliveryType(), request.deliveryAddress(), request.postalCode(), request.deliveryCity(), request.deliveryDistrict());
        KrishiSevaKendra shop = verifiedShop(request.shopId());
        PurchaseOrder order = makeOrder(shop, request.items(), request.deliveryType(), farmer,
                farmer.getFullName(), farmer.getPhoneNumber(), request.deliveryAddress(), request.postalCode(),
                request.deliveryCity(), request.deliveryDistrict(), "Maharashtra", request.deliveryLandmark(), null,
                request.voiceAudioUrl(), request.voiceTranscript());
        return response(orders.save(order), null);
    }

    @Transactional
    public CheckoutResponse checkoutGuest(CheckoutRequest request) {
        validateAddress(request.deliveryType(), request.deliveryAddress(), request.postalCode(), request.deliveryCity(), request.deliveryDistrict());
        String accessToken = newGuestToken();
        String tokenHash = sha256(accessToken);
        List<OrderResponse> result = createOrders(request, null, request.customerName().trim(), request.contactPhone(), tokenHash);
        return new CheckoutResponse(accessToken, result);
    }

    @Transactional
    public CheckoutResponse checkoutFarmer(CheckoutRequest request, UUID farmerId) {
        User farmer = requireFarmer(farmerId);
        validateAddress(request.deliveryType(), request.deliveryAddress(), request.postalCode(), request.deliveryCity(), request.deliveryDistrict());
        List<OrderResponse> result = createOrders(request, farmer, farmer.getFullName(), farmer.getPhoneNumber(), null);
        return new CheckoutResponse(null, result);
    }

    private List<OrderResponse> createOrders(CheckoutRequest request, User farmer, String customerName,
                                             String contactPhone, String guestTokenHash) {
        Set<UUID> uniqueShops = new HashSet<>();
        List<OrderResponse> result = new ArrayList<>();
        for (CheckoutShopRequest group : request.shops()) {
            if (!uniqueShops.add(group.shopId())) throw new BadRequestException("Cart contains a duplicate store group");
            KrishiSevaKendra shop = verifiedShop(group.shopId());
            PurchaseOrder order = makeOrder(shop, group.items(), request.deliveryType(), farmer, customerName,
                    contactPhone, request.deliveryAddress(), request.postalCode(), request.deliveryCity(),
                    request.deliveryDistrict(), request.deliveryState(), request.deliveryLandmark(), guestTokenHash,
                    null, null);
            result.add(response(orders.save(order), null));
        }
        return List.copyOf(result);
    }

    private PurchaseOrder makeOrder(KrishiSevaKendra shop, List<OrderLine> lines, DeliveryType deliveryType,
                                    User farmer, String customerName, String contactPhone, String address,
                                    String postalCode, String city, String district, String state, String landmark,
                                    String guestTokenHash, String audioUrl, String transcript) {
        PurchaseOrder order = new PurchaseOrder();
        order.setFarmer(farmer);
        order.setShop(shop);
        order.setCustomerName(customerName);
        order.setContactPhone(contactPhone);
        order.setDeliveryType(deliveryType);
        order.setDeliveryAddressRequired(deliveryType == DeliveryType.DOORSTEP_DELIVERY);
        order.setDeliveryAddress(clean(address));
        order.setPostalCode(clean(postalCode));
        order.setDeliveryCity(clean(city));
        order.setDeliveryDistrict(clean(district));
        order.setDeliveryState(clean(state));
        order.setDeliveryLandmark(clean(landmark));
        order.setGuestAccessTokenHash(guestTokenHash);
        order.setVoiceAudioUrl(audioUrl);
        order.setVoiceTranscript(transcript);

        BigDecimal total = BigDecimal.ZERO;
        for (OrderLine line : lines) {
            AgriProduct product = products.findByIdForCheckout(line.productId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + line.productId()));
            if (!product.isActive() || !product.getShop().getId().equals(shop.getId()))
                throw new BadRequestException("Every cart item must be active and belong to its selected store");
            if (farmer != null && product.getShop().getOwner().getId().equals(farmer.getId()))
                throw new BadRequestException("You cannot order products from your own agri centre");
            if (product.getStockQuantity() < line.quantity())
                throw new BadRequestException("Only " + product.getStockQuantity() + " units remain for " + product.getProductName());
            product.setStockQuantity(product.getStockQuantity() - line.quantity());
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(line.quantity())).setScale(2, RoundingMode.HALF_UP);
            OrderItem item = new OrderItem();
            item.setProduct(product);
            item.setQuantity(line.quantity());
            item.setUnitPrice(product.getPrice());
            item.setLineTotal(lineTotal);
            order.addItem(item);
            total = total.add(lineTotal);
        }
        order.setTotalAmount(total.setScale(2, RoundingMode.HALF_UP));
        return order;
    }

    private User requireFarmer(UUID farmerId) {
        User farmer = users.findById(farmerId).orElseThrow(() -> new NotFoundException("Farmer not found"));
        if (farmer.getRole() != Role.FARMER) throw new AccessDeniedException("Only farmers can place orders");
        return farmer;
    }

    private KrishiSevaKendra verifiedShop(UUID shopId) {
        KrishiSevaKendra shop = shops.findById(shopId).orElseThrow(() -> new NotFoundException("Shop not found"));
        if (!shop.isVerified()) throw new BadRequestException("Orders are available only from verified centres");
        return shop;
    }

    private void validateAddress(DeliveryType type, String address, String postalCode, String city, String district) {
        if (type == DeliveryType.DOORSTEP_DELIVERY &&
                (blank(address) || blank(postalCode) || blank(city) || blank(district))) {
            throw new BadRequestException("Enter the delivery address, PIN code, city and district, or choose store pickup");
        }
    }

    @Transactional(readOnly = true)
    public OrderResponse trackGuest(UUID id, String token) {
        if (blank(token)) throw new AccessDeniedException("A guest tracking token is required");
        PurchaseOrder order = orders.findById(id).orElseThrow(() -> new NotFoundException("Order not found"));
        String storedHash = order.getGuestAccessTokenHash();
        if (order.getFarmer() != null || storedHash == null ||
                !MessageDigest.isEqual(storedHash.getBytes(StandardCharsets.US_ASCII), sha256(token).getBytes(StandardCharsets.US_ASCII))) {
            throw new AccessDeniedException("This tracking link is invalid");
        }
        return response(order, null);
    }

    @Transactional(readOnly = true)
    public OrderResponse get(UUID id, UUID actor, boolean admin) {
        PurchaseOrder order = orders.findById(id).orElseThrow(() -> new NotFoundException("Order not found"));
        boolean farmer = order.getFarmer() != null && order.getFarmer().getId().equals(actor);
        if (!admin && !farmer && !order.getShop().getOwner().getId().equals(actor))
            throw new AccessDeniedException("You cannot view this order");
        return response(order, null);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> mine(UUID actor, Role role, Pageable pageable) {
        if (role == Role.FARMER) return orders.findByFarmer_Id(actor, pageable).map(o -> response(o, null));
        if (role == Role.SHOP_OWNER) return orders.findByShop_Owner_Id(actor, pageable).map(o -> response(o, null));
        throw new AccessDeniedException("Unsupported account role");
    }

    @Transactional
    public OrderResponse changeStatus(UUID id, OrderStatus requested, UUID actor, Role activeRole) {
        PurchaseOrder order = orders.findById(id).orElseThrow(() -> new NotFoundException("Order not found"));
        boolean farmer = order.getFarmer() != null && order.getFarmer().getId().equals(actor);
        boolean owner = order.getShop().getOwner().getId().equals(actor);
        if (requested == OrderStatus.CANCELLED && activeRole == Role.FARMER && farmer && order.getStatus() == OrderStatus.PENDING) {
            order.getItems().forEach(i -> i.getProduct().setStockQuantity(i.getProduct().getStockQuantity() + i.getQuantity()));
        } else if (requested == OrderStatus.CONFIRMED && activeRole == Role.SHOP_OWNER && owner && order.getStatus() == OrderStatus.PENDING) {
            // Accepted by the centre.
        } else if (requested == OrderStatus.PACKED && activeRole == Role.SHOP_OWNER && owner && order.getStatus() == OrderStatus.CONFIRMED) {
            // Packed by the centre.
        } else if (requested == OrderStatus.OUT_FOR_DELIVERY && activeRole == Role.SHOP_OWNER && owner && (order.getStatus() == OrderStatus.PACKED || order.getStatus() == OrderStatus.CONFIRMED)) {
            // Handed to the delivery route.
        } else if (requested == OrderStatus.DISPATCHED && activeRole == Role.SHOP_OWNER && owner && order.getStatus() == OrderStatus.CONFIRMED) {
            // Dispatched by the centre.
        } else if (requested == OrderStatus.DELIVERED && activeRole == Role.SHOP_OWNER && owner && (order.getStatus() == OrderStatus.DISPATCHED || order.getStatus() == OrderStatus.OUT_FOR_DELIVERY)) {
            // Delivered by the centre.
        } else throw new BadRequestException("This order status transition is not allowed for the current user");
        order.setStatus(requested);
        return response(order, null);
    }

    private OrderResponse response(PurchaseOrder order, String guestAccessToken) {
        String name = order.getCustomerName() != null ? order.getCustomerName() : order.getFarmer() == null ? "Guest customer" : order.getFarmer().getFullName();
        String phone = order.getContactPhone() != null ? order.getContactPhone() : order.getFarmer() == null ? null : order.getFarmer().getPhoneNumber();
        return new OrderResponse(order.getId(), order.getFarmer() == null ? null : order.getFarmer().getId(), name, phone,
                order.getShop().getId(), order.getShop().getShopName(), order.getStatus().name(), order.getDeliveryType(),
                order.getDeliveryAddress(), order.getPostalCode(), order.getDeliveryCity(), order.getDeliveryDistrict(),
                order.getDeliveryState(), order.getDeliveryLandmark(), order.getTotalAmount(), order.getVoiceAudioUrl(),
                order.getVoiceTranscript(), order.getCreatedAt(), order.getItems().stream().map(i ->
                new OrderItemResponse(i.getProduct().getId(), i.getProduct().getProductName(), i.getQuantity(), i.getUnitPrice(), i.getLineTotal())).toList());
    }

    private String newGuestToken() {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("SHA-256 is unavailable", ex);
        }
    }

    private static String clean(String value) { return value == null || value.isBlank() ? null : value.trim(); }
    private static boolean blank(String value) { return value == null || value.isBlank(); }
}
