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
public class OrderResponseDto implements Serializable {
	private static final long serialVersionUID = -1107179772146345245L;
	
	@NotNull
	private Long id;

	@NotNull
	@NotEmpty
	private String drink;

	@NotNull
	@NotEmpty
	private String owner;
	
	private String table;

	@NotNull
	private long createdOn;
}