package com.c4soft.tahitidevops.bar.web;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c4soft.tahitidevops.bar.domain.Order;
import com.c4soft.tahitidevops.bar.persistence.OrderRepo;
import com.c4soft.tahitidevops.bar.web.dto.OrderCreationRequestDto;
import com.c4soft.tahitidevops.bar.web.dto.OrderResponseDto;
import com.c4soft.tahitidevops.bar.web.error.NotFoundEexception;

@RestController
@RequestMapping("/orders")
@PreAuthorize("isAuthenticated()")
public class OrderController {

	private final OrderModelAssembler orderAssembler;
	private final OrderRepo orderRepo;

	@Autowired
	public OrderController(OrderModelAssembler orderAssembler, OrderRepo orderRepo) {
		this.orderAssembler = orderAssembler;
		this.orderRepo = orderRepo;
	}

	@GetMapping
	public CollectionModel<OrderResponseDto> getAll() {
		return orderAssembler.toCollectionModel(orderRepo.findAll());
	}

	@GetMapping("/{id}")
	public OrderResponseDto getById(@PathVariable Long id) {
		return orderAssembler.toModel(orderRepo.findById(id).orElseThrow(NotFoundEexception::new));
	}

	@PostMapping
	public ResponseEntity<Long> placeOrder(@Valid @RequestBody OrderCreationRequestDto dto) {
		final var order = orderRepo.save(new Order(dto.drink));
		return ResponseEntity
				.created(linkTo(methodOn(OrderController.class).getById(order.getId())).withSelfRel().toUri())
				.body(order.getId());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<?> deleteById(@PathVariable Long id) {
		final var order = orderRepo.findById(id).orElseThrow(NotFoundEexception::new);
		orderRepo.delete(order);
		return ResponseEntity.noContent().build();
	}

	@Component
	static class OrderModelAssembler extends RepresentationModelAssemblerSupport<Order, OrderResponseDto> {
		public OrderModelAssembler() {
			super(OrderController.class, OrderResponseDto.class);
		}

		@Override
		protected OrderResponseDto instantiateModel(Order entity) {
			return new OrderResponseDto(entity.getId(), entity.getDrink());
		}

		@Override
		public OrderResponseDto toModel(Order entity) {
			return createModelWithId(entity.getId(), entity);
		}
	}
}
