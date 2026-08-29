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

    // Create new application
    public Application createApplication(
            ApplicationRequest request,
            Long projectId) {

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new RuntimeException("Project not found"));

        Application app = new Application();

        app.setProject(project);
        app.setApprovalName(request.getApprovalName());
        app.setRemarks(request.getRemarks());

        app.setSlaDeadline(
                LocalDateTime.now().plusDays(30)
        );

        return applicationRepository.save(app);
    }

    // Government: get every application
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // Get applications for a specific project
    public List<Application> getApplicationsByProject(
            Long projectId) {

        return applicationRepository.findByProjectId(projectId);
    }

    // Get application by ID
    public Application getApplicationById(Long id) {

        return applicationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Application not found"));
    }

    // Government: update application status
    public Application updateStatus(
            Long id,
            String status) {

        Application app = getApplicationById(id);

        try {

            app.setStatus(
                    Application.Status.valueOf(
                            status.toUpperCase()
                    )
            );

        } catch (IllegalArgumentException e) {

            throw new RuntimeException(
                    "Invalid status. Use SUBMITTED, IN_REVIEW, APPROVED or REJECTED"
            );
        }

        return applicationRepository.save(app);
    }
}