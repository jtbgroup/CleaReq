package com.cleareq.dto;

import java.time.LocalDate;
import java.util.UUID;

public final class PopulationDtos {

    private PopulationDtos() { }

    public record PopulationResponse(UUID id, String name, String status, long memberCount) { }

    public record CreatePopulationRequest(String name, String status) { }

    public record UpdatePopulationRequest(String name, String status) { }

    public record PopulationMemberResponse(
            UUID id,
            UUID personId,
            String personFullName,
            String functionLabel,
            LocalDate startDate,
            LocalDate endDate
    ) { }

    public record AddPopulationMemberRequest(UUID personId, UUID functionId, LocalDate startDate, LocalDate endDate) { }

    public record UpdatePopulationMemberRequest(UUID functionId, LocalDate endDate) { }
}