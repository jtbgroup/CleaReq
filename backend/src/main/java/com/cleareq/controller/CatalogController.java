package com.webappboilerplate.controller;

import com.webappboilerplate.dto.CatalogDtos;
import com.webappboilerplate.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/catalogs")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CatalogDtos.CatalogTypeResponse> listTypes() {
        return catalogService.listTypes();
    }

    @GetMapping("/{typeCode}/entries")
    public ResponseEntity<List<CatalogDtos.CatalogEntryResponse>> listEntries(@PathVariable String typeCode) {
        try {
            return ResponseEntity.ok(catalogService.listEntries(typeCode));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{typeCode}/entries")
    public ResponseEntity<CatalogDtos.CatalogEntryResponse> createEntry(
            @PathVariable String typeCode,
            @RequestBody CatalogDtos.CreateCatalogEntryRequest request) {
        try {
            return ResponseEntity.ok(catalogService.createEntry(typeCode, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{typeCode}/entries/{id}")
    public ResponseEntity<CatalogDtos.CatalogEntryResponse> updateEntry(
            @PathVariable String typeCode,
            @PathVariable UUID id,
            @RequestBody CatalogDtos.UpdateCatalogEntryRequest request) {
        try {
            return ResponseEntity.ok(catalogService.updateEntry(typeCode, id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{typeCode}/entries/{id}/disable")
    public ResponseEntity<Void> disableEntry(@PathVariable String typeCode, @PathVariable UUID id) {
        try {
            catalogService.disableEntry(typeCode, id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{typeCode}/entries/{id}/enable")
    public ResponseEntity<Void> enableEntry(@PathVariable String typeCode, @PathVariable UUID id) {
        try {
            catalogService.enableEntry(typeCode, id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
