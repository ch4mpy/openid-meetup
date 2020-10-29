package com.c4soft.meetup.openid.cafeskifo.api.web.dto;

public class OrderResponseDto {
	public final Long id;
	public final String drink;
	public final String owner;
	public final String table;

	public OrderResponseDto(Long id, String drink, String owner, String table) {
		this.id = id;
		this.drink = drink;
		this.owner = owner;
		this.table = table;
	}

	public OrderResponseDto(Long id, String drink, String owner) {
		this(id, drink, owner, null);
	}
}
