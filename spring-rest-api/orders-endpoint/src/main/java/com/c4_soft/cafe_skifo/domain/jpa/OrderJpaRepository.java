package com.c4_soft.cafe_skifo.domain.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import com.c4_soft.cafe_skifo.domain.Order;

interface OrderJpaRepository extends JpaRepository<Order, Long> {
    
}
