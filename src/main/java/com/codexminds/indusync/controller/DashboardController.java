package com.codexminds.indusync.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codexminds.indusync.entity.Application;
import com.codexminds.indusync.entity.Company;
import com.codexminds.indusync.entity.Compliance;
import com.codexminds.indusync.entity.Project;
import com.codexminds.indusync.repository.ApplicationRepository;
import com.codexminds.indusync.repository.CompanyRepository;
import com.codexminds.indusync.repository.ComplianceRepository;
import com.codexminds.indusync.repository.ProjectRepository;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ComplianceRepository complianceRepository;


    // =========================================================
    // COMPANY DASHBOARD
    // =========================================================

    @GetMapping("/{ownerId}")
    public ResponseEntity<?> getDashboard(
            @PathVariable Long ownerId) {

        List<Company> companies =
                companyRepository.findByOwnerId(ownerId);

        List<Map<String, Object>> companyData =
                new ArrayList<>();

        List<Map<String, Object>> projectData =
                new ArrayList<>();

        List<Map<String, Object>> applicationData =
                new ArrayList<>();

        List<Map<String, Object>> complianceData =
                new ArrayList<>();


        for (Company company : companies) {

            Map<String, Object> companyMap =
                    new HashMap<>();

            companyMap.put("id", company.getId());
            companyMap.put("name", company.getName());
            companyMap.put(
                    "registrationNumber",
                    company.getRegistrationNumber()
            );
            companyMap.put(
                    "industryType",
                    company.getIndustryType()
            );
            companyMap.put("address", company.getAddress());
            companyMap.put(
                    "contactEmail",
                    company.getContactEmail()
            );
            companyMap.put(
                    "contactPhone",
                    company.getContactPhone()
            );

            companyData.add(companyMap);


            List<Project> projects =
                    projectRepository.findByCompanyId(
                            company.getId()
                    );


            for (Project project : projects) {

                Map<String, Object> projectMap =
                        new HashMap<>();

                projectMap.put("id", project.getId());
                projectMap.put("name", project.getName());
                projectMap.put(
                        "description",
                        project.getDescription()
                );
                projectMap.put(
                        "location",
                        project.getLocation()
                );
                projectMap.put(
                        "investmentAmount",
                        project.getInvestmentAmount()
                );
                projectMap.put(
                        "numberOfEmployees",
                        project.getNumberOfEmployees()
                );
                projectMap.put(
                        "landType",
                        project.getLandType()
                );
                projectMap.put(
                        "status",
                        project.getStatus().name()
                );

                projectData.add(projectMap);


                List<Application> applications =
                        applicationRepository.findByProjectId(
                                project.getId()
                        );


                for (Application application : applications) {

                    Map<String, Object> applicationMap =
                            new HashMap<>();

                    applicationMap.put(
                            "id",
                            application.getId()
                    );

                    applicationMap.put(
                            "approvalName",
                            application.getApprovalName()
                    );

                    applicationMap.put(
                            "status",
                            application.getStatus().name()
                    );

                    applicationMap.put(
                            "submittedAt",
                            application.getSubmittedAt()
                    );

                    applicationMap.put(
                            "slaDeadline",
                            application.getSlaDeadline()
                    );

                    applicationMap.put(
                            "remarks",
                            application.getRemarks()
                    );

                    applicationData.add(applicationMap);
                }


                List<Compliance> compliances =
                        complianceRepository.findByProjectId(
                                project.getId()
                        );


                for (Compliance compliance : compliances) {

                    Map<String, Object> complianceMap =
                            new HashMap<>();

                    complianceMap.put(
                            "id",
                            compliance.getId()
                    );

                    complianceMap.put(
                            "title",
                            compliance.getTitle()
                    );

                    complianceMap.put(
                            "description",
                            compliance.getDescription()
                    );

                    complianceMap.put(
                            "dueDate",
                            compliance.getDueDate()
                    );

                    complianceMap.put(
                            "status",
                            compliance.getStatus().name()
                    );

                    complianceData.add(complianceMap);
                }
            }
        }


        Map<String, Object> data =
                new HashMap<>();

        data.put("companies", companyData);
        data.put("projects", projectData);
        data.put("applications", applicationData);
        data.put("compliances", complianceData);

        data.put(
                "totalApplications",
                applicationData.size()
        );

        data.put(
                "approved",
                applicationData.stream()
                        .filter(a ->
                                "APPROVED".equals(
                                        a.get("status")
                                )
                        )
                        .count()
        );

        data.put(
                "pending",
                applicationData.stream()
                        .filter(a ->
                                "SUBMITTED".equals(
                                        a.get("status")
                                )
                                ||
                                "IN_REVIEW".equals(
                                        a.get("status")
                                )
                        )
                        .count()
        );

        data.put(
                "rejected",
                applicationData.stream()
                        .filter(a ->
                                "REJECTED".equals(
                                        a.get("status")
                                )
                        )
                        .count()
        );

        return ResponseEntity.ok(data);
    }


    // =========================================================
    // GOVERNMENT DASHBOARD
    // =========================================================

    @GetMapping("/government")
    public ResponseEntity<?> getGovernmentDashboard() {

        List<Application> applications =
                applicationRepository.findAll();


        long totalApplications =
                applications.size();


        long approved =
                applications.stream()
                        .filter(a ->
                                a.getStatus() ==
                                        Application.Status.APPROVED
                        )
                        .count();


        long rejected =
                applications.stream()
                        .filter(a ->
                                a.getStatus() ==
                                        Application.Status.REJECTED
                        )
                        .count();


        long pending =
                applications.stream()
                        .filter(a ->
                                a.getStatus() ==
                                        Application.Status.SUBMITTED
                                ||
                                a.getStatus() ==
                                        Application.Status.IN_REVIEW
                        )
                        .count();


        // Number of different companies having applications
        long activeApplicants =
                applications.stream()
                        .filter(a -> a.getProject() != null)
                        .map(a ->
                                a.getProject()
                                        .getCompany()
                                        .getId()
                        )
                        .distinct()
                        .count();


        Map<String, Object> data =
                new HashMap<>();

        data.put(
                "totalApplications",
                totalApplications
        );

        data.put(
                "pending",
                pending
        );

        data.put(
                "approved",
                approved
        );

        data.put(
                "rejected",
                rejected
        );

        data.put(
                "activeApplicants",
                activeApplicants
        );


        return ResponseEntity.ok(data);
    }
}