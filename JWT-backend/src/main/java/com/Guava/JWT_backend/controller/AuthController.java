package com.Guava.JWT_backend.controller;

import com.Guava.JWT_backend.dto.ReqRes;
import com.Guava.JWT_backend.entity.OurUsers;
import com.Guava.JWT_backend.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping
public class AuthController {

    private final UserService userService;

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes registerRequest){
        return ResponseEntity.ok(userService.register(registerRequest));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes loginRequest, HttpServletResponse response) {
        ReqRes result = userService.login(loginRequest);
        System.out.println("refreshToken: "+ result.getRefreshToken());
        Cookie refreshTokenCookie = new Cookie("refreshToken", result.getRefreshToken());
        refreshTokenCookie.setHttpOnly(true); // Ensure cookie is HTTP-only
        refreshTokenCookie.setPath("/");

        refreshTokenCookie.setMaxAge(24 * 60 * 60); // Set an appropriate max age (24 hours in this example)
        response.addCookie(refreshTokenCookie);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@CookieValue("refreshToken") String refreshToken) {
        System.out.println("refreshToken endpoint was called ");
        System.out.println("refreshToken: "+ refreshToken);
        return ResponseEntity.ok(userService.refreshAccessToken(refreshToken));
    }


    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        System.out.println("the controller is called");
        return ResponseEntity.ok(userService.getAllUsers());

    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(userService.getUsersById(userId));

    }

    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres){
        return ResponseEntity.ok(userService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = userService.getMyInfo(email);
        return  ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(userService.deleteUser(userId));
    }

}
