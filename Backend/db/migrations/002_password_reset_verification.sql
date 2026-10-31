SET @password_changed_at_exists = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'password_changed_at'
);
SET @password_changed_at_ddl = IF(
  @password_changed_at_exists = 0,
  'ALTER TABLE users ADD COLUMN password_changed_at DATETIME NULL',
  'SELECT 1'
);
PREPARE password_changed_at_statement FROM @password_changed_at_ddl;
EXECUTE password_changed_at_statement;
DEALLOCATE PREPARE password_changed_at_statement;

SET @password_reset_tokens_exists = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = 'password_reset_tokens'
);
SET @password_reset_tokens_ddl = IF(
  @password_reset_tokens_exists = 0,
  'CREATE TABLE password_reset_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY password_reset_tokens_hash_unique (token_hash),
    CONSTRAINT password_reset_tokens_user_fk
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )',
  'SELECT 1'
);
PREPARE password_reset_tokens_statement FROM @password_reset_tokens_ddl;
EXECUTE password_reset_tokens_statement;
DEALLOCATE PREPARE password_reset_tokens_statement;

SET @email_verification_tokens_exists = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = 'email_verification_tokens'
);
SET @email_verification_tokens_ddl = IF(
  @email_verification_tokens_exists = 0,
  'CREATE TABLE email_verification_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    token_hash CHAR(64) NOT NULL,
    expires_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email_verification_tokens_hash_unique (token_hash),
    CONSTRAINT email_verification_tokens_user_fk
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  )',
  'SELECT 1'
);
PREPARE email_verification_tokens_statement FROM @email_verification_tokens_ddl;
EXECUTE email_verification_tokens_statement;
DEALLOCATE PREPARE email_verification_tokens_statement;
