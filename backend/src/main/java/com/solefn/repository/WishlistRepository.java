package com.solefn.repository;

import com.solefn.entity.User;
import com.solefn.entity.Wishlist;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    Optional<Wishlist> findByUserAndProductId(User user, String productId);
    List<Wishlist> findByUserOrderByAddedAtDesc(User user, Pageable pageable);
    void deleteByUserAndProductId(User user, String productId);
    boolean existsByUserAndProductId(User user, String productId);
}
