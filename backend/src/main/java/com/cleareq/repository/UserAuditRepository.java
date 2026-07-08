package com.cleareq.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.cleareq.entity.UserAudit;

import java.util.UUID;

public interface UserAuditRepository extends JpaRepository<UserAudit, UUID> {
}
