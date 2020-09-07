package com.c4soft.tahitidevops.bar.web.error;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundEexception extends RuntimeException {
	private static final long serialVersionUID = -8702307766553980723L;
}
