package com.cleareq.service;

import com.cleareq.dto.PopulationDtos;
import com.cleareq.entity.CatalogEntry;
import com.cleareq.entity.Person;
import com.cleareq.entity.Population;
import com.cleareq.entity.PopulationMember;
import com.cleareq.repository.CatalogEntryRepository;
import com.cleareq.repository.PersonRepository;
import com.cleareq.repository.PopulationMemberRepository;
import com.cleareq.repository.PopulationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PopulationService {

    private static final String FUNCTION_CATALOG_CODE = "FUNCTION";

    private final PopulationRepository populationRepository;
    private final PopulationMemberRepository populationMemberRepository;
    private final PersonRepository personRepository;
    private final CatalogEntryRepository catalogEntryRepository;

    public PopulationService(PopulationRepository populationRepository,
                              PopulationMemberRepository populationMemberRepository,
                              PersonRepository personRepository,
                              CatalogEntryRepository catalogEntryRepository) {
        this.populationRepository = populationRepository;
        this.populationMemberRepository = populationMemberRepository;
        this.personRepository = personRepository;
        this.catalogEntryRepository = catalogEntryRepository;
    }

    public List<PopulationDtos.PopulationResponse> listPopulations() {
        return populationRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PopulationDtos.PopulationResponse createPopulation(PopulationDtos.CreatePopulationRequest request) {
        String name = requireNonBlank(request.name(), "name");
        validateNameUnique(name, null);

        Population population = new Population();
        population.setName(name);
        population.setStatus(parseStatus(request.status(), Population.Status.ACTIVE));

        Population saved = populationRepository.save(population);
        return toResponse(saved);
    }

    @Transactional
    public PopulationDtos.PopulationResponse updatePopulation(UUID id, PopulationDtos.UpdatePopulationRequest request) {
        Population population = requirePopulation(id);

        if (request.name() != null) {
            String name = requireNonBlank(request.name(), "name");
            validateNameUnique(name, id);
            population.setName(name);
        }
        if (request.status() != null) {
            population.setStatus(parseStatus(request.status(), population.getStatus()));
        }

        Population saved = populationRepository.save(population);
        return toResponse(saved);
    }

    public List<PopulationDtos.PopulationMemberResponse> listMembers(UUID populationId) {
        requirePopulation(populationId);
        return populationMemberRepository.findByPopulationId(populationId).stream()
                .map(this::toMemberResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PopulationDtos.PopulationMemberResponse addMember(UUID populationId,
                                                               PopulationDtos.AddPopulationMemberRequest request) {
        Population population = requirePopulation(populationId);
        Person person = requireEnabledPerson(request.personId());
        CatalogEntry function = requireEnabledFunction(request.functionId());
        validateDates(request.startDate(), request.endDate());

        PopulationMember member = new PopulationMember();
        member.setPopulation(population);
        member.setPerson(person);
        member.setFunction(function);
        member.setStartDate(request.startDate());
        member.setEndDate(request.endDate());

        PopulationMember saved = populationMemberRepository.save(member);
        return toMemberResponse(saved);
    }

    @Transactional
    public PopulationDtos.PopulationMemberResponse updateMember(UUID populationId, UUID memberId,
                                                                  PopulationDtos.UpdatePopulationMemberRequest request) {
        requirePopulation(populationId);
        PopulationMember member = requireMember(populationId, memberId);

        if (request.functionId() != null) {
            member.setFunction(requireEnabledFunction(request.functionId()));
        }
        if (request.endDate() != null) {
            validateDates(member.getStartDate(), request.endDate());
            member.setEndDate(request.endDate());
        }

        PopulationMember saved = populationMemberRepository.save(member);
        return toMemberResponse(saved);
    }

    private void validateNameUnique(String name, UUID excludeId) {
        populationRepository.findByName(name).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new IllegalArgumentException("A population with this name already exists");
            }
        });
    }

    private void validateDates(java.time.LocalDate startDate, java.time.LocalDate endDate) {
        if (startDate == null) {
            throw new IllegalArgumentException("startDate is required");
        }
        if (endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate cannot be earlier than startDate");
        }
    }

    private Person requireEnabledPerson(UUID personId) {
        if (personId == null) {
            throw new IllegalArgumentException("personId is required");
        }
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new IllegalArgumentException("Person not found"));
        if (!person.isEnabled()) {
            throw new IllegalArgumentException("This person is disabled and cannot be added to a population");
        }
        return person;
    }

    private CatalogEntry requireEnabledFunction(UUID functionId) {
        if (functionId == null) {
            throw new IllegalArgumentException("functionId is required");
        }
        CatalogEntry function = catalogEntryRepository.findById(functionId)
                .orElseThrow(() -> new IllegalArgumentException("Function not found"));
        if (!FUNCTION_CATALOG_CODE.equals(function.getCatalogType().getCode())) {
            throw new IllegalArgumentException("Catalog entry is not a Function");
        }
        if (!function.isEnabled()) {
            throw new IllegalArgumentException("Function must be enabled");
        }
        return function;
    }

    private Population requirePopulation(UUID id) {
        return populationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Population not found"));
    }

    private PopulationMember requireMember(UUID populationId, UUID memberId) {
        PopulationMember member = populationMemberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Population member not found"));
        if (!member.getPopulation().getId().equals(populationId)) {
            throw new IllegalArgumentException("Population member does not belong to this population");
        }
        return member;
    }

    private Population.Status parseStatus(String status, Population.Status fallback) {
        if (status == null || status.isBlank()) {
            return fallback;
        }
        try {
            return Population.Status.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }

    private String requireNonBlank(String value, String field) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(field + " is required");
        }
        return value.trim();
    }

    private PopulationDtos.PopulationResponse toResponse(Population population) {
        long memberCount = populationMemberRepository.findByPopulationId(population.getId()).size();
        return new PopulationDtos.PopulationResponse(
                population.getId(), population.getName(), population.getStatus().name(), memberCount);
    }

    private PopulationDtos.PopulationMemberResponse toMemberResponse(PopulationMember member) {
        Person person = member.getPerson();
        String fullName = person.getFirstName() + " " + person.getLastName();
        return new PopulationDtos.PopulationMemberResponse(
                member.getId(),
                person.getId(),
                fullName,
                member.getFunction().getLabel(),
                member.getStartDate(),
                member.getEndDate()
        );
    }
}