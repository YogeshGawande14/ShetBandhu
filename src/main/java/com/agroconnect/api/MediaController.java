package com.agroconnect.api;

import com.agroconnect.service.MediaStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

@RestController @RequestMapping("/api/media") @RequiredArgsConstructor
public class MediaController {
    private final MediaStorageService storage;
    @PostMapping("/images") @PreAuthorize("hasAnyRole('SHOP_OWNER','FARMER')") public Map<String,String> upload(@RequestParam("file") MultipartFile file){return Map.of("url",storage.saveImage(file));}
    @GetMapping("/{name}") public ResponseEntity<UrlResource> image(@PathVariable String name)throws IOException{Path path=storage.resolve(name);if(!Files.exists(path))return ResponseEntity.notFound().build();String type=Files.probeContentType(path);MediaType media=type==null?MediaType.APPLICATION_OCTET_STREAM:MediaType.parseMediaType(type);return ResponseEntity.ok().contentType(media).body(new UrlResource(path.toUri()));}
}
