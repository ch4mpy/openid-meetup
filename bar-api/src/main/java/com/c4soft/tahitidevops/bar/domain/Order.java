package com.c4soft.tahitidevops.bar.domain;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "orders")
public class Order {
	@Id
	@GeneratedValue
	private Long id;

	@Column(nullable = false)
	private String drink;

	@Column(nullable = false)
	private final String createdBy;

	public Order(String drink, String createdBy) {
		this.drink = drink;
		this.createdBy = createdBy;
	}

	protected Order() {
		this.createdBy = null;
	}

	public Long getId() {
		return id;
	}

	public Order setId(Long id) {
		this.id = id;
		return this;
	}

	public String getDrink() {
		return drink;
	}

	public Order setDrink(String drink) {
		this.drink = drink;
		return this;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	@Override
	public int hashCode() {
		return Objects.hash(createdBy, drink, id);
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj) {
			return true;
		}
		if (!(obj instanceof Order)) {
			return false;
		}
		final var other = (Order) obj;
		return Objects.equals(createdBy, other.createdBy) && Objects.equals(drink, other.drink)
				&& Objects.equals(id, other.id);
	}

}
