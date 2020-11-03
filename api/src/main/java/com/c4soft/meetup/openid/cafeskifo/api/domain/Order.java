package com.c4soft.meetup.openid.cafeskifo.api.domain;

import java.time.Instant;
import java.util.Date;
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

	@Column(nullable = false)
	private final Long createdOn;

	@Column(name = "tableNbr")
	private String table;

	public Order(String drink, String createdBy, String table) {
		this.drink = drink;
		this.createdBy = createdBy;
		this.table = table;
		this.createdOn = new Date().getTime();
	}

	public Order(String drink, String createdBy) {
		this(drink, createdBy, null);
	}

	protected Order() {
		this(null, null, null);
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

	public String getTable() {
		return table;
	}

	public void setTable(String table) {
		this.table = table;
	}

	public Long getCreatedOn() {
		return createdOn == null ? Instant.EPOCH.toEpochMilli() : createdOn;
	}

	@Override
	public int hashCode() {
		return Objects.hash(createdBy, createdOn, drink, id, table);
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
		return Objects.equals(createdBy, other.createdBy) && Objects.equals(createdOn, other.createdOn)
				&& Objects.equals(drink, other.drink) && Objects.equals(id, other.id)
				&& Objects.equals(table, other.table);
	}

}
