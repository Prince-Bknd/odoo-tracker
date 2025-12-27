package com.project.tracker.service;

import com.project.tracker.dto.AdminDTO;
import com.project.tracker.dto.LoginDTO;
import com.project.tracker.dto.UserDTO;
import com.project.tracker.response.CustomApiResponse;

public interface AuthenticationService {
    
    CustomApiResponse<?> registerAdmin(AdminDTO adminDTO);
    
    CustomApiResponse<?> registerUser(UserDTO userDTO);
    
    CustomApiResponse<?> login(LoginDTO loginDTO);
    
    CustomApiResponse<?> validateToken(String token);
}
