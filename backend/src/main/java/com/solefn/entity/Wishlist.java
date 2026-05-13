package com.solefn.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "wishlists",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_wishlist_user_product",
        columnNames = {"user_id", "product_id"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "product_id", nullable = false, length = 100)
    private String productId;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(length = 500)
    private String image;

    @Column(length = 50)
    private String price;

    @Column(name = "mall_name", length = 100)
    private String mallName;

    @Column(length = 100)
    private String brand;

    @Column(length = 1000)
    private String link;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt = LocalDateTime.now();
}
