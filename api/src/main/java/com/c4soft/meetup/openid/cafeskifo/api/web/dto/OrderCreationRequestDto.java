package com.c4soft.meetup.openid.cafeskifo.api.web.dto;

import javax.validation.constraints.NotEmpty;

public class OrderCreationRequestDto {

	@NotEmpty
	public String drink;

	public String table;

}
