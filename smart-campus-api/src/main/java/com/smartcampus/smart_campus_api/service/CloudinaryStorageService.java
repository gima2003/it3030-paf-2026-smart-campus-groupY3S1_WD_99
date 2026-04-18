package com.smartcampus.smart_campus_api.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

public interface CloudinaryStorageService {

    Map<String, Object> uploadImage(MultipartFile file, String folder) throws IOException;

    void deleteImage(String publicId) throws IOException;
}