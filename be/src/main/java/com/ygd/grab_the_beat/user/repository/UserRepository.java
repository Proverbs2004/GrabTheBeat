package com.ygd.grab_the_beat.user.repository;

import com.ygd.grab_the_beat.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUserId(Long userId);

    Optional<User> findByEmail(String email); // email로 사용자 정보를 가져옴

}
