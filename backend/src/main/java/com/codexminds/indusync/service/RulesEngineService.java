package com.codexminds.indusync.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class RulesEngineService {

    public Map<String, Object> evaluateProject(
            String industry,
            String projectStage,
            String locationType,
            boolean generatesHazardousWaste,
            boolean requiresFireSafety,
            boolean hasStartedProduction) {

        try {

            JsonObject approvalsRoot = loadJson(
                    "rules-engine/approvals.json"
            );

            JsonObject rulesRoot = loadJson(
                    "rules-engine/rules.json"
            );

            JsonArray rules = rulesRoot.getAsJsonArray("rules");
            JsonArray approvals = approvalsRoot.getAsJsonArray("approvals");

            List<String> applicableApprovalIds = new ArrayList<>();

            // ==============================
            // EVALUATE RULES
            // ==============================

            for (JsonElement ruleElement : rules) {

                JsonObject rule = ruleElement.getAsJsonObject();

                boolean matched = true;

                if (rule.has("industry")) {
                    if (!rule.get("industry").getAsString()
                            .equalsIgnoreCase(industry)) {
                        matched = false;
                    }
                }

                if (rule.has("project_stage")) {
                    if (!rule.get("project_stage").getAsString()
                            .equalsIgnoreCase(projectStage)) {
                        matched = false;
                    }
                }

                if (rule.has("requires_fire_safety")) {
                    if (rule.get("requires_fire_safety").getAsBoolean()
                            != requiresFireSafety) {
                        matched = false;
                    }
                }

                if (rule.has("generates_hazardous_waste")) {
                    if (rule.get("generates_hazardous_waste").getAsBoolean()
                            != generatesHazardousWaste) {
                        matched = false;
                    }
                }

                if (matched) {

                    String approvalId =
                            rule.get("approval_id").getAsString();

                    if (!applicableApprovalIds.contains(approvalId)) {
                        applicableApprovalIds.add(approvalId);
                    }
                }
            }

            // ==============================
            // BUILD RESULT
            // ==============================

            List<Map<String, Object>> resultApprovals =
                    new ArrayList<>();

            int readyCount = 0;
            int pendingCount = 0;
            int totalDocuments = 0;

            for (String approvalId : applicableApprovalIds) {

                JsonObject approval =
                        findApproval(approvals, approvalId);

                if (approval == null) {
                    continue;
                }

                String status = "READY";

                // ==============================
                // CHECK DEPENDENCIES
                // ==============================

                if (approval.has("depends_on")) {

                    JsonArray dependencies =
                            approval.getAsJsonArray("depends_on");

                    for (JsonElement dependency : dependencies) {

                        String dependencyId =
                                dependency.getAsString();

                        if (!applicableApprovalIds.contains(dependencyId)) {
                            status = "PENDING DEPENDENCY";
                        }
                    }
                }

                if (status.equals("READY")) {
                    readyCount++;
                } else {
                    pendingCount++;
                }

                // ==============================
                // DOCUMENTS
                // ==============================

                List<String> documents = new ArrayList<>();

                if (approval.has("required_documents")) {

                    JsonArray docs =
                            approval.getAsJsonArray("required_documents");

                    for (JsonElement doc : docs) {
                        documents.add(doc.getAsString());
                        totalDocuments++;
                    }
                }

                // ==============================
                // APPROVAL OBJECT
                // ==============================

                Map<String, Object> approvalData =
                        new LinkedHashMap<>();

                approvalData.put(
                        "approvalId",
                        approvalId
                );

                approvalData.put(
                        "approvalName",
                        getString(
                                approval,
                                "approval_name",
                                "Not Specified"
                        )
                );

                approvalData.put(
                        "department",
                        getString(
                                approval,
                                "department",
                                "Not Specified"
                        )
                );

                approvalData.put(
                        "projectStage",
                        getString(
                                approval,
                                "project_stage",
                                "Not Specified"
                        )
                );

                approvalData.put(
                        "status",
                        status
                );

                approvalData.put(
                        "requiredDocuments",
                        documents
                );

                approvalData.put(
                        "renewalRequired",
                        getString(
                                approval,
                                "renewal_required",
                                "Not Specified"
                        )
                );

                approvalData.put(
                        "sourceName",
                        getString(
                                approval,
                                "source_name",
                                "Not Specified"
                        )
                );

                approvalData.put(
                        "sourceUrl",
                        getString(
                                approval,
                                "source_url",
                                ""
                        )
                );

                resultApprovals.add(approvalData);
            }

            // ==============================
            // FINAL RESPONSE
            // ==============================

            Map<String, Object> response =
                    new LinkedHashMap<>();

            response.put(
                    "industry",
                    industry
            );

            response.put(
                    "projectStage",
                    projectStage
            );

            response.put(
                    "locationType",
                    locationType
            );

            response.put(
                    "generatesHazardousWaste",
                    generatesHazardousWaste
            );

            response.put(
                    "requiresFireSafety",
                    requiresFireSafety
            );

            response.put(
                    "hasStartedProduction",
                    hasStartedProduction
            );

            response.put(
                    "totalApplicableApprovals",
                    resultApprovals.size()
            );

            response.put(
                    "approvalsReady",
                    readyCount
            );

            response.put(
                    "approvalsPending",
                    pendingCount
            );

            response.put(
                    "totalRequiredDocuments",
                    totalDocuments
            );

            response.put(
                    "approvals",
                    resultApprovals
            );

            return response;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Rules Engine failed: " + e.getMessage(),
                    e
            );
        }
    }

    // ==========================================
    // LOAD JSON
    // ==========================================

    private JsonObject loadJson(String fileName)
            throws Exception {

        ClassPathResource resource =
                new ClassPathResource(fileName);

        try (Reader reader =
                     new InputStreamReader(
                             resource.getInputStream(),
                             StandardCharsets.UTF_8)) {

            return JsonParser
                    .parseReader(reader)
                    .getAsJsonObject();
        }
    }

    // ==========================================
    // FIND APPROVAL
    // ==========================================

    private JsonObject findApproval(
            JsonArray approvals,
            String approvalId) {

        for (JsonElement element : approvals) {

            JsonObject approval =
                    element.getAsJsonObject();

            if (approval.has("approval_id")
                    && approval.get("approval_id")
                    .getAsString()
                    .equals(approvalId)) {

                return approval;
            }
        }

        return null;
    }

    // ==========================================
    // SAFE STRING
    // ==========================================

    private String getString(
            JsonObject object,
            String key,
            String defaultValue) {

        if (object.has(key)
                && !object.get(key).isJsonNull()) {

            return object.get(key).getAsString();
        }

        return defaultValue;
    }
}