package com.webappboilerplate.dto;

import java.util.UUID;

public final class CatalogDtos {

    private CatalogDtos() { }

    public record CatalogTypeResponse(UUID id, String code, String label) { }

    public record CatalogEntryResponse(UUID id, String label, boolean enabled) { }

    public record CreateCatalogEntryRequest(String label) { }

    public record UpdateCatalogEntryRequest(String label) { }
}
