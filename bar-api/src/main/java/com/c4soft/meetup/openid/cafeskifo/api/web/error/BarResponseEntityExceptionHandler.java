package com.c4soft.meetup.openid.cafeskifo.api.web.error;

import java.util.stream.Collectors;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class BarResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
			MethodArgumentNotValidException ex,
			HttpHeaders headers,
			HttpStatus status,
			WebRequest request) {

		final var msg = "Payload validation failure:" + ex.getBindingResult()
				.getAllErrors()
				.stream()
				.map(ObjectError::toString)
				.collect(Collectors.joining("\n  * ", "\n  * ", ""));

		return handleExceptionInternal(ex, msg, headers, status, request);
	}
}
