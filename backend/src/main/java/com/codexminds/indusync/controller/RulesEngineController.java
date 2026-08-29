package com.codexminds.indusync.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.codexminds.indusync.service.RulesEngineService;

@RestController
@RequestMapping("/api/rules")
public class RulesEngineController {

    @Autowired
    private RulesEngineService rulesEngineService;

    @PostMapping("/evaluate")
    public ResponseEntity<?> evaluate(
            @RequestBody Map<String, Object> request) {

        try {

            String industry =
                    (String) request.getOrDefault(
                            "industry",
                            "Not Specified"
                    );

            String projectStage =
                    (String) request.getOrDefault(
                            "projectStage",
                            "Not Specified"
                    );

            String locationType =
                    (String) request.getOrDefault(
                            "locationType",
                            "Not Specified"
                    );

            boolean generatesHazardousWaste =
                    Boolean.TRUE.equals(
                            request.get("generatesHazardousWaste")
                    );

            boolean requiresFireSafety =
                    Boolean.TRUE.equals(
                            request.get("requiresFireSafety")
                    );

            boolean hasStartedProduction =
                    Boolean.TRUE.equals(
                            request.get("hasStartedProduction")
                    );

            Map<String, Object> result =
                    rulesEngineService.evaluateProject(
                            industry,
                            projectStage,
                            locationType,
                            generatesHazardousWaste,
                            requiresFireSafety,
                            hasStartedProduction
                    );

            return ResponseEntity.ok(result);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}