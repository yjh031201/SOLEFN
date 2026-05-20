package com.solefn.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WishlistRequest {
    private String productId;
    private String title;
    private String image;
    private String price;
    private String mallName;
    private String brand;
    private String link;
}
