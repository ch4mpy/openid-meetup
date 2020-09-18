package com.c4soft.tahitidevops.bar.persistence;

import org.springframework.data.repository.CrudRepository;

import com.c4soft.tahitidevops.bar.domain.Order;

interface OrderCrudRepository extends CrudRepository<Order, Long> {
}