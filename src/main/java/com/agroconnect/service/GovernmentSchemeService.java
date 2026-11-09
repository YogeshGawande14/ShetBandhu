package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.SchemeRequest;
import com.agroconnect.api.dto.ApiDtos.SchemeResponse;
import com.agroconnect.domain.GovernmentScheme;
import com.agroconnect.repository.GovernmentSchemeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class GovernmentSchemeService {
    private final GovernmentSchemeRepository schemes;
    @Transactional(readOnly=true) public List<SchemeResponse> list(){return schemes.findByActiveTrueOrderByTitleAsc().stream().map(this::response).toList();}
    @Transactional(readOnly=true) public List<SchemeResponse> adminList(){return schemes.findAll(org.springframework.data.domain.Sort.by("title")).stream().map(this::response).toList();}
    @Transactional public SchemeResponse create(SchemeRequest input){GovernmentScheme s=new GovernmentScheme();apply(s,input);return response(schemes.save(s));}
    @Transactional public SchemeResponse update(UUID id,SchemeRequest input){GovernmentScheme s=schemes.findById(id).orElseThrow(()->new NotFoundException("Government scheme not found"));apply(s,input);return response(s);}
    @Transactional public void delete(UUID id){GovernmentScheme s=schemes.findById(id).orElseThrow(()->new NotFoundException("Government scheme not found"));s.setActive(false);}
    private void apply(GovernmentScheme s,SchemeRequest r){s.setTitle(r.title().trim());s.setDescription(r.description().trim());s.setEligibility(r.eligibility().trim());s.setTitleMr(r.titleMr().trim());s.setDescriptionMr(r.descriptionMr().trim());s.setEligibilityMr(r.eligibilityMr().trim());s.setOfficialUrl(r.officialUrl().trim());s.setState(r.state()==null||r.state().isBlank()?"Maharashtra":r.state().trim());s.setActive(r.active());}
    private SchemeResponse response(GovernmentScheme s){return new SchemeResponse(s.getId(),s.getTitle(),s.getDescription(),s.getEligibility(),s.getTitleMr(),s.getDescriptionMr(),s.getEligibilityMr(),s.getOfficialUrl(),s.getState(),s.isActive(),s.getUpdatedAt());}
}
