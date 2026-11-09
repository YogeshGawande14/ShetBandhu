package com.agroconnect.repository;
import com.agroconnect.domain.Role;
import com.agroconnect.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;
import java.util.UUID;
public interface UserRepository extends JpaRepository<User, UUID> { Optional<User> findByPhoneNumber(String phoneNumber); Optional<User> findByEmailIgnoreCase(String email); boolean existsByPhoneNumber(String phoneNumber); boolean existsByEmailIgnoreCase(String email); java.util.List<User> findByRoleAndDistrictIgnoreCase(Role role, String district); Page<User> findByFullNameContainingIgnoreCaseOrPhoneNumberContainingIgnoreCase(String fullName, String phoneNumber, Pageable pageable); @org.springframework.data.jpa.repository.Query("select distinct u from User u join u.roles r where r = :role order by u.createdAt") java.util.List<User> findDistinctByRolesContainingOrderByCreatedAtAsc(@org.springframework.data.repository.query.Param("role") Role role); }
