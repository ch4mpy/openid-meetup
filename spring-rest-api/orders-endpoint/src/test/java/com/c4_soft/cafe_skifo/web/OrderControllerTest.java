package com.c4_soft.cafe_skifo.web;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.c4_soft.cafe_skifo.EnableSpringDataWebSupportTestConf;
import com.c4_soft.cafe_skifo.SampleApi.WebSecurityConfig;
import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.domain.OrderRepository;
import com.c4_soft.cafe_skifo.web.dtos.OrderCreationRequestDto;
import com.c4_soft.springaddons.security.oauth2.test.annotations.WithMockOidcAuth;
import com.c4_soft.springaddons.security.oauth2.test.mockmvc.MockMvcSupport;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Import({ MockMvcSupport.class, WebSecurityConfig.class, EnableSpringDataWebSupportTestConf.class })
class OrderControllerTest {

	@MockBean
	JwtDecoder jwtDecoder;

	@MockBean
	OrderRepository orderRepo;

	@Autowired
	MockMvcSupport api;

	@Test
	void whenUserNotAuthenticatedThenUnauthorized() throws Exception {
		api.get("/orders").andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockOidcAuth
	void whenUserAuthenticatedThenCanListOrders() throws Exception {
		api.get("/orders").andExpect(status().isOk());
	}

	@Test
	@WithMockOidcAuth
	void whenOrderIdIsUnknownThen404() throws Exception {
		when(orderRepo.findById(any())).thenReturn(Optional.empty());

		api.get("/orders/51").andExpect(status().isNotFound());
	}

	@Test
	@WithMockOidcAuth
	void whenUserAuthenticatedThenCanPlaceOrderWithoutTable() throws Exception {
		when(orderRepo.save(any())).thenAnswer(invoc -> {
			final var order = (Order) invoc.getArgument(0);
			order.setId(42L);
			return order;
		});

		final var payload = new OrderCreationRequestDto();
		payload.setDrink("Guinness");
		api.post(payload, "/orders").andExpect(status().isCreated()).andExpect(header().exists("location"));
	}

	@Test
	@WithMockOidcAuth
	void whenUserAuthenticatedThenCanPlaceOrderWitTable() throws Exception {
		when(orderRepo.save(any())).thenAnswer(invoc -> {
			final var order = (Order) invoc.getArgument(0);
			order.setId(42L);
			return order;
		});

		final var payload = new OrderCreationRequestDto();
		payload.setDrink("Guinness");
		payload.setTable("42");
		api.post(payload, "/orders").andExpect(status().isCreated()).andExpect(header().exists("location"));
	}

	@Test
	@WithMockOidcAuth
	void whenPlaceOrderWithEmptyDrinkThenBadRequest() throws Exception {
		final var payload = new OrderCreationRequestDto();

		payload.setDrink(null);
		api.post(payload, "/orders").andExpect(status().isBadRequest());

		payload.setDrink("");
		api.post(payload, "/orders").andExpect(status().isBadRequest());
	}

}
