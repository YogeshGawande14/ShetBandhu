package com.agroconnect.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.Locale;
import java.util.UUID;

@Service
public class MediaStorageService {
    private final Path directory;
    public MediaStorageService(@Value("${app.media.directory:uploads}") String configured){directory=Path.of(configured).toAbsolutePath().normalize();}
    public String saveImage(MultipartFile file){if(file==null||file.isEmpty())throw new BadRequestException("Choose an image to upload");if(file.getSize()>5*1024*1024)throw new BadRequestException("Images must be 5 MB or smaller");String type=file.getContentType()==null?"":file.getContentType().toLowerCase(Locale.ROOT);String ext=switch(type){case "image/jpeg"->"jpg";case "image/png"->"png";case "image/webp"->"webp";default->throw new BadRequestException("Upload a JPG, PNG or WebP image");};String name=UUID.randomUUID()+"."+ext;try{Files.createDirectories(directory);Files.copy(file.getInputStream(),directory.resolve(name),StandardCopyOption.REPLACE_EXISTING);return "/api/media/"+name;}catch(IOException ex){throw new IllegalStateException("Could not save uploaded image",ex);}}
    public Path resolve(String name){if(name==null||!name.matches("[0-9a-fA-F-]{36}\\.(jpg|png|webp)"))throw new NotFoundException("Image not found");Path path=directory.resolve(name).normalize();if(!path.startsWith(directory))throw new NotFoundException("Image not found");return path;}
}
