import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

public class RulesEngine {

    public static void main(String[] args) {

        try {

            // ==========================================
            // READ JSON FILES
            // ==========================================

            String projectJsonString = Files.readString(
                    Path.of("data/project.json"));

            String approvalsJsonString = Files.readString(
                    Path.of("data/approvals.json"));

            String rulesJsonString = Files.readString(
                    Path.of("data/rules.json"));


            // ==========================================
            // PARSE JSON FILES
            // ==========================================

            JsonObject projectRoot = JsonParser
                    .parseString(projectJsonString)
                    .getAsJsonObject();

            JsonObject approvalsRoot = JsonParser
                    .parseString(approvalsJsonString)
                    .getAsJsonObject();

            JsonObject rulesRoot = JsonParser
                    .parseString(rulesJsonString)
                    .getAsJsonObject();


            // ==========================================
            // SUPPORT BOTH PROJECT JSON STRUCTURES
            // ==========================================

            JsonObject project;

            if (projectRoot.has("project")
                    && projectRoot.get("project").isJsonObject()) {

                project = projectRoot
                        .getAsJsonObject("project");

            } else {

                project = projectRoot;
            }


            System.out.println("Project Data Loaded Successfully!");
            System.out.println("Approvals Data Loaded Successfully!");
            System.out.println("Rules Data Loaded Successfully!");


            // ==========================================
            // READ PROJECT DATA
            // ==========================================

            String projectId = getString(
                    project,
                    "project_id",
                    "Not Specified");

            String industry = getString(
                    project,
                    "industry",
                    "Not Specified");

            String projectStage = getString(
                    project,
                    "project_stage",
                    "Not Specified");

            String locationType = getString(
                    project,
                    "location_type",
                    "Not Specified");

            boolean generatesHazardousWaste = getBoolean(
                    project,
                    "generates_hazardous_waste",
                    false);

            boolean requiresFireSafety = getBoolean(
                    project,
                    "requires_fire_safety",
                    false);

            boolean hasStartedProduction = getBoolean(
                    project,
                    "has_started_production",
                    false);


            // ==========================================
            // DISPLAY PROJECT DATA
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("PROJECT INFORMATION");
            System.out.println("====================================");

            System.out.println("Project ID: " + projectId);
            System.out.println("Industry: " + industry);
            System.out.println("Project Stage: " + projectStage);
            System.out.println("Location Type: " + locationType);
            System.out.println("Generates Hazardous Waste: "
                    + generatesHazardousWaste);
            System.out.println("Requires Fire Safety: "
                    + requiresFireSafety);
            System.out.println("Has Started Production: "
                    + hasStartedProduction);


            // ==========================================
            // GET RULES AND APPROVALS
            // ==========================================

            JsonArray rules = rulesRoot
                    .getAsJsonArray("rules");

            JsonArray approvals = approvalsRoot
                    .getAsJsonArray("approvals");

            ArrayList<String> applicableApprovals =
                    new ArrayList<>();


            // ==========================================
            // EVALUATE RULES DYNAMICALLY
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("EVALUATING RULES DYNAMICALLY");
            System.out.println("====================================");


            for (JsonElement ruleElement : rules) {

                JsonObject rule =
                        ruleElement.getAsJsonObject();

                boolean ruleMatched = true;


                // CHECK INDUSTRY

                if (rule.has("industry")) {

                    String ruleIndustry =
                            rule.get("industry")
                                    .getAsString();

                    if (!ruleIndustry.equals(industry)) {
                        ruleMatched = false;
                    }
                }


                // CHECK PROJECT STAGE

                if (rule.has("project_stage")) {

                    String ruleProjectStage =
                            rule.get("project_stage")
                                    .getAsString();

                    if (!ruleProjectStage
                            .equals(projectStage)) {

                        ruleMatched = false;
                    }
                }


                // CHECK FIRE SAFETY

                if (rule.has("requires_fire_safety")) {

                    boolean ruleFireSafety =
                            rule.get(
                                    "requires_fire_safety")
                                    .getAsBoolean();

                    if (ruleFireSafety
                            != requiresFireSafety) {

                        ruleMatched = false;
                    }
                }


                // CHECK HAZARDOUS WASTE

                if (rule.has(
                        "generates_hazardous_waste")) {

                    boolean ruleHazardousWaste =
                            rule.get(
                                    "generates_hazardous_waste")
                                    .getAsBoolean();

                    if (ruleHazardousWaste
                            != generatesHazardousWaste) {

                        ruleMatched = false;
                    }
                }


                // ADD MATCHED APPROVAL

                if (ruleMatched) {

                    String ruleId =
                            rule.get("rule_id")
                                    .getAsString();

                    String approvalId =
                            rule.get("approval_id")
                                    .getAsString();

                    System.out.println();
                    System.out.println(
                            "Rule Matched: " + ruleId);

                    System.out.println(
                            "Applicable Approval: "
                                    + approvalId);

                    if (!applicableApprovals
                            .contains(approvalId)) {

                        applicableApprovals
                                .add(approvalId);
                    }
                }
            }


            // ==========================================
            // FINAL APPLICABLE APPROVALS
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("FINAL APPLICABLE APPROVALS");
            System.out.println("====================================");

            System.out.println(applicableApprovals);


            // ==========================================
            // STORE APPROVAL STATUS
            // ==========================================

            Map<String, String> approvalStatus =
                    new HashMap<>();


            // ==========================================
            // CHECK DEPENDENCIES
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("CHECKING APPROVAL DEPENDENCIES");
            System.out.println("====================================");


            for (String approvalId
                    : applicableApprovals) {

                JsonObject approval =
                        findApproval(
                                approvals,
                                approvalId);

                System.out.println();
                System.out.println(
                        "Approval: " + approvalId);


                if (approval == null) {

                    approvalStatus.put(
                            approvalId,
                            "NOT FOUND");

                    System.out.println(
                            "Status: NOT FOUND");

                    continue;
                }


                if (!approval.has("depends_on")
                        || approval
                                .getAsJsonArray(
                                        "depends_on")
                                .size() == 0) {

                    approvalStatus.put(
                            approvalId,
                            "READY");

                    System.out.println(
                            "Dependency: None");

                    System.out.println(
                            "Status: READY");


                } else {

                    JsonArray dependencies =
                            approval.getAsJsonArray(
                                    "depends_on");

                    boolean dependenciesSatisfied =
                            true;


                    for (JsonElement dependency
                            : dependencies) {

                        String dependencyId =
                                dependency.getAsString();

                        System.out.println(
                                "Depends On: "
                                        + dependencyId);


                        if (!applicableApprovals
                                .contains(
                                        dependencyId)) {

                            dependenciesSatisfied =
                                    false;
                        }
                    }


                    if (dependenciesSatisfied) {

                        approvalStatus.put(
                                approvalId,
                                "READY");

                        System.out.println(
                                "Status: READY");

                    } else {

                        approvalStatus.put(
                                approvalId,
                                "PENDING DEPENDENCY");

                        System.out.println(
                                "Status: "
                                        + "PENDING DEPENDENCY");
                    }
                }
            }


            // ==========================================
            // APPROVAL WORKFLOW
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("APPROVAL WORKFLOW STATUS");
            System.out.println("====================================");


            for (String approvalId
                    : applicableApprovals) {

                JsonObject approval =
                        findApproval(
                                approvals,
                                approvalId);

                String approvalName =
                        approval != null
                                ? getString(
                                        approval,
                                        "approval_name",
                                        "Not Specified")
                                : "Not Found";


                System.out.println();

                System.out.println(
                        approvalId
                                + " - "
                                + approvalName);

                System.out.println(
                        "Workflow Status: "
                                + approvalStatus
                                        .get(approvalId));
            }


            // ==========================================
            // APPROVAL DETAILS
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("APPROVAL DETAILS & DOCUMENT CHECKLIST");
            System.out.println("====================================");


            int totalDocuments = 0;


            for (String approvalId
                    : applicableApprovals) {

                JsonObject approval =
                        findApproval(
                                approvals,
                                approvalId);

                if (approval == null) {
                    continue;
                }


                String approvalName =
                        getString(
                                approval,
                                "approval_name",
                                "Not Specified");

                String department =
                        getString(
                                approval,
                                "department",
                                "Not Specified");


                System.out.println();

                System.out.println("------------------------------------");

                System.out.println(
                        "Approval ID: "
                                + approvalId);

                System.out.println(
                        "Approval Name: "
                                + approvalName);

                System.out.println(
                        "Department: "
                                + department);

                System.out.println(
                        "Current Status: "
                                + approvalStatus
                                        .get(approvalId));


                // ======================================
                // DEPENDENCIES
                // ======================================

                System.out.println(
                        "Depends On:");

                if (!approval.has("depends_on")
                        || approval
                                .getAsJsonArray(
                                        "depends_on")
                                .size() == 0) {

                    System.out.println("- None");

                } else {

                    JsonArray dependencies =
                            approval.getAsJsonArray(
                                    "depends_on");

                    for (JsonElement dependency
                            : dependencies) {

                        System.out.println(
                                "- "
                                        + dependency
                                                .getAsString());
                    }
                }


                // ======================================
                // REQUIRED DOCUMENTS
                // ======================================

                System.out.println(
                        "Required Documents:");

                if (!approval.has(
                        "required_documents")
                        || approval
                                .getAsJsonArray(
                                        "required_documents")
                                .size() == 0) {

                    System.out.println("- None");

                } else {

                    JsonArray documents =
                            approval.getAsJsonArray(
                                    "required_documents");

                    for (JsonElement document
                            : documents) {

                        String documentName =
                                document.getAsString();

                        System.out.println(
                                "[ ] "
                                        + documentName);

                        totalDocuments++;
                    }
                }


                // ======================================
                // SOURCE INFORMATION
                // ======================================

                if (approval.has(
                        "source_information")) {

                    JsonObject sourceInfo =
                            approval.getAsJsonObject(
                                    "source_information");

                    System.out.println();
                    System.out.println(
                            "Source Information:");

                    System.out.println(
                            "Source: "
                                    + getString(
                                            sourceInfo,
                                            "source",
                                            "Not Specified"));

                    System.out.println(
                            "URL: "
                                    + getString(
                                            sourceInfo,
                                            "url",
                                            "Not Specified"));

                    System.out.println(
                            "Last Verified: "
                                    + getString(
                                            sourceInfo,
                                            "last_verified",
                                            "Not Specified"));
                }
            }


            // ==========================================
            // PROJECT SUMMARY
            // ==========================================

            System.out.println();
            System.out.println("====================================");
            System.out.println("PROJECT APPROVAL SUMMARY");
            System.out.println("====================================");

            System.out.println(
                    "Project ID: " + projectId);

            System.out.println(
                    "Total Applicable Approvals: "
                            + applicableApprovals.size());

            System.out.println(
                    "Total Required Documents: "
                            + totalDocuments);


            int readyCount = 0;
            int pendingCount = 0;


            for (String status
                    : approvalStatus.values()) {

                if (status.equals("READY")) {

                    readyCount++;

                } else {

                    pendingCount++;
                }
            }


            System.out.println(
                    "Approvals Ready: "
                            + readyCount);

            System.out.println(
                    "Approvals Pending: "
                            + pendingCount);


            // ==========================================
            // COMPLETION
            // ==========================================

            System.out.println();
            System.out.println(
                    "====================================");

            System.out.println(
                    "RULES ENGINE EXECUTION COMPLETED");

            System.out.println(
                    "====================================");


        } catch (Exception e) {

            System.out.println();
            System.out.println(
                    "Error occurred while running "
                            + "Rules Engine");

            e.printStackTrace();
        }
    }


    // ==============================================
    // GET STRING SAFELY
    // ==============================================

    public static String getString(
            JsonObject object,
            String key,
            String defaultValue) {

        if (object.has(key)
                && !object.get(key).isJsonNull()) {

            return object
                    .get(key)
                    .getAsString();
        }

        return defaultValue;
    }


    // ==============================================
    // GET BOOLEAN SAFELY
    // ==============================================

    public static boolean getBoolean(
            JsonObject object,
            String key,
            boolean defaultValue) {

        if (object.has(key)
                && !object.get(key).isJsonNull()) {

            return object
                    .get(key)
                    .getAsBoolean();
        }

        return defaultValue;
    }


    // ==============================================
    // FIND APPROVAL BY ID
    // ==============================================

    public static JsonObject findApproval(
            JsonArray approvals,
            String approvalId) {

        for (JsonElement approvalElement
                : approvals) {

            JsonObject approval =
                    approvalElement.getAsJsonObject();

            if (approval.has("approval_id")
                    && approval
                            .get("approval_id")
                            .getAsString()
                            .equals(approvalId)) {

                return approval;
            }
        }

        return null;
    }
}