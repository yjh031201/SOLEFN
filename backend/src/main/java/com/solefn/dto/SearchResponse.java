package com.solefn.dto;

import java.util.List;

public record SearchResponse(
        int total,
        List<ShoeItem> items,
        boolean hasMore
) {}
