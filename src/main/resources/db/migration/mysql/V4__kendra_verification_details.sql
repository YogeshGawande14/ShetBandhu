ALTER TABLE krishi_seva_kendras
  ADD COLUMN owner_license_number VARCHAR(100) NULL,
  ADD COLUMN city VARCHAR(100) NULL,
  ADD COLUMN photo_url VARCHAR(1000) NULL,
  ADD COLUMN verification_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  MODIFY latitude DECIMAL(10,7) NULL,
  MODIFY longitude DECIMAL(10,7) NULL;

UPDATE krishi_seva_kendras SET verification_status = CASE WHEN is_verified THEN 'VERIFIED' ELSE 'PENDING' END;
