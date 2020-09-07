package com.c4soft.tahitidevops.bar.web.dto;

import javax.validation.constraints.NotEmpty;

public class OrderCreationRequestDto {

	@NotEmpty
	public String drink;

}
