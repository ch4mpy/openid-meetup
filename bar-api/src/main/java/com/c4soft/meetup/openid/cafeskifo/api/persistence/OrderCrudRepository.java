package com.c4soft.meetup.openid.cafeskifo.api.persistence;

import org.springframework.data.repository.CrudRepository;

import com.c4soft.meetup.openid.cafeskifo.api.domain.Order;

interface OrderCrudRepository extends CrudRepository<Order, Long> {
}