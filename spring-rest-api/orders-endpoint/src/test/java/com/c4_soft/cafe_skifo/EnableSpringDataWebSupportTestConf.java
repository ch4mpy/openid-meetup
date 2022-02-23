package com.c4_soft.cafe_skifo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.c4_soft.cafe_skifo.domain.Order;
import com.c4_soft.cafe_skifo.domain.OrderRepository;

/**
 * Avoid MethodArgumentConversionNotSupportedException with repos MockBean
 *
 * @author Jérôme Wacongne &lt;ch4mp#64;c4-soft.com&gt;
 */
@TestConfiguration
public class EnableSpringDataWebSupportTestConf {
	@Autowired
	OrderRepository sampleRepo;

	@Bean
	WebMvcConfigurer configurer() {
		return new WebMvcConfigurer() {

			@Override
			public void addFormatters(FormatterRegistry registry) {
				registry.addConverter(String.class, Order.class, id -> sampleRepo.findById(Long.valueOf(id)).get());
			}
		};
	}
}