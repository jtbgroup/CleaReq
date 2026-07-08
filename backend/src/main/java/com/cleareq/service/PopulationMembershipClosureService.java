package com.webappboilerplate.service;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class PopulationMembershipClosureService {

    public void closeActiveMemberships(UUID personId, LocalDate closingDate) {
        // UC-05 will implement active membership closure persistence.
        // Kept as a no-op hook to keep UC-04 disable flow forward-compatible.
    }
}
