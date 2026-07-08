package com.cleareq.service;

import com.cleareq.entity.PopulationMember;
import com.cleareq.repository.PopulationMemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class PopulationMembershipClosureService {

    private final PopulationMemberRepository populationMemberRepository;

    public PopulationMembershipClosureService(PopulationMemberRepository populationMemberRepository) {
        this.populationMemberRepository = populationMemberRepository;
    }

    /**
     * Closes every active membership (endDate null or in the future) of the given person,
     * across all populations, by setting endDate to the closing date. Invoked as part of
     * the UC-04 person-disabling flow so both operations happen in a single transaction.
     */
    @Transactional
    public void closeActiveMemberships(UUID personId, LocalDate closingDate) {
        List<PopulationMember> activeMemberships =
                populationMemberRepository.findByPersonIdAndEndDateIsNullOrEndDateGreaterThanEqual(
                        personId, closingDate);

        for (PopulationMember membership : activeMemberships) {
            membership.setEndDate(closingDate);
        }
        populationMemberRepository.saveAll(activeMemberships);
    }
}