package com.terruno.api.taste;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TasteProfileRepository extends JpaRepository<TasteProfile, Long> {

    Optional<TasteProfile> findByUserId(Long userId);
}
