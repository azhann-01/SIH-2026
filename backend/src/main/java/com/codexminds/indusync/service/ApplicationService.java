package com.codexminds.indusync.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codexminds.indusync.dto.ApplicationRequest;
import com.codexminds.indusync.entity.Application;
import com.codexminds.indusync.entity.Project;
import com.codexminds.indusync.repository.ApplicationRepository;
import com.codexminds.indusync.repository.ProjectRepository;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public Application createApplication(ApplicationRequest request, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Application app = new Application();
        app.setProject(project);
        app.setApprovalName(request.getApprovalName());
        app.setRemarks(request.getRemarks());
        app.setSlaDeadline(LocalDateTime.now().plusDays(30));

        return applicationRepository.save(app);
    }

    public List<Application> getApplicationsByProject(Long projectId) {
        return applicationRepository.findByProjectId(projectId);
    }

    public Application getApplicationById(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }

    public Application updateStatus(Long id, String status) {
        Application app = getApplicationById(id);
        app.setStatus(Application.Status.valueOf(status));
        return applicationRepository.save(app);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}