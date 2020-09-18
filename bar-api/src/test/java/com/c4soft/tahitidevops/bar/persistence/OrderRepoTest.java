package com.c4soft.tahitidevops.bar.persistence;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Import;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

import com.c4_soft.springaddons.security.oauth2.test.annotations.IdTokenClaims;
import com.c4_soft.springaddons.security.oauth2.test.annotations.WithMockOidcId;
import com.c4soft.tahitidevops.bar.domain.Order;

@DataJpaTest
@Import({ OrderRepoTest.SecurityConf.class, OrderRepo.class })
class OrderRepoTest {

	@Autowired
	OrderRepo orderRepo;

	@Autowired
	OrderCrudRepository unsecuredRepo;

	private Order mojito;
	private Order guinness;

	@BeforeEach
	void setup() {
		mojito = unsecuredRepo.save(new Order("mojito", BARMAN_SUBJECT));
		guinness = unsecuredRepo.save(new Order("pint of Guinness", CLIENT_SUBJECT));
	}

	@Test
	@WithMockOidcId("BARMAN")
	void whenBarmanThenNoFilter() {
		assertThat(orderRepo.findAll()).containsExactlyInAnyOrder(mojito, guinness);
	}

	@Test
	@WithMockOidcId(id = @IdTokenClaims(sub = CLIENT_SUBJECT))
	void whenClientThenNoFilter() {
		assertThat(orderRepo.findAll()).containsExactlyInAnyOrder(guinness);
	}

	@Test
	@WithMockOidcId("BARMAN")
	void whenBarmanThenCanGetAnyOrder() {
		assertThat(orderRepo.findById(mojito.getId())).isEqualTo(Optional.of(mojito));
		assertThat(orderRepo.findById(guinness.getId())).isEqualTo(Optional.of(guinness));
	}

	@Test
	@WithMockOidcId(id = @IdTokenClaims(sub = CLIENT_SUBJECT))
	void whenClientThenCanGetGuinessOnly() {
		assertThat(orderRepo.findById(guinness.getId())).isEqualTo(Optional.of(guinness));
		assertThrows(AccessDeniedException.class, () -> orderRepo.findById(mojito.getId()));
	}

	@Test
	@WithMockOidcId("BARMAN")
	void whenBarmanThenCanDeleteAnyOrder() {
		assertDoesNotThrow(() -> orderRepo.delete(mojito));
		assertDoesNotThrow(() -> orderRepo.delete(guinness));
	}

	@Test
	@WithMockOidcId(id = @IdTokenClaims(sub = CLIENT_SUBJECT))
	void whenClientThenCanDeleteGuinessOnly() {
		assertDoesNotThrow(() -> orderRepo.delete(guinness));
		assertThrows(AccessDeniedException.class, () -> orderRepo.delete(mojito));
	}

	private static final String BARMAN_SUBJECT = "51";
	private static final String CLIENT_SUBJECT = "42";

	@TestConfiguration
	@EnableGlobalMethodSecurity(prePostEnabled = true)
	static class SecurityConf {
	}
}
