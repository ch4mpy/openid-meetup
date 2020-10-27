package com.c4soft.tahitidevops.bar.web;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedirectController {

	private static final String INDEX_PATH = "/cafe-skifo/index.html";

	@GetMapping("/")
	void handleRoot(HttpServletRequest request, HttpServletResponse response) throws IOException, URISyntaxException {
		response.sendRedirect(indexUri(request).toASCIIString());
	}

	@GetMapping("/cafe-skifo")
	void redirectRoot(HttpServletRequest request, HttpServletResponse response) throws IOException, URISyntaxException {
		response.sendRedirect(indexUri(request).toASCIIString());
	}

	@GetMapping("/cafe-skifo/settings/**")
	void redirectSettings(HttpServletRequest request, HttpServletResponse response)
			throws IOException, URISyntaxException {
		response.sendRedirect(indexUri(request).toASCIIString());
	}

	@GetMapping("/cafe-skifo/orders/**")
	void redirectOrders(HttpServletRequest request, HttpServletResponse response)
			throws IOException, URISyntaxException {
		response.sendRedirect(indexUri(request).toASCIIString());
	}

	private URI indexUri(HttpServletRequest request) throws URISyntaxException {
		return new URI("https", null, request.getServerName(), -1, INDEX_PATH, null, null);
	}
}
