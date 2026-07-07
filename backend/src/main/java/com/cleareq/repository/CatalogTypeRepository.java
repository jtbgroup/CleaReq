package com.webappboilerplate.repository;

import com.webappboilerplate.entity.CatalogType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CatalogTypeRepository extends JpaRepository<CatalogType, UUID> {
    Optional<CatalogType> findByCode(String code);
}
