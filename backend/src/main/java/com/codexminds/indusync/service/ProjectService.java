package com.codexminds.indusync.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.codexminds.indusync.dto.ProjectRequest;
import com.codexminds.indusync.entity.Company;
import com.codexminds.indusync.entity.Project;
import com.codexminds.indusync.repository.CompanyRepository;
import com.codexminds.indusync.repository.ProjectRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public Project createProject(
            ProjectRequest request,
            Long companyId) {

        Company company =
                companyRepository.findById(companyId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Company not found"
                                ));

        Project project = new Project();

        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setLocation(request.getLocation());
        project.setInvestmentAmount(
                request.getInvestmentAmount()
        );
        project.setNumberOfEmployees(
                request.getNumberOfEmployees()
        );
        project.setLandType(request.getLandType());

        // Rules Engine fields
        project.setIndustry(request.getIndustry());
        project.setProjectStage(request.getProjectStage());
        project.setLocationType(request.getLocationType());

        project.setGeneratesHazardousWaste(
                Boolean.TRUE.equals(
                        request.getGeneratesHazardousWaste()
                )
        );

        project.setRequiresFireSafety(
                Boolean.TRUE.equals(
                        request.getRequiresFireSafety()
                )
        );

        project.setHasStartedProduction(
                Boolean.TRUE.equals(
                        request.getHasStartedProduction()
                )
        );

        project.setCompany(company);

        return projectRepository.save(project);
    }

    public List<Project> getProjectsByCompany(
            Long companyId) {

        return projectRepository.findByCompanyId(companyId);
    }

    public Project getProjectById(Long id) {

        return projectRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Project not found"
                        ));
    }
}