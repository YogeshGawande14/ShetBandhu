package com.agroconnect.repository;

import com.agroconnect.domain.GovernmentScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface GovernmentSchemeRepository extends JpaRepository<GovernmentScheme,UUID> {
    List<GovernmentScheme> findByActiveTrueOrderByTitleAsc();
}
