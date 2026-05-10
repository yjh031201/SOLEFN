package com.solefn.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "recent_views",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_user_product",
        columnNames = {"user_id", "product_id"}
    ),
    indexes = @Index(name = "idx_user_viewed", columnList = "user_id, viewed_at DESC")
)
@Getter
@Setter
@NoArgsConstructor
public class RecentView {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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

    @Column(name = "viewed_at", nullable = false)
    private LocalDateTime viewedAt = LocalDateTime.now();
}