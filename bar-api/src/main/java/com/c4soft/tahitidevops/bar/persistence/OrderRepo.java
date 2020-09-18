package com.c4soft.tahitidevops.bar.persistence;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Repository;

import com.c4soft.tahitidevops.bar.domain.Order;

@Repository
public class OrderRepo {

	private final OrderCrudRepository delegate;

	@Autowired
	public OrderRepo(OrderCrudRepository delegate) {
		super();
		this.delegate = delegate;
	}

	// authentication.account.keycloakSecurityContext.token.subject")
	@PostFilter("hasAuthority('BARMAN') or hasAuthority('WAITER') or filterObject.createdBy == authentication.token.subject")
	public Iterable<Order> findAll() {
		return this.delegate.findAll();
	}

	@PostAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or returnObject.orElse(null)?.createdBy == authentication.token.subject")
	public Optional<Order> findById(Long id) {
		return this.delegate.findById(id);
	}

	@PreAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or #entity.createdBy == authentication.token.subject")
	public void delete(Order entity) {
		this.delegate.delete(entity);
	}

	@PreAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or #entity.createdBy == authentication.token.subject")
	public Order save(Order entity) {
		return this.delegate.save(entity);
	}
}
