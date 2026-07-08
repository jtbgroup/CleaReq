package com.cleareq.dto;

import java.util.UUID;

public final class PersonDtos {

    private PersonDtos() { }

    public record PersonResponse(
            UUID id,
            String lastName,
            String firstName,
            String email,
            String functionLabel,
            boolean enabled
    ) { }

    public record CreatePersonRequest(String lastName, String firstName, String email, UUID functionId) { }

    public record UpdatePersonRequest(String lastName, String firstName, UUID functionId) { }
}
