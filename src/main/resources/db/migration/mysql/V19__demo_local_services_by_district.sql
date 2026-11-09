-- Demo-only providers are disabled accounts so these listings are visible for QA
-- but cannot be used as sign-in accounts or mistaken for real businesses.
INSERT INTO users(id,full_name,phone_number,password_hash,role,village,district,latitude,longitude,is_approved,created_at,account_enabled,token_version,email_verified)
VALUES
('d1900000-0000-4000-8000-000000000001','Demo Service Provider - Amravati','DS-AMRAVATI','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','FARMER','Amravati','Amravati',20.9374,77.7796,TRUE,CURRENT_TIMESTAMP(6),FALSE,0,FALSE),
('d1900000-0000-4000-8000-000000000002','Demo Service Provider - Akola','DS-AKOLA','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','FARMER','Akola','Akola',20.7002,77.0082,TRUE,CURRENT_TIMESTAMP(6),FALSE,0,FALSE),
('d1900000-0000-4000-8000-000000000003','Demo Service Provider - Nashik','DS-NASHIK','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','FARMER','Nashik','Nashik',19.9975,73.7898,TRUE,CURRENT_TIMESTAMP(6),FALSE,0,FALSE),
('d1900000-0000-4000-8000-000000000004','Demo Service Provider - Latur','DS-LATUR','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','FARMER','Latur','Latur',18.4088,76.5604,TRUE,CURRENT_TIMESTAMP(6),FALSE,0,FALSE),
('d1900000-0000-4000-8000-000000000005','Demo Service Provider - Pune','DS-PUNE','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','FARMER','Pune','Pune',18.5204,73.8567,TRUE,CURRENT_TIMESTAMP(6),FALSE,0,FALSE),
('d1900000-0000-4000-8000-000000000006','Demo Service Provider - Nagpur','DS-NAGPUR','$2a$12$C6UzMDM.H6dfI/f/IKcEe.7HNKgh3vV6S.iJf7j5xLJTKJgE6yWfS','FARMER','Nagpur','Nagpur',21.1458,79.0882,TRUE,CURRENT_TIMESTAMP(6),FALSE,0,FALSE);

INSERT INTO user_roles(user_id,role) VALUES
('d1900000-0000-4000-8000-000000000001','FARMER'),('d1900000-0000-4000-8000-000000000001','SHOP_OWNER'),
('d1900000-0000-4000-8000-000000000002','FARMER'),('d1900000-0000-4000-8000-000000000002','SHOP_OWNER'),
('d1900000-0000-4000-8000-000000000003','FARMER'),('d1900000-0000-4000-8000-000000000003','SHOP_OWNER'),
('d1900000-0000-4000-8000-000000000004','FARMER'),('d1900000-0000-4000-8000-000000000004','SHOP_OWNER'),
('d1900000-0000-4000-8000-000000000005','FARMER'),('d1900000-0000-4000-8000-000000000005','SHOP_OWNER'),
('d1900000-0000-4000-8000-000000000006','FARMER'),('d1900000-0000-4000-8000-000000000006','SHOP_OWNER');

INSERT INTO local_service_listings(id,owner_id,listing_type,category,title,description,image_url,price,rate_unit,rate_notes,village,taluka,district,latitude,longitude,availability,active,created_at,updated_at)
VALUES
('d1910000-0000-4000-8000-000000000001','d1900000-0000-4000-8000-000000000001','EQUIPMENT','Tractor','45 HP tractor with operator','Demo listing for local testing. Includes tractor and operator; confirm diesel and transport charges before booking.','/demo-tractor-amravati.svg',1200.00,'PER_HOUR','Diesel billed separately','Amravati','Amravati','Amravati',20.9374,77.7796,'Available by prior booking',TRUE,CURRENT_TIMESTAMP(6),CURRENT_TIMESTAMP(6)),
('d1910000-0000-4000-8000-000000000002','d1900000-0000-4000-8000-000000000002','SERVICE','Crop spraying','Tractor-mounted crop spraying','Demo listing for local testing. Area and water requirements should be confirmed with the provider.','/demo-sprayer-akola.svg',450.00,'PER_ACRE','Chemical cost not included','Akola','Akola','Akola',20.7002,77.0082,'Mon-Sat, advance booking',TRUE,CURRENT_TIMESTAMP(6),CURRENT_TIMESTAMP(6)),
('d1910000-0000-4000-8000-000000000003','d1900000-0000-4000-8000-000000000003','EQUIPMENT','Harvester','Combine harvester rental','Demo listing for local testing. Confirm crop, field access, minimum hours and travel charges before booking.','/demo-harvester-nashik.svg',2400.00,'PER_HOUR','Operator included; travel extra','Nashik','Nashik','Nashik',19.9975,73.7898,'Call through app for schedule',TRUE,CURRENT_TIMESTAMP(6),CURRENT_TIMESTAMP(6)),
('d1910000-0000-4000-8000-000000000004','d1900000-0000-4000-8000-000000000004','EQUIPMENT','Tractor','Farm tractor rental','Demo listing for local testing. Confirm implement attachment and transport charges before booking.','/demo-tractor-latur.svg',1100.00,'PER_HOUR','Implements charged separately','Latur','Latur','Latur',18.4088,76.5604,'Available by prior booking',TRUE,CURRENT_TIMESTAMP(6),CURRENT_TIMESTAMP(6)),
('d1910000-0000-4000-8000-000000000005','d1900000-0000-4000-8000-000000000005','SERVICE','Rotavator','Tractor rotavator service','Demo listing for local testing. Per-acre rate varies with soil and field conditions; confirm before booking.','/demo-rotavator-pune.svg',900.00,'PER_ACRE','Fuel included in demo rate','Pune','Haveli','Pune',18.5204,73.8567,'Weekdays, advance booking',TRUE,CURRENT_TIMESTAMP(6),CURRENT_TIMESTAMP(6)),
('d1910000-0000-4000-8000-000000000006','d1900000-0000-4000-8000-000000000006','EQUIPMENT','Tractor','45 HP tractor rental','Demo listing for local testing. Confirm operator, fuel, implements and travel terms before booking.','/demo-tractor-nagpur.svg',1000.00,'PER_HOUR','Fuel billed separately','Nagpur','Nagpur','Nagpur',21.1458,79.0882,'Available by prior booking',TRUE,CURRENT_TIMESTAMP(6),CURRENT_TIMESTAMP(6));
