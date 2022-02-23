package com.c4_soft.cafe_skifo.domain.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;

import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.domain.OrderRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class SecuredOrderRepository implements OrderRepository {

	private final OrderJpaRepository delegate;

	@Override
	public List<Order> findAll() {
		return this.delegate.findAll();
	}

	@Override
	public Optional<Order> findById(Long id) {
		return this.delegate.findById(id);
	}

	@Override
	public void delete(Order entity) {
		this.delegate.delete(entity);
	}

	@Override
	public Order save(Order entity) {
		return this.delegate.save(entity);
	}
}
