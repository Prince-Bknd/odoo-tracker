package com.project.tracker.service.impl;

import com.project.tracker.dto.AdminDTO;
import com.project.tracker.dto.AuthDataDTO;
import com.project.tracker.dto.LoginDTO;
import com.project.tracker.dto.TokenValidationDTO;
import com.project.tracker.dto.UserDTO;
import com.project.tracker.entity.Admin;
import com.project.tracker.entity.User;
import com.project.tracker.repository.AdminRepository;
import com.project.tracker.repository.UserRepository;
import com.project.tracker.response.CustomApiResponse;
import com.project.tracker.service.AuthenticationService;
import com.project.tracker.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public CustomApiResponse<?> registerAdmin(AdminDTO adminDTO) {
        try {
            if (adminRepository.existsByUsername(adminDTO.getUsername())) {
                return CustomApiResponse.error("Username already exists", HttpStatus.BAD_REQUEST);
            }

            if (adminRepository.existsByEmail(adminDTO.getEmail())) {
                return CustomApiResponse.error("Email already exists", HttpStatus.BAD_REQUEST);
            }

            Admin admin = new Admin();
            admin.setUsername(adminDTO.getUsername());
            admin.setEmail(adminDTO.getEmail());
            admin.setPassword(passwordEncoder.encode(adminDTO.getPassword()));
            admin.setRole(adminDTO.getRole().toUpperCase());
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());

            Admin savedAdmin = adminRepository.save(admin);

            String accessToken = jwtUtils.generateAccessToken(adminDTO.getUsername(), adminDTO.getEmail(), adminDTO.getRole());
            String refreshToken = jwtUtils.generateRefreshToken(adminDTO.getUsername(), adminDTO.getEmail(), adminDTO.getRole());

            AuthDataDTO authData = new AuthDataDTO();
            authData.setId(savedAdmin.getId());
            authData.setUsername(savedAdmin.getUsername());
            authData.setRole(savedAdmin.getRole());
            authData.setEmail(savedAdmin.getEmail());
            authData.setAccessToken(accessToken);
            authData.setRefreshToken(refreshToken);
            
            LocalDateTime expirationTime = LocalDateTime.now().plusHours(24);
            authData.setTokenExpiration(expirationTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            authData.setCreatedAt(savedAdmin.getCreatedAt().format(formatter));

            return CustomApiResponse.created("Admin registered successfully", authData);

        } catch (Exception e) {
            return CustomApiResponse.error("Error registering admin: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public CustomApiResponse<?> registerUser(UserDTO userDTO) {
        try {
            if (userRepository.existsByUsername(userDTO.getUsername())) {
                return CustomApiResponse.error("Username already exists", HttpStatus.BAD_REQUEST);
            }

            if (userRepository.existsByEmail(userDTO.getEmail())) {
                return CustomApiResponse.error("Email already exists", HttpStatus.BAD_REQUEST);
            }

            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setEmail(userDTO.getEmail());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRole().toUpperCase());
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setPhone(userDTO.getPhone());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            User savedUser = userRepository.save(user);

            String accessToken = jwtUtils.generateAccessToken(userDTO.getUsername(), userDTO.getEmail(), userDTO.getRole());
            String refreshToken = jwtUtils.generateRefreshToken(userDTO.getUsername(), userDTO.getEmail(), userDTO.getRole());

            AuthDataDTO authData = new AuthDataDTO();
            authData.setId(savedUser.getId());
            authData.setUsername(savedUser.getUsername());
            authData.setRole(savedUser.getRole());
            authData.setEmail(savedUser.getEmail());
            authData.setAccessToken(accessToken);
            authData.setRefreshToken(refreshToken);
            
            LocalDateTime expirationTime = LocalDateTime.now().plusHours(24);
            authData.setTokenExpiration(expirationTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            authData.setCreatedAt(savedUser.getCreatedAt().format(formatter));

            return CustomApiResponse.created("User registered successfully", authData);

        } catch (Exception e) {
            return CustomApiResponse.error("Error registering user: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public CustomApiResponse<?> login(LoginDTO loginDTO) {
        try {
            // First try to find in admin table
            Admin admin = adminRepository.findByUsername(loginDTO.getUsername()).orElse(null);
            User user = null;
            
            if (admin == null) {
                // If not found in admin table, try user table
                user = userRepository.findByUsername(loginDTO.getUsername()).orElse(null);
            }
            
            if (admin == null && user == null) {
                return CustomApiResponse.error("Invalid username or password", HttpStatus.UNAUTHORIZED);
            }
            
            // Check password
            String storedPassword = admin != null ? admin.getPassword() : user.getPassword();
            if (!passwordEncoder.matches(loginDTO.getPassword(), storedPassword)) {
                return CustomApiResponse.error("Invalid username or password", HttpStatus.UNAUTHORIZED);
            }
            
            if (user != null && !user.getIsActive()) {
                return CustomApiResponse.error("Account is deactivated", HttpStatus.UNAUTHORIZED);
            }
            
            String username = admin != null ? admin.getUsername() : user.getUsername();
            String role = admin != null ? admin.getRole() : user.getRole();
            String email = admin != null ? admin.getEmail() : user.getEmail();
            Long id = admin != null ? admin.getId() : user.getId();
            
            String accessToken = jwtUtils.generateAccessToken(username, email, role);
            String refreshToken = jwtUtils.generateRefreshToken(username, email, role);

            AuthDataDTO authData = new AuthDataDTO();
            authData.setId(id);
            authData.setUsername(username);
            authData.setRole(role);
            authData.setEmail(email);
            authData.setAccessToken(accessToken);
            authData.setRefreshToken(refreshToken);
            
            LocalDateTime expirationTime = LocalDateTime.now().plusHours(24);
            authData.setTokenExpiration(expirationTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
            
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
            LocalDateTime createdAt = admin != null ? admin.getCreatedAt() : user.getCreatedAt();
            authData.setCreatedAt(createdAt.format(formatter));

            return CustomApiResponse.success("Login successful", authData);

        } catch (Exception e) {
            return CustomApiResponse.error("Error during login: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public CustomApiResponse<?> validateToken(String token) {
        try {
            if (token == null || token.trim().isEmpty()) {
                return CustomApiResponse.error("Token is required", HttpStatus.BAD_REQUEST);
            }

            // Remove "Bearer " prefix if present
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            // Extract username from token first
            String username = jwtUtils.extractUsername(token);
            if (username == null) {
                return CustomApiResponse.error("Invalid token format", HttpStatus.UNAUTHORIZED);
            }

            // Validate JWT token
            if (!jwtUtils.validateToken(token, username)) {
                return CustomApiResponse.error("Invalid or expired token", HttpStatus.UNAUTHORIZED);
            }

            // Extract role from token
            String role = jwtUtils.getRoleFromToken(token);
            if (role == null) {
                return CustomApiResponse.error("Invalid token claims", HttpStatus.UNAUTHORIZED);
            }

            // Find user/admin in database
            Admin admin = adminRepository.findByUsername(username).orElse(null);
            User user = null;

            if (admin == null) {
                user = userRepository.findByUsername(username).orElse(null);
            }

            if (admin == null && user == null) {
                return CustomApiResponse.error("User not found", HttpStatus.UNAUTHORIZED);
            }

            // Check if account is active (for users)
            if (user != null && !user.getIsActive()) {
                return CustomApiResponse.error("Account is deactivated", HttpStatus.UNAUTHORIZED);
            }

            // Get user details
            Long userId = admin != null ? admin.getId() : user.getId();
            String email = admin != null ? admin.getEmail() : user.getEmail();

            // Create validation response
            TokenValidationDTO validationData = new TokenValidationDTO(
                userId, username, email, role, true, "Token is valid", 
                LocalDateTime.now(), LocalDateTime.now().plusHours(24)
            );

            return CustomApiResponse.success("Token validation successful", validationData);

        } catch (Exception e) {
            return CustomApiResponse.error("Error validating token: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
