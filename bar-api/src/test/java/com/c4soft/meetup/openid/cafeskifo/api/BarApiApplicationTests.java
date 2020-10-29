package com.c4soft.meetup.openid.cafeskifo.api;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;

@SpringBootTest
class BarApiApplicationTests {
	@MockBean
	JwtDecoder jwtDecoder;

	@Test
	void contextLoads() {
	}

}
