package com.c4soft.tahitidevops.bar.web;

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
import org.springframework.security.oauth2.jwt.JwtDecoder;

import com.c4_soft.springaddons.security.oauth2.test.annotations.keycloak.WithMockKeycloakAuth;
import com.c4_soft.springaddons.security.oauth2.test.mockmvc.MockMvcSupport;
import com.c4_soft.springaddons.security.oauth2.test.mockmvc.keycloak.ServletKeycloakAuthUnitTestingSupport;
import com.c4soft.tahitidevops.bar.conf.WebSecurityConfig;
import com.c4soft.tahitidevops.bar.domain.Order;
import com.c4soft.tahitidevops.bar.persistence.OrderRepo;
import com.c4soft.tahitidevops.bar.web.dto.OrderCreationRequestDto;

@WebMvcTest(OrderController.class)
@Import({ ServletKeycloakAuthUnitTestingSupport.UnitTestConfig.class, WebSecurityConfig.class })
class OrderControllerTest {

	@MockBean
	JwtDecoder jwtDecoder;

	@MockBean
	OrderRepo orderRepo;

	@Autowired
	MockMvcSupport api;

	@Test
	void whenUserNotAuthenticatedThenUnauthorized() throws Exception {
		api.get("/orders").andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockKeycloakAuth
	void whenUserAuthenticatedThenCanListOrders() throws Exception {
		api.get("/orders").andExpect(status().isOk());
	}

	@Test
	@WithMockKeycloakAuth
	void whenOrderIdIsUnknownThen404() throws Exception {
		when(orderRepo.findById(any())).thenReturn(Optional.empty());

		api.get("/orders/51").andExpect(status().isNotFound());
	}

	@Test
	@WithMockKeycloakAuth
	void whenUserAuthenticatedThenCanPlaceOrder() throws Exception {
		when(orderRepo.save(any())).thenAnswer(invoc -> ((Order) invoc.getArgument(0)).setId(42L));

		final var payload = new OrderCreationRequestDto();
		payload.drink = "Guinness";
		api.post(payload, "/orders").andExpect(status().isCreated()).andExpect(header().exists("location"));
	}

	@Test
	@WithMockKeycloakAuth
	void whenPlaceOrderWithEmptyDrinkThenBadRequest() throws Exception {
		final var payload = new OrderCreationRequestDto();

		payload.drink = null;
		api.post(payload, "/orders").andExpect(status().isBadRequest());

		payload.drink = "";
		api.post(payload, "/orders").andExpect(status().isBadRequest());
	}

}
