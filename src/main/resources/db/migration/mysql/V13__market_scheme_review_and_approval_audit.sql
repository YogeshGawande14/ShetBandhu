ALTER TABLE mandi_rates ADD COLUMN tehsil VARCHAR(100), ADD COLUMN city VARCHAR(100);
CREATE INDEX ix_rate_geography ON mandi_rates(district, tehsil, city, record_date);

CREATE TABLE government_schemes (
    id CHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    description VARCHAR(3000) NOT NULL,
    eligibility VARCHAR(2000) NOT NULL,
    official_url VARCHAR(1000) NOT NULL,
    state VARCHAR(100),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at DATETIME(6) NOT NULL,
    INDEX ix_scheme_state_active (state, active)
);

CREATE TABLE product_reviews (
    id CHAR(36) NOT NULL PRIMARY KEY,
    product_id CHAR(36) NOT NULL,
    customer_id CHAR(36) NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(1200) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_product_review_product FOREIGN KEY (product_id) REFERENCES agri_products(id),
    CONSTRAINT fk_product_review_customer FOREIGN KEY (customer_id) REFERENCES users(id),
    CONSTRAINT uq_product_review_customer UNIQUE (product_id, customer_id),
    CONSTRAINT ck_product_review_rating CHECK (rating BETWEEN 1 AND 5),
    INDEX ix_product_review_created (product_id, created_at)
);

CREATE TABLE kendra_approval_audits (
    id CHAR(36) NOT NULL PRIMARY KEY,
    kendra_id CHAR(36) NOT NULL,
    admin_user_id CHAR(36) NOT NULL,
    documents_missing BOOLEAN NOT NULL,
    reason VARCHAR(500) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_kendra_audit_shop FOREIGN KEY (kendra_id) REFERENCES krishi_seva_kendras(id),
    CONSTRAINT fk_kendra_audit_admin FOREIGN KEY (admin_user_id) REFERENCES users(id),
    INDEX ix_kendra_approval_audit_shop_time (kendra_id, created_at)
);

INSERT INTO government_schemes(id,title,description,eligibility,official_url,state,active,updated_at) VALUES
(UUID(),'PM-KISAN','Income support scheme for eligible landholding farmer families. Check current instalment status and application guidance on the official portal.','Eligibility depends on land records and exclusion categories; verify the current rules on the official portal.','https://pmkisan.gov.in/','Maharashtra',TRUE,CURRENT_TIMESTAMP(6)),
(UUID(),'MahaDBT Farmer Schemes','Maharashtra agriculture department portal for farm equipment, irrigation and other farmer benefits.','Scheme-specific eligibility and application windows vary. Review the current scheme details on MahaDBT before applying.','https://mahadbt.maharashtra.gov.in/Farmer/','Maharashtra',TRUE,CURRENT_TIMESTAMP(6)),
(UUID(),'Pradhan Mantri Fasal Bima Yojana','Crop insurance information and enrolment guidance for notified crops and seasons.','Eligibility depends on notified crops, area, season and current enrollment dates. Confirm through the official portal.','https://pmfby.gov.in/','Maharashtra',TRUE,CURRENT_TIMESTAMP(6));

INSERT INTO users(id,full_name,phone_number,password_hash,role,is_approved,account_enabled,created_at,token_version,email_verified)
VALUES
('d1300000-0000-4000-8000-000000000001','Demo Agro Agency Pune','DEMO-AG-PUNE','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','SHOP_OWNER',TRUE,TRUE,CURRENT_TIMESTAMP(6),0,FALSE),
('d1300000-0000-4000-8000-000000000002','Demo Kisan Agency Nashik','DEMO-AG-NASHIK','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','SHOP_OWNER',TRUE,TRUE,CURRENT_TIMESTAMP(6),0,FALSE),
('d1300000-0000-4000-8000-000000000003','Demo Shetkari Agency Latur','DEMO-AG-LATUR','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','SHOP_OWNER',TRUE,TRUE,CURRENT_TIMESTAMP(6),0,FALSE);

INSERT INTO user_roles(user_id,role) VALUES
('d1300000-0000-4000-8000-000000000001','SHOP_OWNER'),('d1300000-0000-4000-8000-000000000001','FARMER'),
('d1300000-0000-4000-8000-000000000002','SHOP_OWNER'),('d1300000-0000-4000-8000-000000000002','FARMER'),
('d1300000-0000-4000-8000-000000000003','SHOP_OWNER'),('d1300000-0000-4000-8000-000000000003','FARMER');

INSERT INTO krishi_seva_kendras(id,shop_name,owner_id,address,contact_number,is_verified,verification_status,created_at,city,business_type,document_url,service_summary,postal_code,photo_url)
VALUES
('d1300000-0000-4000-8000-000000000011','AgroConnect Demo Agency - Pune','d1300000-0000-4000-8000-000000000001','Demo listing - not a real storefront, Pune, Maharashtra','02000000001',TRUE,'VERIFIED',CURRENT_TIMESTAMP(6),'Pune','AGENCY','https://agroconnect.local/demo','Demo catalogue for local testing','411001','https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80'),
('d1300000-0000-4000-8000-000000000012','AgroConnect Demo Agency - Nashik','d1300000-0000-4000-8000-000000000002','Demo listing - not a real storefront, Nashik, Maharashtra','02530000001',TRUE,'VERIFIED',CURRENT_TIMESTAMP(6),'Nashik','AGENCY','https://agroconnect.local/demo','Demo catalogue for local testing','422001','https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80'),
('d1300000-0000-4000-8000-000000000013','AgroConnect Demo Agency - Latur','d1300000-0000-4000-8000-000000000003','Demo listing - not a real storefront, Latur, Maharashtra','02380000001',TRUE,'VERIFIED',CURRENT_TIMESTAMP(6),'Latur','AGENCY','https://agroconnect.local/demo','Demo catalogue for local testing','413512','https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80');

INSERT INTO agri_products(id,shop_id,product_name,category,description,price,unit,stock_quantity,active,created_at,audio_description_url,image_url,admin_removed,version)
SELECT UUID(),k.id,p.product_name,p.category,'Demonstration item for local testing. Verify product label and details before real use.',p.price,p.unit,35,TRUE,CURRENT_TIMESTAMP(6),NULL,p.image_url,FALSE,0
FROM krishi_seva_kendras k
CROSS JOIN (
  SELECT 'Hybrid maize seeds' product_name,'SEEDS' category,850.00 price,'5 kg' unit,'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80' image_url UNION ALL
  SELECT 'Soybean seeds','SEEDS',2100.00,'30 kg','https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Cotton seeds','SEEDS',950.00,'packet','https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Drip irrigation kit','FERTILIZER',1800.00,'kit','https://images.unsplash.com/photo-1560693225-b8507d383e4c?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Organic compost','FERTILIZER',420.00,'25 kg','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'NPK crop nutrition','FERTILIZER',980.00,'25 kg','https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Neem bio pesticide','PESTICIDE',360.00,'1 L','https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Crop protection spray','PESTICIDE',540.00,'500 ml','https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Hand sprayer','PESTICIDE',1250.00,'unit','https://images.unsplash.com/photo-1560693225-b8507d383e4c?auto=format&fit=crop&w=900&q=80' UNION ALL
  SELECT 'Soil health test kit','SEEDS',650.00,'kit','https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80'
) p
WHERE k.id IN ('d1300000-0000-4000-8000-000000000011','d1300000-0000-4000-8000-000000000012','d1300000-0000-4000-8000-000000000013');
