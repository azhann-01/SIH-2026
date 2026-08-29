package com.codexminds.indusync.service;

import com.codexminds.indusync.dto.ComplianceRequest;
import com.codexminds.indusync.entity.Compliance;
import com.codexminds.indusync.entity.Project;
import com.codexminds.indusync.repository.ComplianceRepository;
import com.codexminds.indusync.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ComplianceService {

    @Autowired
    private ComplianceRepository complianceRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public Compliance createCompliance(ComplianceRequest request, Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Compliance c = new Compliance();
        c.setProject(project);
        c.setTitle(request.getTitle());
        c.setDescription(request.getDescription());
        c.setDueDate(request.getDueDate());

        return complianceRepository.save(c);
    }

    public List<Compliance> getComplianceByProject(Long projectId) {
        return complianceRepository.findByProjectId(projectId);
    }
}