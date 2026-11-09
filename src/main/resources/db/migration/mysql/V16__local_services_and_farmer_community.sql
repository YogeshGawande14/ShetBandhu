CREATE TABLE local_service_listings (
 id CHAR(36) NOT NULL PRIMARY KEY,
 owner_id CHAR(36) NOT NULL,
 listing_type VARCHAR(20) NOT NULL,
 category VARCHAR(50) NOT NULL,
 title VARCHAR(160) NOT NULL,
 description VARCHAR(2000) NOT NULL,
 image_url VARCHAR(1000) NOT NULL,
 price DECIMAL(12,2) NOT NULL,
 rate_unit VARCHAR(20) NOT NULL,
 rate_notes VARCHAR(500),
 village VARCHAR(120) NOT NULL,
 taluka VARCHAR(120) NOT NULL,
 district VARCHAR(120) NOT NULL,
 latitude DECIMAL(10,7) NOT NULL,
 longitude DECIMAL(10,7) NOT NULL,
 availability VARCHAR(500) NOT NULL,
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at DATETIME(6) NOT NULL,
 updated_at DATETIME(6) NOT NULL,
 CONSTRAINT fk_local_service_owner FOREIGN KEY (owner_id) REFERENCES users(id),
 CONSTRAINT ck_local_service_type CHECK (listing_type IN ('EQUIPMENT','SERVICE')),
 CONSTRAINT ck_local_service_price CHECK (price > 0),
 INDEX ix_local_service_area (active,district,taluka),
 INDEX ix_local_service_geo (active,latitude,longitude),
 INDEX ix_local_service_owner (owner_id,active)
);
CREATE TABLE local_service_contact_threads (
 id CHAR(36) NOT NULL PRIMARY KEY,
 listing_id CHAR(36) NOT NULL,
 requester_id CHAR(36) NOT NULL,
 provider_id CHAR(36) NOT NULL,
 requested_date DATE,
 area_acres DECIMAL(8,2),
 status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
 created_at DATETIME(6) NOT NULL,
 updated_at DATETIME(6) NOT NULL,
 CONSTRAINT fk_service_thread_listing FOREIGN KEY (listing_id) REFERENCES local_service_listings(id),
 CONSTRAINT fk_service_thread_requester FOREIGN KEY (requester_id) REFERENCES users(id),
 CONSTRAINT fk_service_thread_provider FOREIGN KEY (provider_id) REFERENCES users(id),
 CONSTRAINT uq_service_thread_request UNIQUE (listing_id,requester_id),
 INDEX ix_service_thread_provider (provider_id,status,updated_at),
 INDEX ix_service_thread_requester (requester_id,updated_at)
);
CREATE TABLE local_service_messages (
 id CHAR(36) NOT NULL PRIMARY KEY,
 thread_id CHAR(36) NOT NULL,
 sender_id CHAR(36) NOT NULL,
 message VARCHAR(2000) NOT NULL,
 created_at DATETIME(6) NOT NULL,
 CONSTRAINT fk_service_message_thread FOREIGN KEY (thread_id) REFERENCES local_service_contact_threads(id),
 CONSTRAINT fk_service_message_sender FOREIGN KEY (sender_id) REFERENCES users(id),
 INDEX ix_service_message_thread (thread_id,created_at)
);
CREATE TABLE farmer_community_groups (
 id CHAR(36) NOT NULL PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 description VARCHAR(1000) NOT NULL,
 locality VARCHAR(160),
 created_by CHAR(36),
 active BOOLEAN NOT NULL DEFAULT TRUE,
 created_at DATETIME(6) NOT NULL,
 CONSTRAINT fk_community_creator FOREIGN KEY (created_by) REFERENCES users(id),
 INDEX ix_community_active_locality (active,locality)
);
CREATE TABLE farmer_community_members (
 id CHAR(36) NOT NULL PRIMARY KEY,
 group_id CHAR(36) NOT NULL,
 user_id CHAR(36) NOT NULL,
 joined_at DATETIME(6) NOT NULL,
 CONSTRAINT fk_community_member_group FOREIGN KEY (group_id) REFERENCES farmer_community_groups(id),
 CONSTRAINT fk_community_member_user FOREIGN KEY (user_id) REFERENCES users(id),
 CONSTRAINT uq_community_member UNIQUE (group_id,user_id),
 INDEX ix_community_member_user (user_id,joined_at)
);
CREATE TABLE farmer_community_messages (
 id CHAR(36) NOT NULL PRIMARY KEY,
 group_id CHAR(36) NOT NULL,
 sender_id CHAR(36) NOT NULL,
 message VARCHAR(2000) NOT NULL,
 created_at DATETIME(6) NOT NULL,
 CONSTRAINT fk_community_message_group FOREIGN KEY (group_id) REFERENCES farmer_community_groups(id),
 CONSTRAINT fk_community_message_sender FOREIGN KEY (sender_id) REFERENCES users(id),
 INDEX ix_community_message_group (group_id,created_at)
);
INSERT INTO farmer_community_groups(id,name,description,locality,created_by,active,created_at) VALUES
('d1600000-0000-4000-8000-000000000001','सर्व शेतकरी समुदाय','महाराष्ट्रातील शेतकऱ्यांसाठी सामान्य चर्चा आणि मदत.','महाराष्ट्र',NULL,TRUE,CURRENT_TIMESTAMP(6)),
('d1600000-0000-4000-8000-000000000002','अकोला बाजार चर्चा','अकोला आणि परिसरातील शेतकरी व बाजार चर्चा.','अकोला, महाराष्ट्र',NULL,TRUE,CURRENT_TIMESTAMP(6));