package com.c4_soft.cafe_skifo.domain.jpa;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.domain.OrderRepository;
import com.c4_soft.springaddons.security.oauth2.test.annotations.OpenIdClaims;
import com.c4_soft.springaddons.security.oauth2.test.annotations.WithMockOidcAuth;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.NONE)
class SecuredOrderRepositoryTest {

	@Autowired
	OrderRepository orderRepo;

	@Autowired
	OrderJpaRepository unsecuredRepo;

	private Order mojito;
	private Order guinness;

	@BeforeEach
	void setup() {
		unsecuredRepo.deleteAllInBatch();
		mojito = unsecuredRepo.save(new Order("mojito", BARMAN_USERNAME));
		guinness = unsecuredRepo.save(new Order("pint of Guinness", CLIENT_USERNAME));
	}

	@Test
	@WithMockOidcAuth("BARMAN")
	void whenBarmanThenNoFilter() {
		assertThat(orderRepo.findAll()).containsExactlyInAnyOrder(mojito, guinness);
	}

	@Test
	@WithMockOidcAuth(claims = @OpenIdClaims(sub = CLIENT_USERNAME))
	void whenClientThenNoFilter() {
		assertThat(orderRepo.findAll()).containsExactlyInAnyOrder(guinness);
	}

	@Test
	@WithMockOidcAuth("BARMAN")
	void whenBarmanThenCanGetAnyOrder() {
		assertThat(orderRepo.findById(mojito.getId())).isEqualTo(Optional.of(mojito));
		assertThat(orderRepo.findById(guinness.getId())).isEqualTo(Optional.of(guinness));
	}

	@Test
	@WithMockOidcAuth(claims = @OpenIdClaims(sub = CLIENT_USERNAME))
	void whenClientThenCanGetGuinessOnly() {
		assertThat(orderRepo.findById(guinness.getId())).isEqualTo(Optional.of(guinness));
		assertThrows(AccessDeniedException.class, () -> orderRepo.findById(mojito.getId()));
	}

	@Test
	@WithMockOidcAuth("BARMAN")
	void whenBarmanThenCanDeleteAnyOrder() {
		assertDoesNotThrow(() -> orderRepo.delete(mojito));
		assertDoesNotThrow(() -> orderRepo.delete(guinness));
	}

	@Test
	@WithMockOidcAuth(claims = @OpenIdClaims(sub = CLIENT_USERNAME))
	void whenClientThenCanDeleteGuinessOnly() {
		assertDoesNotThrow(() -> orderRepo.delete(guinness));
		assertThrows(AccessDeniedException.class, () -> orderRepo.delete(mojito));
	}

	private static final String BARMAN_USERNAME = "Hulk";
	private static final String CLIENT_USERNAME = "Vickette";

}
