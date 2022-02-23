package com.c4_soft.cafe_skifo.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class Order {
	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String drink;

	@Column(nullable = false)
	private final String createdBy;

	@Column(nullable = false)
	private final Long createdOn;

	@Column(name = "tableNbr")
	private String table;
	
	public Order(String drink, String createdBy) {
		this(createdBy, new Date().getTime());
		this.drink = drink;
	}
	
	Order() {
		this((String) null, (Long) null);
	}
}
