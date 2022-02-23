package com.c4_soft.cafe_skifo.web;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.domain.OrderRepository;
import com.c4_soft.cafe_skifo.exceptions.ResourceNotFoundException;
import com.c4_soft.cafe_skifo.web.dtos.OrderCreationRequestDto;
import com.c4_soft.cafe_skifo.web.dtos.OrderResponseDto;
import com.c4_soft.springaddons.security.oauth2.oidc.OidcAuthentication;
import com.c4_soft.springaddons.security.oauth2.oidc.OidcToken;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(path = "/orders", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
@RequiredArgsConstructor
@Transactional
@PreAuthorize("isAuthenticated()")
public class OrderController {
	private final OrderRepository orderRepo;
	private final OrderMapper sampleMapper;

	@GetMapping
	public List<OrderResponseDto> retrieveAll() {
		return orderRepo.findAll().stream().map(sampleMapper::toDto).collect(Collectors.toList());
	}

	@PostMapping
	@Transactional
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> create(@Valid @RequestBody OrderCreationRequestDto dto, OidcAuthentication<OidcToken> auth) throws URISyntaxException {
		final Order tmp = new Order(auth.getToken().getSubject(), new Date().getTime());
		sampleMapper.update(tmp, dto);
		final Order sample = orderRepo.save(tmp);

		return ResponseEntity.created(new URI(String.format("/%d", sample.getId()))).build();
	}

	@GetMapping("/{id}")
	public OrderResponseDto retrieveById(@PathVariable(name = "id") long id) {
		return orderRepo.findById(id).map(sampleMapper::toDto).orElseThrow(() -> new ResourceNotFoundException(String.format("No sample with ID %s", id)));
	}

	@PutMapping("/{id}")
	@Transactional
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> update(
			@PathVariable(name = "id") @Parameter(name = "id", in = ParameterIn.PATH, required = true, schema = @Schema(type = "long")) Order sample,
			@Valid @RequestBody OrderCreationRequestDto dto,
			OidcAuthentication<OidcToken> auth) {
		sampleMapper.update(sample, dto);
		orderRepo.save(sample);

		return ResponseEntity.accepted().build();
	}

	@DeleteMapping("/{id}")
	@Transactional
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> delete(
			@PathVariable(name = "id") @Parameter(name = "id", in = ParameterIn.PATH, required = true, schema = @Schema(type = "long")) Order sample,
			OidcAuthentication<OidcToken> auth) {
		orderRepo.delete(sample);

		return ResponseEntity.accepted().build();
	}
}
