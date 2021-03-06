package com.c4soft.meetup.openid.cafeskifo.api.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import com.c4_soft.springaddons.security.oauth2.test.annotations.WithMockOidcId;
import com.c4_soft.springaddons.security.oauth2.test.mockmvc.MockMvcSupport;
import com.c4soft.meetup.openid.cafeskifo.api.conf.WebSecurityConfig;
import com.c4soft.meetup.openid.cafeskifo.api.domain.Order;
import com.c4soft.meetup.openid.cafeskifo.api.persistence.OrderRepo;
import com.c4soft.meetup.openid.cafeskifo.api.web.dto.OrderCreationRequestDto;

@WebMvcTest(OrderController.class)
@Import({ MockMvcSupport.class, WebSecurityConfig.class })
class OrderControllerTest {

	@MockBean
	JwtDecoder jwtDecoder;

	@MockBean
	OrderRepo orderRepo;

	@Autowired
	MockMvcSupport api;

	private final RequestPostProcessor sslPostProcessor = (MockHttpServletRequest request) -> {
		request.setSecure(true);
		return request;
	};

	@Test
	void whenUserNotAuthenticatedThenUnauthorized() throws Exception {
		api.with(sslPostProcessor).get("/orders").andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockOidcId
	void whenUserAuthenticatedThenCanListOrders() throws Exception {
		api.with(sslPostProcessor).get("/orders").andExpect(status().isOk());
	}

	@Test
	@WithMockOidcId
	void whenOrderIdIsUnknownThen404() throws Exception {
		when(orderRepo.findById(any())).thenReturn(Optional.empty());

		api.with(sslPostProcessor).get("/orders/51").andExpect(status().isNotFound());
	}

	@Test
	@WithMockOidcId
	void whenUserAuthenticatedThenCanPlaceOrderWithoutTable() throws Exception {
		when(orderRepo.save(any())).thenAnswer(invoc -> ((Order) invoc.getArgument(0)).setId(42L));

		final var payload = new OrderCreationRequestDto();
		payload.drink = "Guinness";
		api.with(sslPostProcessor)
				.post(payload, "/orders")
				.andExpect(status().isCreated())
				.andExpect(header().exists("location"));
	}

	@Test
	@WithMockOidcId
	void whenUserAuthenticatedThenCanPlaceOrderWitTable() throws Exception {
		when(orderRepo.save(any())).thenAnswer(invoc -> ((Order) invoc.getArgument(0)).setId(42L));

		final var payload = new OrderCreationRequestDto();
		payload.drink = "Guinness";
		payload.table = "42";
		api.with(sslPostProcessor)
				.post(payload, "/orders")
				.andExpect(status().isCreated())
				.andExpect(header().exists("location"));
	}

	@Test
	@WithMockOidcId
	void whenPlaceOrderWithEmptyDrinkThenBadRequest() throws Exception {
		final var payload = new OrderCreationRequestDto();

		payload.drink = null;
		api.with(sslPostProcessor).post(payload, "/orders").andExpect(status().isBadRequest());

		payload.drink = "";
		api.with(sslPostProcessor).post(payload, "/orders").andExpect(status().isBadRequest());
	}

}
