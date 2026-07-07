package com.webappboilerplate.service;

import com.webappboilerplate.dto.CatalogDtos;
import com.webappboilerplate.entity.CatalogEntry;
import com.webappboilerplate.entity.CatalogType;
import com.webappboilerplate.repository.CatalogEntryRepository;
import com.webappboilerplate.repository.CatalogTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CatalogService {

    private final CatalogTypeRepository catalogTypeRepository;
    private final CatalogEntryRepository catalogEntryRepository;

    public CatalogService(CatalogTypeRepository catalogTypeRepository,
                           CatalogEntryRepository catalogEntryRepository) {
        this.catalogTypeRepository = catalogTypeRepository;
        this.catalogEntryRepository = catalogEntryRepository;
    }

    public List<CatalogDtos.CatalogTypeResponse> listTypes() {
        return catalogTypeRepository.findAll().stream()
                .map(this::toTypeResponse)
                .collect(Collectors.toList());
    }

    public List<CatalogDtos.CatalogEntryResponse> listEntries(String typeCode) {
        requireCatalogType(typeCode);
        return catalogEntryRepository.findByCatalogTypeCode(typeCode).stream()
                .map(this::toEntryResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public CatalogDtos.CatalogEntryResponse createEntry(String typeCode, CatalogDtos.CreateCatalogEntryRequest request) {
        CatalogType catalogType = requireCatalogType(typeCode);
        validateLabelUnique(typeCode, request.label(), null);

        CatalogEntry entry = new CatalogEntry();
        entry.setCatalogType(catalogType);
        entry.setLabel(request.label());
        entry.setEnabled(true);

        CatalogEntry saved = catalogEntryRepository.save(entry);
        return toEntryResponse(saved);
    }

    @Transactional
    public CatalogDtos.CatalogEntryResponse updateEntry(String typeCode, UUID id,
                                                          CatalogDtos.UpdateCatalogEntryRequest request) {
        requireCatalogType(typeCode);
        CatalogEntry entry = requireEntry(typeCode, id);
        validateLabelUnique(typeCode, request.label(), id);

        entry.setLabel(request.label());
        CatalogEntry saved = catalogEntryRepository.save(entry);
        return toEntryResponse(saved);
    }

    @Transactional
    public void disableEntry(String typeCode, UUID id) {
        requireCatalogType(typeCode);
        CatalogEntry entry = requireEntry(typeCode, id);
        entry.setEnabled(false);
        catalogEntryRepository.save(entry);
    }

    @Transactional
    public void enableEntry(String typeCode, UUID id) {
        requireCatalogType(typeCode);
        CatalogEntry entry = requireEntry(typeCode, id);
        entry.setEnabled(true);
        catalogEntryRepository.save(entry);
    }

    private void validateLabelUnique(String typeCode, String label, UUID excludeId) {
        boolean duplicate = catalogEntryRepository.findByCatalogTypeCode(typeCode).stream()
                .anyMatch(e -> e.getLabel().equalsIgnoreCase(label) && !e.getId().equals(excludeId));
        if (duplicate) {
            throw new IllegalArgumentException("This entry already exists in the catalog");
        }
    }

    private CatalogType requireCatalogType(String typeCode) {
        return catalogTypeRepository.findByCode(typeCode)
                .orElseThrow(() -> new IllegalArgumentException("Catalog type not found: " + typeCode));
    }

    private CatalogEntry requireEntry(String typeCode, UUID id) {
        CatalogEntry entry = catalogEntryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Catalog entry not found"));
        if (!entry.getCatalogType().getCode().equals(typeCode)) {
            throw new IllegalArgumentException("Catalog entry does not belong to catalog type: " + typeCode);
        }
        return entry;
    }

    private CatalogDtos.CatalogTypeResponse toTypeResponse(CatalogType catalogType) {
        return new CatalogDtos.CatalogTypeResponse(catalogType.getId(), catalogType.getCode(), catalogType.getLabel());
    }

    private CatalogDtos.CatalogEntryResponse toEntryResponse(CatalogEntry entry) {
        return new CatalogDtos.CatalogEntryResponse(entry.getId(), entry.getLabel(), entry.isEnabled());
    }
}
