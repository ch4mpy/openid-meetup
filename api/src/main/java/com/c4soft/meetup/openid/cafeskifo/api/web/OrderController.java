package com.c4soft.meetup.openid.cafeskifo.api.web;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c4_soft.springaddons.security.oauth2.oidc.OidcIdAuthenticationToken;
import com.c4soft.meetup.openid.cafeskifo.api.domain.Order;
import com.c4soft.meetup.openid.cafeskifo.api.persistence.OrderRepo;
import com.c4soft.meetup.openid.cafeskifo.api.web.dto.OrderCreationRequestDto;
import com.c4soft.meetup.openid.cafeskifo.api.web.dto.OrderResponseDto;
import com.c4soft.meetup.openid.cafeskifo.api.web.error.NotFoundEexception;

@RestController
@RequestMapping("/orders")
@PreAuthorize("isAuthenticated()")
public class OrderController {

	private final OrderRepo orderRepo;

	@Autowired
	public OrderController(OrderRepo orderRepo) {
		this.orderRepo = orderRepo;
	}

	@GetMapping
	public ResponseEntity<List<OrderResponseDto>> getAll() {
		return ResponseEntity.ok(convert(orderRepo.findAll()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderResponseDto> getById(@PathVariable("id") long id) {
		final var order = getOrderById(id);
		return ResponseEntity.ok(convert(order));
	}

	@PostMapping
	public ResponseEntity<Long>
			placeOrder(@Valid @RequestBody OrderCreationRequestDto dto, OidcIdAuthenticationToken auth) {
		// auth.getAccount().getKeycloakSecurityContext().getToken().getSubject()
		final var order = orderRepo.save(new Order(dto.drink, auth.getToken().getPreferredUsername(), dto.table));

		return ResponseEntity
				.created(linkTo(methodOn(OrderController.class).getById(order.getId())).withSelfRel().toUri())
				.body(order.getId());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteById(@PathVariable("id") long id) {
		final var order = getOrderById(id);
		orderRepo.delete(order);
		return ResponseEntity.noContent().build();
	}

	private Order getOrderById(long id) {
		return orderRepo.findById(id).orElseThrow(NotFoundEexception::new);
	}

	private static OrderResponseDto convert(Order entity) {
		return new OrderResponseDto(entity.getId(), entity.getDrink(), entity.getCreatedBy(), entity.getTable());
	}

	private static List<OrderResponseDto> convert(Iterable<Order> entities) {
		return StreamSupport.stream(entities.spliterator(), false)
				.map(OrderController::convert)
				.collect(Collectors.toList());
	}
}
