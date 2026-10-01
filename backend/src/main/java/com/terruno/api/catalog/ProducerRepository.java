package com.terruno.api.catalog;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProducerRepository extends JpaRepository<Producer, Long> {

    List<Producer> findAllByOrderByNameAsc();
}
