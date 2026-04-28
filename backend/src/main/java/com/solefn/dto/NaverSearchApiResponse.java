package com.solefn.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record NaverSearchApiResponse(List<NaverItem> items) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record NaverItem(
            String productId,
            String title,
            String lprice,
            String image,
            String link,
            String mallName,
            String brand,
            String category1,
            String category2,
            String category3
    ) {}
}
