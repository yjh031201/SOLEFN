package com.solefn.dto;

import java.util.List;

public record ColorVariant(
        String id,
        String color,
        String lowestPrice,
        String image,
        String link,
        String mallName,
        List<ShoeItem> stores
) {}
