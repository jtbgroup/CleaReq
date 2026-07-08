package com.cleareq.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "catalog_entry",
        uniqueConstraints = @UniqueConstraint(columnNames = {"catalog_type_id", "label"}))
public class CatalogEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_type_id", nullable = false)
    private CatalogType catalogType;

    @Column(nullable = false, length = 150)
    private String label;

    @Column(nullable = false)
    private boolean enabled = true;

    public UUID getId() {
        return id;
    }

    public CatalogType getCatalogType() {
        return catalogType;
    }

    public void setCatalogType(CatalogType catalogType) {
        this.catalogType = catalogType;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
