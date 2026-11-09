CREATE TABLE farmer_product_requests (
  id CHAR(36) PRIMARY KEY,
  farmer_id CHAR(36) NOT NULL,
  product_name VARCHAR(140) NOT NULL,
  quantity_description VARCHAR(120) NOT NULL,
  village VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  INDEX ix_product_requests_area (district, status, created_at),
  CONSTRAINT fk_request_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);
CREATE TABLE farmer_product_request_responses (
  id CHAR(36) PRIMARY KEY,
  request_id CHAR(36) NOT NULL,
  owner_id CHAR(36) NOT NULL,
  kendra_id CHAR(36) NOT NULL,
  available BOOLEAN NOT NULL,
  price DECIMAL(12,2) NULL,
  eta VARCHAR(100) NOT NULL,
  message VARCHAR(500) NULL,
  created_at TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  INDEX ix_request_response_owner (owner_id, created_at),
  CONSTRAINT fk_response_request FOREIGN KEY (request_id) REFERENCES farmer_product_requests(id) ON DELETE CASCADE,
  CONSTRAINT fk_response_owner FOREIGN KEY (owner_id) REFERENCES users(id),
  CONSTRAINT fk_response_kendra FOREIGN KEY (kendra_id) REFERENCES krishi_seva_kendras(id)
);
