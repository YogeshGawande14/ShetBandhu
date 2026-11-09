package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.KendraRequest;
import com.agroconnect.api.dto.ApiDtos.KendraResponse;
import com.agroconnect.api.dto.ApiDtos.KendraSearchResponse;
import com.agroconnect.api.dto.ApiDtos.AdminKendraReviewResponse;
import com.agroconnect.api.mapper.AgroMapper;
import com.agroconnect.domain.KrishiSevaKendra;
import com.agroconnect.domain.Role;
import com.agroconnect.domain.User;
import com.agroconnect.domain.VerificationStatus;
import com.agroconnect.repository.KendraRepository;
import com.agroconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class KendraService {
    private static final double EARTH_RADIUS_KM = 6371.0088;

    private final KendraRepository shops;
    private final UserRepository users;
    private final AgroMapper mapper;
    private final com.agroconnect.repository.KendraApprovalAuditRepository approvalAudits;

    @Transactional
    public KendraResponse create(KendraRequest request, UUID ownerId) {
        User owner = users.findById(ownerId).orElseThrow(() -> new NotFoundException("Owner not found"));
        if (!owner.getRoles().contains(Role.SHOP_OWNER)) throw new AccessDeniedException("Only an approved owner account can register a shop");
        KrishiSevaKendra shop = mapper.kendra(request);
        shop.setOwner(owner);
        shop.setBusinessType(request.businessType()==null||request.businessType().isBlank()?"KENDRA":request.businessType());
        shop.setVerified(false);
        shop.setVerificationStatus(VerificationStatus.PENDING);
        return response(shops.save(shop), 0);
    }

    @Transactional(readOnly = true)
    public List<KendraResponse> myShops(UUID ownerId) {
        return shops.findByOwner_Id(ownerId).stream().map(shop -> response(shop, 0)).toList();
    }

    @Transactional(readOnly = true)
    public List<KendraSearchResponse> search(String query) {
        if (query == null || query.trim().length() < 3) throw new BadRequestException("Enter at least 3 letters or digits to search by area or PIN code");
        return shops.searchVerifiedByArea(query.trim()).stream()
                .map(shop -> new KendraSearchResponse(shop.getId(), shop.getShopName(), shop.getAddress(), maskPhone(shop.getContactNumber()), true))
                .toList();
    }
    @Transactional(readOnly = true)
    public List<KendraResponse> pendingVerification() {
        return shops.findByVerifiedFalse().stream().filter(shop -> shop.getVerificationStatus() == VerificationStatus.PENDING).map(shop -> response(shop, 0)).toList();
    }

    @Transactional(readOnly = true)
    public List<AdminKendraReviewResponse> pendingReviews() {
        return shops.findByVerifiedFalse().stream().filter(shop -> shop.getVerificationStatus() == VerificationStatus.PENDING)
                .map(shop -> new AdminKendraReviewResponse(shop.getId(), shop.getShopName(), shop.getOwner().getId(), shop.getOwner().getFullName(), shop.getOwner().getEmail(), shop.getBusinessType(), shop.getAddress(), shop.getContactNumber(), shop.getGstin(), shop.getOwnerLicenseNumber(), shop.getCity(), shop.getPostalCode(), shop.getDocumentUrl(), shop.getServiceSummary(), shop.getPhotoUrl(), shop.getVerificationStatus().name()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AdminKendraReviewResponse> businessDirectory(String city, String businessType, VerificationStatus status) {
        return shops.findAll(org.springframework.data.domain.Sort.by(
                        org.springframework.data.domain.Sort.Order.asc("city"),
                        org.springframework.data.domain.Sort.Order.asc("shopName")))
                .stream()
                .filter(shop -> city == null || city.isBlank() || (shop.getCity() != null && shop.getCity().toLowerCase(java.util.Locale.ROOT).contains(city.trim().toLowerCase(java.util.Locale.ROOT))))
                .filter(shop -> businessType == null || businessType.isBlank() || businessType.equalsIgnoreCase(shop.getBusinessType()))
                .filter(shop -> status == null || status == shop.getVerificationStatus())
                .map(shop -> new AdminKendraReviewResponse(shop.getId(), shop.getShopName(), shop.getOwner().getId(), shop.getOwner().getFullName(), shop.getOwner().getEmail(), shop.getBusinessType(), shop.getAddress(), shop.getContactNumber(), shop.getGstin(), shop.getOwnerLicenseNumber(), shop.getCity(), shop.getPostalCode(), shop.getDocumentUrl(), shop.getServiceSummary(), shop.getPhotoUrl(), shop.getVerificationStatus().name()))
                .toList();
    }

    @Transactional
    public KendraResponse verify(UUID id, UUID adminId, boolean overrideMissingDocuments, String reason) {
        KrishiSevaKendra shop = shops.findById(id).orElseThrow(() -> new NotFoundException("Kendra not found"));
        boolean missingDocuments = shop.getDocumentUrl() == null || shop.getDocumentUrl().isBlank() || shop.getOwnerLicenseNumber() == null || shop.getOwnerLicenseNumber().isBlank();
        if (missingDocuments && !overrideMissingDocuments) throw new BadRequestException("Documents or licence are missing. Acknowledge the override warning to approve this business.");
        if (missingDocuments && (reason == null || reason.isBlank())) throw new BadRequestException("An audit reason is required when approving without documents");
        shop.setVerified(true);
        shop.setVerificationStatus(VerificationStatus.VERIFIED);
        com.agroconnect.domain.KendraApprovalAudit audit = new com.agroconnect.domain.KendraApprovalAudit();
        audit.setKendraId(shop.getId()); audit.setAdminUserId(adminId); audit.setDocumentsMissing(missingDocuments);
        audit.setReason(reason == null || reason.isBlank() ? "Required documents submitted and reviewed" : reason.trim());
        approvalAudits.save(audit);
        return response(shop, 0);
    }

    @Transactional
    public KendraResponse reject(UUID id) {
        KrishiSevaKendra shop=shops.findById(id).orElseThrow(()->new NotFoundException("Kendra not found"));
        shop.setVerified(false);
        shop.setVerificationStatus(VerificationStatus.REJECTED);
        return response(shop,0);
    }

    @Transactional(readOnly = true)
    public List<KendraResponse> nearby(BigDecimal lat, BigDecimal lon) {
        return nearby(lat, lon, 10.0);
    }

    @Transactional(readOnly = true)
    public List<KendraResponse> nearby(BigDecimal lat, BigDecimal lon, double radiusKm) {
        if (!Double.isFinite(radiusKm) || (radiusKm != 10.0 && radiusKm != 25.0)) {
            throw new BadRequestException("Search radius must be 10 or 25 km");
        }
        if (lat == null || lon == null || lat.abs().compareTo(BigDecimal.valueOf(90)) > 0 || lon.abs().compareTo(BigDecimal.valueOf(180)) > 0) {
            throw new BadRequestException("Valid latitude and longitude are required");
        }
        double latitude = lat.doubleValue();
        double longitude = lon.doubleValue();
        double latDelta = radiusKm / 111.045;
        double lonDelta = Math.min(180.0, radiusKm / (111.045 * Math.max(Math.cos(Math.toRadians(latitude)), 0.000001)));
        BigDecimal minLat = BigDecimal.valueOf(Math.max(-90.0, latitude - latDelta));
        BigDecimal maxLat = BigDecimal.valueOf(Math.min(90.0, latitude + latDelta));
        double minLon = longitude - lonDelta;
        double maxLon = longitude + lonDelta;
        List<KrishiSevaKendra> candidates;
        if (minLon < -180.0) {
            candidates = new ArrayList<>(shops.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, BigDecimal.valueOf(minLon + 360.0), BigDecimal.valueOf(180.0)));
            candidates.addAll(shops.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, BigDecimal.valueOf(-180.0), BigDecimal.valueOf(maxLon)));
        } else if (maxLon > 180.0) {
            candidates = new ArrayList<>(shops.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, BigDecimal.valueOf(minLon), BigDecimal.valueOf(180.0)));
            candidates.addAll(shops.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, BigDecimal.valueOf(-180.0), BigDecimal.valueOf(maxLon - 360.0)));
        } else {
            candidates = shops.findByLatitudeBetweenAndLongitudeBetween(minLat, maxLat, BigDecimal.valueOf(minLon), BigDecimal.valueOf(maxLon));
        }
        return candidates.stream().distinct()
                .filter(shop -> shop.getLatitude()!=null && shop.getLongitude()!=null)
                .map(shop -> Map.entry(shop, distance(latitude, longitude, shop.getLatitude().doubleValue(), shop.getLongitude().doubleValue())))
                .filter(entry -> entry.getKey().isVerified() && entry.getValue() <= radiusKm)
                .sorted(Map.Entry.comparingByValue())
                .map(entry -> response(entry.getKey(), entry.getValue()))
                .toList();
    }

    private KendraResponse response(KrishiSevaKendra shop, double distance) {
        return new KendraResponse(shop.getId(), shop.getShopName(), shop.getOwner().getId(), shop.getAddress(), maskPhone(shop.getContactNumber()),
                shop.getGstin(), shop.isVerified(), shop.getVerificationStatus().name(), shop.getOwnerLicenseNumber(), shop.getCity(), shop.getPhotoUrl(), shop.getLatitude(), shop.getLongitude(),
                BigDecimal.valueOf(distance).setScale(2, RoundingMode.HALF_UP).doubleValue(), shop.getBusinessType(), shop.getServiceSummary(), shop.getPostalCode());
    }

    private String maskPhone(String number) {
        if (number == null || number.length() < 2) return "Protected";
        return "••••••" + number.substring(number.length()-2);
    }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        double p = Math.toRadians(lat2 - lat1);
        double l = Math.toRadians(lon2 - lon1);
        double h = Math.sin(p / 2) * Math.sin(p / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.sin(l / 2) * Math.sin(l / 2);
        return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
    }
}



