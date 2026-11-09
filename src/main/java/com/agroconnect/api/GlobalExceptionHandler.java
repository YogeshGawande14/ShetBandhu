package com.agroconnect.api;
import com.agroconnect.api.dto.ApiDtos.ErrorResponse;
import com.agroconnect.service.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import java.time.Instant;
@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final Logger log=LoggerFactory.getLogger(GlobalExceptionHandler.class);
    @ExceptionHandler(NotFoundException.class) ResponseEntity<ErrorResponse> notFound(RuntimeException e,HttpServletRequest r) { return error(HttpStatus.NOT_FOUND,e.getMessage(),r); }
    @ExceptionHandler({BadRequestException.class,ConstraintViolationException.class}) ResponseEntity<ErrorResponse> badRequest(Exception e,HttpServletRequest r) { return error(HttpStatus.BAD_REQUEST,e.getMessage(),r); }
    @ExceptionHandler(ConflictException.class) ResponseEntity<ErrorResponse> conflict(Exception e,HttpServletRequest r) { return error(HttpStatus.CONFLICT,e.getMessage(),r); }
    @ExceptionHandler({AccessDeniedException.class,org.springframework.security.authentication.BadCredentialsException.class,org.springframework.security.authentication.DisabledException.class}) ResponseEntity<ErrorResponse> forbidden(Exception e,HttpServletRequest r) { return error(e instanceof AccessDeniedException?HttpStatus.FORBIDDEN:HttpStatus.UNAUTHORIZED,e instanceof AccessDeniedException?"Access denied":"Invalid credentials",r); }
    @ExceptionHandler({MethodArgumentNotValidException.class,HandlerMethodValidationException.class}) ResponseEntity<ErrorResponse> validation(Exception e,HttpServletRequest r) { String m=e instanceof MethodArgumentNotValidException v?v.getBindingResult().getFieldErrors().stream().map(f->f.getField()+": "+f.getDefaultMessage()).findFirst().orElse("Validation failed"):"Request validation failed";return error(HttpStatus.BAD_REQUEST,m,r); }
    @ExceptionHandler(DataIntegrityViolationException.class) ResponseEntity<ErrorResponse> integrity(Exception e,HttpServletRequest r) { return error(HttpStatus.CONFLICT,"Request conflicts with existing data",r); }
    @ExceptionHandler(Exception.class) ResponseEntity<ErrorResponse> unexpected(Exception e,HttpServletRequest r) { log.error("Unhandled request failure at {}",r.getRequestURI(),e);return error(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected error occurred",r); }
    private ResponseEntity<ErrorResponse> error(HttpStatus s,String m,HttpServletRequest r) { return ResponseEntity.status(s).body(new ErrorResponse(Instant.now(),s.value(),s.getReasonPhrase(),m,r.getRequestURI())); }
}
