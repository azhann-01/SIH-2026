package com.codexminds.indusync.controller;

import com.codexminds.indusync.entity.Scheme;
import com.codexminds.indusync.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/scheme")
public class SchemeController {

    @Autowired
    private SchemeRepository schemeRepository;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Scheme scheme) {
        return ResponseEntity.ok(schemeRepository.save(scheme));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(schemeRepository.findAll());
    }

    @GetMapping("/industry/{industry}")
    public ResponseEntity<?> getByIndustry(@PathVariable String industry) {
        List<Scheme> list = schemeRepository.findByIndustry(industry);
        return ResponseEntity.ok(list);
    }
}