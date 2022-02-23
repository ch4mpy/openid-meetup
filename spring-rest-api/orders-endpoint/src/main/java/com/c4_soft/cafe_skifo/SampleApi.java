package com.c4_soft.cafe_skifo;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.domain.jpa.SecuredOrderRepository;
import com.c4_soft.cafe_skifo.exceptions.CafeSkifoExceptionHandler;
import com.c4_soft.springaddons.security.oauth2.SynchronizedJwt2AuthenticationConverter;
import com.c4_soft.springaddons.security.oauth2.config.OidcServletApiSecurityConfig;
import com.c4_soft.springaddons.security.oauth2.config.ServletSecurityBeans;
import com.c4_soft.springaddons.security.oauth2.config.SpringAddonsSecurityProperties;

@SpringBootApplication(scanBasePackageClasses = { SampleApi.class, CafeSkifoExceptionHandler.class })
@EnableJpaRepositories(basePackageClasses = { SecuredOrderRepository.class })
@EntityScan(basePackageClasses = { Order.class })
@EnableTransactionManagement
public class SampleApi {
    public static void main(String[] args) {
		new SpringApplicationBuilder(SampleApi.class).web(WebApplicationType.SERVLET).run(args);
	}

	@EnableWebSecurity
	@EnableGlobalMethodSecurity(prePostEnabled = true)
	@Import({ SpringAddonsSecurityProperties.class, ServletSecurityBeans.class })
	public class WebSecurityConfig extends OidcServletApiSecurityConfig {
		public WebSecurityConfig(
				SynchronizedJwt2AuthenticationConverter<? extends AbstractAuthenticationToken> authenticationConverter,
				SpringAddonsSecurityProperties securityProperties,
				ServerProperties serverProperties) {
			super(authenticationConverter, securityProperties, serverProperties);
		}
	}
}
