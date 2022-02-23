package com.c4_soft.cafe_skifo.web;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.MappingConstants.ComponentModel;

import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.web.dtos.OrderCreationRequestDto;
import com.c4_soft.cafe_skifo.web.dtos.OrderResponseDto;

@Mapper(componentModel = ComponentModel.SPRING)
public interface OrderMapper {

	@Mapping(target = "owner", source = "createdBy")
	OrderResponseDto toDto(Order domain);

	@Mapping(target = "id", ignore = true)
    void update(@MappingTarget Order entity, OrderCreationRequestDto dto);

}