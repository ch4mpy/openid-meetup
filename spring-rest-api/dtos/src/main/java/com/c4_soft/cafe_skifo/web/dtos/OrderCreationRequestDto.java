package com.c4_soft.cafe_skifo.web.dtos;

import java.io.Serializable;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@XmlRootElement
@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreationRequestDto implements Serializable {
	private static final long serialVersionUID = 2734365053999872845L;

	@NotNull
	@NotEmpty
	private String drink;

	private String table;
}