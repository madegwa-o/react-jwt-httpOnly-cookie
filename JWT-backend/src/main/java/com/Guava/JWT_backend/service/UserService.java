package com.Guava.JWT_backend.service;

import com.Guava.JWT_backend.dto.ReqRes;
import com.Guava.JWT_backend.entity.OurUsers;
import com.Guava.JWT_backend.repo.UsersRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final PasswordEncoder passwordEncoder;
    private final UsersRepo usersRepo;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    public ReqRes register(ReqRes registerRequest) {
        ReqRes response = new ReqRes();

        try {
            OurUsers user = new OurUsers();
            user.setCity(registerRequest.getCity());
            user.setEmail(registerRequest.getEmail());
            user.setRole(registerRequest.getRole());
            user.setName(registerRequest.getName());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

            OurUsers savedUser = usersRepo.save(user);

            if (savedUser.getId()> 0){
                response.setOurUsers(savedUser);
                response.setMessage("User saved Successfully");
                response.setStatusCode(200);
            }

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public ReqRes login(ReqRes loginRequest) {
        ReqRes response = new ReqRes();

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    ));
            OurUsers user = usersRepo.findByEmail(loginRequest.getEmail()).orElse(null);
            String token = jwtTokenService.generateToken(user);
            String refreshToken = jwtTokenService.generateRefreshToken(new HashMap<>(),user);

            response.setStatusCode(200);
            response.setToken(token);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpiryTime("1Hr");
            response.setMessage("Successfully Logged In");

            SecurityContextHolder.getContext().setAuthentication(authentication);

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }

    public ReqRes refreshAccessToken(String refreshToken) {
        ReqRes response = new ReqRes();
        try {
            String userEmail = jwtTokenService.extractUsername(refreshToken);
            OurUsers user = usersRepo.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

           if (user != null){
               if (jwtTokenService.isTokenValid(refreshToken,user)){
                   String accessToken = jwtTokenService.generateToken(user);
                   response.setStatusCode(200);
                   response.setToken(accessToken);
                   response.setRefreshToken(refreshToken);
                   response.setRole(user.getRole());
                   response.setExpiryTime("24Hrs");
                   response.setMessage("Successfully Refreshed Token");
               }
           } else {
               throw new RuntimeException("Invalid User");
           }

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }

        return response;
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();
                existingUser.setEmail(updatedUser.getEmail());
                existingUser.setName(updatedUser.getName());
                existingUser.setCity(updatedUser.getCity());
                existingUser.setRole(updatedUser.getRole());

                // Check if password is present in the request
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    // Encode the password and update it
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }

                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }
}

