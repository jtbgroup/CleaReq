package com.cleareq.repository;

import com.cleareq.entity.Population;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PopulationRepository extends JpaRepository<Population, UUID> {
    Optional<Population> findByName(String name);
}