package com.cleareq.controller;

import com.cleareq.dto.PopulationDtos;
import com.cleareq.service.PopulationService;
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
@RequestMapping("/api/populations")
public class PopulationController {

    private final PopulationService populationService;

    public PopulationController(PopulationService populationService) {
        this.populationService = populationService;
    }

    @GetMapping
    public List<PopulationDtos.PopulationResponse> listPopulations() {
        return populationService.listPopulations();
    }

    @PostMapping
    public ResponseEntity<PopulationDtos.PopulationResponse> createPopulation(
            @RequestBody PopulationDtos.CreatePopulationRequest request) {
        try {
            return ResponseEntity.ok(populationService.createPopulation(request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<PopulationDtos.PopulationResponse> updatePopulation(
            @PathVariable UUID id,
            @RequestBody PopulationDtos.UpdatePopulationRequest request) {
        try {
            return ResponseEntity.ok(populationService.updatePopulation(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<PopulationDtos.PopulationMemberResponse>> listMembers(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(populationService.listMembers(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<PopulationDtos.PopulationMemberResponse> addMember(
            @PathVariable UUID id,
            @RequestBody PopulationDtos.AddPopulationMemberRequest request) {
        try {
            return ResponseEntity.ok(populationService.addMember(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/members/{memberId}")
    public ResponseEntity<PopulationDtos.PopulationMemberResponse> updateMember(
            @PathVariable UUID id,
            @PathVariable UUID memberId,
            @RequestBody PopulationDtos.UpdatePopulationMemberRequest request) {
        try {
            return ResponseEntity.ok(populationService.updateMember(id, memberId, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}