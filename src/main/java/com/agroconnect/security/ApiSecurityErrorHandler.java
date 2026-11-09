package com.agroconnect.security;

import com.agroconnect.api.dto.ApiDtos.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.Instant;

@Component @RequiredArgsConstructor
public class ApiSecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {
    private final ObjectMapper objectMapper;
    @Override public void commence(HttpServletRequest request,HttpServletResponse response,AuthenticationException exception) throws IOException {
        write(request,response,401,"Unauthorized","Authentication is required or the token is invalid");
    }
    @Override public void handle(HttpServletRequest request,HttpServletResponse response,AccessDeniedException exception) throws IOException {
        write(request,response,403,"Forbidden","Access denied");
    }
    private void write(HttpServletRequest request,HttpServletResponse response,int status,String error,String message) throws IOException {
        response.setStatus(status);response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getWriter(),new ErrorResponse(Instant.now(),status,error,message,request.getRequestURI()));
    }
}
