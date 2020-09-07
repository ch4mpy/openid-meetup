package com.c4soft.tahitidevops.bar.web.dto;

import org.springframework.hateoas.RepresentationModel;

public class OrderResponseDto extends RepresentationModel<OrderResponseDto> {
	public final Long id;
	public final String drink;

	public OrderResponseDto(Long id, String drink) {
		this.id = id;
		this.drink = drink;
	}
}
