package com.c4soft.tahitidevops.bar.web.dto;

public class OrderResponseDto {
	public final Long id;
	public final String drink;

	public OrderResponseDto(Long id, String drink) {
		this.id = id;
		this.drink = drink;
	}
}
