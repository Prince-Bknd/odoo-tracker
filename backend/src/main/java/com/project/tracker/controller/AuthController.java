package com.project.tracker.controller;

import com.project.tracker.dto.AdminDTO;
import com.project.tracker.dto.LoginDTO;
import com.project.tracker.dto.UserDTO;
import com.project.tracker.response.CustomApiResponse;
import com.project.tracker.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication Service", description = "APIs for managing Authentication, Admin and User registration")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping(value = "/admin/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Register a new admin", description = "Registers a new admin with provided details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Admin registered successfully", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = CustomApiResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Bad request due to data integrity issues", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content) })
    public ResponseEntity<CustomApiResponse<?>> registerAdmin(@Valid @RequestBody AdminDTO adminDTO) {
        logger.info("Admin registration request received for username: {}", adminDTO.getUsername());
        
        CustomApiResponse<?> response = authenticationService.registerAdmin(adminDTO);
        logger.info("Admin registration completed with status: {}", response.getStatus());
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping(value = "/user/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Register a new user", description = "Registers a new user with provided details.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = CustomApiResponse.class)) }),
            @ApiResponse(responseCode = "400", description = "Bad request due to data integrity issues", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content) })
    public ResponseEntity<CustomApiResponse<?>> registerUser(@Valid @RequestBody UserDTO userDTO) {
        logger.info("User registration request received for username: {}", userDTO.getUsername());
        
        CustomApiResponse<?> response = authenticationService.registerUser(userDTO);
        logger.info("User registration completed with status: {}", response.getStatus());
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "User login", description = "Authenticates user/admin and returns access tokens.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = CustomApiResponse.class)) }),
            @ApiResponse(responseCode = "401", description = "Invalid credentials", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content) })
    public ResponseEntity<CustomApiResponse<?>> login(@Valid @RequestBody LoginDTO loginDTO) {
        logger.info("Login request received for username: {}", loginDTO.getUsername());
        
        CustomApiResponse<?> response = authenticationService.login(loginDTO);
        logger.info("Login completed with status: {}", response.getStatus());
        return new ResponseEntity<>(response, response.getHttpStatus());
    }

    @PostMapping(value = "/validate-token", produces = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Validate access token", description = "Validates the provided access token and returns user information.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token validation successful", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = CustomApiResponse.class)) }),
            @ApiResponse(responseCode = "401", description = "Invalid or expired token", content = @Content),
            @ApiResponse(responseCode = "500", description = "Internal server error", content = @Content) })
    public ResponseEntity<CustomApiResponse<?>> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        logger.info("Token validation request received");
        
        CustomApiResponse<?> response = authenticationService.validateToken(authorizationHeader);
        logger.info("Token validation completed with status: {}", response.getStatus());
        return new ResponseEntity<>(response, response.getHttpStatus());
    }
}
