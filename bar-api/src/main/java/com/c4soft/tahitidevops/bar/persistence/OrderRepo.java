package com.c4soft.tahitidevops.bar.persistence;

import org.springframework.data.repository.PagingAndSortingRepository;

import com.c4soft.tahitidevops.bar.domain.Order;

public interface OrderRepo extends PagingAndSortingRepository<Order, Long> {
}
