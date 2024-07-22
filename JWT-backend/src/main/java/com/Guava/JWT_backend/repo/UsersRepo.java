package com.Guava.JWT_backend.repo;

import com.Guava.JWT_backend.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers,Integer> {

    Optional<OurUsers> findByEmail(String email);
}
