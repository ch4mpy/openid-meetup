package com.c4soft.tahitidevops.bar.web;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedirectController {

	private static final String INDEX_PATH = "/cafe-skifo/index.html";

	@GetMapping("/")
	void handleRoot(HttpServletResponse response) throws IOException {
		response.sendRedirect(INDEX_PATH);
	}

	@GetMapping("/cafe-skifo")
	void handleCafeSkifo(HttpServletResponse response) throws IOException {
		response.sendRedirect(INDEX_PATH);
	}
}
