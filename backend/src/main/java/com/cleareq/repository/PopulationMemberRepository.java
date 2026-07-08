package com.cleareq.repository;

import com.cleareq.entity.PopulationMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface PopulationMemberRepository extends JpaRepository<PopulationMember, UUID> {

    List<PopulationMember> findByPopulationId(UUID populationId);

    @Query("SELECT pm FROM PopulationMember pm WHERE pm.person.id = :personId "
            + "AND (pm.endDate IS NULL OR pm.endDate >= :today)")
    List<PopulationMember> findByPersonIdAndEndDateIsNullOrEndDateGreaterThanEqual(
            @Param("personId") UUID personId, @Param("today") LocalDate today);
}