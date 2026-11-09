package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.*;import com.agroconnect.service.FarmerCommunityService;import jakarta.validation.Valid;import lombok.RequiredArgsConstructor;import org.springframework.security.core.Authentication;import org.springframework.security.access.prepost.PreAuthorize;import org.springframework.web.bind.annotation.*;import java.util.List;import java.util.UUID;
@RestController @RequestMapping("/api/community") @RequiredArgsConstructor
public class FarmerCommunityController {
 private final FarmerCommunityService service;private final CurrentUser currentUser;
 @GetMapping("/groups") public List<CommunityGroupResponse> groups(Authentication auth){return service.list(currentUser.get(auth));}
 @PostMapping("/groups") public CommunityGroupResponse create(Authentication auth,@Valid @RequestBody CommunityGroupCreateRequest req){return service.create(currentUser.get(auth),req);}
 @PostMapping("/groups/{id}/join") public CommunityGroupResponse join(Authentication auth,@PathVariable UUID id){return service.join(currentUser.get(auth),id);}
 @DeleteMapping("/groups/{id}/leave") public void leave(Authentication auth,@PathVariable UUID id){service.leave(currentUser.get(auth),id);}
 @GetMapping("/groups/{id}/members") public List<CommunityMemberResponse> members(Authentication auth,@PathVariable UUID id){return service.memberList(currentUser.get(auth),id);}
 @GetMapping("/groups/{id}/messages") public List<CommunityMessageResponse> messages(Authentication auth,@PathVariable UUID id){return service.messageList(currentUser.get(auth),id);}
 @PostMapping("/groups/{id}/messages") public CommunityMessageResponse send(Authentication auth,@PathVariable UUID id,@Valid @RequestBody CommunityMessageRequest req){return service.send(currentUser.get(auth),id,req);}
 @GetMapping("/admin/groups") @PreAuthorize("hasRole('SUPER_ADMIN')") public List<CommunityGroupResponse> adminGroups(){return service.adminList();}
 @DeleteMapping("/admin/groups/{id}") @PreAuthorize("hasRole('SUPER_ADMIN')") public void moderate(@PathVariable UUID id){service.moderate(id);}
}