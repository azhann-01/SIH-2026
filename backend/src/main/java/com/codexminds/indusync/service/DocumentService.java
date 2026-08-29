package com.codexminds.indusync.service;

import com.codexminds.indusync.dto.DocumentRequest;
import com.codexminds.indusync.entity.Application;
import com.codexminds.indusync.entity.Document;
import com.codexminds.indusync.repository.ApplicationRepository;
import com.codexminds.indusync.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Document uploadDocument(DocumentRequest request, Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        Document doc = new Document();
        doc.setApplication(app);
        doc.setFileName(request.getFileName());
        doc.setFileUrl(request.getFileUrl());
        doc.setDocumentType(request.getDocumentType());

        return documentRepository.save(doc);
    }

    public List<Document> getDocumentsByApplication(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId);
    }
}