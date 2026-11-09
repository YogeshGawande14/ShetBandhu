-- Local QA fixture only. Run AFTER Spring Boot has applied Flyway migrations.
-- Synthetic entries are clearly labeled; owner passwords are disabled intentionally.
-- Idempotent: reruns retain existing test records.
USE agroconnect_db;
CREATE TEMPORARY TABLE qa_centres(n INT PRIMARY KEY,city VARCHAR(90),district VARCHAR(90),pin CHAR(6),lat DECIMAL(10,7),lon DECIMAL(10,7));
INSERT INTO qa_centres VALUES
(1,'Ahilyanagar','Ahilyanagar','414001',19.0948,74.7480),
(2,'Akola','Akola','444001',20.7096,77.0021),
(3,'Amravati','Amravati','444601',20.9374,77.7796),
(4,'Beed','Beed','431122',18.9891,75.7601),
(5,'Bhandara','Bhandara','441904',21.1669,79.6500),
(6,'Buldhana','Buldhana','443001',20.5293,76.1842),
(7,'Chandrapur','Chandrapur','442401',19.9615,79.2961),
(8,'Chhatrapati Sambhajinagar','Chhatrapati Sambhajinagar','431001',19.8762,75.3433),
(9,'Dharashiv','Dharashiv','413501',18.1861,76.0419),
(10,'Dhule','Dhule','424001',20.9042,74.7749),
(11,'Gadchiroli','Gadchiroli','442605',20.1809,80.0030),
(12,'Gondia','Gondia','441601',21.4624,80.2209),
(13,'Hingoli','Hingoli','431513',19.7146,77.1425),
(14,'Jalgaon','Jalgaon','425001',21.0077,75.5626),
(15,'Jalna','Jalna','431203',19.8410,75.8864),
(16,'Kolhapur','Kolhapur','416003',16.7050,74.2433),
(17,'Latur','Latur','413512',18.4088,76.5604),
(18,'Mumbai City','Mumbai','400001',18.9388,72.8354),
(19,'Mumbai Suburban','Bandra, Mumbai','400050',19.0596,72.8295),
(20,'Nagpur','Nagpur','440001',21.1458,79.0882),
(21,'Nanded','Nanded','431601',19.1383,77.3210),
(22,'Nandurbar','Nandurbar','425412',21.3667,74.2400),
(23,'Nashik','Nashik','422001',19.9975,73.7898),
(24,'Palghar','Palghar','401404',19.6968,72.7654),
(25,'Parbhani','Parbhani','431401',19.2608,76.7748),
(26,'Pune','Pune','411001',18.5204,73.8567),
(27,'Raigad','Alibag','402201',18.6414,72.8722),
(28,'Ratnagiri','Ratnagiri','415612',16.9902,73.3120),
(29,'Sangli','Sangli','416416',16.8524,74.5815),
(30,'Satara','Satara','415001',17.6805,74.0183),
(31,'Sindhudurg','Oros','416812',16.1060,73.6850),
(32,'Solapur','Solapur','413001',17.6599,75.9064),
(33,'Thane','Thane','400601',19.2183,72.9781),
(34,'Wardha','Wardha','442001',20.7453,78.6022),
(35,'Washim','Washim','444505',20.1110,77.1330),
(36,'Yavatmal','Yavatmal','445001',20.3888,78.1204);
INSERT INTO users(id,full_name,phone_number,password_hash,role,village,district,is_approved)
SELECT UUID(),CONCAT('AgroConnect QA Owner ',LPAD(c.n,2,'0')),CONCAT('90000',LPAD(10000+c.n,5,'0')),'!QA_FIXTURE_LOGIN_DISABLED!','SHOP_OWNER',c.city,c.district,FALSE
FROM qa_centres c WHERE NOT EXISTS(SELECT 1 FROM users u WHERE u.phone_number=CONCAT('90000',LPAD(10000+c.n,5,'0')));
INSERT INTO krishi_seva_kendras(id,shop_name,owner_id,address,contact_number,latitude,longitude,is_verified)
SELECT UUID(),CONCAT('AgroConnect QA Kendra ',LPAD(c.n,2,'0'),' - ',c.city),u.id,CONCAT('QA test address, ',c.city,', Maharashtra ',c.pin),CONCAT('+91 90000',LPAD(10000+c.n,5,'0')),c.lat,c.lon,TRUE
FROM qa_centres c JOIN users u ON u.phone_number=CONCAT('90000',LPAD(10000+c.n,5,'0'))
WHERE NOT EXISTS(SELECT 1 FROM krishi_seva_kendras k WHERE k.shop_name=CONCAT('AgroConnect QA Kendra ',LPAD(c.n,2,'0'),' - ',c.city));
CREATE TEMPORARY TABLE qa_catalog(n INT PRIMARY KEY,product_name VARCHAR(140),category VARCHAR(30),description VARCHAR(300),price DECIMAL(12,2),unit VARCHAR(20),image_url VARCHAR(1000));
INSERT INTO qa_catalog VALUES
(1,'NPK 19:19:19 Water Soluble','FERTILIZER','QA sample listing; verify label and suitability before use.',1250,'1 kg','https://farmagro.ec/uploads/images/products/b8e9b79ac5de2aa59ab29ebfe450f6640ef2ac213ed826a662.png'),
(2,'Urea 46% Nitrogen','FERTILIZER','QA sample listing; verify label and suitability before use.',320,'45 kg bag','https://farmagro.ec/uploads/images/products/b8e9b79ac5de2aa59ab29ebfe450f6640ef2ac213ed826a662.png'),
(3,'DAP 18:46:0','FERTILIZER','QA sample listing; verify label and suitability before use.',1450,'50 kg bag','https://farmagro.ec/uploads/images/products/b8e9b79ac5de2aa59ab29ebfe450f6640ef2ac213ed826a662.png'),
(4,'Potash MOP','FERTILIZER','QA sample listing; verify label and suitability before use.',900,'50 kg bag','https://farmagro.ec/uploads/images/products/b8e9b79ac5de2aa59ab29ebfe450f6640ef2ac213ed826a662.png'),
(5,'Neem Based Insecticide','PESTICIDE','QA sample listing; illustrative image; actual formulation may differ.',480,'500 ml','https://res.cloudinary.com/dmcfuei38/image/upload/v1755766897/Drsoilhealth/Products/qcpmzvu8l2ayq7fkzebs.webp'),
(6,'Bio Fungicide','PESTICIDE','QA sample listing; illustrative image; actual formulation may differ.',360,'250 g','https://agrivruddhi.com/cdn/shop/files/Shenzi_SC_Insecticide_-AV.png?v=1761374689&width=1080'),
(7,'Crop Protection Spray','PESTICIDE','QA sample listing; illustrative image; actual formulation may differ.',620,'500 ml','https://farmmate.in/cdn/shop/products/BOLT_1200x1200.png?v=1679987906'),
(8,'Soybean Certified Seeds','SEEDS','QA sample listing; check season, variety and certification.',115,'1 kg','https://sarpanseeds.com/cdn/shop/products/Vegetablemix_1280x.jpg?v=1611861270'),
(9,'Cotton Hybrid Seeds','SEEDS','QA sample listing; check season, variety and certification.',850,'450 g pack','https://bentleyseeds.com/cdn/shop/products/il_fullxfull.3167747039_1a27.jpg'),
(10,'Onion Seeds','SEEDS','QA sample listing; check season, variety and certification.',520,'100 g','https://sarpanseeds.com/cdn/shop/products/Vegetablemix_1280x.jpg?v=1611861270');
INSERT INTO agri_products(id,shop_id,product_name,category,description,price,unit,stock_quantity,active,image_url)
SELECT UUID(),k.id,CONCAT('QA ',c.product_name,' - ',LPAD(q.n,2,'0')),c.category,c.description,c.price,c.unit,25,TRUE,c.image_url
FROM qa_centres q JOIN krishi_seva_kendras k ON k.shop_name=CONCAT('AgroConnect QA Kendra ',LPAD(q.n,2,'0'),' - ',q.city) CROSS JOIN qa_catalog c
WHERE NOT EXISTS(SELECT 1 FROM agri_products p WHERE p.shop_id=k.id AND p.product_name=CONCAT('QA ',c.product_name,' - ',LPAD(q.n,2,'0')));
SELECT COUNT(*) AS qa_centres FROM krishi_seva_kendras WHERE shop_name LIKE 'AgroConnect QA Kendra %';
SELECT COUNT(*) AS qa_products FROM agri_products WHERE product_name LIKE 'QA %';

