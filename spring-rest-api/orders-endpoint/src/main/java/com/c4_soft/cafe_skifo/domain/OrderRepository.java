package com.c4_soft.cafe_skifo.domain;

import java.util.List;
import java.util.Optional;

import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;

public interface OrderRepository {

	@PostFilter("hasAuthority('BARMAN') or hasAuthority('WAITER') or filterObject.createdBy == authentication.token.preferredUsername")
	List<Order> findAll();

	@PostAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or returnObject.orElse(null)?.createdBy == authentication.token.preferredUsername")
	Optional<Order> findById(Long id);

	@PreAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or #entity.createdBy == authentication.token.preferredUsername")
	void delete(Order entity);

	@PreAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or #entity.createdBy == authentication.token.preferredUsername")
	Order save(Order entity);

}