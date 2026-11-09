package com.agroconnect.service;

import com.agroconnect.api.mapper.AgroMapper;
import com.agroconnect.domain.*;
import com.agroconnect.repository.*;
import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class KendraServiceTest {
    @Test void missingDocumentsCannotBeApprovedWithoutOverrideAcknowledgement() {
        KendraRepository shops=mock(KendraRepository.class);var audit=mock(KendraApprovalAuditRepository.class);KrishiSevaKendra pending=shop("Pending",18.0,73.0);UUID id=UUID.randomUUID();pending.setId(id);pending.setVerified(false);pending.setVerificationStatus(VerificationStatus.PENDING);pending.setDocumentUrl(null);pending.setOwnerLicenseNumber(null);when(shops.findById(id)).thenReturn(Optional.of(pending));
        var service=new KendraService(shops,mock(UserRepository.class),mock(AgroMapper.class),audit);
        assertThrows(BadRequestException.class,()->service.verify(id,UUID.randomUUID(),false,""));
        assertFalse(pending.isVerified());verify(audit,never()).save(any(KendraApprovalAudit.class));
    }

    @Test void documentOverrideRequiresReasonAndWritesAudit() {
        KendraRepository shops=mock(KendraRepository.class);var audit=mock(KendraApprovalAuditRepository.class);KrishiSevaKendra pending=shop("Pending",18.0,73.0);UUID id=UUID.randomUUID(),admin=UUID.randomUUID();pending.setId(id);pending.setVerified(false);pending.setVerificationStatus(VerificationStatus.PENDING);pending.setDocumentUrl(null);pending.setOwnerLicenseNumber(null);when(shops.findById(id)).thenReturn(Optional.of(pending));when(audit.save(any(KendraApprovalAudit.class))).thenAnswer(call->call.getArgument(0));
        var service=new KendraService(shops,mock(UserRepository.class),mock(AgroMapper.class),audit);
        assertThrows(BadRequestException.class,()->service.verify(id,admin,true," "));
        var response=service.verify(id,admin,true,"Manual document exception approved");
        assertTrue(response.verified());var captor=org.mockito.ArgumentCaptor.forClass(KendraApprovalAudit.class);verify(audit).save(captor.capture());assertTrue(captor.getValue().isDocumentsMissing());assertEquals(admin,captor.getValue().getAdminUserId());assertEquals("Manual document exception approved",captor.getValue().getReason());
    }

    @Test void nearbyReturnsOnlyShopsWithinTenKmSortedByDistance() {
        KendraRepository shops=mock(KendraRepository.class);
        KrishiSevaKendra near=shop("Near",18.01,73.0), farther=shop("Farther",18.08,73.0), outside=shop("Outside",18.2,73.0);
        when(shops.findByLatitudeBetweenAndLongitudeBetween(any(),any(),any(),any())).thenReturn(List.of(farther,outside,near));
        var results=new KendraService(shops,mock(UserRepository.class),mock(AgroMapper.class),mock(com.agroconnect.repository.KendraApprovalAuditRepository.class)).nearby(new BigDecimal("18.0"),new BigDecimal("73.0"));
        assertEquals(List.of("Near","Farther"),results.stream().map(r->r.shopName()).toList());
        assertTrue(results.get(0).distanceInKm()<results.get(1).distanceInKm());
    }
    private KrishiSevaKendra shop(String name,double lat,double lon) { User owner=new User(); owner.setId(java.util.UUID.randomUUID()); KrishiSevaKendra s=new KrishiSevaKendra();s.setShopName(name);s.setVerified(true);s.setOwner(owner);s.setAddress("address");s.setContactNumber("1234567890");s.setLatitude(BigDecimal.valueOf(lat));s.setLongitude(BigDecimal.valueOf(lon));return s; }
}

