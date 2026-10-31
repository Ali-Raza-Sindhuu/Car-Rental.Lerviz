CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(255) NULL,
  google_sub VARCHAR(255) NULL,
  email_verified_at TIMESTAMP NULL DEFAULT NULL,
  password_changed_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY users_email_unique (email),
  UNIQUE KEY users_google_sub_unique (google_sub)
);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
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
);

CREATE TABLE IF NOT EXISTS email_verification_tokens (
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
);

CREATE TABLE IF NOT EXISTS cars (
  id VARCHAR(64) NOT NULL,
  make VARCHAR(120) NOT NULL,
  model VARCHAR(120) NOT NULL,
  year_range VARCHAR(32) NOT NULL,
  year SMALLINT UNSIGNED NOT NULL,
  `condition` ENUM('new', 'used') NOT NULL,
  listing_type ENUM('buy', 'rent') NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  body_type VARCHAR(80) NOT NULL,
  fuel VARCHAR(80) NOT NULL,
  transmission VARCHAR(80) NOT NULL,
  cc INT UNSIGNED NOT NULL DEFAULT 0,
  bhp INT UNSIGNED NOT NULL DEFAULT 0,
  mileage INT UNSIGNED NOT NULL DEFAULT 0,
  colour VARCHAR(80) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(190) NULL,
  status ENUM('available', 'sold') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY cars_listing_status_year_idx (listing_type, status, year),
  KEY cars_make_model_idx (make, model),
  KEY cars_price_idx (price)
);

CREATE TABLE IF NOT EXISTS car_details (
  car_id VARCHAR(64) NOT NULL,
  description TEXT NOT NULL,
  specs JSON NOT NULL,
  dealer JSON NOT NULL,
  vin VARCHAR(32) NOT NULL,
  PRIMARY KEY (car_id),
  CONSTRAINT car_details_car_fk
    FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS car_features (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  car_id VARCHAR(64) NOT NULL,
  label VARCHAR(190) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY car_features_car_sort_unique (car_id, sort_order),
  CONSTRAINT car_features_car_fk
    FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS car_gallery (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  car_id VARCHAR(64) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(190) NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY car_gallery_car_sort_unique (car_id, sort_order),
  CONSTRAINT car_gallery_car_fk
    FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  car_id VARCHAR(64) NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('pending', 'confirmed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY bookings_car_status_dates_idx (car_id, status, start_date, end_date),
  CONSTRAINT bookings_car_fk
    FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE,
  CONSTRAINT bookings_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS carts (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY carts_user_unique (user_id),
  CONSTRAINT carts_user_fk
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cart_items (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cart_id BIGINT UNSIGNED NOT NULL,
  car_id VARCHAR(64) NOT NULL,
  listing_type ENUM('buy', 'rent') NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  added_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY cart_items_cart_car_unique (cart_id, car_id),
  CONSTRAINT cart_items_cart_fk
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
  CONSTRAINT cart_items_car_fk
    FOREIGN KEY (car_id) REFERENCES cars (id) ON DELETE CASCADE
);
