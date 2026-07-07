package com.webappboilerplate.repository;

import com.webappboilerplate.entity.CatalogEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CatalogEntryRepository extends JpaRepository<CatalogEntry, UUID> {
    List<CatalogEntry> findByCatalogTypeCode(String code);

    List<CatalogEntry> findByCatalogTypeCodeAndEnabledTrue(String code);
}
