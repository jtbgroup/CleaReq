package com.webappboilerplate.controller;

import com.webappboilerplate.dto.PersonDtos;
import com.webappboilerplate.service.PersonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/persons")
public class PersonController {

    private final PersonService personService;

    public PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping
    public List<PersonDtos.PersonResponse> listPersons() {
        return personService.listPersons();
    }

    @PostMapping
    public ResponseEntity<PersonDtos.PersonResponse> createPerson(
            @RequestBody PersonDtos.CreatePersonRequest request) {
        try {
            return ResponseEntity.ok(personService.createPerson(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PersonDtos.PersonResponse> updatePerson(
            @PathVariable UUID id,
            @RequestBody PersonDtos.UpdatePersonRequest request) {
        try {
            return ResponseEntity.ok(personService.updatePerson(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{id}/disable")
    public ResponseEntity<Void> disablePerson(@PathVariable UUID id) {
        try {
            personService.disablePerson(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
