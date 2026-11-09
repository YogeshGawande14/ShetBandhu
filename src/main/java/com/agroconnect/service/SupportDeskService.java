package com.agroconnect.service;

import com.agroconnect.api.dto.ApiDtos.*;
import com.agroconnect.domain.Role;
import com.agroconnect.domain.SupportTicket;
import com.agroconnect.domain.User;
import com.agroconnect.repository.SupportTicketRepository;
import com.agroconnect.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;

@Service @RequiredArgsConstructor
public class SupportDeskService {
    private final SupportTicketRepository tickets;
    private final UserRepository users;

    @Transactional
    public SupportTicketResponse create(UUID userId,SupportTicketCreate input) {
        User user=users.findById(userId).orElseThrow(()->new NotFoundException("Account not found"));
        if(!user.getRoles().contains(Role.FARMER)&&!user.getRoles().contains(Role.SHOP_OWNER)) throw new AccessDeniedException("Customer or owner account required");
        SupportTicket ticket=new SupportTicket(); ticket.setUser(user);ticket.setSubject(input.subject().trim());ticket.setMessage(input.message().trim());
        return toDto(tickets.save(ticket));
    }

    @Transactional(readOnly=true)
    public List<SupportTicketResponse> mine(UUID userId){return tickets.findByUser_IdOrderByCreatedAtDesc(userId).stream().map(this::toDto).toList();}

    @Transactional(readOnly=true)
    public List<SupportTicketResponse> adminQueue(){return tickets.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList();}

    @Transactional
    public SupportTicketResponse respond(UUID ticketId,SupportReplyRequest input){
        SupportTicket ticket=tickets.findById(ticketId).orElseThrow(()->new NotFoundException("Support request not found"));
        ticket.setAdminReply(input.message().trim());ticket.setStatus(input.resolved()?"RESOLVED":"OPEN");
        return toDto(ticket);
    }

    private SupportTicketResponse toDto(SupportTicket t){return new SupportTicketResponse(t.getId(),t.getUser().getId(),t.getUser().getFullName(),t.getUser().getRole().name(),t.getSubject(),t.getMessage(),t.getStatus(),t.getAdminReply(),t.getCreatedAt(),t.getUpdatedAt());}
}
