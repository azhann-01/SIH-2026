package com.codexminds.indusync.repository;

import com.codexminds.indusync.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByProjectId(Long projectId);

    long countByStatus(Application.Status status);
}