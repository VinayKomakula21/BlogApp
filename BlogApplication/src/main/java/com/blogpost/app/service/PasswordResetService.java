package com.blogpost.app.service;

import com.blogpost.app.entity.PasswordResetToken;
import com.blogpost.app.entity.User;
import com.blogpost.app.exception.ResourceNotFoundException;
import com.blogpost.app.repository.PasswordResetTokenRepository;
import com.blogpost.app.utils.PasswordHasher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Transactional
public class PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetService.class);
    private static final int TOKEN_EXPIRATION_MINUTES = 60;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserService userService;

    public String createPasswordResetToken(String userName) {
        Optional<User> userOpt = userService.findUserByUserName(userName);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();

        tokenRepository.invalidateAllUserTokens(user.getId());

        PasswordResetToken token = PasswordResetToken.create(user, TOKEN_EXPIRATION_MINUTES);
        tokenRepository.save(token);

        logger.info("Password reset token created for user: {}", userName);
        return token.getToken();
    }

    public boolean validateToken(String token) {
        Optional<PasswordResetToken> resetToken = tokenRepository.findByToken(token);
        return resetToken.isPresent() && resetToken.get().isValid();
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = tokenRepository.findByToken(token);

        if (resetTokenOpt.isEmpty()) {
            logger.warn("Password reset attempted with invalid token");
            return false;
        }

        PasswordResetToken resetToken = resetTokenOpt.get();

        if (!resetToken.isValid()) {
            logger.warn("Password reset attempted with expired or used token for user: {}",
                    resetToken.getUser().getUserName());
            return false;
        }

        User user = resetToken.getUser();
        user.setPassword(PasswordHasher.hash(newPassword));

        user.setTokenVersion(user.getTokenVersion() + 1);

        userService.updateUser(user.getId(), user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        tokenRepository.invalidateAllUserTokens(user.getId());

        logger.info("Password successfully reset for user: {}", user.getUserName());
        return true;
    }

    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredTokens() {
        tokenRepository.deleteExpiredTokens(LocalDateTime.now());
        logger.debug("Cleaned up expired password reset tokens");
    }
}
