package com.project.tracker.repository;

import com.project.tracker.entity.AccessToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccessTokenRepository extends JpaRepository<AccessToken, Long> {

    /**
     * Find access token by the actual token string
     */
    Optional<AccessToken> findByAccessToken(String accessToken);

    /**
     * Find refresh token by the actual token string
     */
    Optional<AccessToken> findByRefreshToken(String refreshToken);

    /**
     * Find all active tokens for a specific user
     */
    List<AccessToken> findByUserIdAndIsActiveTrue(Long userId);

    /**
     * Find all active tokens for a specific username
     */
    List<AccessToken> findByUsernameAndIsActiveTrue(String username);

    /**
     * Find all active tokens for a specific email
     */
    List<AccessToken> findByEmailAndIsActiveTrue(String email);

    /**
     * Find all expired tokens
     */
    @Query("SELECT at FROM AccessToken at WHERE at.expiresAt < :currentTime AND at.isActive = true")
    List<AccessToken> findExpiredTokens(@Param("currentTime") LocalDateTime currentTime);

    /**
     * Find all system generated tokens
     */
    List<AccessToken> findByIsSystemGeneratedTrue();

    /**
     * Find all active tokens
     */
    List<AccessToken> findByIsActiveTrue();

    /**
     * Deactivate all tokens for a specific user
     */
    @Modifying
    @Query("UPDATE AccessToken at SET at.isActive = false, at.updatedAt = :currentTime WHERE at.userId = :userId AND at.isActive = true")
    void deactivateAllTokensForUser(@Param("userId") Long userId, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Deactivate a specific token
     */
    @Modifying
    @Query("UPDATE AccessToken at SET at.isActive = false, at.updatedAt = :currentTime WHERE at.id = :tokenId")
    void deactivateToken(@Param("tokenId") Long tokenId, @Param("currentTime") LocalDateTime currentTime);

    /**
     * Count active tokens for a specific user
     */
    long countByUserIdAndIsActiveTrue(Long userId);

    /**
     * Check if a token exists and is active
     */
    boolean existsByAccessTokenAndIsActiveTrue(String accessToken);

    /**
     * Check if a refresh token exists and is active
     */
    boolean existsByRefreshTokenAndIsActiveTrue(String refreshToken);
}
