package com.solefn.dto;

import java.util.List;

public record GroupedShoeItem(
        String id,
        String title,
        String price,
        String image,
        String link,
        String mallName,
        String brand,
        String category2,
        String category3,
        int storeCount,
        List<ShoeItem> stores
) {}
