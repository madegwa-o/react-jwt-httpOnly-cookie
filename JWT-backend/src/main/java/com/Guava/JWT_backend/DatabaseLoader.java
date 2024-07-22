package com.Guava.JWT_backend;

import com.Guava.JWT_backend.entity.OurUsers;
import com.Guava.JWT_backend.repo.UsersRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DatabaseLoader {

    private final PasswordEncoder passwordEncoder;
    private final UsersRepo userRepo;

    @Bean
    public CommandLineRunner databaseInit(){
        return args -> {
            String hashedPassword = passwordEncoder.encode("1234");
            // Hardcoded user details
            OurUsers user1 = new OurUsers("John", "Nakuru", "john", hashedPassword,"ADMIN");
            OurUsers user2 = new OurUsers("Oscar", "Nakuru", "oscar", hashedPassword,"ADMIN");

            // Save users to the database
            userRepo.save(user1);
            userRepo.save(user2);

        };
    }
}
