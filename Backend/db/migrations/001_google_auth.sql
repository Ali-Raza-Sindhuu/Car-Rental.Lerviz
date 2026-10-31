SET @google_sub_exists = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'google_sub'
);
SET @google_sub_ddl = IF(
  @google_sub_exists = 0,
  'ALTER TABLE users ADD COLUMN google_sub VARCHAR(255) NULL UNIQUE',
  'SELECT 1'
);
PREPARE google_sub_statement FROM @google_sub_ddl;
EXECUTE google_sub_statement;
DEALLOCATE PREPARE google_sub_statement;

SET @email_verified_at_exists = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'email_verified_at'
);
SET @email_verified_at_ddl = IF(
  @email_verified_at_exists = 0,
  'ALTER TABLE users ADD COLUMN email_verified_at TIMESTAMP NULL DEFAULT NULL',
  'SELECT 1'
);
PREPARE email_verified_at_statement FROM @email_verified_at_ddl;
EXECUTE email_verified_at_statement;
DEALLOCATE PREPARE email_verified_at_statement;

SET @password_hash_is_required = (
  SELECT COUNT(*)
  FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'users'
    AND column_name = 'password_hash'
    AND is_nullable = 'NO'
);
SET @password_hash_ddl = IF(
  @password_hash_is_required > 0,
  'ALTER TABLE users MODIFY COLUMN password_hash VARCHAR(255) NULL',
  'SELECT 1'
);
PREPARE password_hash_statement FROM @password_hash_ddl;
EXECUTE password_hash_statement;
DEALLOCATE PREPARE password_hash_statement;
