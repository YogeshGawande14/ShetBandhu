ALTER TABLE government_schemes
    ADD COLUMN title_mr VARCHAR(180) NULL,
    ADD COLUMN description_mr VARCHAR(3000) NULL,
    ADD COLUMN eligibility_mr VARCHAR(2000) NULL;

UPDATE government_schemes SET
    title_mr = 'प्रधानमंत्री किसान सन्मान निधी (पीएम-किसान)',
    description_mr = 'पात्र जमीनधारक शेतकरी कुटुंबांसाठी उत्पन्न सहाय्य. हप्त्याची स्थिती आणि अर्जाची माहिती अधिकृत संकेतस्थळावर तपासा.',
    eligibility_mr = 'पात्रता जमीन नोंदी आणि अपात्रतेच्या निकषांवर अवलंबून असते. अर्ज करण्यापूर्वी अधिकृत संकेतस्थळावरील सध्याचे नियम तपासा.'
WHERE title = 'PM-KISAN';

UPDATE government_schemes SET
    title_mr = 'महाडीबीटी शेतकरी योजना',
    description_mr = 'शेती उपकरणे, सिंचन आणि इतर शेतकरी लाभांसाठी महाराष्ट्र शासनाचे पोर्टल.',
    eligibility_mr = 'प्रत्येक योजनेची पात्रता आणि अर्जाचा कालावधी वेगळा असू शकतो. अर्जापूर्वी महाडीबीटीवरील सध्याचे तपशील तपासा.'
WHERE title = 'MahaDBT Farmer Schemes';

UPDATE government_schemes SET
    title_mr = 'प्रधानमंत्री पीक विमा योजना',
    description_mr = 'अधिसूचित पिके आणि हंगामांसाठी पीक विमा व नोंदणीविषयक माहिती.',
    eligibility_mr = 'पात्रता अधिसूचित पीक, क्षेत्र, हंगाम आणि अर्जाच्या तारखांवर अवलंबून असते. अधिकृत पोर्टलवर खात्री करा.'
WHERE title = 'Pradhan Mantri Fasal Bima Yojana';