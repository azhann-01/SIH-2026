package com.codexminds.indusync.repository;

import com.codexminds.indusync.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
    List<Scheme> findByIndustry(String industry);
}