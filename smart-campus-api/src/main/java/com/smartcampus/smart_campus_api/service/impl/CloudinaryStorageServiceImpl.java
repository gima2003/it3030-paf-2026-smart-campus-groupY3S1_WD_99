package com.smartcampus.smart_campus_api.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.smartcampus.smart_campus_api.service.CloudinaryStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryStorageServiceImpl implements CloudinaryStorageService {

    private final Cloudinary cloudinary;

    public CloudinaryStorageServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadImage(MultipartFile file, String folder) throws IOException {
        return (Map<String, Object>) cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folder,
                        "resource_type", "image"
                )
        );
    }

    @Override
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap("resource_type", "image")
        );
    }
}