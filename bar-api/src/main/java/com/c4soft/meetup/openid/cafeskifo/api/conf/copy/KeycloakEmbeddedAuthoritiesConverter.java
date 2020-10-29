package com.c4soft.meetup.openid.cafeskifo.api.conf.copy;

import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import net.minidev.json.JSONArray;
import net.minidev.json.JSONObject;

@Component
public class KeycloakEmbeddedAuthoritiesConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

	@Override
	public Collection<GrantedAuthority> convert(Jwt jwt) {
		final var roles = Optional.ofNullable((JSONObject) jwt.getClaims().get("resource_access"))
				.flatMap(resourceAccess -> Optional.ofNullable((JSONObject) resourceAccess.get("cafe-skifo")))
				.flatMap(tahitiDevops -> Optional.ofNullable((JSONArray) tahitiDevops.get("roles")))
				.orElse(new JSONArray());

		return roles.stream().map(Object::toString).map(SimpleGrantedAuthority::new).collect(Collectors.toSet());
	}

}