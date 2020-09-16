package com.c4soft.tahitidevops.bar.persistence;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PostFilter;
import org.springframework.security.access.prepost.PreAuthorize;

import com.c4soft.tahitidevops.bar.domain.Order;

public interface OrderRepo extends CrudRepository<Order, Long> {

	@Override
	// authentication.account.keycloakSecurityContext.token.subject")
	@PostFilter("hasAuthority('BARMAN') or hasAuthority('WAITER') or filterObject.createdBy == authentication.token.subject")
	Iterable<Order> findAll();

	@Override
	@PostAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or returnObject.orElse(null)?.createdBy == authentication.token.subject")
	Optional<Order> findById(Long id);

	@Override
	@PreAuthorize("hasAuthority('BARMAN') or hasAuthority('WAITER') or #entity.createdBy == authentication.token.subject")
	void delete(Order entity);

}
