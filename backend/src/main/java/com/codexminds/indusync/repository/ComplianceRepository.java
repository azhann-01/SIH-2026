package com.codexminds.indusync.repository;

import com.codexminds.indusync.entity.Compliance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComplianceRepository extends JpaRepository<Compliance, Long> {
    List<Compliance> findByProjectId(Long projectId);
}