package com.webappboilerplate.service;

import com.webappboilerplate.dto.PersonDtos;
import com.webappboilerplate.entity.CatalogEntry;
import com.webappboilerplate.entity.Person;
import com.webappboilerplate.repository.CatalogEntryRepository;
import com.webappboilerplate.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class PersonService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final String FUNCTION_CATALOG_CODE = "FUNCTION";

    private final PersonRepository personRepository;
    private final CatalogEntryRepository catalogEntryRepository;
    private final PopulationMembershipClosureService populationMembershipClosureService;

    public PersonService(PersonRepository personRepository,
                         CatalogEntryRepository catalogEntryRepository,
                         PopulationMembershipClosureService populationMembershipClosureService) {
        this.personRepository = personRepository;
        this.catalogEntryRepository = catalogEntryRepository;
        this.populationMembershipClosureService = populationMembershipClosureService;
    }

    public List<PersonDtos.PersonResponse> listPersons() {
        return personRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PersonDtos.PersonResponse createPerson(PersonDtos.CreatePersonRequest request) {
        String lastName = requireNonBlank(request.lastName(), "lastName");
        String firstName = requireNonBlank(request.firstName(), "firstName");
        String email = requireValidEmail(request.email());
        CatalogEntry function = requireEnabledFunction(request.functionId());

        if (personRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("A person with this email already exists");
        }

        Person person = new Person();
        person.setLastName(lastName);
        person.setFirstName(firstName);
        person.setEmail(email);
        person.setFunction(function);
        person.setEnabled(true);

        Person saved = personRepository.save(person);
        return toResponse(saved);
    }

    @Transactional
    public PersonDtos.PersonResponse updatePerson(UUID id, PersonDtos.UpdatePersonRequest request) {
        Person person = requirePerson(id);

        String lastName = requireNonBlank(request.lastName(), "lastName");
        String firstName = requireNonBlank(request.firstName(), "firstName");
        CatalogEntry function = requireEnabledFunction(request.functionId());

        person.setLastName(lastName);
        person.setFirstName(firstName);
        person.setFunction(function);

        Person saved = personRepository.save(person);
        return toResponse(saved);
    }

    @Transactional
    public void disablePerson(UUID id) {
        Person person = requirePerson(id);
        person.setEnabled(false);
        personRepository.save(person);
        populationMembershipClosureService.closeActiveMemberships(person.getId(), LocalDate.now());
    }

    private Person requirePerson(UUID id) {
        return personRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Person not found"));
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

    private String requireValidEmail(String email) {
        String normalized = requireNonBlank(email, "email");
        if (!EMAIL_PATTERN.matcher(normalized).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        return normalized;
    }

    private String requireNonBlank(String value, String field) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException(field + " is required");
        }
        return value.trim();
    }

    private PersonDtos.PersonResponse toResponse(Person person) {
        return new PersonDtos.PersonResponse(
                person.getId(),
                person.getLastName(),
                person.getFirstName(),
                person.getEmail(),
                person.getFunction().getLabel(),
                person.isEnabled()
        );
    }
}
