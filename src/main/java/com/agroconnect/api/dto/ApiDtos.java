package com.agroconnect.api.dto;

import com.agroconnect.domain.Role;
import com.agroconnect.domain.CropType;
import com.agroconnect.domain.DeliveryType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public final class ApiDtos {
    private ApiDtos() {}
    public record RegisterRequest(@NotBlank @Size(max=120) String fullName, @NotBlank @Pattern(regexp="^[+0-9][0-9 -]{6,19}$") String phoneNumber, @NotBlank @Size(min=5,max=72) String password, @NotNull Role role, @Size(max=100) String village, @Size(max=100) String district, @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude, @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude) {}
    public record LoginRequest(@NotBlank String phoneNumber, @NotBlank @Size(min=5,max=200) String password, Role activeRole) {}
    public record AdminTokenLoginRequest(@NotBlank @Pattern(regexp="^[0-9]{10}$") String accessId,@NotBlank @Size(min=32,max=200) String accessToken) {}
    public record ActiveRoleRequest(@NotNull Role activeRole) {}
    public record AdminAccountStatusRequest(boolean accountEnabled) {}
    public record AdminAccountResponse(UUID id, String fullName, String maskedPhone, Set<Role> roles, String district, String village, boolean accountEnabled, Instant createdAt) {}
    public record SupportTicketCreate(@NotBlank @Size(max=120) String subject,@NotBlank @Size(max=2000) String message) {}
    public record SupportReplyRequest(@NotBlank @Size(max=2000) String message,boolean resolved) {}
    public record SupportTicketResponse(UUID id,UUID requesterId,String requesterName,String requesterRole,String subject,String message,String status,String adminReply,Instant createdAt,Instant updatedAt) {}
    public record FarmerRequestCreate(@NotBlank @Size(max=140) String productName,@NotBlank @Size(max=120) String quantityDescription,@NotBlank @Size(max=100) String village,@NotBlank @Size(max=100) String district,@Pattern(regexp="^[0-9]{6}$") String postalCode,@Size(max=1000) String imageUrl) {}
    public record FarmerRequestReply(@NotNull UUID kendraId,@NotNull Boolean available,@DecimalMin("0.01") BigDecimal price,@NotBlank @Size(max=100) String eta,@Size(max=500) String message) {}
    public record FarmerRequestReplyResponse(UUID id,String kendraName,String district,boolean available,BigDecimal price,String eta,String message,Instant createdAt) {}
    public record FarmerRequestResponse(UUID id,String productName,String quantityDescription,String village,String district,String postalCode,String imageUrl,String status,Instant createdAt,List<FarmerRequestReplyResponse> replies) {}
    public record AuthResponse(String accessToken, String tokenType, Instant expiresAt, UUID userId, String fullName, Role role, Set<Role> roles, Role activeRole, String village, String district, String profilePhotoUrl) {}
    public record ProductRequest(@NotNull UUID shopId, @NotBlank @Size(max=140) String name, @Pattern(regexp="FERTILIZER|PESTICIDE|SEEDS") String category, @Size(max=1000) String description, @NotNull @DecimalMin(value="0.01") BigDecimal price, @NotBlank @Size(max=20) String unit, @Min(0) int stockQuantity, @Size(max=1000) String audioDescriptionUrl, @Size(max=1000) String imageUrl, boolean active) {}
    public record ProductResponse(UUID id, UUID shopId, String shopName, String name, String category, String description, BigDecimal price, String unit, int stockQuantity, boolean active, String audioDescriptionUrl, String imageUrl, Instant createdAt) {}
    public record ProductModerationRequest(boolean approved, @NotBlank @Size(max=500) String reason) {}
    public record AdminProductResponse(UUID id, String productName, String shopName, UUID ownerId, String category, BigDecimal price, String unit, int stockQuantity, String imageUrl, boolean active, boolean adminRemoved, String moderationReason, String adminModeratedBy, Instant moderatedAt, Instant createdAt) {}
    public record KendraRequest(@NotBlank @Size(max=140) String shopName, @NotBlank @Size(max=300) String address, @NotBlank @Size(max=20) String contactNumber, @Pattern(regexp="^[0-9A-Z]{15}$") String gstin, @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude, @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude, @Size(max=100) String ownerLicenseNumber, @NotBlank @Size(max=100) String city, @Size(max=1000) String photoUrl, @Pattern(regexp="KENDRA|AGENCY") String businessType, @Size(max=1000) String documentUrl, @Size(max=1000) String serviceSummary, @NotBlank @Pattern(regexp="^[0-9]{6}$") String postalCode,@Size(max=1000) String imageUrl) {}
    public record KendraResponse(UUID id, String shopName, UUID ownerId, String address, String contactNumber, String gstin, boolean verified, String verificationStatus, String ownerLicenseNumber, String city, String photoUrl, BigDecimal latitude, BigDecimal longitude, double distanceInKm, String businessType, String serviceSummary, String postalCode) {}
    public record AdminKendraReviewResponse(UUID id, String shopName, UUID ownerId, String ownerName, String ownerEmail, String businessType, String address, String contactNumber, String gstin, String ownerLicenseNumber, String city, String postalCode, String documentUrl, String serviceSummary, String photoUrl, String verificationStatus) {}
    public record AdminKendraApprovalRequest(boolean overrideMissingDocuments, @Size(max=500) String reason) {}
    public record KendraSearchResponse(UUID id, String shopName, String address, String contactNumber, boolean verified) {}
    public record OrderLine(@NotNull UUID productId, @Min(1) int quantity) {}
    public record OrderRequest(@NotNull UUID shopId, @NotEmpty List<@Valid OrderLine> items, @NotNull DeliveryType deliveryType, @Size(max=1000) String voiceAudioUrl, @Size(max=2000) String voiceTranscript, @Size(max=500) String deliveryAddress, @Pattern(regexp="^[0-9]{6}$") String postalCode, @Size(max=120) String deliveryCity, @Size(max=120) String deliveryDistrict, @Size(max=180) String deliveryLandmark) {}
    public record CheckoutShopRequest(@NotNull UUID shopId, @NotEmpty List<@Valid OrderLine> items) {}
    public record CheckoutRequest(@NotBlank @Size(max=120) String customerName, @NotBlank @Pattern(regexp="^[6-9][0-9]{9}$") String contactPhone, @NotNull DeliveryType deliveryType, @Size(max=500) String deliveryAddress, @Pattern(regexp="^[0-9]{6}$") String postalCode, @Size(max=120) String deliveryCity, @Size(max=120) String deliveryDistrict, @Size(max=120) String deliveryState, @Size(max=180) String deliveryLandmark, @NotEmpty List<@Valid CheckoutShopRequest> shops) {}
    public record CheckoutResponse(String guestAccessToken, List<OrderResponse> orders) {}
    public record OrderStatusRequest(@NotNull com.agroconnect.domain.OrderStatus status) {}
    public record OrderItemResponse(UUID productId, String productName, int quantity, BigDecimal unitPrice, BigDecimal lineTotal) {}
    public record OrderResponse(UUID id, UUID farmerId, String customerName, String contactPhone, UUID shopId, String shopName, String status, DeliveryType deliveryType, String deliveryAddress, String postalCode, String deliveryCity, String deliveryDistrict, String deliveryState, String deliveryLandmark, BigDecimal totalAmount, String voiceAudioUrl, String voiceTranscript, Instant orderDate, List<OrderItemResponse> items) {}
    public record ProfitRequest(@NotNull CropType cropName, @NotNull @DecimalMin("0.01") BigDecimal quantityInQuintals) {}
    public record ProfitOption(String mandiName, BigDecimal ratePerQuintal, BigDecimal transportCostPerQtl, BigDecimal grossRevenue, BigDecimal transportCost, BigDecimal netProfit, String district, LocalDate recordDate) {}
    public record SchemeRequest(@NotBlank @Size(max=180) String title, @NotBlank @Size(max=3000) String description, @NotBlank @Size(max=2000) String eligibility, @NotBlank @Size(max=180) String titleMr, @NotBlank @Size(max=3000) String descriptionMr, @NotBlank @Size(max=2000) String eligibilityMr, @NotBlank @Pattern(regexp="^https://.+") @Size(max=1000) String officialUrl, @Size(max=100) String state, boolean active) {}
    public record SchemeResponse(UUID id, String title, String description, String eligibility, String titleMr, String descriptionMr, String eligibilityMr, String officialUrl, String state, boolean active, Instant updatedAt) {}
    public record ProductReviewRequest(@Min(1) @Max(5) int rating, @NotBlank @Size(max=1200) String comment) {}
    public record ProductReviewResponse(UUID id, UUID productId, String customerName, int rating, String comment, Instant createdAt) {}
    public record ProductReviewSummary(BigDecimal averageRating, long reviewCount, List<ProductReviewResponse> reviews) {}
    public record MandiRateRequest(@NotNull CropType cropName, @NotBlank @Size(max=140) String mandiName, @NotNull @DecimalMin("0.00") BigDecimal ratePerQuintal, @NotNull @DecimalMin("0.00") BigDecimal minRate, @NotNull @DecimalMin("0.00") BigDecimal maxRate, @NotNull @DecimalMin("0.00") BigDecimal transportCostPerQtl, @Size(max=100) String district, @Size(max=100) String tehsil, @Size(max=100) String city, @NotNull LocalDate recordDate) {}
    public record MandiRateResponse(UUID id, CropType cropName, String mandiName, BigDecimal ratePerQuintal, BigDecimal minRate, BigDecimal maxRate, BigDecimal transportCostPerQtl, String district, String tehsil, String city, boolean autoFetched, String sourceLabel, LocalDate recordDate) {}
    public record ErrorResponse(Instant timestamp, int status, String error, String message, String path) {}
    public record LocalServiceListingRequest(@NotBlank @Pattern(regexp="EQUIPMENT|SERVICE") String listingType,@NotBlank @Size(max=50) String category,@NotBlank @Size(max=160) String title,@NotBlank @Size(max=2000) String description,@NotBlank @Size(max=1000) String imageUrl,@NotNull @DecimalMin("0.01") BigDecimal price,@NotBlank @Pattern(regexp="PER_ACRE|PER_HOUR|PER_DAY|PER_TRIP") String rateUnit,@Size(max=500) String rateNotes,@Pattern(regexp="^$|^[+]?[0-9()\\-\\s]{8,20}$", message="Enter a valid phone number") String contactNumber,boolean allowCalls,boolean allowWhatsApp,@NotBlank @Size(max=120) String village,@NotBlank @Size(max=120) String taluka,@NotBlank @Size(max=120) String district,@NotNull @DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,@NotNull @DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude,@NotBlank @Size(max=500) String availability) {}
    public record LocalServiceListingResponse(UUID id,UUID ownerId,String ownerName,String listingType,String category,String title,String description,String imageUrl,BigDecimal price,String rateUnit,String rateNotes,String contactNumber,boolean allowCalls,boolean allowWhatsApp,String village,String taluka,String district,double distanceInKm,String availability,Instant createdAt) {}
    public record LocalServiceSearchRequest(@DecimalMin("-90.0") @DecimalMax("90.0") BigDecimal latitude,@DecimalMin("-180.0") @DecimalMax("180.0") BigDecimal longitude,@Size(max=120) String village,@Size(max=120) String taluka,@Size(max=120) String district,@Pattern(regexp="EQUIPMENT|SERVICE|ALL") String type) {}
    public record LocalServiceContactRequest(@NotBlank @Size(max=2000) String message,LocalDate requestedDate,@DecimalMin("0.01") BigDecimal areaAcres) {}
    public record LocalServiceThreadResponse(UUID id,UUID listingId,String listingTitle,String listingImageUrl,String listingVillage,BigDecimal listingPrice,String rateUnit,UUID requesterId,String requesterName,UUID providerId,String providerName,String status,LocalDate requestedDate,BigDecimal areaAcres,long unreadCount,Instant updatedAt) {}
    public record LocalServiceMessageRequest(@NotBlank @Size(max=2000) String message) {}
    public record LocalServiceMessageResponse(UUID id,UUID senderId,String senderName,String message,boolean delivered,boolean read,Instant createdAt) {}
    public record CommunityGroupCreateRequest(@NotBlank @Size(max=120) String name,@NotBlank @Size(max=1000) String description,@Size(max=160) String locality) {}
    public record CommunityGroupResponse(UUID id,String name,String description,String locality,String createdByName,long memberCount,boolean joined,Instant createdAt) {}
    public record CommunityMemberResponse(UUID userId,String name,String village,String district,Instant joinedAt) {}
    public record CommunityMessageRequest(@NotBlank @Size(max=2000) String message) {}
    public record CommunityMessageResponse(UUID id,UUID senderId,String senderName,String village,String message,Instant createdAt) {}    public record LocalServiceStatusRequest(@NotBlank @Pattern(regexp="ACCEPTED|REJECTED|COMPLETED|CANCELLED") String status) {}
    public record ProfilePhotoResponse(String profilePhotoUrl) {}
}

