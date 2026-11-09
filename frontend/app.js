const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
const formatMoney = value => new Intl.NumberFormat(state.locale === 'mr' ? 'mr-IN' : 'en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
function readStoredJson(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key) ?? JSON.stringify(fallback)); return value ?? fallback; }
  catch { localStorage.removeItem(key); return fallback; }
}
function readStoredSessionJson(key,fallback){try{return JSON.parse(sessionStorage.getItem(key)||'null')||fallback;}catch{return fallback;}}
const storedCart = readStoredJson('agroconnect.cart.v2', []);
const state = {
  products: [], allProducts: [], nextPage: 0, hasMore: false, category: 'ALL', search: '', sort: 'featured',
  shops: [], cart: (Array.isArray(storedCart) ? storedCart : []).filter(item => item && item.id && Number(item.quantity) > 0), user: readStoredJson('agroconnect.user', null),
  token: localStorage.getItem('agroconnect.token') || '', locale: localStorage.getItem('agroconnect.locale') || 'en', ownedShopIds: [], ownerTab: 'overview', authMode: 'login', pendingAuth: null, recoveryEmail: '', recoveryToken: '', marketGroups: [], compareMarkets: [], activeMarket: -1, activeMarketDistrict: '', marketFallback: false, serviceCoordinates: readStoredSessionJson('agroconnect.location', null), locationName: localStorage.getItem('agroconnect.locationName') || '', serviceAreaDistrict: '', serviceAreaResolvedFor: '', serviceSearchScope: '', serviceResultsAreDemo: false, serviceApiError: '', serviceFilter: 'ALL', serviceResults: null, communityPoll: null, activeCommunityGroup: null, activityTab: 'orders',
};
let toastTimer;
let searchTimer;
const enMr = {
  'Farm essentials, closer to you':'शेतीसाठी आवश्यक वस्तू, आता जवळच','All products':'सर्व उत्पादने','Seeds':'बियाणे','Fertilizers':'खते','Crop protection':'पीक संरक्षण','Mandi prices':'बाजारभाव','Find a centre':'केंद्र शोधा','Verified local agri stores':'पडताळलेली कृषी सेवा केंद्रे','Select your location':'आपले ठिकाण निवडा','DELIVER TO':'डिलिव्हरीचे ठिकाण','Search seeds, fertilizers, crop care…':'बियाणे, खते किंवा पीक संरक्षण शोधा…','Local expertise. Genuine inputs. Delivery to your doorstep.':'स्थानिक मार्गदर्शन. दर्जेदार निविष्ठा. घरपोच सेवा.','Find a nearby centre':'जवळचे केंद्र शोधा','BUILT FOR MAHARASHTRA FARMERS':'महाराष्ट्रातील शेतकऱ्यांसाठी','Better inputs.':'दर्जेदार निविष्ठा.','Better harvests.':'चांगले उत्पादन.','Compare trusted farm products, check mandi prices, and order from verified centres near you.':'विश्वासार्ह उत्पादने पाहा, बाजारभाव तपासा आणि पडताळलेल्या केंद्रांतून मागवा.','Shop farm essentials':'शेतीसाठी खरेदी करा','TODAY\'S MARKET':'आजचा बाजार','Know your':'जाणून घ्या','market price.':'बाजारभाव.','Compare net returns across local mandis.':'स्थानिक बाजारातील निव्वळ परतावा पाहा.','Explore mandi rates':'बाजारभाव पाहा','Verified centres':'पडताळलेली केंद्रे','Local, trusted agri stores':'विश्वासार्ह स्थानिक दुकाने','Fair, clear prices':'स्पष्ट आणि योग्य किंमती','Know the total before ordering':'ऑर्डरपूर्वी एकूण किंमत पाहा','Doorstep delivery':'घरपोच डिलिव्हरी','Address required at checkout':'ऑर्डरसाठी पत्ता आवश्यक','Support in your language':'आपल्या भाषेत मदत','English & मराठी':'English आणि मराठी','THE FARMER\'S MARKETPLACE':'शेतकऱ्यांसाठी बाजार','Shop farm essentials':'शेतीसाठी आवश्यक वस्तू','Quality inputs from trusted stores in Maharashtra.':'महाराष्ट्रातील विश्वासार्ह दुकानांतून दर्जेदार निविष्ठा.','View all products':'सर्व उत्पादने पहा','All products':'सर्व उत्पादने','Crop care':'पीक संरक्षण','Loading products…':'उत्पादने लोड होत आहेत…','Sort by':'क्रमानुसार','Recommended':'शिफारस केलेले','Price: low to high':'कमी किंमत आधी','Price: high to low':'जास्त किंमत आधी','Name':'नाव','Show more products':'आणखी उत्पादने','MORE THAN A MARKETPLACE':'बाजारापेक्षा अधिक','Made for the way':'आपल्या शेतीसाठी','you farm.':'आपली पद्धत.','Practical tools and reliable local support through every season.':'प्रत्येक हंगामात उपयोगी साधने आणि स्थानिक मदत.','Mandi rates':'बाजारभाव','Compare net returns':'निव्वळ परतावा पाहा','Nearby centres':'जवळची केंद्रे','Search by area or PIN':'परिसर किंवा PIN शोधा','Crop help':'पीक मार्गदर्शन','Simple symptom guidance':'लक्षणांनुसार प्राथमिक मदत','LOCAL, VERIFIED, READY TO HELP':'जवळची पडताळलेली केंद्रे','Find your agri centre':'कृषी सेवा केंद्र शोधा','Search by village, area or PIN code. No coordinates needed.':'गाव, परिसर किंवा PIN ने शोधा. अक्षांश-रेखांश नको.','Enter area or 6-digit PIN code':'परिसर किंवा ६ अंकी PIN','Find centres':'केंद्रे शोधा','Local agri knowledge and trusted farm inputs,':'स्थानिक कृषी माहिती आणि विश्वासार्ह निविष्ठा,','all in one place.':'एकाच ठिकाणी.','Shop':'खरेदी','Centres':'केंद्रे','About':'माहिती','Built for Maharashtra':'महाराष्ट्रासाठी','DEMO LISTING':'डेमो यादी','FARM ESSENTIAL':'शेतीसाठी','in stock':'साठा उपलब्ध','Currently unavailable':'सध्या अनुपलब्ध','Add to cart':'कार्टमध्ये टाका','Your cart is ready for a good harvest.':'आपल्या कार्टमध्ये अजून काही नाही.','Browse farm essentials and add what you need.':'उत्पादने पाहून आवश्यक वस्तू जोडा.','Remove':'काढा','Continue to delivery':'डिलिव्हरीकडे जा','Subtotal':'उपएकूण','Delivery':'डिलिव्हरी','Calculated for your address':'पत्त्यानुसार कळेल','Total before delivery':'डिलिव्हरीपूर्वी एकूण','Your delivery address and final total are confirmed at checkout.':'पत्ता आणि अंतिम किंमत checkoutमध्ये निश्चित होईल.','Deliver to my address':'माझ्या पत्त्यावर पोहोचवा','We need your delivery address and PIN code':'पत्ता आणि PIN आवश्यक आहे','I\'ll pick it up':'मी दुकानातून घेईन','Collect directly from the selected centre':'निवडलेल्या केंद्रातून घ्या','Your contact':'आपली संपर्क माहिती','Full name':'पूर्ण नाव','Mobile number':'मोबाइल क्रमांक','Delivery address':'डिलिव्हरीचा पत्ता','House / farm address':'घर / शेताचा पत्ता','PIN code':'PIN कोड','Village / city':'गाव / शहर','District':'जिल्हा','Landmark':'जवळची खूण','(optional)':'(ऐच्छिक)','Sign in':'लॉग इन','Sign in to शेतबंधू':'शेतबंधू मध्ये लॉग इन','Create account':'खाते तयार करा','Track orders and save your favourite products.':'ऑर्डर पाहा आणि आवडती उत्पादने जतन करा.','Continue':'पुढे जा','Continue as guest':'अतिथी म्हणून पुढे जा','Your information is protected and only used to manage your शेतबंधू account.':'आपली माहिती सुरक्षित असून खाते व्यवस्थापनापुरती वापरली जाते.','Order confirmed':'ऑर्डर निश्चित झाली',"Today's mandi prices":'आजचे बाजारभाव','DAILY MARKET SNAPSHOT':'आजचा बाजार','Compare today\'s listed rates before choosing where to sell.':'विकण्यापूर्वी आजचे बाजारभाव तपासा.','Crop':'पीक','General information only; contact a qualified local agriculture officer before applying any treatment.':'ही सामान्य माहिती आहे. उपाय करण्यापूर्वी कृषी अधिकाऱ्यांचा सल्ला घ्या.','Crop help, in a few steps':'पिकासाठी प्राथमिक मार्गदर्शन','Choose a crop and symptom for initial guidance.':'पीक आणि लक्षण निवडून प्राथमिक मदत पहा.'
};
Object.assign(enMr, { 'Search seeds, fertilizers, crop care…':'बियाणे, खते किंवा पीक संरक्षण शोधा…','Enter area or 6-digit PIN code':'परिसर किंवा ६ अंकी PIN कोड','Name for the delivery':'डिलिव्हरीसाठी नाव','10-digit mobile number':'१० अंकी मोबाइल क्रमांक','House number, street, farm or landmark':'घर क्रमांक, रस्ता, शेत किंवा जवळची खूण','6 digits':'६ अंक','Your village or city':'आपले गाव किंवा शहर','District':'जिल्हा','Nearby landmark':'जवळची खूण','At least 10 characters':'किमान १० अक्षरे' });
Object.assign(enMr, {
'Accounts':'खाती','Centre verification':'केंद्र पडताळणी','City directory':'शहर निर्देशिका','Delivery details':'डिलिव्हरी तपशील','Help desk':'मदत कक्ष','Orders':'ऑर्डर्स','Overview':'आढावा','Platform Admin':'प्लॅटफॉर्म प्रशासन','Product review':'उत्पादन तपासणी','Products & stock':'उत्पादने आणि साठा','Restricted access':'मर्यादित प्रवेश','Super Admin sign-in':'सुपर अॅडमिन लॉग इन','WELCOME BACK':'पुन्हा स्वागत आहे','Super Admin':'सुपर अॅडमिन','Owner panel':'मालक पॅनेल','Owner sign in':'मालक लॉग इन','Agency owner':'एजन्सी मालक','Seva Kendra owner':'सेवा केंद्र मालक','Farmer':'शेतकरी','Customer':'ग्राहक','Cart':'कार्ट','Search':'शोधा','Filter':'फिल्टर','Sort':'क्रमवारी','Category':'प्रकार','Price':'किंमत','Stock':'साठा','Available':'उपलब्ध','Not available':'उपलब्ध नाही','Quantity':'प्रमाण','Add':'जोडा','ADD TO CART ＋':'कार्टमध्ये टाका ＋','Customer reviews':'ग्राहकांचे अभिप्राय','Submit review':'अभिप्राय पाठवा','Your rating':'तुमचे रेटिंग','Your review':'तुमचा अभिप्राय','Share your experience after delivery':'डिलिव्हरीनंतरचा अनुभव सांगा','Loading verified customer reviews…':'पडताळलेले अभिप्राय लोड होत आहेत…','Sign in as a customer to write a review after delivery.':'डिलिव्हरीनंतर अभिप्राय देण्यासाठी ग्राहक म्हणून लॉग इन करा.','Only customers with a delivered order can post one review per product.':'डिलिव्हरी झालेल्या ऑर्डरचा ग्राहक प्रत्येक उत्पादनासाठी एक अभिप्राय देऊ शकतो.','Excellent':'उत्कृष्ट','Good':'चांगले','Okay':'ठीक','Poor':'खराब','Bad':'अतिशय खराब','Requests from nearby farmers':'जवळच्या शेतकऱ्यांच्या विनंत्या','Requests match your registered district; phone numbers stay private.':'विनंत्या नोंदणीकृत जिल्ह्यानुसार दाखवल्या आहेत; फोन नंबर गोपनीय आहेत.','Your centre':'तुमचे केंद्र','Availability':'उपलब्धता','Price (₹)':'किंमत (₹)','ETA':'अपेक्षित वेळ','Reply':'उत्तर','Send response':'उत्तर पाठवा','Any useful detail':'अतिरिक्त माहिती','e.g. Ready tomorrow':'उदा. उद्या तयार','No open requests currently match your registered district.':'तुमच्या जिल्ह्यात सध्या उघड्या विनंत्या नाहीत.','Sign in to send a request and see centre replies here.':'विनंती पाठवण्यासाठी आणि केंद्राचे उत्तर पाहण्यासाठी लॉग इन करा.','Waiting for nearby centres to reply.':'जवळच्या केंद्रांच्या उत्तराची प्रतीक्षा आहे.','Your requests and centre replies will show here.':'तुमच्या विनंत्या आणि केंद्रांची उत्तरे येथे दिसतील.','Only Super Admin can publish verified rate entries.':'पडताळलेले बाजारभाव फक्त सुपर अॅडमिन प्रकाशित करू शकतो.','Market / APMC':'बाजार / APMC','Taluka / tehsil':'तालुका / तहसील','City':'शहर','Record date':'नोंद दिनांक','Modal rate ₹/qtl':'प्रचलित दर ₹/क्विंटल','Minimum rate':'किमान दर','Maximum rate':'कमाल दर','Transport cost / qtl':'वाहतूक खर्च / क्विंटल','Publish market rate':'बाजारभाव प्रकाशित करा','Published rates':'प्रकाशित बाजारभाव','RECORDS':'नोंदी','Market':'बाजार','City / taluka':'शहर / तालुका','District':'जिल्हा','Modal':'प्रचलित','Min—Max':'किमान—कमाल','Date':'दिनांक','No rate records are stored.':'बाजारभावाच्या नोंदी उपलब्ध नाहीत.','Search product or centre':'उत्पादन किंवा केंद्र शोधा','Seller centre':'विक्रेता केंद्र','Status':'स्थिती','Review action':'तपासणी कृती','Review reason':'तपासणीचे कारण','Restore':'पुन्हा सुरू करा','No products found.':'उत्पादने आढळली नाहीत.','LIVE':'सुरू','REMOVED':'काढले','HIDDEN BY OWNER':'मालकाने लपवले','Quality farm input from a verified local centre.':'पडताळलेल्या स्थानिक केंद्रातील दर्जेदार कृषी निविष्ठा.','Track order':'ऑर्डरचा मागोवा घ्या','Your orders':'तुमच्या ऑर्डर्स','No orders yet.':'अजून ऑर्डर्स नाहीत.','Products':'उत्पादने','Requests':'विनंत्या','Support':'मदत','Dashboard':'डॅशबोर्ड','Applications':'अर्ज','Pending':'प्रलंबित','Approved':'मंजूर','Rejected':'नामंजूर','Approve':'मंजूर करा','Reject':'नामंजूर करा','Documents':'कागदपत्रे','Shop name':'दुकानाचे नाव','Address':'पत्ता','Contact number':'संपर्क क्रमांक','Upload image':'फोटो जोडा','Product name':'उत्पादनाचे नाव','Description':'तपशील','Unit':'एकक','Save changes':'बदल जतन करा','Cancel':'रद्द करा','Loading…':'लोड होत आहे…','Please wait…':'कृपया थांबा…','No data found.':'माहिती आढळली नाही.','Something went wrong.':'काहीतरी चूक झाली.','Language set to English':'भाषा इंग्रजी केली','Network error. Please try again.':'नेटवर्कमध्ये अडचण. पुन्हा प्रयत्न करा.','Sign out':'लॉग आउट','Log out':'लॉग आउट','Close':'बंद करा','Back':'मागे','Next':'पुढे','Save':'जतन करा','Update':'अपडेट करा','Publish':'प्रकाशित करा','View details':'तपशील पहा'
});
Object.assign(enMr, {'Enter a city to see its available markets. Open a market for crop-wise rates and select markets to compare.':'शहर टाकल्यावर उपलब्ध बाजार दिसतील. बाजार उघडून पिकांचे दर पहा आणि बाजारांची तुलना करा.','City in Maharashtra':'महाराष्ट्रातील शहर','Enter city name (e.g. Pune)':'शहराचे नाव टाका (उदा. पुणे)','Find markets':'बाजार शोधा','Enter a city to find available markets.':'उपलब्ध बाजार पाहण्यासाठी शहराचे नाव टाका.','Demo rates are excluded. Other rates show their source and reporting date; confirm the latest price with the market before selling.':'डेमो दर वगळले आहेत. इतर दरांचा स्रोत व तारीख पहा; विक्रीपूर्वी बाजाराशी खात्री करा.','LOCAL WEATHER':'स्थानिक हवामान','Weather near you':'तुमच्या परिसरातील हवामान','Enter a Maharashtra city to see current conditions and a short forecast.':'सध्याचे हवामान आणि अंदाज पाहण्यासाठी महाराष्ट्रातील शहर टाका.','City':'शहर','Enter city name':'शहराचे नाव टाका','Show weather':'हवामान पहा','Weather appears here after a city search.':'शहर शोधल्यानंतर हवामान येथे दिसेल.','Only the city name is used to find forecast data.':'हवामानासाठी फक्त शहराचे नाव वापरले जाते.','Forecast data by':'हवामानाचा स्रोत','Open a market to view crop rates':'पिकांचे दर पाहण्यासाठी बाजार उघडा','Add to compare':'तुलनेसाठी निवडा','Compare selected markets':'निवडलेल्या बाजारांची तुलना','Select one more market to compare.':'तुलनेसाठी आणखी एक बाजार निवडा.','Clear list':'यादी रिकामी करा','Close':'बंद करा','MARKET RATES':'बाजारभाव','MARKET COMPARISON':'बाजार तुलना','Search by city':'शहरानुसार शोधा'});
Object.assign(enMr, {'Search by city, district, taluka or market. Open a market to see crop-wise prices and compare reporting dates.':'शहर, जिल्हा, तालुका किंवा बाजार शोधा. पिकांचे दर व नोंदींच्या तारखांची तुलना पाहण्यासाठी बाजार उघडा.','City, district or market in Maharashtra':'महाराष्ट्रातील शहर, जिल्हा किंवा बाजार','Try Akola, Washim, Buldhana…':'अकोला, वाशीम, बुलढाणा शोधा…','Search a city, district or market to view available reports.':'उपलब्ध दर पाहण्यासाठी शहर, जिल्हा किंवा बाजार शोधा.','Demo samples appear only when no reported rate is available for your search. Results cover localities with rate records; they do not imply a rate is available in every village. Check the source and date before selling.':'तुमच्या शोधासाठी नोंदवलेला दर नसल्यासच डेमो नमुना दाखवला जाईल. निकाल फक्त दर नोंदी असलेल्या ठिकाणांचे आहेत; प्रत्येक गावाचा दर उपलब्ध आहे असा याचा अर्थ नाही. विक्रीपूर्वी स्रोत व तारीख तपासा.'});
Object.assign(enMr, {'Browse reported markets across Maharashtra, or search by city, district, taluka or market. Open a market to see crop-wise prices and compare rates.':'महाराष्ट्रातील उपलब्ध बाजार पहा किंवा शहर, जिल्हा, तालुका अथवा बाजार शोधा. बाजार उघडून पीकनिहाय भाव व तुलना पहा.','City, district or market (optional)':'शहर, जिल्हा किंवा बाजार (ऐच्छिक)','Try Akola, Washim, Buldhana — or leave blank for Maharashtra':'अकोला, वाशीम, बुलढाणा शोधा — किंवा महाराष्ट्रासाठी रिकामे ठेवा','Show markets':'बाजार पहा','Browse available market reports across Maharashtra or search a locality.':'महाराष्ट्रातील उपलब्ध बाजारभाव पहा किंवा ठिकाण शोधा.','Demo samples appear only when no reported rate is available for your search. Results cover markets with published records; not every village has an APMC report. Check the source and date before selling.':'नोंदवलेला भाव उपलब्ध नसल्यासच डेमो नमुना दिसेल. निकाल प्रकाशित बाजार नोंदी दाखवतात; प्रत्येक गावाचा APMC भाव असेलच असे नाही. विक्रीपूर्वी स्रोत व तारीख तपासा.'});
Object.assign(enMr, {'Marketplace':'शेती साहित्य बाजार','Choose a category to find farm inputs from trusted stores across Maharashtra.':'महाराष्ट्रातील विश्वासार्ह दुकानांतून शेती साहित्य पाहण्यासाठी प्रकार निवडा.','Market rates':'बाजारभाव','Farm services':'शेती सेवा','Nearby machines and services':'जवळची यंत्रे आणि शेती सेवा','LOCAL FARMERS HELPING FARMERS':'शेतकरी एकमेकांना मदत करतात','Choose your village':'आपले गाव निवडा','Find within 25 km':'२५ किमीमध्ये शोधा'});
Object.assign(enMr, {'My activity':'माझी कामे','Service bookings':'सेवा बुकिंग','Product requests':'उत्पादन विनंत्या','My listings':'माझ्या नोंदी','My groups':'माझे गट','Profile photo':'प्रोफाइल फोटो','Update photo':'फोटो बदला','JPG, PNG or WebP · up to 5 MB':'JPG, PNG किंवा WebP · कमाल ५ MB','Orders':'ऑर्डर्स','My requests and centre replies':'माझ्या विनंत्या आणि केंद्रांची उत्तरे','Request a product or input':'उत्पादन किंवा निविष्ठेची विनंती करा','Attach a product photo (optional)':'उत्पादनाचा फोटो जोडा (ऐच्छिक)','Send product request':'उत्पादन विनंती पाठवा','My service requests':'माझ्या सेवा विनंत्या','Manage my listings':'माझ्या नोंदी व्यवस्थापित करा','Farmers’ community':'शेतकरी समुदाय','Create a group':'गट तयार करा'});
Object.assign(enMr,{'Orders & tracking':'ऑर्डर्स आणि मागोवा','My equipment & services':'माझी यंत्रे आणि सेवा','Groups & chat':'शेतकरी गट आणि संवाद','Help desk':'मदत कक्ष','My account':'माझे खाते','Create a group':'गट तयार करा','Log out':'लॉग आउट','Update location & weather':'ठिकाण आणि हवामान बदला','City / village':'शहर / गाव','Your selected village or city is applied automatically. Browser location is used for nearby platform searches.':'निवडलेले गाव किंवा शहर आपोआप लागू होईल. जवळची केंद्रे शोधण्यासाठी ब्राउझरचे ठिकाण वापरले जाईल.','Forecast lookup uses the locality name, not exact GPS coordinates.':'हवामानासाठी गाव/शहराचे नाव वापरले जाते; अचूक GPS निर्देशांक नाही.','Select your location':'आपले ठिकाण निवडा','Near me':'माझ्या जवळ','Weather near you':'तुमच्या परिसरातील हवामान','Government schemes':'शासकीय योजना','Can\'t find what you need?':'हवे ते उत्पादन दिसत नाही?','Tell nearby verified centres what product or input you’re looking for.':'तुम्हाला कोणते उत्पादन हवे आहे ते जवळच्या पडताळलेल्या केंद्रांना कळवा.','Request this product':'या उत्पादनाची विनंती करा','Request when available':'उपलब्ध झाल्यावर विनंती करा'});
Object.assign(enMr,{'Showing listings for':'यासाठी listings','Select your location above':'वर ठिकाण निवडा','Choose a location once in the header or centre search; we’ll apply it here.':'Header किंवा केंद्र शोधातून एकदा ठिकाण निवडा; ते येथे लागू होईल.','Refresh listings':'Listings पुन्हा लोड करा','Choose a location above to see listings for its district.':'जिल्ह्यातील listings पाहण्यासाठी वर ठिकाण निवडा.','Save photo':'फोटो जतन करा','Post equipment or service':'यंत्र किंवा सेवा नोंदवा','Your listings could not be loaded.':'तुमच्या listings लोड झाल्या नाहीत.','Restart the backend and confirm database migrations have completed.':'Backend पुन्हा सुरू करून database migrations पूर्ण झाल्या आहेत याची खात्री करा.','Try again':'पुन्हा प्रयत्न करा'});
function translateVisibleText() {
  const map = state.locale === 'mr' ? enMr : Object.fromEntries(Object.entries(enMr).map(([english, marathi]) => [marathi, english]));
  const translate = value => {
    if (!value) return value;
    const trimmed = value.trim();
    let result = map[trimmed];
    if (!result && state.locale === 'mr') {
      const count = trimmed.match(/^(\d+)\s+(items?|products?|centres?)$/i);
      const group = trimmed.match(/^\((\d+)\s+(items?|products?)\)$/i);
      const match = count || group;
      if (match) result = `${group ? '(' : ''}${new Intl.NumberFormat('mr-IN').format(Number(match[1]))} ${map[match[2].toLowerCase()] || match[2]}${group ? ')' : ''}`;
    }
    return result ? value.replace(trimmed, result) : value;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) node.nodeValue = translate(node.nodeValue);
  $$('[placeholder], [aria-label], [title], [alt], input[type="button"], input[type="submit"]').forEach(element => {
    ['placeholder','aria-label','title','alt','value'].forEach(attribute => { if (element.hasAttribute(attribute)) element.setAttribute(attribute, translate(element.getAttribute(attribute))); });
  });
  document.documentElement.lang = state.locale === 'mr' ? 'mr' : 'en';
  document.title = state.locale === 'mr' ? 'शेतबंधू | शेतकऱ्यांचा बाजार' : 'शेतबंधू | Farmer marketplace';
}
let translationObserverStarted = false;
const translationObserver = new MutationObserver(() => translateVisibleText());
function observeTranslatedContent() {
  if (document.body && !translationObserverStarted) { translationObserver.observe(document.body, { childList: true, subtree: true }); translationObserverStarted = true; }
}
function clearInvalidSession(){state.token='';state.user=null;localStorage.removeItem('agroconnect.token');localStorage.removeItem('agroconnect.user');$('#accountMenu').hidden=true;$('#accountButton').innerHTML='<span class="user-icon">♙</span><span>Sign in</span>';activateRoleView();renderCart();}
async function api(path, options = {}) {
  const isForm = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const method=(options.method||'GET').toUpperCase();
  if((method==='POST'||method==='PUT')&&/^\/local-services(?:\/[0-9a-f-]+)?$/i.test(path)&&options.body&&!isForm){try{const payload=JSON.parse(options.body),form=$('#localServiceListingForm')||$('#localListingEditForm');if(form){payload.contactNumber=form.elements.contactNumber?.value.trim()||null;payload.allowCalls=!!form.elements.allowCalls?.checked;payload.allowWhatsApp=!!form.elements.allowWhatsApp?.checked;options={...options,body:JSON.stringify(payload)};}}catch{}}
  const headers = { ...(options.body && !isForm ? { 'Content-Type': 'application/json' } : {}), ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}), ...(options.headers || {}) };
  let response = await fetch(`/api${path}`, { ...options, headers });
  if(response.status===401&&state.token&&method==='GET'&&path.startsWith('/local-services')){
    const anonymousHeaders={...headers};delete anonymousHeaders.Authorization;
    const anonymousResponse=await fetch(`/api${path}`,{...options,headers:anonymousHeaders});
    if(anonymousResponse.ok){clearInvalidSession();response=anonymousResponse;}
  }
  const text = await response.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) {
    if (response.status === 401 && state.token && !path.startsWith('/auth/')) { clearInvalidSession(); toast('Your session expired. Please sign in again.'); }
    throw new Error(body?.message || `Request failed (${response.status})`);
  }
  return body;
}

async function uploadImage(file) {
  if(!file) return null;
  const data=new FormData(); data.append('file',file);
  const result=await api('/media/images',{method:'POST',body:data});
  return result.url;
}

function toast(message) {
  const element = $('#toast');
  element.textContent = message;
  element.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { element.hidden = true; }, 2600);
}

const imageByCategory = {
  SEEDS: 'https://sarpanseeds.com/cdn/shop/products/Vegetablemix_1280x.jpg?v=1611861270',
  PESTICIDE: 'https://res.cloudinary.com/dmcfuei38/image/upload/v1755766897/Drsoilhealth/Products/qcpmzvu8l2ayq7fkzebs.webp',
  FERTILIZER: 'https://farmagro.ec/uploads/images/products/b8e9b79ac5de2aa59ab29ebfe450f6640ef2ac213ed826a662.png',
};

function categoryLabel(category) {
  if (state.locale === 'mr') return ({ SEEDS: 'बियाणे', FERTILIZER: 'खते', PESTICIDE: 'पीक संरक्षण' })[category] || 'उत्पादन';
  return ({ SEEDS: 'Seeds', FERTILIZER: 'Fertilizer', PESTICIDE: 'Crop care' })[category] || 'Farm input';
}

async function loadRates() {
  const panel=$('#ratesGrid'),rawCity=String(new FormData($('#marketRateSearch')).get('city')||'').trim(),city=marketSearchTerm(rawCity),mr=state.locale==='mr';
  state.marketGroups=[];state.compareMarkets=[];state.activeMarket=-1;state.activeMarketDistrict='';state.marketFallback=false;
  if(city.length===1){panel.innerHTML=`<div class="empty-state">${mr?'किमान दोन अक्षरे टाका किंवा रिकामे ठेवून महाराष्ट्रातील बाजार पहा.':'Enter at least two characters, or leave blank to browse Maharashtra.'}</div>`;return;}
  panel.innerHTML=`<div class="empty-state">${mr?'महाराष्ट्रातील बाजारभाव शोधत आहोत…':'Loading Maharashtra market reports…'}</div>`;
  try{const liveUrl=city?`/mandi-rates/live?city=${encodeURIComponent(city)}`:'/mandi-rates/live';let all=await api(liveUrl).catch(()=>[]);if(!Array.isArray(all)||!all.length){all=[];let page=0,pages=1;do{const q=new URLSearchParams({page:String(page),size:'100',sort:'recordDate,desc'});if(city)q.set('city',city);const data=await api(`/mandi-rates?${q}`);all.push(...(data.content||[]));pages=Math.min(Number(data.totalPages||1),100);page++;}while(page<pages);}
    const official=all.filter(x=>x.sourceLabel==='OFFICIAL_FEED'),reported=all.filter(x=>x.sourceLabel!=='DEMO'&&x.sourceLabel!=='OFFICIAL_FEED'),rows=official.length?official:reported.length?reported:all.filter(x=>x.sourceLabel==='DEMO');state.marketFallback=!official.length&&!reported.length&&rows.length>0;
    const grouped=new Map();for(const r of rows){const key=[r.mandiName,r.district||'',r.tehsil||''].map(x=>String(x).trim().toLowerCase()).join('|');if(!grouped.has(key))grouped.set(key,{name:r.mandiName,district:r.district||'',tehsil:r.tehsil||'',city:r.city||r.district||city,rates:[]});grouped.get(key).rates.push(r);}
    state.marketGroups=[...grouped.values()].sort((a,b)=>a.name.localeCompare(b.name));state.activeMarketDistrict=[...new Set(state.marketGroups.map(m=>m.district||m.city||city))][0]||'';renderMarketBrowser(city);
  }catch(e){panel.innerHTML=`<div class="empty-state">${mr?'बाजारभाव लोड झाले नाहीत: ':'Could not load rates: '}${escapeHtml(e.message)}</div>`;}
}
function renderMarketBrowser(city){const host=$('#ratesGrid'),mr=state.locale==='mr',groups=state.marketGroups,scope=city?marketLocalityName(city):(mr?'संपूर्ण महाराष्ट्र':'Maharashtra');if(!groups.length){host.innerHTML=`<div class="empty-state">${mr?`${escapeHtml(scope)} साठी दर उपलब्ध नाहीत. गाव/शहराचे नाव तपासा किंवा नंतर पुन्हा प्रयत्न करा.`:`No market records found for ${escapeHtml(scope)}. Check the locality or try again later.`}</div>`;return;}const districts=[...new Set(groups.map(m=>m.district||m.city||city).filter(Boolean))].sort((a,b)=>a.localeCompare(b));if(!city&&!state.activeMarketDistrict)state.activeMarketDistrict='*';else if(city&&!districts.includes(state.activeMarketDistrict))state.activeMarketDistrict=districts[0];const visible=groups.map((m,i)=>({m,i})).filter(({m})=>state.activeMarketDistrict==='*'||(m.district||m.city||city)===state.activeMarketDistrict);const allChip=!city?`<button type="button" class="market-locality-chip ${state.activeMarketDistrict==='*'?'active':''}" data-market-district="*">${mr?'संपूर्ण महाराष्ट्र':'All Maharashtra'}</button>`:'';const localities=allChip+districts.map(d=>`<button type="button" class="market-locality-chip ${d===state.activeMarketDistrict?'active':''}" data-market-district="${escapeHtml(d)}">${escapeHtml(marketLocalityName(d))}</button>`).join('');const cards=visible.map(({m,i})=>{const crops=new Set(m.rates.map(r=>r.cropName));const newest=m.rates.slice().sort((a,b)=>String(b.recordDate).localeCompare(String(a.recordDate)))[0];return `<article class="market-tile"><div class="market-tile-heading"><span class="market-tile-kicker">${escapeHtml([m.city,m.tehsil,m.district].filter(Boolean).map(marketLocalityName).join(' · ')||'Maharashtra')}</span><strong>${escapeHtml(m.name)}</strong><span>${crops.size} ${mr?'पिके':'crops'} · ${mr?'अहवाल दिनांक':'reported'} ${escapeHtml(newest?.recordDate||'—')}</span></div><button class="market-open" type="button" data-open-market="${i}">${mr?'पीकनिहाय दर पहा':'View crop rates'} <span aria-hidden="true">→</span></button><label class="market-compare"><input type="checkbox" data-compare-market="${i}" ${state.compareMarkets.includes(i)?'checked':''}> ${mr?'तुलनेसाठी निवडा':'Add to compare'}</label></article>`;}).join('');const source=state.marketFallback?(mr?'नमुना दर · फक्त डेमोसाठी · प्रत्यक्ष विक्रीपूर्वी APMC मध्ये खात्री करा':'Demo sample · for preview only · verify with the APMC before selling'):(mr?'नोंदवलेले बाजारभाव · स्रोत व तारीख प्रत्येक नोंदीसोबत':'Reported market rates · source and date shown on each record');host.innerHTML=`<div class="market-source-banner ${state.marketFallback?'demo':'reported'}"><span>${state.marketFallback?'DEMO':'MARKET DATA'}</span><p>${source}</p></div><div class="market-results-head"><strong>${visible.length} ${mr?'बाजार':'markets'} · ${escapeHtml(scope)}</strong><small>${mr?'जिल्हा निवडा, मग बाजारातील पीकनिहाय दर उघडा':'Select a district, then open a market for crop rates'}</small></div><div class="market-locality-list" role="group" aria-label="${mr?'जिल्हे':'Districts'}">${localities}</div><div class="market-list">${cards||`<div class="empty-state">${mr?'या जिल्ह्यासाठी बाजार नाहीत.':'No markets in this district.'}</div>`}</div><div id="marketDetail"></div><div id="marketCompare"></div>`;renderMarketDetail();renderMarketComparison();}
function marketSearchTerm(value){const aliases={'अकोला':'Akola','वाशीम':'Washim','बुलढाणा':'Buldhana','अमरावती':'Amravati','नागपूर':'Nagpur','पुणे':'Pune','नाशिक':'Nashik','लातूर':'Latur','जळगाव':'Jalgaon','यवतमाळ':'Yavatmal','नांदेड':'Nanded','सोलापूर':'Solapur','कोल्हापूर':'Kolhapur','सातारा':'Satara','सांगली':'Sangli','परभणी':'Parbhani','जालना':'Jalna','बीड':'Beed','हिंगोली':'Hingoli','वर्धा':'Wardha','चंद्रपूर':'Chandrapur','भंडारा':'Bhandara','गोंदिया':'Gondia','गडचिरोली':'Gadchiroli','धुळे':'Dhule','नंदुरबार':'Nandurbar','अहिल्यानगर':'Ahilyanagar','अहमदनगर':'Ahilyanagar','छत्रपती संभाजीनगर':'Chhatrapati Sambhajinagar','औरंगाबाद':'Chhatrapati Sambhajinagar','मुंबई':'Mumbai','रायगड':'Raigad','रत्नागिरी':'Ratnagiri','सिंधुदुर्ग':'Sindhudurg','ठाणे':'Thane','पालघर':'Palghar','उस्मानाबाद':'Dharashiv','धाराशिव':'Dharashiv'};return aliases[String(value||'').trim()]||String(value||'').trim();}
function marketLocalityName(value){if(state.locale!=='mr')return String(value||'');const names={'akola':'अकोला','washim':'वाशीम','buldhana':'बुलढाणा','amravati':'अमरावती','nagpur':'नागपूर','pune':'पुणे','nashik':'नाशिक','latur':'लातूर','jalgaon':'जळगाव','yavatmal':'यवतमाळ','nanded':'नांदेड','solapur':'सोलापूर','kolhapur':'कोल्हापूर','satara':'सातारा','sangli':'सांगली','parbhani':'परभणी','jalna':'जालना','beed':'बीड','hingoli':'हिंगोली','wardha':'वर्धा','chandrapur':'चंद्रपूर','bhandara':'भंडारा','gondia':'गोंदिया','gadchiroli':'गडचिरोली','dhule':'धुळे','nandurbar':'नंदुरबार','ahilyanagar':'अहिल्यानगर','aurangabad':'छत्रपती संभाजीनगर','chhatrapati sambhajinagar':'छत्रपती संभाजीनगर','dharashiv':'धाराशिव','mumbai':'मुंबई','raigad':'रायगड','ratnagiri':'रत्नागिरी','sindhudurg':'सिंधुदुर्ग','thane':'ठाणे','palghar':'पालघर'};return names[String(value||'').trim().toLowerCase()]||String(value||'');}
function marketCropName(v){const n={SOYBEAN:['Soybean','सोयाबीन'],TOOR:['Toor','तूर'],WHEAT:['Wheat','गहू'],COTTON:['Cotton','कापूस'],GRAM:['Gram','हरभरा'],MAIZE:['Maize','मका'],ONION:['Onion','कांदा'],JOWAR:['Jowar','ज्वारी']};return n[v]?.[state.locale==='mr'?1:0]||String(v||'');}
function rateSparkline(rates){const values=rates.slice(0,7).reverse().map(r=>Number(r.ratePerQuintal)).filter(Number.isFinite);if(values.length<2)return `<span class="rate-trend-unavailable">—</span>`;const min=Math.min(...values),max=Math.max(...values),span=max-min||1,pts=values.map((v,i)=>`${4+i*14},${24-(v-min)/span*19}`).join(' ');return `<svg class="rate-sparkline" viewBox="0 0 92 28" aria-label="${values.length} reported values" role="img"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
function renderMarketDetail(){const host=$('#marketDetail'),m=state.marketGroups[state.activeMarket];if(!host)return;if(!m){host.innerHTML='';return;}const mr=state.locale==='mr',crops=[...new Set(m.rates.map(r=>r.cropName))],rows=crops.map(c=>{const history=m.rates.filter(r=>r.cropName===c).sort((a,b)=>String(b.recordDate).localeCompare(String(a.recordDate))),latest=history[0],previous=history.find(r=>r.recordDate!==latest.recordDate),delta=previous&&Number(previous.ratePerQuintal)?(Number(latest.ratePerQuintal)-Number(previous.ratePerQuintal))/Number(previous.ratePerQuintal)*100:null,trend=delta===null?'':`<span class="rate-change ${delta>=0?'up':'down'}">${delta>=0?'▲':'▼'} ${Math.abs(delta).toFixed(1)}%</span>`;return `<tr><th>${escapeHtml(marketCropName(c))}</th><td><strong>${formatMoney(latest.ratePerQuintal)}</strong><small>${mr?'प्रति क्विंटल':'per quintal'}</small></td><td>${rateSparkline(history)}</td><td>${trend||`<span class="rate-trend-unavailable">${mr?'तुलनेसाठी मागील नोंद नाही':'No previous report'}</span>`}</td><td>${formatMoney(latest.minRate)} – ${formatMoney(latest.maxRate)}</td><td>${escapeHtml(latest.recordDate||'—')}<small>${escapeHtml(latest.sourceLabel==='OFFICIAL_FEED'?(mr?'अधिकृत feed':'Official feed'):(mr?'स्थानिक नोंद':'Reported'))}</small></td></tr>`;}).join('');host.innerHTML=`<section class="market-detail"><div class="market-detail-head"><div><span class="eyebrow">${mr?'बाजारभाव':'MARKET RATES'}</span><h3>${escapeHtml(m.name)}</h3><small>${escapeHtml([m.city,m.tehsil,m.district].filter(Boolean).map(marketLocalityName).join(' · '))}</small></div><button class="secondary-button" type="button" data-close-market>${mr?'बंद करा':'Close'}</button></div><div class="market-table-wrap"><table class="market-table"><thead><tr><th>${mr?'पीक':'Crop'}</th><th>${mr?'प्रचलित दर':'Modal price'}</th><th>${mr?'नोंदींचा कल':'Reported trend'}</th><th>${mr?'बदल':'Change'}</th><th>${mr?'किमान – कमाल':'Min – max'}</th><th>${mr?'तारीख / स्रोत':'Date / source'}</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;}
function renderMarketComparison(){const host=$('#marketCompare');if(!host)return;const mr=state.locale==='mr',selected=state.compareMarkets.map(i=>state.marketGroups[i]).filter(Boolean);if(!selected.length){host.innerHTML='';return;}const crops=[...new Set(selected.flatMap(m=>m.rates.map(r=>r.cropName)))];const head=selected.map(m=>`<th>${escapeHtml(m.name)}</th>`).join('');const rows=crops.map(c=>{const values=selected.map(m=>m.rates.find(r=>r.cropName===c));const best=Math.max(...values.filter(Boolean).map(r=>Number(r.ratePerQuintal)));return `<tr><th>${escapeHtml(marketCropName(c))}</th>${values.map(r=>`<td>${r?`<strong class="${Number(r.ratePerQuintal)===best?'compare-best':''}">${formatMoney(r.ratePerQuintal)}</strong><small>${escapeHtml(r.recordDate||'')}</small>`:'—'}</td>`).join('')}</tr>`;}).join('');host.innerHTML=`<section class="market-compare-panel"><div class="market-detail-head"><div><span class="eyebrow">${mr?'बाजार तुलना':'MARKET COMPARISON'}</span><h3>${mr?'तुलना यादी आणि सारांश':'Compare selected markets'}</h3><small>${mr?'प्रत्येक पिकासाठी सर्वाधिक नोंदवलेला प्रचलित दर ठळक':'Highest listed modal rate for each crop is highlighted'}</small></div><button class="secondary-button" type="button" data-clear-compare>${mr?'यादी रिकामी करा':'Clear list'}</button></div>${selected.length<2?`<p class="compare-hint">${mr?'तुलनेसाठी आणखी एक बाजार निवडा.':'Select one more market to compare.'}</p>`:`<div class="market-table-wrap"><table class="market-table"><thead><tr><th>${mr?'पीक':'Crop'}</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>`}</section>`;}
function handleMarketBrowserClick(e){const district=e.target.closest('[data-market-district]');if(district){state.activeMarketDistrict=district.dataset.marketDistrict;state.activeMarket=-1;renderMarketBrowser($('#marketRateSearch [name="city"]').value.trim());return;}const open=e.target.closest('[data-open-market]');if(open){state.activeMarket=Number(open.dataset.openMarket);renderMarketDetail();return;}if(e.target.closest('[data-close-market]')){state.activeMarket=-1;renderMarketDetail();return;}const box=e.target.closest('[data-compare-market]');if(box){const i=Number(box.dataset.compareMarket);if(box.checked){if(state.compareMarkets.length>=4){box.checked=false;toast(state.locale==='mr'?'एकावेळी जास्तीत जास्त ४ बाजार तुलना करा.':'Compare up to four markets at once.');return;}if(!state.compareMarkets.includes(i))state.compareMarkets.push(i);}else state.compareMarkets=state.compareMarkets.filter(x=>x!==i);renderMarketComparison();return;}if(e.target.closest('[data-clear-compare]')){state.compareMarkets=[];renderMarketBrowser($('#marketRateSearch [name="city"]').value.trim());}}
async function loadMarketTicker() {
  const host = $('#marketTicker');
  if (!host) return;
  try {
    let all = await api('/mandi-rates/live').catch(() => []);
    let demo = false;
    if (!Array.isArray(all) || !all.length) {
      const data = await api('/mandi-rates?page=0&size=100&sort=recordDate,desc');
      all = data.content || [];
      const reported = all.filter(rate => rate.sourceLabel !== 'DEMO');
      if (reported.length) all = reported;
      else { all = all.filter(rate => rate.sourceLabel === 'DEMO'); demo = all.length > 0; }
    }
    if (!all.length) { host.hidden = true; return; }
    const grouped = new Map();
    for (const rate of all) {
      const key = `${rate.cropName}|${rate.mandiName}|${rate.district || ''}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(rate);
    }
    const latest = [...grouped.values()].map(history => {
      history.sort((a, b) => String(b.recordDate).localeCompare(String(a.recordDate)));
      return { row: history[0], previous: history.find(rate => rate.recordDate !== history[0].recordDate) };
    }).sort((a, b) => String(b.row.recordDate).localeCompare(String(a.row.recordDate))).slice(0, 10);
    const mr = state.locale === 'mr';
    const items = latest.map(({ row: rate, previous }) => {
      const delta = previous && Number(previous.ratePerQuintal) ? (Number(rate.ratePerQuintal) - Number(previous.ratePerQuintal)) / Number(previous.ratePerQuintal) * 100 : null;
      const locality = rate.district || rate.city || rate.mandiName;
      return `<a class="market-ticker-item" href="#rates" data-market-name="${escapeHtml(rate.mandiName)}" data-market-location="${escapeHtml(locality)}" data-market-crop="${escapeHtml(rate.cropName)}" aria-label="${escapeHtml(marketCropName(rate.cropName))}, ${escapeHtml(marketLocalityName(locality))}, ${formatMoney(rate.ratePerQuintal)}. View market details"><span>${escapeHtml(marketCropName(rate.cropName))}</span><small>${escapeHtml(marketLocalityName(locality))}</small><strong>${formatMoney(rate.ratePerQuintal)}</strong>${delta === null ? '' : `<em class="${delta >= 0 ? 'up' : 'down'}">${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta).toFixed(1)}%</em>`}</a>`;
    }).join('');
    host.innerHTML = `<span class="market-ticker-label"><i></i><span>${mr ? 'बाजारभाव' : 'Mandi rates'}</span></span><div class="market-ticker-track">${items}</div>${demo ? `<span class="market-ticker-demo">${mr ? 'डेमो' : 'DEMO'}</span>` : ''}<button class="market-ticker-pause" type="button" aria-label="${mr ? 'दरांची हालचाल थांबवा' : 'Pause market rates'}" aria-pressed="false"><span aria-hidden="true">Ⅱ</span><span class="market-ticker-control-label">${mr ? 'थांबवा' : 'Pause'}</span></button><a class="market-ticker-all" href="#rates">${mr ? 'सर्व दर' : 'All rates'} <span aria-hidden="true">→</span></a>`;
    host.hidden = false;
  } catch { host.hidden = true; }
}async function loadWeather(city,point=null){const host=$('#weatherPanel'),mr=state.locale==='mr';if(!city&&!point){host.innerHTML=`<div><strong>${mr?'ठिकाण निवडल्यावर हवामान आपोआप दिसेल.':'Weather appears automatically after location access.'}</strong></div>`;return;}host.innerHTML=`<div class="weather-loading">${mr?'तुमच्या ठिकाणचे हवामान लोड होत आहे…':'Loading weather for your location…'}</div>`;try{let placeName=city|| (mr?'तुमच्या ठिकाणी':'Your location'),latitude,longitude;if(point){latitude=Number(point.latitude);longitude=Number(point.longitude);}else{const locQ=new URLSearchParams({name:`${city}, Maharashtra`,count:'5',language:mr?'mr':'en',countryCode:'IN'});const locResponse=await fetch(`https://geocoding-api.open-meteo.com/v1/search?${locQ}`);if(!locResponse.ok)throw new Error('Location lookup failed');const places=(await locResponse.json()).results||[];const place=places.find(p=>/maharashtra/i.test(p.admin1||''));if(!place)throw new Error(mr?'महाराष्ट्रातील शहर सापडले नाही.':'Maharashtra city not found.');latitude=place.latitude;longitude=place.longitude;placeName=place.name;}const q=new URLSearchParams({latitude:String(latitude),longitude:String(longitude),current:'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',daily:'temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code',forecast_days:'3',timezone:'auto'});const response=await fetch(`https://api.open-meteo.com/v1/forecast?${q}`);if(!response.ok)throw new Error('Weather forecast unavailable');const d=await response.json(),c=d.current,days=d.daily.time.map((date,i)=>`<div class="weather-day"><small>${escapeHtml(new Intl.DateTimeFormat(mr?'mr-IN':'en-IN',{weekday:'short',day:'numeric',month:'short'}).format(new Date(`${date}T12:00:00`)))}</small><strong>${Math.round(d.daily.temperature_2m_max[i])}° / ${Math.round(d.daily.temperature_2m_min[i])}°</strong><span>${mr?'पावसाची शक्यता':'Rain chance'} ${d.daily.precipitation_probability_max[i]??0}%</span></div>`).join('');host.innerHTML=`<div class="weather-current"><span class="weather-icon">${weatherIcon(c.weather_code)}</span><div><small>${mr?'सध्याचे हवामान':'CURRENT WEATHER'} · ${escapeHtml(placeName)}</small><h3>${Math.round(c.temperature_2m)}°C · ${weatherCondition(c.weather_code,mr)}</h3><p>${mr?'जाणवणारे':'Feels like'} ${Math.round(c.apparent_temperature)}° · ${mr?'आर्द्रता':'Humidity'} ${c.relative_humidity_2m}% · ${mr?'वारा':'Wind'} ${Math.round(c.wind_speed_10m)} km/h</p></div></div><div class="weather-forecast">${days}</div>`;}catch(e){host.innerHTML=`<div class="weather-error">${escapeHtml(e.message||'Weather unavailable')}</div>`;}}
function weatherIcon(c){if(c===0)return '☀️';if(c<=3)return '🌤️';if(c===45||c===48)return '🌫️';if(c>=51&&c<=82)return '🌧️';if(c>=95)return '⛈️';return '🌥️';}
function weatherCondition(c,mr){const en={0:'Clear sky',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Dense fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',80:'Showers',81:'Rain showers',82:'Heavy showers',95:'Thunderstorm'},ma={0:'स्वच्छ आकाश',1:'मुख्यतः स्वच्छ',2:'अंशतः ढगाळ',3:'ढगाळ',45:'धुके',48:'दाट धुके',51:'हलका रिमझिम पाऊस',53:'रिमझिम पाऊस',55:'जोरदार रिमझिम',61:'हलका पाऊस',63:'पाऊस',65:'जोरदार पाऊस',80:'पावसाच्या सरी',81:'सरी',82:'जोरदार सरी',95:'वादळी पाऊस'};return (mr?ma:en)[c]|| (mr?'हवामान बदलते':'Variable weather');}
async function loadSchemes() {
  const host=$('#schemeGrid'); if(!host)return;
  const marathi=state.locale==='mr';
  host.innerHTML=`<div class="empty-state">${marathi?'शासकीय योजना लोड होत आहेत…':'Loading government schemes…'}</div>`;
  try {
    const schemes=await api('/schemes');
    host.innerHTML=schemes.length?schemes.map(s=>{
      const title=marathi?(s.titleMr||s.title):s.title;
      const description=marathi?(s.descriptionMr||s.description):s.description;
      const eligibility=marathi?(s.eligibilityMr||s.eligibility):s.eligibility;
      return `<article class="scheme-card"><span class="eyebrow">${escapeHtml(marathi&&s.state==='Maharashtra'?'महाराष्ट्र':s.state||'Maharashtra')}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p><div class="scheme-eligibility"><b>${marathi?'पात्रता':'Eligibility'}</b><p>${escapeHtml(eligibility)}</p></div><a class="primary-button" href="${escapeHtml(s.officialUrl)}" target="_blank" rel="noopener noreferrer">${marathi?'अधिकृत तपशील पहा ↗':'Check official details ↗'}</a><small>${marathi?'सध्याचे नियम आणि तारखा अधिकृत शासकीय पोर्टलवर तपासा.':'Open the official government portal to verify current rules and dates.'}</small></article>`;
    }).join(''):`<div class="empty-state">${marathi?'सध्या कोणत्याही सक्रिय शासकीय योजना उपलब्ध नाहीत.':'No active government schemes are listed.'}</div>`;
  } catch(error){host.innerHTML=`<div class="empty-state">${marathi?'योजना लोड होऊ शकल्या नाहीत:':'Schemes could not load: '}${escapeHtml(error.message)}</div>`;}
}
const cropHelp = {
  SOYBEAN: [
    ['Yellow or spotted leaves', 'Check whether leaves have visible insects or spreading spots. Keep a sample and ask your local agriculture officer before spraying.'],
    ['Holes or caterpillars', 'Inspect the underside of leaves and pods. Remove a sample of the affected plant and ask about integrated pest management.'],
    ['Plants wilting', 'Check soil moisture and standing water. Separate affected plants and seek a local diagnosis.'],
  ],
  TOOR: [['Wilting plants', 'Check for waterlogging and root damage. Keep a plant sample for a local agriculture officer.'], ['Holes in pods', 'Inspect pods for larvae and ask a local adviser to identify the pest before treatment.']],
  WHEAT: [['Rust-like marks', 'Check whether orange or brown marks are spreading on the leaves. Get the crop diagnosed before spraying.'], ['Yellowing leaves', 'Check irrigation and recent weather; share a plant sample with a local agriculture officer.']],
  COTTON: [['Larvae in bolls', 'Inspect affected bolls and collect a sample. Ask a local officer about monitoring and integrated pest management.'], ['Leaf spots', 'Note how quickly spots spread and show affected leaves to an agriculture officer before treatment.']],
};

function renderCropHelp() {
  const crop = $('#doctorCrop').value;
  $('#symptomList').innerHTML = (cropHelp[crop] || []).map(([symptom], index) => `<button type="button" data-symptom="${index}">${escapeHtml(symptom)}</button>`).join('');
  $('#doctorAdvice').textContent = 'Choose a symptom to see general next steps.';
  translateVisibleText();
}

function persistCart() {
  localStorage.setItem('agroconnect.cart.v2', JSON.stringify(state.cart));
  renderCart();
  renderProducts();
}

function cartCount() { return state.cart.reduce((sum, item) => sum + item.quantity, 0); }
function cartSubtotal() { return state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }
function cartItemFor(productId) { return state.cart.find(item => item.id === productId); }

function renderProducts() {
  const productGrid = $('#productGrid');
  let list = [...state.products];
  if (state.user?.role === 'FARMER' && state.ownedShopIds.length) list = list.filter(product => !state.ownedShopIds.includes(product.shopId));
  if (state.category !== 'ALL') list = list.filter(product => product.category === state.category);
  if (state.search) {
    const query = state.search.toLocaleLowerCase();
    list = list.filter(product => `${product.name} ${product.category} ${product.shopName} ${product.description}`.toLocaleLowerCase().includes(query));
  }
  if (state.sort === 'price-asc') list.sort((a, b) => Number(a.price) - Number(b.price));
  if (state.sort === 'price-desc') list.sort((a, b) => Number(b.price) - Number(a.price));
  if (state.sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
  $('#resultCount').textContent = `${state.totalElements ?? list.length}${state.hasMore ? '+' : ''} products${state.category !== 'ALL' ? ` · ${categoryLabel(state.category)}` : ''}`;
  productGrid.innerHTML = list.map(product => {
    const quantity = cartItemFor(product.id)?.quantity || 0;
    const image = product.imageUrl || imageByCategory[product.category] || '';
    const imageMarkup = image
      ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(product.name)}" loading="lazy" onerror="this.remove();this.parentElement.insertAdjacentHTML('afterbegin','<span class=&quot;product-category-mark&quot; aria-hidden=&quot;true&quot;>🌱</span>')">`
      : '<span class="product-category-mark" aria-hidden="true">🌱</span>';
    return `<article class="product-card" data-product-id="${escapeHtml(product.id)}">
      <div class="product-image">${imageMarkup}<span class="qa-badge">${product.name.startsWith('QA ') || (product.shopName||'').includes('Demo Agency') ? 'DEMO LISTING' : 'FARM ESSENTIAL'}</span></div>
      <div class="product-info"><span class="product-store">${escapeHtml(product.shopName || 'Verified local centre')}</span>
      <h3>${escapeHtml(product.name)}</h3><p class="product-unit">${escapeHtml(categoryLabel(product.category))} · ${escapeHtml(product.unit)}</p>
      <div class="price-line"><strong class="product-price">${formatMoney(product.price)}</strong></div>
      <p class="stock-line">${product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Currently unavailable'}</p>
       ${quantity ? `<div class="quantity-control" aria-label="${quantity} in cart"><button type="button" data-cart-change="-1" data-id="${escapeHtml(product.id)}" aria-label="Remove one">−</button><span>${quantity} in cart</span><button type="button" data-cart-change="1" data-id="${escapeHtml(product.id)}" aria-label="Add one">+</button></div>` : product.stockQuantity < 1 ? `<button class="add-button request-stock-button" type="button" data-request-product="${escapeHtml(product.name)}">Request this product</button>` : `<button class="add-button" type="button" data-add="${escapeHtml(product.id)}">Add to cart <b>＋</b></button>`}
      </div></article>`;
  }).join('') || `<div class="empty-state">${state.search || state.category !== 'ALL' ? 'No products match your search. Try another name or category.' : 'No products are available yet. Please try again shortly.'}</div>`;
  $('#productRequestPrompt').hidden=!state.search||list.length>0;
  $('#productRequestOpen').dataset.requestName=state.search;
  $('#loadMore').hidden = !state.hasMore || !!state.search;
  translateVisibleText();
}

function addToCart(productId, delta = 1) {
  const product = state.allProducts.find(item => item.id === productId) || state.products.find(item => item.id === productId);
  if (!product) return;
  const existing = cartItemFor(productId);
  const quantity = (existing?.quantity || 0) + delta;
  if (quantity < 0) return;
  if (quantity === 0) state.cart = state.cart.filter(item => item.id !== productId);
  else if (existing) {
    if (quantity > product.stockQuantity) { toast(`Only ${product.stockQuantity} units are in stock.`); return; }
    existing.quantity = quantity;
  } else state.cart.push({ id: product.id, shopId: product.shopId, shopName: product.shopName, name: product.name, category: product.category, unit: product.unit, price: Number(product.price), imageUrl: product.imageUrl || imageByCategory[product.category], quantity: 1, stockQuantity: product.stockQuantity });
  persistCart();
  if (delta > 0) toast(`${product.name} added to your cart`);
}

function renderCart() {
  const count = cartCount();
  $('#cartCount').textContent = count;
  $('#mobileCartCount').textContent = count;
  $('#cartItemLabel').textContent = `(${count} ${count === 1 ? 'item' : 'items'})`;
  $('#mobileCartSummary').textContent = count ? `${count} item${count===1?'':'s'} · ${formatMoney(cartSubtotal())}` : 'Cart is empty';
  const content = $('#cartContents');
  if (!state.cart.length) {
    content.innerHTML = '<div class="cart-empty"><span>▱</span><b>Your cart is ready for a good harvest.</b><small>Browse farm essentials and add what you need.</small></div>';
    $('#cartFooter').innerHTML = '';
    translateVisibleText(); return;
  }
  content.innerHTML = state.cart.map(item => `<article class="cart-row"><img class="cart-thumb" src="${escapeHtml(item.imageUrl || '')}" alt="" onerror="this.style.visibility='hidden'"><div><h3>${escapeHtml(item.name)}</h3><small>${escapeHtml(item.unit)} · ${escapeHtml(item.shopName)}</small><br><button type="button" class="remove-item" data-remove="${escapeHtml(item.id)}">Remove</button></div><div class="cart-amount"><b>${formatMoney(item.price * item.quantity)}</b><div class="mini-qty"><button type="button" data-cart-change="-1" data-id="${escapeHtml(item.id)}" aria-label="Remove one">−</button><span>${item.quantity}</span><button type="button" data-cart-change="1" data-id="${escapeHtml(item.id)}" aria-label="Add one">+</button></div></div></article>`).join('');
  $('#cartFooter').innerHTML = `<div class="subtotal-line"><span>Subtotal</span><b>${formatMoney(cartSubtotal())}</b></div><div class="delivery-line"><span>Delivery</span><span>Calculated for your address</span></div><div class="total-line"><span>Total before delivery</span><b>${formatMoney(cartSubtotal())}</b></div><button class="primary-button" type="button" id="checkoutButton">Continue to delivery <span>→</span></button><p class="cart-note">Your delivery address and final total are confirmed at checkout.</p>`;
  translateVisibleText();
}

function showScrim() { $('#scrim').hidden = false; }
function hideScrimIfIdle() { if ($('#cartDrawer').hidden && $('#authPanel').hidden) $('#scrim').hidden = true; }
function openCart() { $('#cartDrawer').hidden = false; showScrim(); document.body.style.overflow = 'hidden'; renderCart(); $('#cartDrawer').querySelector('.close-button').focus(); }
function closeCart() { $('#cartDrawer').hidden = true; document.body.style.overflow = ''; hideScrimIfIdle(); $('#cartButton').focus(); }

function openCheckout() {
  if (!state.cart.length) { toast('Your cart is empty. Add a product to continue.'); return; }
  closeCart();
  $('#checkoutPanel').hidden = false;
  document.body.style.overflow = 'hidden';
  $('#checkoutError').hidden = true;
  $('#checkoutSuccess').hidden = true;
  $('#checkoutForm').hidden = false;
  $('#checkoutTitle').textContent = 'Delivery details';
  $('#checkoutSummary').hidden = false;
  renderCheckoutSummary();
  $('#checkoutPanel').scrollTop = 0;
  translateVisibleText();
  $('#customerName').focus({ preventScroll: true });
}

function closeCheckout() { $('#checkoutPanel').hidden = true; document.body.style.overflow = ''; $('#cartButton').focus(); }

function renderCheckoutSummary() {
  const groups = new Map();
  for (const item of state.cart) groups.set(item.shopId, (groups.get(item.shopId) || 0) + item.quantity);
  $('#checkoutSummary').innerHTML = `<h3>Order summary <span>(${cartCount()} items · ${groups.size} ${groups.size === 1 ? 'centre' : 'centres'})</span></h3><div class="summary-items">${state.cart.map(item => `<div class="summary-item"><img src="${escapeHtml(item.imageUrl || '')}" alt="" onerror="this.style.visibility='hidden'"><span>${escapeHtml(item.name)}<small>${item.quantity} × ${formatMoney(item.price)}</small></span><b>${formatMoney(item.price * item.quantity)}</b></div>`).join('')}</div><div class="summary-totals"><div><span>Items subtotal</span><b>${formatMoney(cartSubtotal())}</b></div><div><span>Delivery</span><span id="deliveryCharge">Enter PIN to check</span></div><div class="summary-grand"><span>Total</span><b>${formatMoney(cartSubtotal())}</b></div></div><button type="button" class="primary-button place-order" id="placeOrderButton">Place order <span>→</span></button><p class="summary-secure">⌑ Your address is used only to fulfil this order.</p>`;
  renderMobileSubmit();
}

function renderMobileSubmit() {
  $('#mobileCheckoutSubmit').innerHTML = `<button type="button" class="primary-button" data-place-order>Place order · ${formatMoney(cartSubtotal())} <span>→</span></button>`;
}

function validateCheckout() {
  const form = $('#checkoutForm');
  const isDelivery = new FormData(form).get('deliveryType') === 'DOORSTEP_DELIVERY';
  const fields = ['customerName', 'contactPhone', ...(isDelivery ? ['deliveryAddress', 'postalCode', 'deliveryCity', 'deliveryDistrict'] : [])];
  let firstInvalid = null;
  for (const name of fields) {
    const input = form.elements.namedItem(name);
    const group = input.closest('.field');
    group.classList.remove('invalid');
    group.querySelector('.field-error').textContent = '';
    const value = input.value.trim();
    let message = '';
    if (!value) message = 'This field is required.';
    else if (name === 'contactPhone' && !/^[6-9][0-9]{9}$/.test(value)) message = 'Enter a valid 10-digit Indian mobile number.';
    else if (name === 'postalCode' && !/^[0-9]{6}$/.test(value)) message = 'Enter a valid 6-digit PIN code.';
    if (message) {
      group.classList.add('invalid');
      group.querySelector('.field-error').textContent = message;
      firstInvalid ||= input;
    }
  }
  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  }
  return true;
}

async function submitOrder() {
  if (!validateCheckout()) { $('#checkoutError').hidden = true; return; }
  if (!state.cart.length) { $('#checkoutError').textContent = 'Your cart is empty.'; $('#checkoutError').hidden = false; return; }
  const form = new FormData($('#checkoutForm'));
  const groups = new Map();
  for (const item of state.cart) {
    if (!groups.has(item.shopId)) groups.set(item.shopId, []);
    groups.get(item.shopId).push({ productId: item.id, quantity: item.quantity });
  }
  const request = {
    customerName: form.get('customerName').trim(), contactPhone: form.get('contactPhone').trim(),
    deliveryType: form.get('deliveryType'), deliveryAddress: form.get('deliveryAddress').trim() || null,
    postalCode: form.get('postalCode').trim() || null, deliveryCity: form.get('deliveryCity').trim() || null,
    deliveryDistrict: form.get('deliveryDistrict').trim() || null, deliveryState: 'Maharashtra',
    deliveryLandmark: form.get('deliveryLandmark').trim() || null,
    shops: [...groups].map(([shopId, items]) => ({ shopId, items })),
  };
  $('#checkoutError').hidden = true;
  const button = $('#placeOrderButton');
  button.disabled = true;
  button.innerHTML = 'Placing order…';
  try {
    const authenticated = state.user?.role === 'FARMER' && !!state.token;
    const response = await api(authenticated ? '/checkout' : '/checkout/guest', { method: 'POST', body: JSON.stringify(request) });
    state.cart = [];
    persistCart();
    const orders = response.orders || [];
    if (response.guestAccessToken) localStorage.setItem('agroconnect.guestOrders', JSON.stringify({ token: response.guestAccessToken, orders: orders.map(order => order.id) }));
    $('#checkoutTitle').textContent = 'Order confirmed';
    $('#checkoutForm').hidden = true;
    $('#checkoutSummary').hidden = true;
    $('#checkoutSuccess').hidden = false;
    $('#checkoutSuccess').innerHTML = `<div class="success-mark">✓</div><span class="eyebrow" style="justify-content:center">ORDER RECEIVED</span><h3>Thank you, ${escapeHtml(request.customerName.split(/\s+/)[0])}.</h3><p>Your order${orders.length > 1 ? 's are' : ' is'} with ${orders.length} local ${orders.length === 1 ? 'centre' : 'centres'}. They will call <b>${escapeHtml(request.contactPhone)}</b> to confirm delivery details.</p>${orders.map(order => `<div class="success-order">Order <b>#${escapeHtml(order.id.slice(0, 8).toUpperCase())}</b> · ${escapeHtml(order.shopName)}<br><b>${formatMoney(order.totalAmount)}</b> · ${escapeHtml(order.status)}</div>`).join('')}${response.guestAccessToken ? `<p>Save this secure code to check order status later:<br><code style="font-size:8px;word-break:break-all">${escapeHtml(response.guestAccessToken)}</code></p>` : '<p>You can see this order in your शेतबंधू account.</p>'}<button class="primary-button" type="button" id="doneCheckout">Continue shopping <span>→</span></button>`;
    $('#checkoutProgress').hidden = true;
    $('#doneCheckout').addEventListener('click', closeCheckout, { once: true });
  } catch (error) {
    $('#checkoutError').textContent = error.message || 'We could not place that order. Please check your details and try again.';
    $('#checkoutError').hidden = false;
    $('#checkoutError').scrollIntoView({ behavior: 'smooth', block: 'center' });
    button.disabled = false;
    button.innerHTML = 'Place order <span>→</span>';
  }
}

function syncDeliveryMode() {
  const doorstep = $('#checkoutForm').elements.deliveryType.value === 'DOORSTEP_DELIVERY';
  $('#addressFields').hidden = !doorstep;
  $$('.choice-card').forEach(card => card.classList.toggle('selected', card.querySelector('input').checked));
  $$('#addressFields [required]').forEach(input => { input.required = doorstep; });
  $('#deliveryCharge').textContent = doorstep ? 'Confirmed before dispatch' : 'Free pickup';
}

function openAuth(mode = 'login') {
  closeCart();
  $('#authPanel').hidden = false;
  showScrim();
  document.body.style.overflow = 'hidden';
  setAuthMode(mode);
  $('#authPhone').focus();
}

function closeAuth() { $('#authPanel').hidden = true; document.body.style.overflow = ''; hideScrimIfIdle(); $('#accountButton').focus(); }

function setAuthMode(mode) {
  state.authMode = mode;
  const register = mode === 'register';
  const admin = mode === 'admin';
  $('#authTitle').textContent = admin ? 'Super Admin sign in' : register ? 'Create your account' : 'Sign in to शेतबंधू';
  $('.auth-subtitle').textContent = admin ? 'Restricted access for AgroConnect platform administrators.' : register ? 'Create an account to order or list products.' : 'Track orders and save your favourite products.';
  $('.auth-tabs').hidden = admin;
  $('#adminLoginMode').hidden = admin;
  $('#adminLoginBack').hidden = !admin;
  $('#adminRecoveryHint').hidden = true;
  $('#recoveryFlow').hidden = true;
  $('#emailVerificationFlow').hidden = true;
  $('#authForm').hidden = false;
  $('#authPhone').placeholder = admin ? '10-digit admin Access ID' : '10-digit mobile number';
  $('label[for="authPhone"]').firstChild.textContent = admin ? 'Access ID ' : 'Mobile number ';
  $('label[for="authPassword"]').firstChild.textContent = admin ? 'Private access token ' : 'Password ';
  $('#authPassword').placeholder = admin ? 'Paste the private token' : 'At least 5 characters';
  $('#authPassword').minLength = admin ? 32 : 5;
  $('.auth-role-field').hidden = admin;
  $('#authRoleLabel').textContent = register ? 'I am a' : 'Sign in as';
  $$('.auth-tabs button').forEach(button => button.classList.toggle('selected', button.dataset.authMode === mode));
  $$('.register-field').forEach(field => { field.hidden = !register; const input = field.querySelector('input,select'); if (input) input.required = register && input.name === 'fullName'; });
  $('#authSubmit').innerHTML = register ? 'Create account <span>→</span>' : admin ? 'Enter Admin panel <span>→</span>' : 'Continue <span>→</span>';
  $('#authError').hidden = true;
}

function showRecoveryFlow() {
  state.recoveryStep = 'request'; state.recoveryEmail = ''; state.recoveryToken = '';
  $('#authForm').hidden = true; $('.auth-tabs').hidden = true; $('#adminLoginMode').hidden = true; $('#adminLoginBack').hidden = true;
  $('#emailVerificationFlow').hidden = true;
  const panel = $('#recoveryFlow'); panel.hidden = false;
  panel.innerHTML = `<form id="recoveryRequestForm" class="portal-form"><p class="wide auth-legal">Enter only the email address verified on your शेतबंधू account. We’ll send a random 4-digit code that expires in 5 minutes.</p><label class="wide">Recovery email<input name="email" type="email" required maxlength="254" autocomplete="email"></label><div class="wide"><button class="primary-button" type="submit">Send recovery code</button></div><button class="guest-back wide" type="button" data-recovery-back>Back to sign in</button></form>`;
}

function showRecoveryCodeStep() {
  const panel = $('#recoveryFlow'); panel.hidden = false;
  panel.innerHTML = `<form id="recoveryCodeForm" class="portal-form"><p class="wide auth-legal">If the email is linked to an account, the 4-digit code has been sent. Check inbox and spam folders.</p><label class="wide">Email<input name="email" type="email" readonly value="${escapeHtml(state.recoveryEmail)}"></label><label class="wide">4-digit code<input name="code" inputmode="numeric" pattern="[0-9]{4}" minlength="4" maxlength="4" autocomplete="one-time-code" required></label><div class="wide"><button class="primary-button" type="submit">Verify code</button></div><button class="guest-back wide" type="button" data-resend-recovery>Resend code</button><button class="guest-back wide" type="button" data-recovery-back>Back to sign in</button></form>`;
}

function showRecoveryPasswordStep() {
  const panel = $('#recoveryFlow'); panel.hidden = false;
  panel.innerHTML = `<form id="recoveryPasswordForm" class="portal-form"><p class="wide auth-legal">Code accepted. Create a new password (at least 12 characters).</p><label class="wide">New password<input name="newPassword" type="password" minlength="12" maxlength="72" autocomplete="new-password" required></label><label class="wide">Confirm new password<input name="confirmPassword" type="password" minlength="12" maxlength="72" autocomplete="new-password" required></label><div class="wide"><button class="primary-button" type="submit">Change password</button></div></form>`;
}

function showEmailVerification(email = '', requestCode = false) {
  $('#authForm').hidden = true; $('.auth-tabs').hidden = true; $('#adminLoginMode').hidden = true; $('#adminLoginBack').hidden = true;
  $('#recoveryFlow').hidden = true;
  const panel = $('#emailVerificationFlow'); panel.hidden = false;
  panel.innerHTML = requestCode ? `<form id="emailVerificationRequestForm" class="portal-form"><p class="wide auth-legal">Add or update your recovery email. A 4-digit verification code will be sent to that address.</p><label class="wide">Recovery email<input name="email" type="email" value="${escapeHtml(email)}" maxlength="254" autocomplete="email" required></label><div class="wide"><button class="primary-button" type="submit">Send verification code</button></div><button class="guest-back wide" type="button" data-verify-back>Back</button></form>` : `<form id="emailVerificationForm" class="portal-form"><p class="wide auth-legal">Enter the 4-digit code sent to your email to enable password recovery.</p><label class="wide">Recovery email<input name="email" type="email" value="${escapeHtml(email)}" maxlength="254" autocomplete="email" required></label><label class="wide">4-digit code<input name="code" inputmode="numeric" pattern="[0-9]{4}" minlength="4" maxlength="4" autocomplete="one-time-code" required></label><div class="wide"><button class="primary-button" type="submit">Verify email</button></div><button class="guest-back wide" type="button" data-resend-email>Resend code</button><button class="guest-back wide" type="button" data-verify-back>Back</button></form>`;
}

async function establishSession(user) {
  state.token=user.accessToken;state.user={fullName:user.fullName,userId:user.userId,role:user.activeRole||user.role,roles:user.roles||[user.role],village:user.village,district:user.district,profilePhotoUrl:user.profilePhotoUrl||null};
  localStorage.setItem('agroconnect.token',state.token);localStorage.setItem('agroconnect.user',JSON.stringify(state.user));
  closeAuth();updateAccountIdentity();activateRoleView();toast(`${state.locale==='mr'?'नमस्कार':'Welcome'}, ${user.fullName.split(/\s+/)[0]}`);
}
async function loadProducts({ append = false } = {}) {
  try {
    const page = append ? state.nextPage : 0;
    const params = new URLSearchParams({ page: String(page), size: '20' });
    params.set('sort', ({ 'price-asc': 'price,asc', 'price-desc': 'price,desc', name: 'productName,asc', featured: 'productName,asc' })[state.sort]);
    if (state.search) params.set('q', state.search);
    if (state.category !== 'ALL') params.set('category', state.category);
    const data = await api(`/products?${params.toString()}`);
    state.products = append ? [...state.products, ...(data.content || [])] : data.content || [];
    state.allProducts = [...state.products];
    state.nextPage = page + 1;
    state.hasMore = !data.last;
    state.totalElements = data.totalElements;
    renderProducts();
  } catch (error) {
    $('#productGrid').innerHTML = `<div class="empty-state">Products couldn't load. ${escapeHtml(error.message)}<br><button type="button" class="secondary-button" id="retryProducts" style="margin-top:8px">Try again</button></div>`;
  }
}

async function loadShops(query) {
  const results = $('#shopResults');
  results.innerHTML = '<div class="empty-state">Searching verified centres…</div>';
  try {
    const list = await api(`/kendras/search?q=${encodeURIComponent(query)}`);
    state.locationName=query;state.serviceAreaResolvedFor='';state.serviceAreaDistrict='';localStorage.setItem('agroconnect.locationName',query);applyLocationLabel(query);$('#weatherCity').value=query;void loadWeather(query);$('#serviceVillage').value=query;
    if(state.serviceCoordinates)void loadNearbyCentres(state.serviceCoordinates);void searchLocalServices(null,list);
    results.innerHTML = list.map(shop => `<article class="shop-card"><h3>${escapeHtml(shop.shopName)} <span aria-label="Verified" style="color:#168a52">✓</span></h3><p>${escapeHtml(shop.address)} · Contact protected</p><span class="status-pill good">Verified centre</span></article>`).join('') || '<div class="empty-state">No verified centre found. Try a nearby area or PIN code.</div>';
  } catch (error) { results.innerHTML = `<div class="empty-state">${escapeHtml(error.message)}</div>`;void searchLocalServices(); }
}

function openAccount() {
  if (state.user) {
    const nextRole=(state.user.roles||[]).find(role=>role!==state.user.role);
    const switchButton=$('#accountSwitchRole');
    switchButton.hidden=!nextRole;
    switchButton.textContent=nextRole?`Switch to ${nextRole==='SHOP_OWNER'?'Kendra Owner':'Shetkari'} view`:'Role: Shetkari';
    $('#accountMenu').hidden=true;
    if($('#accountActivity').hidden)void renderAccountActivity('orders');else $('#accountActivity').hidden=true;
    return;
  }
  openAuth('login');
}

async function logout(message = null, allDevices=false, revoke=true) {
  const token=state.token;
  if(revoke && token) { try { await fetch(`/api/auth/${allDevices?'logout-all':'logout'}`,{method:'POST',headers:{Authorization:`Bearer ${token}`}}); } catch {} }
  state.token = ''; state.user = null; state.cart = []; state.ownedShopIds = [];
  ['agroconnect.token','agroconnect.user','agroconnect.cart.v2','agroconnect.guestOrders'].forEach(key => localStorage.removeItem(key));
  closeCheckout(); closeCart(); closeAuth();
  activateRoleView(); renderCart(); renderProducts(); $('#accountActivity').hidden=true;
  $('#accountButton').innerHTML = '<span class="user-icon">♙</span><span>Sign in</span>';
  $('#accountMenu').hidden=true;
  history.replaceState(null,'',`${location.pathname}${location.search}#home`);window.scrollTo({top:0,behavior:'smooth'});
  toast(message||(state.locale==='mr'?'लॉग आउट झाले. मुख्य पानावर परत जात आहोत.':'You have been logged out. Back to the main portal.'));
}

function activateRoleView() {
  const role=state.user?.role,owner=role==='SHOP_OWNER',admin=role==='SUPER_ADMIN';
  $('#customerApp').hidden=owner||admin;$('#accountActivity').hidden=owner||admin;
  $('.site-footer').hidden=owner||admin;$('.site-header').hidden=owner||admin;$('.mobile-bottom').hidden=owner||admin;
  $('#ownerApp').hidden=!owner;$('#adminApp').hidden=!admin;document.body.classList.toggle('portal-mode',owner||admin);updateAccountIdentity();
  if(owner)loadOwnerPanel();else if(admin)loadAdminPanel();else{if(state.user?.roles?.includes('SHOP_OWNER'))loadOwnedShops();}
}
async function loadOwnedShops() {
  try { state.ownedShopIds = (await api('/kendras/mine')).map(shop => shop.id); renderProducts(); }
  catch { state.ownedShopIds = []; }
}

function portalNav(tab) {
  state.ownerTab = tab;
  $$('[data-owner-tab]').forEach(button => button.classList.toggle('active', button.dataset.ownerTab === tab));
  $('#ownerPageTitle').textContent = ({ overview: 'Overview', products: 'Products & stock', orders: 'Orders', requests: 'Farmer requests', support: 'Help desk' })[tab];
  renderOwnerTab();
}

async function loadOwnerPanel() {
  $('#ownerName').textContent = state.user?.fullName || 'Kendra Owner';
  $('#ownerProfileName').textContent = state.user?.fullName || 'Account';
  $('#ownerProfileName').textContent = 'Log out';
  try {
    state.ownerShops = await api('/kendras/mine');
    state.ownedShopIds = state.ownerShops.map(shop => shop.id);
    const verified = state.ownerShops.some(shop => shop.verified);
    const rejected = state.ownerShops.some(shop => shop.verificationStatus === 'REJECTED');
    const banner = $('#ownerVerification');
    banner.hidden = false;
    banner.className = `verification-banner ${verified ? 'verified' : rejected ? 'rejected' : ''}`;
    banner.textContent = verified ? '✓ Your centre is verified. Product listings and order management are enabled.' : rejected ? 'Your last centre application was rejected. Review your details and submit a corrected application. Your Shetkari account remains available.' : '⏳ Verification pending. Your Shetkari account stays available; product publishing and orders unlock after admin approval.';
    $('#ownerShopName').textContent = state.ownerShops.map(shop => shop.shopName).join(', ') || 'Verification pending';
    renderOwnerTab();
  } catch (error) { $('#ownerContent').innerHTML = `<div class="empty-panel">Owner workspace unavailable: ${escapeHtml(error.message)}. Sign in again or switch to Shetkari view.</div>`; }
}

async function renderOwnerTab() {
  const root = $('#ownerContent');
  root.innerHTML = '<div class="empty-panel">Loading your centre data…</div>';
  try {
    const verified = (state.ownerShops || []).filter(shop => shop.verified);
    if (state.ownerTab === 'support') return await renderSupportMine(root, 'Owner / agency help desk');
    if (!verified.length) { root.innerHTML = `<div class="portal-card"><div class="portal-card-head"><div><h2>Apply as a Kendra or agency</h2><small>Your farmer account remains available while this application is reviewed. Business document is required.</small></div><button class="portal-btn secondary" data-switch-farmer>Switch to Shetkari view</button></div><form id="ownerApplicationForm" class="portal-form"><label>Business type<select name="businessType"><option value="KENDRA">Seva Kendra</option><option value="AGENCY">Agency</option></select></label><label>Centre / agency name<input name="shopName" required maxlength="140"></label><label>Owner phone<input name="contactNumber" required maxlength="20" value="${escapeHtml(state.user?.phoneNumber||'')}"></label><label>Licence number<input name="ownerLicenseNumber" required maxlength="100"></label><label>City / district<input name="city" required maxlength="100"></label><label>6-digit PIN code<input name="postalCode" inputmode="numeric" pattern="[0-9]{6}" required maxlength="6"></label><label class="wide">Full address<input name="address" required maxlength="300"></label><label>Business document URL<input name="documentUrl" type="url" required maxlength="1000" placeholder="Secure document link"></label><label>GST (optional)<input name="gstin" maxlength="15"></label><label>Centre photo URL (optional)<input name="photoUrl" type="url" maxlength="1000"></label><label>Services offered<input name="serviceSummary" maxlength="1000" placeholder="Seeds, fertilizer, crop advice"></label><div class="wide"><button class="portal-btn" type="submit">Submit for verification</button></div></form></div>`; return; }
    if (state.ownerTab === 'products') return await renderOwnerProducts(root);
    if (state.ownerTab === 'orders') return await renderOwnerOrders(root);
    if (state.ownerTab === 'requests') return await renderOwnerRequests(root);
    const [products, orders] = await Promise.all([api('/products/mine?page=0&size=100'), api('/orders?page=0&size=100')]);
    const items = products.content || [];
    const orderItems = orders.content || [];
    const sales = orderItems.filter(order => !['CANCELLED','PENDING'].includes(order.status)).reduce((sum,order)=>sum+Number(order.totalAmount||0),0);
    root.innerHTML = `<div class="portal-kpis"><article class="portal-kpi"><span class="kpi-icon">▤</span><strong>${items.length}</strong><small>Product listings</small></article><article class="portal-kpi"><span class="kpi-icon">▣</span><strong>${orderItems.length}</strong><small>Orders to manage</small></article><article class="portal-kpi"><span class="kpi-icon">₹</span><strong>${formatMoney(sales)}</strong><small>Confirmed sales value</small></article><article class="portal-kpi"><span class="kpi-icon">!</span><strong>${items.filter(p=>p.stockQuantity<6).length}</strong><small>Low stock alerts</small></article></div><div class="portal-card"><div class="portal-card-head"><h2>Recent orders</h2><button class="portal-btn secondary" data-owner-go="orders">View all</button></div>${ownerOrdersTable(orderItems.slice(0,6))}</div><div class="portal-card"><div class="portal-card-head"><h2>Low stock</h2><button class="portal-btn secondary" data-owner-go="products">Manage products</button></div>${ownerProductsTable(items.filter(p=>p.stockQuantity<6).slice(0,6))}</div>`;
  } catch (error) { root.innerHTML = `<div class="empty-panel">Could not load dashboard: ${escapeHtml(error.message)}</div>`; }
}

async function renderSupportMine(root, title='Customer help desk') {
  if(!state.user){root.innerHTML='<div class="portal-card"><h2>Help desk</h2><div class="empty-panel">Sign in to send a question to the शेतबंधू टीम.</div></div>';return;}
  root.innerHTML='<div class="empty-panel">Loading your help requests…</div>';
  try {
    const tickets=await api('/support/mine');
    root.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>${escapeHtml(title)}</h2><small>Your question is sent to the Super Admin desk.</small></div></div><form id="supportTicketForm" class="portal-form"><label>Subject<input name="subject" maxlength="120" required></label><label class="wide">Question / request<textarea name="message" rows="3" maxlength="2000" required></textarea></label><div class="wide"><button class="portal-btn">Send to Admin desk</button></div></form></div><div class="portal-card"><h2>Your help requests</h2>${tickets.length?tickets.map(t=>`<article class="request-card"><div><span class="status-pill ${t.status==='RESOLVED'?'good':''}">${escapeHtml(t.status)}</span><h3>${escapeHtml(t.subject)}</h3><p>${escapeHtml(t.message)}</p>${t.adminReply?`<div class="empty-panel"><b>Super Admin reply</b><br>${escapeHtml(t.adminReply)}</div>`:''}</div></article>`).join(''):'<div class="empty-panel">No requests sent yet.</div>'}</div>`;
  } catch(error){root.innerHTML=`<div class="empty-panel">Help desk unavailable: ${escapeHtml(error.message)}</div>`;}
}

async function renderAdminSupport() {
  const host=$('#adminContent');host.innerHTML='<div class="empty-panel">Loading support queue…</div>';
  try {
    const tickets=await api('/support/admin');
    host.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Super Admin help desk</h2><small>Customer, Seva Kendra owner and agency requests are routed here.</small></div><span class="status-pill">${tickets.filter(t=>t.status==='OPEN').length} OPEN</span></div>${tickets.length?tickets.map(t=>`<article class="portal-card"><div class="portal-card-head"><div><span class="status-pill ${t.status==='RESOLVED'?'good':''}">${escapeHtml(t.status)} · ${escapeHtml(t.requesterRole)}</span><h2>${escapeHtml(t.subject)}</h2><small>${escapeHtml(t.requesterName)} · ${new Date(t.createdAt).toLocaleString()}</small></div></div><p>${escapeHtml(t.message)}</p>${t.adminReply?`<p><b>Previous response:</b> ${escapeHtml(t.adminReply)}</p>`:''}<form class="admin-support-reply portal-form" data-ticket-id="${t.id}"><label>Reply<textarea name="message" rows="2" maxlength="2000" required>${escapeHtml(t.adminReply||'')}</textarea></label><label class="check-label"><input type="checkbox" name="resolved" ${t.status==='RESOLVED'?'checked':''}> Mark resolved</label><button class="portal-btn">Send reply</button></form></article>`).join(''):'<div class="empty-panel">No customer or owner requests yet.</div>'}</div>`;
  } catch(error){host.innerHTML=`<div class="empty-panel">Could not load help desk: ${escapeHtml(error.message)}</div>`;}
}

async function submitSupportTicket(form) {
  const data=new FormData(form);try{await api('/support',{method:'POST',body:JSON.stringify({subject:data.get('subject').trim(),message:data.get('message').trim()})});toast('Request sent to the Super Admin desk');await renderSupportMine(form.closest('#ownerContent')||$('#customerSupportPanel'),form.closest('#ownerContent')?'Owner / agency help desk':'Customer help desk');}catch(error){toast(error.message);}
}

async function replySupportTicket(form) {
  const data=new FormData(form);try{await api(`/support/admin/${form.dataset.ticketId}`,{method:'PATCH',body:JSON.stringify({message:data.get('message').trim(),resolved:data.get('resolved')==='on'})});toast('Reply sent');await renderAdminSupport();}catch(error){toast(error.message);}
}

function ownerProductsTable(products) {
  if (!products.length) return '<div class="empty-panel">No products need attention.</div>';
  return `<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Availability</th></tr></thead><tbody>${products.map(p=>`<tr><td><strong>${escapeHtml(p.name)}</strong></td><td>${formatMoney(p.price)} / ${escapeHtml(p.unit)}</td><td>${p.stockQuantity}<span class="status-pill ${p.stockQuantity>0?'good':''}">${p.stockQuantity<6?'Low stock':'In stock'}</span></td><td>${p.active?'Available':'Hidden'}</td></tr>`).join('')}</tbody></table></div>`;
}

function ownerOrdersTable(orders) {
  if (!orders.length) return '<div class="empty-panel">No orders yet. New customer orders will appear here.</div>';
  return `<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Update</th></tr></thead><tbody>${orders.map(o=>`<tr><td>#${escapeHtml(o.id.slice(0,8).toUpperCase())}</td><td><strong>${escapeHtml(o.customerName||'Customer')}</strong><br><small>Phone hidden for privacy</small></td><td>${(o.items||[]).map(i=>`${escapeHtml(i.productName)} × ${i.quantity}`).join('<br>')}</td><td>${formatMoney(o.totalAmount)}</td><td><span class="status-pill ${o.status==='DELIVERED'?'good':''}">${escapeHtml(o.status.replaceAll('_',' '))}</span></td><td>${o.status==='PENDING'?`<button class="portal-btn" data-order-status="CONFIRMED" data-order-id="${o.id}">Confirm</button>`:o.status==='CONFIRMED'?`<button class="portal-btn" data-order-status="PACKED" data-order-id="${o.id}">Mark packed</button>`:o.status==='PACKED'?`<button class="portal-btn" data-order-status="OUT_FOR_DELIVERY" data-order-id="${o.id}">Dispatch</button>`:o.status==='OUT_FOR_DELIVERY'?`<button class="portal-btn" data-order-status="DELIVERED" data-order-id="${o.id}">Delivered</button>`:'—'}</td></tr>`).join('')}</tbody></table></div>`;
}

async function renderOwnerProducts(root) {
  const result = await api('/products/mine?page=0&size=100');
  const products = result.content || [];
  state.ownerProducts = products;
  root.innerHTML = `<div class="portal-card"><div class="portal-card-head"><div><h2>Your catalogue</h2><small>Manage product availability, photos and stock for your verified centre.</small></div><button class="portal-btn" id="newOwnerProduct">＋ Add product</button></div><div id="ownerProductFormHost"></div><div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Actions</th><th>Photo</th><th>Product</th><th>Price</th><th>Stock</th><th>Live</th></tr></thead><tbody>${products.map(p=>`<tr><td><button class="portal-btn secondary" data-edit-product="${p.id}">Edit</button> <button class="portal-btn danger" data-toggle-product="${p.id}" data-active="${p.active}">${p.active?'Hide':'Show'}</button></td><td>${p.imageUrl?`<img src="${escapeHtml(p.imageUrl)}" alt="" style="width:42px;height:42px;object-fit:contain">`:'🌱'}</td><td><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.category)}</small></td><td>${formatMoney(p.price)} / ${escapeHtml(p.unit)}</td><td>${p.stockQuantity}${p.stockQuantity<6?' ⚠':''}</td><td>${p.active?'Available':'Hidden'}</td></tr>`).join('')}</tbody></table></div></div>`;
}

async function renderOwnerOrders(root) { const result=await api('/orders?page=0&size=100'); root.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Orders & fulfilment</h2><small>Only orders for your own centre are shown.</small></div></div>${ownerOrdersTable(result.content||[])}</div>`; }

async function renderOwnerRequests(root) { const requests=await api('/requests/owner'); const shops=(state.ownerShops||[]).filter(s=>s.verified); root.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Requests from nearby farmers</h2><small>Requests match your registered district; phone numbers stay private.</small></div></div>${requests.length?requests.map(r=>`<article class="request-card"><div>${r.imageUrl?`<img class="request-photo" src="${escapeHtml(r.imageUrl)}" alt="Requested product">`:''}<span class="status-pill">${escapeHtml(r.district)}</span><h3>${escapeHtml(r.productName)}</h3><p>${escapeHtml(r.quantityDescription)} · ${escapeHtml(r.village)}</p><small>Requested ${new Date(r.createdAt).toLocaleDateString()}</small></div><form class="portal-form owner-reply-form" data-request-id="${r.id}"><label>Your centre<select name="kendraId" required>${shops.map(s=>`<option value="${s.id}">${escapeHtml(s.shopName)}</option>`).join('')}</select></label><label>Availability<select name="available"><option value="true">Available</option><option value="false">Not available</option></select></label><label>Price (₹)<input name="price" type="number" min="0.01" step="0.01"></label><label>ETA<input name="eta" required maxlength="100" placeholder="e.g. Ready tomorrow"></label><label class="wide">Reply<input name="message" maxlength="500" placeholder="Any useful detail"></label><div class="wide"><button class="portal-btn">Send response</button></div></form><div class="request-replies">${(r.replies||[]).map(x=>`<p><b>${escapeHtml(x.kendraName)}</b> · ${x.available?'Available at '+formatMoney(x.price):'Unavailable'} · ${escapeHtml(x.eta)}</p>`).join('')}</div></article>`).join(''):'<div class="empty-panel">No open requests currently match your registered district.</div>'}</div>`; }

async function submitFarmerRequest(form){if(!state.user){openAuth('login');return;}if(!hasFarmerRole()){toast(state.locale==='mr'?'शेतकरी account आवश्यक आहे.':'A farmer account is required.');return;}const f=new FormData(form);try{let imageUrl=null;const photo=f.get('requestPhoto');if(photo?.size){const upload=new FormData();upload.append('file',photo);imageUrl=(await api('/media/images',{method:'POST',body:upload})).url;}await api('/requests',{method:'POST',body:JSON.stringify({productName:f.get('productName').trim(),quantityDescription:f.get('quantityDescription').trim(),village:f.get('village').trim(),district:f.get('district').trim(),postalCode:f.get('postalCode').trim()||null,imageUrl})});toast(state.locale==='mr'?'विनंती जवळच्या केंद्रांना पाठवली.':'Request sent to nearby centres.');form.reset();$('#productRequestFormHost').hidden=true;await renderAccountActivity('requests');}catch(e){toast(e.message);}}async function submitOwnerReply(form) { const f=new FormData(form); const available=f.get('available')==='true'; try { await api(`/requests/${form.dataset.requestId}/replies`,{method:'POST',body:JSON.stringify({kendraId:f.get('kendraId'),available,price:available?Number(f.get('price')):null,eta:f.get('eta').trim(),message:f.get('message').trim()||null})}); toast('Reply sent to farmer'); await renderOwnerRequests($('#ownerContent')); }catch(e){toast(e.message);} }
function requestProduct(productName=''){const host=$('#productRequestFormHost'),form=$('#farmerRequestForm');host.hidden=false;form.elements.productName.value=String(productName||'').trim();form.elements.village.value=state.user?.village||$('#serviceVillage').value||'';form.elements.district.value=state.user?.district||$('#serviceDistrict').value||'';host.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(()=>form.elements.quantityDescription.focus({preventScroll:true}),300);}

async function loadAdminPanel() {
  if(!$('#adminCommunityNav')){const nav=document.querySelector('.admin-sidebar .portal-nav');if(nav){const b=document.createElement('button');b.id='adminCommunityNav';b.dataset.adminTab='community';b.innerHTML='☷ <span>Community groups</span>';nav.append(b);}}
  if(!$('#adminQuickLogout')) { const b=document.createElement('button'); b.id='adminQuickLogout'; b.className='portal-btn secondary'; b.textContent='Log out'; $('.admin-app .portal-topbar').append(b); }
  try { const shops=await api('/admin/kendras/pending'); state.adminPendingShops=shops; $('#adminContent').innerHTML=`<div class="portal-kpis"><article class="portal-kpi"><span class="kpi-icon">⏳</span><strong>${shops.length}</strong><small>Businesses awaiting review</small></article><article class="portal-kpi"><span class="kpi-icon">✓</span><strong>Restricted</strong><small>Admin role active</small></article></div><div class="portal-card"><div class="portal-card-head"><h2>Kendra and agency verification queue</h2><span class="status-pill">PENDING REVIEW</span></div>${shops.length?`<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Business</th><th>Owner</th><th>Address / PIN</th><th>Documents</th><th>Review</th></tr></thead><tbody>${shops.map(s=>`<tr><td><strong>${escapeHtml(s.shopName)}</strong><br><small>${escapeHtml(s.businessType||'KENDRA')}</small></td><td>${escapeHtml(s.ownerName)}<br><small>${escapeHtml(s.ownerEmail||'No email')}</small></td><td>${escapeHtml(s.address)} · ${escapeHtml(s.postalCode||'')}</td><td>${s.documentUrl?`<a href="${escapeHtml(s.documentUrl)}" target="_blank" rel="noopener">View document</a>`:'<span class="status-pill">MISSING</span>'}<br>Licence: ${escapeHtml(s.ownerLicenseNumber||'Missing')}</td><td><button class="portal-btn" data-approve-shop="${s.id}">Approve</button> <button class="portal-btn danger" data-reject-shop="${s.id}">Reject</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-panel">No businesses are waiting for review.</div>'}</div>`; }
  catch(error) { $('#adminContent').innerHTML=`<div class="empty-panel">Admin access required: ${escapeHtml(error.message)}</div>`; }
}

async function submitOwnerApplication(form) {
  const data=new FormData(form);
  const request={shopName:data.get('shopName').trim(),contactNumber:data.get('contactNumber').trim(),ownerLicenseNumber:data.get('ownerLicenseNumber').trim()||null,city:data.get('city').trim(),address:data.get('address').trim(),gstin:data.get('gstin').trim()||null,photoUrl:data.get('photoUrl').trim()||null,latitude:null,longitude:null,businessType:data.get('businessType'),documentUrl:data.get('documentUrl').trim()||null,serviceSummary:data.get('serviceSummary').trim()||null,postalCode:data.get('postalCode').trim()};
  const button=form.querySelector('button[type="submit"]'); button.disabled=true;
  try { const image=await uploadImage(data.get('photoFile')); if(image)request.photoUrl=image; await api('/kendras',{method:'POST',body:JSON.stringify(request)}); toast('Application sent for admin review'); await loadOwnerPanel(); }
  catch(error) { toast(error.message); button.disabled=false; }
}

async function renderAdminCommunity(){const host=$('#adminContent');host.innerHTML='<div class="empty-panel">Loading farmer groups…</div>';try{const groups=await api('/community/admin/groups');host.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Farmer community moderation</h2><small>Review local groups and deactivate groups that violate community rules.</small></div><span class="status-pill good">${groups.length} ACTIVE</span></div>${groups.length?`<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Group</th><th>Locality</th><th>Created by</th><th>Members</th><th>Created</th><th>Moderation</th></tr></thead><tbody>${groups.map(g=>`<tr><td><strong>${escapeHtml(g.name)}</strong><br><small>${escapeHtml(g.description)}</small></td><td>${escapeHtml(g.locality||'—')}</td><td>${escapeHtml(g.createdByName)}</td><td>${g.memberCount}</td><td>${new Date(g.createdAt).toLocaleDateString()}</td><td><button class="portal-btn danger" data-moderate-group="${g.id}">Deactivate group</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-panel">No active groups.</div>'}</div>`;}catch(e){host.innerHTML=`<div class="empty-panel">Could not load community groups: ${escapeHtml(e.message)}</div>`;}}

async function renderAdminRates() {
  const host=$('#adminContent'); host.innerHTML='<div class="empty-panel">Loading rates…</div>';
  try { const page=await api('/mandi-rates?page=0&size=100&sort=recordDate,desc'); const rates=page.content||[]; host.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Mandi rates</h2><small>Only Super Admin can publish verified rate entries.</small></div></div><form id="adminRateForm" class="portal-form"><label>Crop<select name="cropName"><option>SOYBEAN</option><option>TOOR</option><option>WHEAT</option><option>COTTON</option><option>GRAM</option><option>MAIZE</option><option>ONION</option><option>JOWAR</option></select></label><label>Market / APMC<input name="mandiName" required maxlength="140"></label><label>District<input name="district" maxlength="100" required></label><label>Taluka / tehsil<input name="tehsil" maxlength="100"></label><label>City<input name="city" maxlength="100"></label><label>Record date<input name="recordDate" type="date" required value="${new Date().toISOString().slice(0,10)}"></label><label>Modal rate ₹/qtl<input name="ratePerQuintal" type="number" min="0" step="0.01" required></label><label>Minimum rate<input name="minRate" type="number" min="0" step="0.01" required></label><label>Maximum rate<input name="maxRate" type="number" min="0" step="0.01" required></label><label>Transport cost / qtl<input name="transportCostPerQtl" type="number" min="0" step="0.01" required value="0"></label><div class="wide"><button class="portal-btn">Publish market rate</button></div></form></div><div class="portal-card"><div class="portal-card-head"><h2>Published rates</h2><span class="status-pill good">${rates.length} RECORDS</span></div>${rates.length?`<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Crop</th><th>Market</th><th>City / taluka</th><th>District</th><th>Modal</th><th>Min—Max</th><th>Date</th><th></th></tr></thead><tbody>${rates.map(r=>`<tr><td>${r.cropName}</td><td><strong>${escapeHtml(r.mandiName)}</strong></td><td>${escapeHtml([r.city,r.tehsil].filter(Boolean).join(' / ')||'—')}</td><td>${escapeHtml(r.district||'—')}</td><td>${formatMoney(r.ratePerQuintal)}</td><td>${formatMoney(r.minRate)}—${formatMoney(r.maxRate)}</td><td>${r.recordDate}</td><td><button class="portal-btn danger" data-delete-rate="${r.id}">Remove</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-panel">No rate records are stored.</div>'}</div>`; }
  catch(error){host.innerHTML=`<div class="empty-panel">Could not load rates: ${escapeHtml(error.message)}</div>`;}
}
async function renderAdminAccounts(query = '') {
  const host = $('#adminContent');
  host.innerHTML = '<div class="empty-panel">Loading accounts…</div>';
  try {
    const params = new URLSearchParams({ page: '0', size: '50' });
    if (query.trim()) params.set('query', query.trim());
    const page = await api(`/admin/accounts?${params.toString()}`);
    const accounts = page.content || [];
    host.innerHTML = `<div class="portal-card"><div class="portal-card-head"><div><h2>Account management</h2><small>Search accounts, review roles, and suspend compromised or abusive accounts.</small></div><span class="status-pill good">${page.totalElements || 0} ACCOUNTS</span></div><form id="adminAccountSearchForm" class="admin-account-search"><input id="adminAccountQuery" name="query" value="${escapeHtml(query)}" maxlength="120" placeholder="Search name or mobile"><button class="portal-btn" type="submit">Search</button></form>${accounts.length ? `<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Name</th><th>Phone</th><th>Roles</th><th>Area</th><th>Status</th><th>Access</th></tr></thead><tbody>${accounts.map(account => { const protectedAccount = account.roles.includes('SUPER_ADMIN') || account.id === state.user?.userId; return `<tr><td><strong>${escapeHtml(account.fullName)}</strong></td><td>${escapeHtml(account.maskedPhone)}</td><td>${account.roles.map(role => `<span class="status-pill">${escapeHtml(role.replace('_', ' '))}</span>`).join(' ')}</td><td>${escapeHtml([account.village, account.district].filter(Boolean).join(', ') || '—')}</td><td><span class="status-pill ${account.accountEnabled ? 'good' : ''}">${account.accountEnabled ? 'ACTIVE' : 'SUSPENDED'}</span></td><td><button class="portal-btn ${account.accountEnabled ? 'danger' : 'secondary'}" data-account-status="${account.id}" data-enable="${!account.accountEnabled}" ${protectedAccount ? 'disabled title="Admin accounts cannot be changed here"' : ''}>${account.accountEnabled ? 'Suspend' : 'Restore'}</button></td></tr>`; }).join('')}</tbody></table></div>` : '<div class="empty-panel">No accounts match this search.</div>'}</div>`;
  } catch (error) {
    host.innerHTML = `<div class="empty-panel">Could not load accounts: ${escapeHtml(error.message)}</div>`;
  }
}

async function renderAdminBusinesses(city = '', type = '') {
  const host = $('#adminContent'); host.innerHTML = '<div class="empty-panel">Loading city-wise centre directory…</div>';
  try {
    const params = new URLSearchParams(); if (city.trim()) params.set('city', city.trim()); if (type) params.set('businessType', type);
    const shops = await api(`/admin/kendras?${params.toString()}`);
    const cities = [...new Set(shops.map(s => s.city).filter(Boolean))];
    host.innerHTML = `<div class="portal-card"><div class="portal-card-head"><div><h2>Kendra & agency directory</h2><small>All registered centres, grouped and sorted by Maharashtra city.</small></div><span class="status-pill good">${shops.length} BUSINESSES · ${cities.length} CITIES</span></div><form id="adminBusinessSearch" class="admin-account-search"><input name="city" value="${escapeHtml(city)}" maxlength="100" placeholder="Filter by city"><select name="type"><option value="">All businesses</option><option value="KENDRA" ${type==='KENDRA'?'selected':''}>Seva Kendra</option><option value="AGENCY" ${type==='AGENCY'?'selected':''}>Agency</option></select><button class="portal-btn">Search</button></form>${shops.length?`<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>City</th><th>Business</th><th>Owner</th><th>Type</th><th>PIN</th><th>Status</th></tr></thead><tbody>${shops.map(s=>`<tr><td><strong>${escapeHtml(s.city||'—')}</strong></td><td>${escapeHtml(s.shopName)}</td><td>${escapeHtml(s.ownerName)}</td><td>${escapeHtml(s.businessType||'KENDRA')}</td><td>${escapeHtml(s.postalCode||'—')}</td><td><span class="status-pill ${s.verificationStatus==='VERIFIED'?'good':''}">${escapeHtml(s.verificationStatus)}</span></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-panel">No businesses match this city or type.</div>'}</div>`;
  } catch (error) { host.innerHTML = `<div class="empty-panel">Could not load city directory: ${escapeHtml(error.message)}</div>`; }
}

async function renderAdminSchemes(){const host=$('#adminContent');host.innerHTML='<div class="empty-panel">Loading scheme records…</div>';try{const rows=await api('/admin/schemes');host.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Government scheme directory</h2><small>Keep summaries, eligibility guidance and official links current.</small></div></div><form id="adminSchemeForm" class="portal-form"><label>Scheme title (English)<input name="title" maxlength="180" required></label><label>योजनेचे नाव (मराठी)<input name="titleMr" maxlength="180" required></label><label>State<input name="state" value="Maharashtra" maxlength="100"></label><label class="wide">Description / benefits (English)<textarea name="description" maxlength="3000" required></textarea></label><label class="wide">तपशील / लाभ (मराठी)<textarea name="descriptionMr" maxlength="3000" required></textarea></label><label class="wide">Eligibility guidance (English)<textarea name="eligibility" maxlength="2000" required></textarea></label><label class="wide">पात्रता मार्गदर्शन (मराठी)<textarea name="eligibilityMr" maxlength="2000" required></textarea></label><label class="wide">Official HTTPS link<input name="officialUrl" type="url" pattern="https://.*" maxlength="1000" required></label><label class="check-label"><input name="active" type="checkbox" checked> Show to customers</label><div class="wide"><button class="portal-btn">Add scheme</button></div></form></div><div class="portal-card"><div class="portal-card-head"><h2>Published entries</h2><span class="status-pill">${rows.length}</span></div>${rows.length?`<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Scheme</th><th>State</th><th>Eligibility</th><th>Official link</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(s=>`<tr><td><strong>${escapeHtml(s.title)}</strong><br><small>${escapeHtml(s.description)}</small></td><td>${escapeHtml(s.state||'—')}</td><td>${escapeHtml(s.eligibility)}</td><td><a href="${escapeHtml(s.officialUrl)}" target="_blank" rel="noopener noreferrer">Official page ↗</a></td><td>${s.active?'Visible':'Hidden'}</td><td>${s.active?`<button class="portal-btn danger" data-hide-scheme="${s.id}">Hide</button>`:''}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-panel">No schemes have been added.</div>'}</div>`;}catch(e){host.innerHTML=`<div class="empty-panel">Could not load scheme records: ${escapeHtml(e.message)}</div>`;}}

async function renderSuperAdminManagement() {
  const host = $('#adminContent');
  host.innerHTML = '<div class="empty-panel">Loading Super Admin access…</div>';
  try {
    const admins = await api('/admin/accounts/super-admins');
    const accountOptions = admins.map(admin => `<option value="${admin.id}">${escapeHtml(admin.fullName)} · ${escapeHtml(admin.phoneNumber)}</option>`).join('');
    host.innerHTML = `<div class="portal-card"><div class="portal-card-head"><div><h2>Super Admin access</h2><small>Add a backup admin so access can be restored quickly.</small></div><span class="status-pill good">${admins.length} ADMINS</span></div><div class="empty-panel" style="text-align:left;margin-bottom:16px">Recovery: another Super Admin can update a colleague’s phone and password in a few minutes. If every admin is locked out, use a new phone, email and password in IntelliJ’s private ADMIN_PHONE, ADMIN_EMAIL and ADMIN_PASSWORD settings, then restart the backend.</div><form id="createSuperAdminForm" class="portal-form"><label>Full name<input name="fullName" required maxlength="120" autocomplete="name"></label><label>Mobile number<input name="phoneNumber" required maxlength="20" autocomplete="tel" placeholder="Use a number not registered yet"></label><label>Recovery email<input name="email" type="email" required maxlength="254" autocomplete="email"></label><label>Initial password<input name="password" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters"></label><label>Your password to confirm<input name="currentPassword" type="password" required minlength="10" maxlength="72" autocomplete="current-password"></label><div class="wide"><button class="portal-btn" type="submit">Add Super Admin</button></div></form></div><div class="portal-card"><div class="portal-card-head"><div><h2>Admin directory & recovery</h2><small>Phone and recovery email are visible to Super Admins.</small></div></div>${admins.length ? `<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Name</th><th>Phone</th><th>Email recovery</th><th>Status</th><th>Added</th></tr></thead><tbody>${admins.map(admin=>`<tr><td><strong>${escapeHtml(admin.fullName)}</strong></td><td>${escapeHtml(admin.phoneNumber)}</td><td>${escapeHtml(admin.email||'Not set')} · ${admin.emailVerified?'verified':'verify pending'}</td><td><span class="status-pill ${admin.accountEnabled?'good':''}">${admin.accountEnabled?'ACTIVE':'SUSPENDED'}</span></td><td>${new Date(admin.createdAt).toLocaleDateString()}</td></tr>`).join('')}</tbody></table></div><form id="resetSuperAdminForm" class="portal-form" style="margin-top:18px"><label>Admin to restore<select name="adminId" required>${accountOptions}</select></label><label>New phone number<input name="phoneNumber" required maxlength="20" autocomplete="tel"></label><label>New password<input name="newPassword" type="password" required minlength="12" maxlength="72" autocomplete="new-password" placeholder="At least 12 characters"></label><label>Your password to confirm<input name="currentPassword" type="password" required minlength="10" maxlength="72" autocomplete="current-password"></label><div class="wide"><button class="portal-btn secondary" type="submit">Restore Admin Access</button></div></form>` : '<div class="empty-panel">No Super Admin accounts were found.</div>'}</div>`;
  } catch (error) {
    host.innerHTML = `<div class="empty-panel">Could not load Super Admin access: ${escapeHtml(error.message)}</div>`;
  }
}

async function renderAdminProducts(query='') {
  const host=$('#adminContent'); host.innerHTML='<div class="empty-panel">Loading product listings…</div>';
  try {
    const params=new URLSearchParams({page:'0',size:'100'}); if(query.trim()) params.set('query',query.trim());
    const page=await api(`/admin/products?${params.toString()}`); const products=page.content||[];
    host.innerHTML=`<div class="portal-card"><div class="portal-card-head"><div><h2>Product review</h2><small>Review seller listings and remove fake or unsafe products from the marketplace.</small></div><span class="status-pill good">${page.totalElements||0} LISTINGS</span></div><form id="adminProductSearch" class="admin-account-search"><input name="query" value="${escapeHtml(query)}" maxlength="120" placeholder="Search product or centre"><button class="portal-btn">Search</button></form>${products.length?`<div class="portal-table-wrap"><table class="portal-table"><thead><tr><th>Product</th><th>Seller centre</th><th>Price</th><th>Status</th><th>Review action</th></tr></thead><tbody>${products.map(p=>`<tr><td>${p.imageUrl?`<img src="${escapeHtml(p.imageUrl)}" alt="" style="width:42px;height:42px;object-fit:cover;border-radius:8px;vertical-align:middle;margin-right:8px">`:''}<strong>${escapeHtml(p.productName)}</strong><br><small>${escapeHtml(p.category||'')}</small></td><td>${escapeHtml(p.shopName)}</td><td>${formatMoney(p.price)} / ${escapeHtml(p.unit)}</td><td><span class="status-pill ${p.active?'good':''}">${p.adminRemoved?'REMOVED':p.active?'LIVE':'HIDDEN BY OWNER'}</span>${p.moderationReason?`<small>${escapeHtml(p.moderationReason)}</small>`:''}</td><td><form class="admin-moderation-form" data-product-id="${p.id}"><input name="reason" required maxlength="500" placeholder="Review reason" value="${escapeHtml(p.moderationReason||'')}" style="max-width:170px"><button class="portal-btn ${p.adminRemoved?'secondary':'danger'}">${p.adminRemoved?'Restore':'Remove'}</button></form></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-panel">No products found.</div>'}</div>`;
  } catch(error) { host.innerHTML=`<div class="empty-panel">Could not load product listings: ${escapeHtml(error.message)}</div>`; }
}

async function moderateAdminProduct(form) {
  const id=form.dataset.productId, reason=new FormData(form).get('reason').trim(), button=form.querySelector('button');
  try {
    await api(`/admin/products/${id}/moderation`,{method:'PATCH',body:JSON.stringify({approved:button.textContent.trim()==='Restore',reason})});
    toast(button.textContent.trim()==='Restore'?'Product restored':'Product removed from marketplace');
    await renderAdminProducts($('#adminProductSearch input')?.value||'');
  } catch(error) { toast(error.message); }
}

async function submitSuperAdminCreate(form) {
  const data = new FormData(form);
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await api('/admin/accounts/super-admins', {method:'POST', body:JSON.stringify({fullName:data.get('fullName').trim(), phoneNumber:data.get('phoneNumber').trim(), email:data.get('email').trim(), password:data.get('password'), currentPassword:data.get('currentPassword')})});
    toast('Backup Super Admin added; recovery email verification sent');
    await renderSuperAdminManagement();
  } catch(error) { toast(error.message); button.disabled=false; }
}

async function submitSuperAdminReset(form) {
  const data = new FormData(form);
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await api(`/admin/accounts/super-admins/${encodeURIComponent(data.get('adminId'))}/credentials`, {method:'PATCH', body:JSON.stringify({currentPassword:data.get('currentPassword'), phoneNumber:data.get('phoneNumber').trim(), newPassword:data.get('newPassword')})});
    toast('Admin phone and password updated; previous sessions revoked');
    await renderSuperAdminManagement();
  } catch(error) { toast(error.message); button.disabled=false; }
}

async function updateAdminAccountStatus(id, enabled) {
  try {
    await api(`/admin/accounts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ accountEnabled: enabled }) });
    toast(enabled ? 'Account access restored' : 'Account suspended and sessions revoked');
    await renderAdminAccounts($('#adminAccountQuery')?.value || '');
  } catch (error) { toast(error.message); }
}
async function saveAdminRate(form) { const f=new FormData(form); const body={cropName:f.get('cropName'),mandiName:f.get('mandiName').trim(),district:f.get('district').trim(),tehsil:f.get('tehsil').trim()||null,city:f.get('city').trim()||null,recordDate:f.get('recordDate'),ratePerQuintal:Number(f.get('ratePerQuintal')),minRate:Number(f.get('minRate')),maxRate:Number(f.get('maxRate')),transportCostPerQtl:Number(f.get('transportCostPerQtl'))}; try{await api('/mandi-rates',{method:'POST',body:JSON.stringify(body)});toast('Market rate published');await renderAdminRates();}catch(error){toast(error.message);}}

function showOwnerProductForm(product=null) {
  const host=$('#ownerProductFormHost');
  const shops=(state.ownerShops||[]).filter(shop=>shop.verified);
  const selected=product?.shopId || shops[0]?.id || '';
  host.innerHTML=`<form class="portal-form" id="ownerProductForm" data-product-id="${product?.id||''}"><label class="wide">Centre<select name="shopId" required>${shops.map(shop=>`<option value="${shop.id}" ${shop.id===selected?'selected':''}>${escapeHtml(shop.shopName)}</option>`).join('')}</select></label><label>Product name<input name="name" required maxlength="140" value="${escapeHtml(product?.name||'')}"></label><label>Category<select name="category" required><option value="SEEDS" ${product?.category==='SEEDS'?'selected':''}>Seeds</option><option value="FERTILIZER" ${product?.category==='FERTILIZER'?'selected':''}>Fertilizer</option><option value="PESTICIDE" ${product?.category==='PESTICIDE'?'selected':''}>Crop care</option></select></label><label>Price (₹)<input name="price" type="number" min="0.01" step="0.01" required value="${product?.price||''}"></label><label>Unit<input name="unit" maxlength="20" required placeholder="1 kg / 500 ml" value="${escapeHtml(product?.unit||'')}"></label><label>Available stock<input name="stockQuantity" type="number" min="0" step="1" required value="${product?.stockQuantity??0}"></label><label class="wide">Attach product photo<input name="imageFile" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG or WebP · up to 5 MB. ${product?.imageUrl?'A current photo is already saved.':''}</small></label><label class="wide">Or paste photo URL<input name="imageUrl" type="url" maxlength="1000" value="${escapeHtml(product?.imageUrl||'')}"></label><label class="wide">Product details<textarea name="description" rows="3" maxlength="1000" placeholder="Brand, pack size, use, ingredients and safe handling">${escapeHtml(product?.description||'')}</textarea></label><div class="wide panel-actions"><button class="portal-btn" type="submit">${product?'Save changes':'Add listing'}</button><button class="portal-btn secondary" type="button" id="cancelProductForm">Cancel</button></div></form>`;
  $('#cancelProductForm').addEventListener('click',()=>{host.innerHTML='';});
}

function editOwnerProduct(id) { const item=(state.ownerProducts||[]).find(p=>p.id===id); if(item) showOwnerProductForm(item); }
async function saveOwnerProduct(form) {
  const f=new FormData(form), id=form.dataset.productId;
  const button=form.querySelector('[type="submit"]'); button.disabled=true;
  try { const imageUrl=await uploadImage(f.get('imageFile')); const body={shopId:f.get('shopId'),name:f.get('name').trim(),category:f.get('category'),description:f.get('description').trim(),price:Number(f.get('price')),unit:f.get('unit').trim(),stockQuantity:Number(f.get('stockQuantity')),active:id?(state.ownerProducts||[]).find(p=>p.id===id)?.active??true:true,imageUrl:imageUrl||f.get('imageUrl').trim()||((state.ownerProducts||[]).find(p=>p.id===id)?.imageUrl)||null,audioDescriptionUrl:null}; await api(id?`/products/${id}`:'/products',{method:id?'PUT':'POST',body:JSON.stringify(body)}); toast(id?'Product updated':'Product added'); await renderOwnerProducts($('#ownerContent')); } catch(error) { toast(error.message); button.disabled=false; }
}
async function toggleOwnerProduct(id,active) { const p=(state.ownerProducts||[]).find(item=>item.id===id); if(!p)return; try { await api(`/products/${id}`,{method:'PUT',body:JSON.stringify({...p,shopId:p.shopId,name:p.name,active:!active})}); toast(active?'Listing hidden':'Listing visible'); await renderOwnerProducts($('#ownerContent')); }catch(error){toast(error.message);} }
async function updateOrderStatus(id,status) { try { await api(`/orders/${id}/status`,{method:'PATCH',body:JSON.stringify({status})}); toast('Order status updated'); await renderOwnerTab(); } catch(error) { toast(error.message); } }
async function switchActiveRole(role) { try { const user=await api('/auth/active-role',{method:'POST',body:JSON.stringify({activeRole:role})}); state.token=user.accessToken; state.user={...state.user,role:user.activeRole||user.role,roles:user.roles}; localStorage.setItem('agroconnect.token',state.token); localStorage.setItem('agroconnect.user',JSON.stringify(state.user)); activateRoleView(); renderProducts(); } catch(error) { toast(error.message); } }
function openProductDetail(id) {
  const p=state.products.find(item=>item.id===id); if(!p)return;
  const image=p.imageUrl||imageByCategory[p.category]||'';
  const modal=$('#productDetailModal');
  modal.innerHTML=`<article class="product-detail-card"><button class="detail-close" type="button" aria-label="Close">×</button><img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}"><div class="product-detail-copy"><span class="eyebrow">${escapeHtml(p.shopName||'शेतबंधू केंद्र')}</span><h2>${escapeHtml(p.name)}</h2><p>${escapeHtml(p.description||'Quality farm input from a verified local centre.')}</p><strong>${formatMoney(p.price)} <small style="font-size:12px;font-weight:500">/ ${escapeHtml(p.unit)}</small></strong><p>${p.stockQuantity>0?`${p.stockQuantity} available · Delivery options shown at checkout`:'Currently unavailable'}</p><button class="primary-button" data-detail-add="${p.id}" ${p.stockQuantity<1?'disabled':''}>ADD TO CART ＋</button></div><section class="product-reviews"><h3>Customer reviews</h3><div id="productReviewList">Loading verified customer reviews…</div>${state.user?.role==='FARMER'?`<form id="productReviewForm" data-product-id="${p.id}" class="review-form"><label>Your rating<select name="rating"><option value="5">★★★★★ — Excellent</option><option value="4">★★★★ — Good</option><option value="3">★★★ — Okay</option><option value="2">★★ — Poor</option><option value="1">★ — Bad</option></select></label><label>Your review<textarea name="comment" maxlength="1200" required placeholder="Share your experience after delivery"></textarea></label><button class="portal-btn">Submit review</button><small>Only customers with a delivered order can post one review per product.</small></form>`:'<p class="rate-disclaimer">Sign in as a customer to write a review after delivery.</p>'}</section></article>`;
  modal.hidden=false; modal.querySelector('.detail-close').addEventListener('click',()=>modal.hidden=true); modal.addEventListener('click',event=>{if(event.target===modal)modal.hidden=true;},{once:true}); modal.querySelector('[data-detail-add]')?.addEventListener('click',()=>{addToCart(p.id);modal.hidden=true;},{once:true}); void loadProductReviews(p.id);
}

async function loadProductReviews(productId){const host=$('#productReviewList');try{const data=await api(`/products/${productId}/reviews`);host.innerHTML=`<strong>${data.averageRating||'0.0'} ★ · ${data.reviewCount||0} reviews</strong>${data.reviews?.length?data.reviews.map(r=>`<article class="review-item"><b>${escapeHtml(r.customerName)} · ${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</b><p>${escapeHtml(r.comment)}</p><small>${new Date(r.createdAt).toLocaleDateString()}</small></article>`).join(''):'<p>No customer reviews yet.</p>'}`;}catch(error){host.textContent=`Reviews unavailable: ${error.message}`;}}
async function submitProductReview(form){const f=new FormData(form),button=form.querySelector('button');button.disabled=true;try{await api(`/products/${form.dataset.productId}/reviews`,{method:'POST',body:JSON.stringify({rating:Number(f.get('rating')),comment:f.get('comment').trim()})});toast('Thank you. Your verified purchase review was added.');form.reset();await loadProductReviews(form.dataset.productId);}catch(error){toast(error.message);button.disabled=false;}}

function updateAccountIdentity(){
  const user=state.user;if(!user)return;const name=user.fullName||'Farmer';$('#accountName').textContent=name;$('#accountRoleLabel').textContent=state.locale==='mr'?'शेतकरी खाते':'Farmer account';$('#accountCenterName').textContent=name;$('#accountCenterAvatar').hidden=!!user.profilePhotoUrl;$('#accountCenterPhoto').src=user.profilePhotoUrl||'';$('#accountCenterPhoto').hidden=!user.profilePhotoUrl;
  const profilePreview=$('#profilePhotoPreview'),profileFallback=$('#profilePhotoFallback');if(profilePreview){profilePreview.src=user.profilePhotoUrl||'';profilePreview.hidden=!user.profilePhotoUrl;}if(profileFallback)profileFallback.hidden=!!user.profilePhotoUrl;
  const avatar=user.profilePhotoUrl?`<span class="user-icon profile-avatar"><img src="${escapeHtml(user.profilePhotoUrl)}" alt=""></span>`:'<span class="user-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="8" r="3.4"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/></svg></span>';
  $('#accountButton').innerHTML=`${avatar}<span>${escapeHtml(name.split(/\s+/)[0])}</span>`;$('#accountButton').setAttribute('aria-label',name);
  $('#ownerName').textContent=name;$('#ownerProfileName').textContent=name;const ownerAvatar=$('#ownerProfile .avatar.small');if(ownerAvatar)ownerAvatar.innerHTML=user.profilePhotoUrl?`<img src="${escapeHtml(user.profilePhotoUrl)}" alt="">`:'♙';
}
function hasFarmerRole(){return !!state.user&&(state.user.roles||[]).includes('FARMER');}
async function geocodeMaharashtra(name){const q=new URLSearchParams({name:`${name}, Maharashtra`,count:'5',language:state.locale==='mr'?'mr':'en',countryCode:'IN'});const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?${q}`);if(!r.ok)throw new Error('Location search failed');const items=(await r.json()).results||[];return items.find(x=>/maharashtra/i.test(x.admin1||''))||null;}
const demoServiceDistricts=['Ahilyanagar','Akola','Amravati','Beed','Bhandara','Buldhana','Chandrapur','Chhatrapati Sambhajinagar','Dharashiv','Dhule','Gadchiroli','Gondia','Hingoli','Jalgaon','Jalna','Kolhapur','Latur','Mumbai City','Mumbai Suburban','Nagpur','Nanded','Nandurbar','Nashik','Palghar','Parbhani','Pune','Raigad','Ratnagiri','Sangli','Satara','Sindhudurg','Solapur','Thane','Wardha','Washim','Yavatmal'];
const demoServiceImages=['/demo-tractor-amravati.svg','/demo-sprayer-akola.svg','/demo-rotavator-pune.svg','/demo-harvester-nashik.svg','/demo-tractor-latur.svg','/demo-tractor-nagpur.svg'];
function demoLocalServiceApi(district,type='ALL',location=''){
 const aliases={Murtizapur:'Akola',Akot:'Akola',Telhara:'Akola',Dhamangaon:'Amravati',Karanja:'Washim',Mehkar:'Buldhana',Shegaon:'Buldhana',Hinganghat:'Wardha',Katol:'Nagpur',Baramati:'Pune',Sinnar:'Nashik',Udgir:'Latur'};
 const clean=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
 let target=String(district||'').trim();if(!target){const match=Object.keys(aliases).find(key=>clean(location).includes(clean(key)));target=aliases[match]||demoServiceDistricts.find(name=>clean(location).includes(clean(name)))||'';}
 const selected=demoServiceDistricts.find(name=>clean(name)===clean(target))||'';if(!selected)return [];
 const rows=[];for(let i=0;i<2;i++){const equipment=i===0,slug=clean(selected);rows.push({id:`demo-${slug}-${equipment?'tractor':'spraying'}`,ownerId:null,ownerName:state.locale==='mr'?'डेमो पुरवठादार':'Demo provider (sample)',listingType:equipment?'EQUIPMENT':'SERVICE',category:equipment?'Tractor rental':'Crop spraying',title:equipment?`Demo tractor rental · ${selected}`:`Demo crop spraying · ${selected}`,description:equipment?'Illustrative equipment listing for preview. Confirm actual availability with a local farmer after the live service is available.':'Illustrative farm service listing for preview. Confirm actual availability with a local farmer after the live service is available.',imageUrl:demoServiceImages[(demoServiceDistricts.indexOf(selected)*2+i)%demoServiceImages.length],price:equipment?700:450,rateUnit:equipment?'PER_HOUR':'PER_ACRE',rateNotes:equipment?'Sample rate only':'Sample rate only; materials may be extra',village:state.locale==='mr'?'नमुना परिसर':'Sample area',taluka:state.locale==='mr'?'नमुना तालुका':'Sample taluka',district:selected,distanceInKm:-1,availability:state.locale==='mr'?'केवळ डेमो — प्रत्यक्ष उपलब्धता नाही':'DEMO ONLY — not a real availability',createdAt:new Date().toISOString(),demo:true});}
 return rows.filter(row=>type==='ALL'||row.listingType===type);
}
async function resolveServiceDistrict(location,locationRows=[]){if(state.serviceAreaResolvedFor===location&&state.serviceAreaDistrict)return state.serviceAreaDistrict;let district='';if(location){try{const place=await geocodeMaharashtra(location);district=place?.admin2||'';}catch{}}
 if(!district&&locationRows.length)district=locationRows.find(row=>row.city)?.city||'';if(!district)district=state.user?.district||'';state.serviceAreaResolvedFor=location;state.serviceAreaDistrict=district;const field=$('#serviceDistrict');if(field)field.value=district;return district;}
async function searchLocalServices(coords=null,locationRows=[]){
 const host=$('#localServiceResults'),form=$('#localServiceSearch'),location=String(state.locationName||state.user?.village||'').trim(),savedVillage=String($('#serviceVillage')?.value||'').trim();
 if(!location&&!savedVillage&&!coords&&!state.user?.district){host.innerHTML=`<p class="empty-state">${state.locale==='mr'?'वरच्या भागात एकदा ठिकाण निवडा; त्या जिल्ह्यातील listings आपोआप दिसतील.':'Select your location once above; listings for its district will appear here automatically.'}</p>`;updateServiceAreaLabel('');return;}
 host.innerHTML=`<p class="empty-state">${state.locale==='mr'?'तुमच्या जिल्ह्यातील उपकरणे आणि सेवा शोधत आहोत…':'Finding equipment and services in your district…'}</p>`;
 try{const district=await resolveServiceDistrict(location,locationRows),point=coords||state.serviceCoordinates;const q=new URLSearchParams({type:state.serviceFilter});if(district){q.set('district',district);state.serviceSearchScope='district';}else if(point){q.set('latitude',point.latitude);q.set('longitude',point.longitude);state.serviceSearchScope='radius';}else if(location||savedVillage){q.set('village',location||savedVillage);state.serviceSearchScope='locality';}else{state.serviceSearchScope='district';}
   const rows=await api(`/local-services?${q}`);if(Array.isArray(rows)&&rows.length){state.serviceResults=rows;state.serviceResultsAreDemo=rows.every(isDemoLocalService);state.serviceApiError='';renderLocalServiceCards(rows);updateServiceAreaLabel(district||location);return;}
   const samples=demoLocalServiceApi(district,state.serviceFilter,location||savedVillage);state.serviceResults=samples;state.serviceResultsAreDemo=samples.length>0;state.serviceApiError='';renderLocalServiceCards(samples);updateServiceAreaLabel(district||location);
 }catch(e){const district=state.serviceAreaDistrict||state.user?.district||'',samples=demoLocalServiceApi(district,state.serviceFilter,location||savedVillage);state.serviceResults=samples;state.serviceResultsAreDemo=samples.length>0;state.serviceApiError=e.message||'API unavailable';state.serviceSearchScope=district?'district':(coords||state.serviceCoordinates?'radius':'locality');renderLocalServiceCards(samples);updateServiceAreaLabel(district||location);}
}
function updateServiceAreaLabel(area){const label=$('#serviceAreaLabel'),hint=$('#serviceAreaHint'),mr=state.locale==='mr';if(label)label.textContent=area?(state.serviceSearchScope==='district'?(mr?`${area} जिल्ह्यातील सर्व listings`:`All listings in ${area} district`):`${mr?'जवळ':'Near'} ${area}`):(mr?'ठिकाण निवडा':'Select your location above');if(hint)hint.textContent=area?(state.serviceResultsAreDemo?(state.serviceApiError?(mr?'सेवा API अडचणीत आहे; खालील नोंदी demo नमुने आहेत.':'Service API is unavailable; the listings below are demo samples.'):(mr?'प्रत्यक्ष शेतकरी listing उपलब्ध नसल्यामुळे demo नमुने दाखवले आहेत.':'Demo samples are shown until farmers post real listings in this district.')):(mr?'ठिकाण बदलण्यासाठी वरची location निवडा.':'Change the location once above to update these listings.')):(mr?'Header मधून किंवा केंद्र शोधातून ठिकाण निवडा; इथे पुन्हा विचारले जाणार नाही.':'Choose it in the header or centre search; it won’t be requested again here.');}
function applyLocationLabel(name){const label=$('#locationLabel');if(label)label.textContent=name||'Select your location';updateServiceAreaLabel(state.serviceAreaDistrict||name||'');}
async function loadNearbyCentres(point){
 if(!point)return;
 const host=$('#shopResults');
 host.innerHTML='<div class="empty-state">Finding verified centres near your location…</div>';
 try{
  const rows=await api(`/kendras/nearby?latitude=${encodeURIComponent(point.latitude)}&longitude=${encodeURIComponent(point.longitude)}&radiusKm=10`);
  host.innerHTML=rows.length?rows.map(s=>`<article class="shop-card"><h3>${escapeHtml(s.shopName)} <span aria-label="Verified" style="color:#168a52">✓</span></h3><p>${escapeHtml(s.address||s.city||'')} · ${Number(s.distanceInKm).toFixed(1)} km away · Contact protected</p><span class="status-pill good">Verified centre</span></article>`).join(''):'<div class="empty-state">No verified centres found within 10 km of your current location.</div>';
  const knownLocality=state.locationName||state.user?.village||$('#serviceVillage')?.value?.trim()||'';
  if(!knownLocality){
   const nearest=rows.find(row=>row.city)?.city||rows.find(row=>row.district)?.district;
    if(nearest){
    const city=marketLocalityName(nearest),label=`${state.locale==='mr'?'जवळ':'Near'} ${city}`;
    applyLocationLabel(label);$('#weatherCity').value=nearest;void loadWeather(nearest);
   }else applyLocationLabel(state.locale==='mr'?'तुमचे ठिकाण':'Your location');
  }
 }catch(error){
  host.innerHTML=`<div class="empty-state">${escapeHtml(error.message)}</div>`;
  if(!(state.locationName||state.user?.village||$('#serviceVillage')?.value?.trim()))applyLocationLabel(state.locale==='mr'?'माझे ठिकाण':'My location');
 }
}
function applyDetectedLocation(point){
 state.serviceCoordinates=point;sessionStorage.setItem('agroconnect.location',JSON.stringify(point));
 const locality=state.user?.village||$('#serviceVillage')?.value?.trim()||'';
 if(locality){state.locationName=locality;localStorage.setItem('agroconnect.locationName',locality);$('#weatherCity').value=locality;applyLocationLabel(locality);}
 else applyLocationLabel(state.locale==='mr'?'तुमचे ठिकाण शोधत आहे…':'Finding your location…');
 // Use the permitted coordinates immediately for our own nearby-centre and service APIs.
 void loadNearbyCentres(point);void searchLocalServices(point);
 if(locality)void loadWeather(locality);
}function isDemoLocalService(row){return !!row.demo||/demo listing for local testing|illustrative .* listing/i.test(String(row.description||''))||/demo service provider/i.test(String(row.ownerName||''));}
function renderLocalServiceCards(rows){const host=$('#localServiceResults'),mr=state.locale==='mr';if(!rows.length){const reason=state.serviceApiError?(mr?'प्रत्यक्ष listings लोड होत नाहीत आणि या जिल्ह्यासाठी demo नमुनेही उपलब्ध नाहीत.':'Live listings could not load, and no demo samples are available for this district.'):mr?'या भागात अजून कोणत्याही शेतकऱ्याने listing केलेली नाही.':'No farmer listings are available in this area yet.';host.innerHTML=`<p class="empty-state">${reason}${state.serviceApiError?`<br><small>${escapeHtml(state.serviceApiError)}</small>`:''}</p>`;return;}const banner=state.serviceResultsAreDemo?`<p class="service-demo-note"><b>DEMO LISTINGS</b> ${state.serviceApiError?(mr?'प्रत्यक्ष सेवा API उपलब्ध नाही. खालील नमुने काल्पनिक आहेत.':'Live service API is unavailable. The sample listings below are fictional.'):(mr?'या जिल्ह्यात प्रत्यक्ष शेतकरी listing नसल्यामुळे नमुने दाखवत आहोत.':'No farmer listings are available yet, so illustrative samples are shown.')}${state.serviceApiError?` <small>(${escapeHtml(state.serviceApiError)})</small>`:''}</p>`:state.serviceSearchScope==='district'?`<p class="service-radius-note">${mr?`${escapeHtml(state.serviceAreaDistrict)} जिल्ह्यातील सर्व प्रत्यक्ष शेतकरी listings.`:`Farmer-posted listings across ${escapeHtml(state.serviceAreaDistrict)} district.`}</p>`:'';host.innerHTML=`${banner}<div class="local-service-grid">${rows.map(r=>{const demo=isDemoLocalService(r);return `<article class="local-service-card ${demo?'demo-listing-card':''}"><div class="demo-listing-badge" ${demo?'':'hidden'}>DEMO</div><img src="${escapeHtml(r.imageUrl)}" alt="${escapeHtml(r.title)}" loading="lazy"><div class="local-service-card-body"><span class="status-pill">${r.listingType==='EQUIPMENT'?(mr?'यंत्र भाडे':'EQUIPMENT RENTAL'):(mr?'शेती सेवा':'FARM SERVICE')} · ${escapeHtml(r.category)}</span><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml(r.description)}</p><strong>${formatMoney(r.price)} <small>${rateUnitLabel(r.rateUnit,mr)}</small></strong><div class="local-service-location"><b>${escapeHtml(r.ownerName)}</b><span>${escapeHtml([r.village,r.taluka,r.district].filter(Boolean).join(', '))}${r.distanceInKm>=0?` · ${Number(r.distanceInKm).toFixed(1)} km`:''}</span><small>${mr?'उपलब्धता: ':'Availability: '}${escapeHtml(r.availability)}</small>${r.rateNotes?`<small>${escapeHtml(r.rateNotes)}</small>`:''}</div>${demo?`<button type="button" class="secondary-button" data-demo-listing>${mr?'नमुना यादी':'Demo listing · view only'}</button>`:`<button type="button" class="primary-button" data-service-contact="${r.id}">${mr?'वेबसाइटवर संपर्क करा':'Contact through website'}</button>`}</div></article>`;}).join('')}</div>`;}
function rateUnitLabel(u,mr){return ({PER_ACRE:mr?'प्रति एकर':'per acre',PER_HOUR:mr?'प्रति तास':'per hour',PER_DAY:mr?'प्रति दिवस':'per day',PER_TRIP:mr?'प्रति फेरी':'per trip'})[u]||u;}
function renderLocalServiceListingForm(){if(!hasFarmerRole()){openAuth('login');return;}const host=$('#localServiceFormHost');host.innerHTML=`<form id="localServiceListingForm" class="portal-form local-listing-form"><div class="portal-card-head wide"><div><h3>${state.locale==='mr'?'यंत्र किंवा सेवा नोंदवा':'List equipment or a farm service'}</h3><small>${state.locale==='mr'?'प्रत्येक listing साठी स्पष्ट फोटो, गाव आणि दर आवश्यक आहेत.':'A clear photo, village and rate are required for every listing.'}</small></div><button type="button" class="secondary-button" data-close-listing>×</button></div><label>${state.locale==='mr'?'प्रकार':'Listing type'}<select name="listingType" required><option value="EQUIPMENT">${state.locale==='mr'?'यंत्र भाडे':'Equipment rental'}</option><option value="SERVICE">${state.locale==='mr'?'शेती सेवा':'Farm service'}</option></select></label><label>${state.locale==='mr'?'प्रकार/वर्ग':'Category'}<input name="category" required maxlength="50" placeholder="${state.locale==='mr'?'उदा. ट्रॅक्टर, फवारणी':'e.g. Tractor, spraying'}"></label><label>${state.locale==='mr'?'यंत्र/सेवेचे नाव':'Equipment or service name'}<input name="title" required maxlength="160"></label><label>${state.locale==='mr'?'दर':'Rate'}<input name="price" type="number" min="0.01" step="0.01" required></label><label class="wide">${state.locale==='mr'?'तपशील':'Details'}<textarea name="description" maxlength="2000" required></textarea></label><label>${state.locale==='mr'?'दर कसा मोजाल?':'Rate unit'}<select name="rateUnit"><option value="PER_ACRE">${state.locale==='mr'?'प्रति एकर':'Per acre'}</option><option value="PER_HOUR">${state.locale==='mr'?'प्रति तास':'Per hour'}</option><option value="PER_DAY">${state.locale==='mr'?'प्रति दिवस':'Per day'}</option><option value="PER_TRIP">${state.locale==='mr'?'प्रति फेरी':'Per trip'}</option></select></label><label>${state.locale==='mr'?'दराच्या अटी':'Rate notes'}<input name="rateNotes" maxlength="500" placeholder="${state.locale==='mr'?'डिझेल/चालक/ने-आण समाविष्ट?':'Fuel, operator or travel included?'}"></label><label class="wide">${state.locale==='mr'?'यंत्र/कामाचा स्पष्ट फोटो (अनिवार्य)':'Clear equipment/service photo (required)'}<input name="image" type="file" accept="image/jpeg,image/png,image/webp" required></label><label>${state.locale==='mr'?'गाव':'Village'}<input name="village" maxlength="120" required value="${escapeHtml(state.user?.village||$('#serviceVillage')?.value||state.locationName||'')}"></label><label>${state.locale==='mr'?'तालुका':'Taluka'}<input name="taluka" maxlength="120" required></label><label>${state.locale==='mr'?'जिल्हा':'District'}<input name="district" maxlength="120" required value="${escapeHtml(state.user?.district||state.serviceAreaDistrict||$('#serviceDistrict')?.value||'')}"></label><label class="wide">${state.locale==='mr'?'उपलब्ध दिवस/वेळ':'Availability'}<input name="availability" maxlength="500" required placeholder="${state.locale==='mr'?'उदा. सोमवार-शनिवार':'e.g. Monday to Saturday'}"></label><div class="wide listing-location-status" id="listingLocationStatus">${state.serviceCoordinates?(state.locale==='mr'?'वापरकर्त्याने परवानगी दिलेले ठिकाण वापरले जाईल.':'Your permitted location will be used.'):(state.locale==='mr'?'२५ किमी शोधासाठी ठिकाण परवानगी द्या.':'Allow location access to place this listing on the 25 km map.')}</div><div class="wide form-actions"><button type="button" class="secondary-button" data-use-listing-location>${state.locale==='mr'?'माझं ठिकाण वापरा':'Use my location'}</button><button class="primary-button" type="submit">${state.locale==='mr'?'Listing प्रकाशित करा':'Publish listing'}</button></div></form>`;}
async function captureServiceLocation(onSuccess){if(!navigator.geolocation){toast(state.locale==='mr'?'या browser मध्ये location उपलब्ध नाही.':'Location is unavailable in this browser. City search is optional.');return;}applyLocationLabel(state.locale==='mr'?'ठिकाण मिळवत आहे…':'Finding your location…');navigator.geolocation.getCurrentPosition(pos=>{const point={latitude:pos.coords.latitude,longitude:pos.coords.longitude};state.locationName='';state.serviceAreaDistrict='';state.serviceAreaResolvedFor='';localStorage.removeItem('agroconnect.locationName');applyDetectedLocation(point);if(onSuccess)onSuccess(point);},error=>{const denied=error?.code===error.PERMISSION_DENIED;applyLocationLabel(state.locale==='mr'?'ठिकाण निवडा':'Select your location');toast(denied?(state.locale==='mr'?'जवळची केंद्रे आपोआप दाखवण्यासाठी browser location परवानगी द्या. शहर शोधणे ऐच्छिक आहे.':'Allow browser location to show nearby centres automatically. City search is optional.'):(state.locale==='mr'?'तुमचे ठिकाण मिळाले नाही. पुन्हा प्रयत्न करा.':'Could not get your location. Please try again.'));},{enableHighAccuracy:false,timeout:15000,maximumAge:300000});}
async function submitLocalServiceListing(form){if(!hasFarmerRole()){openAuth('login');return;}const f=new FormData(form),host=$('#localServiceFormHost');if(!state.serviceCoordinates){toast(state.locale==='mr'?'२५ किमी शोधासाठी आधी location द्या.':'Use your location before publishing a radius listing.');return;}try{const imageForm=new FormData();imageForm.append('file',f.get('image'));const uploaded=await api('/media/images',{method:'POST',body:imageForm});const body={listingType:f.get('listingType'),category:f.get('category').trim(),title:f.get('title').trim(),description:f.get('description').trim(),imageUrl:uploaded.url,price:Number(f.get('price')),rateUnit:f.get('rateUnit'),rateNotes:f.get('rateNotes').trim()||null,village:f.get('village').trim(),taluka:f.get('taluka').trim(),district:f.get('district').trim(),latitude:state.serviceCoordinates.latitude,longitude:state.serviceCoordinates.longitude,availability:f.get('availability').trim()};await api('/local-services',{method:'POST',body:JSON.stringify(body)});toast(state.locale==='mr'?'तुमची listing प्रकाशित झाली.':'Your listing is live.');host.innerHTML='';await loadMyListings();}catch(e){toast(e.message);}}
async function loadMyListings(){const host=$('#accountActivityPanel');try{const rows=await api('/local-services/mine');state.myLocalListings=rows;if(state.activityTab!=='listings'||!host)return;host.innerHTML=`<div class="activity-list">${rows.length?rows.map(r=>`<article class="activity-card"><img src="${escapeHtml(r.imageUrl)}" alt=""><div><h3>${escapeHtml(r.title)}</h3><p>${escapeHtml([r.village,r.taluka,r.district].join(', '))}</p><strong>${formatMoney(r.price)} / ${rateUnitLabel(r.rateUnit,state.locale==='mr')}</strong><small>${escapeHtml(r.availability)}</small></div><div class="listing-actions"><button type="button" class="secondary-button" data-edit-listing="${r.id}">Edit</button><button type="button" class="text-button danger-text" data-remove-listing="${r.id}">${state.locale==='mr'?'काढून टाका':'Remove listing'}</button></div></article>`).join(''):`<p class="empty-panel">${state.locale==='mr'?'तुमची listing अजून नाही. यंत्र किंवा सेवा नोंदवण्यासाठी खालील बटण दाबा.':'You have not listed equipment or services yet. Add a listing below.'}</p>`}<button class="primary-button" id="activityAddListing" type="button">${state.locale==='mr'?'यंत्र/सेवा जोडा':'Add equipment or service'}</button></div>`;}catch(e){if(host)host.innerHTML=`<div class="account-load-error"><strong>${state.locale==='mr'?'तुमची listings लोड झाली नाहीत.':'Your listings could not be loaded.'}</strong><p>${escapeHtml(e.message)}</p><small>${state.locale==='mr'?'Backend पुन्हा सुरू करून database migrations पूर्ण झाल्या आहेत याची खात्री करा.':'Restart the backend and confirm database migrations have completed.'}</small><div><button type="button" class="secondary-button" id="retryMyListings">${state.locale==='mr'?'पुन्हा प्रयत्न':'Try again'}</button><button type="button" class="primary-button" id="activityAddListing">${state.locale==='mr'?'यंत्र/सेवा नोंदवा':'Post equipment or service'}</button></div></div>`;}}
function editLocalServiceListing(id){const r=(state.myLocalListings||[]).find(x=>x.id===id);if(!r)return;const host=$('#accountActivityPanel');host.insertAdjacentHTML('afterbegin',`<form id="localListingEditForm" class="portal-form local-listing-edit" data-listing-id="${r.id}"><h3 class="wide">Edit your listing</h3><label>Listing type<select name="listingType"><option value="EQUIPMENT" ${r.listingType==='EQUIPMENT'?'selected':''}>Equipment</option><option value="SERVICE" ${r.listingType==='SERVICE'?'selected':''}>Service</option></select></label><label>Category<input name="category" required value="${escapeHtml(r.category)}"></label><label>Title<input name="title" required maxlength="160" value="${escapeHtml(r.title)}"></label><label>Price<input name="price" type="number" min="0.01" step="0.01" required value="${r.price}"></label><label class="wide">Details<textarea name="description" required maxlength="2000">${escapeHtml(r.description)}</textarea></label><label>Rate unit<select name="rateUnit"><option value="PER_ACRE" ${r.rateUnit==='PER_ACRE'?'selected':''}>Per acre</option><option value="PER_HOUR" ${r.rateUnit==='PER_HOUR'?'selected':''}>Per hour</option><option value="PER_DAY" ${r.rateUnit==='PER_DAY'?'selected':''}>Per day</option><option value="PER_TRIP" ${r.rateUnit==='PER_TRIP'?'selected':''}>Per trip</option></select></label><label>Rate notes<input name="rateNotes" value="${escapeHtml(r.rateNotes||'')}"></label><label class="wide">Replace photo (optional)<input name="image" type="file" accept="image/jpeg,image/png,image/webp"></label><label>Village<input name="village" required value="${escapeHtml(r.village)}"></label><label>Taluka<input name="taluka" required value="${escapeHtml(r.taluka)}"></label><label>District<input name="district" required value="${escapeHtml(r.district)}"></label><label class="wide">Availability<input name="availability" required value="${escapeHtml(r.availability)}"></label><div class="wide"><button class="primary-button">Save changes</button><button class="secondary-button" type="button" data-cancel-listing-edit>Cancel</button></div></form>`);}
async function saveLocalServiceEdit(form){const r=(state.myLocalListings||[]).find(x=>x.id===form.dataset.listingId);if(!r)return;const f=new FormData(form);try{let imageUrl=r.imageUrl;const file=f.get('image');if(file?.size){const media=new FormData();media.append('file',file);imageUrl=(await api('/media/images',{method:'POST',body:media})).url;}const body={listingType:f.get('listingType'),category:f.get('category').trim(),title:f.get('title').trim(),description:f.get('description').trim(),imageUrl,price:Number(f.get('price')),rateUnit:f.get('rateUnit'),rateNotes:f.get('rateNotes').trim()||null,village:f.get('village').trim(),taluka:f.get('taluka').trim(),district:f.get('district').trim(),latitude:r.latitude,longitude:r.longitude,availability:f.get('availability').trim()};await api(`/local-services/${r.id}`,{method:'PUT',body:JSON.stringify(body)});toast('Your listing was updated.');await loadMyListings();}catch(e){toast(e.message);}}
async function loadServiceInbox(){const host=$('#accountActivityPanel');try{const rows=await api('/local-services/inbox');state.serviceInboxRows=rows;host.innerHTML=`<div class="service-inbox-heading"><h3>${state.locale==='mr'?'यंत्र व सेवा विनंत्या':'Equipment & service requests'}</h3><small>${state.locale==='mr'?'नवीन संदेश लाल बिंदूने दिसतील.':'Unread messages are marked in red.'}</small></div><div class="service-thread-list">${rows.length?rows.map(t=>`<button type="button" data-open-service-thread="${t.id}"><img class="service-request-listing-thumb" src="${escapeHtml(t.listingImageUrl)}" alt=""><span class="service-thread-summary"><b>${escapeHtml(t.listingTitle)}</b><small>${state.user.userId===t.providerId?escapeHtml(t.requesterName):escapeHtml(t.providerName)} · ${escapeHtml(t.status)}${t.areaAcres?` · ${t.areaAcres} acres`:''}</small><small>${escapeHtml(t.listingVillage||'')} · ${formatMoney(t.listingPrice)} ${rateUnitLabel(t.rateUnit,state.locale==='mr')}</small></span></button>`).join(''):`<p class="empty-panel">${state.locale==='mr'?'सेवा विनंत्या अजून नाहीत.':'No service conversations yet.'}</p>`}</div><div id="serviceThreadView"></div>`;enhanceLocalServiceUi();}catch(e){host.innerHTML=`<p class="empty-panel">${escapeHtml(e.message)}</p>`;}}
function renderServiceMessageRows(rows){return rows.map(m=>`<p class="${m.senderId===state.user.userId?'mine':''}"><b>${escapeHtml(m.senderName)}</b><span>${escapeHtml(m.message)}</span><small>${new Date(m.createdAt).toLocaleTimeString(state.locale==='mr'?'mr-IN':'en-IN')} ${m.senderId===state.user.userId?`<i class="message-ticks ${m.read?'is-read':m.delivered?'is-delivered':''}" aria-label="${m.read?'Read':m.delivered?'Delivered':'Sent'}">${m.read||m.delivered?'✓✓':'✓'}</i>`:''}</small></p>`).join('');}
async function refreshLocalServiceThread(id){if(state.activeServiceThread!==id||state.activityTab!=='service'||$('#accountActivity').hidden)return;try{const rows=await api(`/local-services/inbox/${id}/messages`),host=$('#serviceThreadView .thread-messages');if(!host)return;const nearBottom=host.scrollHeight-host.scrollTop-host.clientHeight<40;host.innerHTML=renderServiceMessageRows(rows);if(nearBottom)host.scrollTop=host.scrollHeight;}catch{}}
async function openServiceThread(id){state.activeServiceThread=id;try{const [threads,msgs]=await Promise.all([api('/local-services/inbox'),api(`/local-services/inbox/${id}/messages`)]);state.serviceInboxRows=threads;const t=threads.find(x=>x.id===id),host=$('#serviceThreadView');if(!t||!host)return;const owner=state.user.userId===t.providerId;host.innerHTML=`<section class="service-thread"><div class="thread-heading"><div><b>${escapeHtml(t.listingTitle)}</b><small>${escapeHtml(t.requesterName)} ↔ ${escapeHtml(t.providerName)} · ${escapeHtml(t.status)}${t.requestedDate?` · ${escapeHtml(t.requestedDate)}`:''}${t.areaAcres?` · ${t.areaAcres} acres`:''}</small></div>${owner&&t.status==='OPEN'?`<div><button class="secondary-button" data-service-status="ACCEPTED" data-thread="${id}">Accept</button><button class="secondary-button" data-service-status="REJECTED" data-thread="${id}">Decline</button></div>`:''}${owner&&t.status==='ACCEPTED'?`<button class="secondary-button" data-service-status="COMPLETED" data-thread="${id}">Mark complete</button>`:''}</div><div class="thread-messages">${renderServiceMessageRows(msgs)}</div><form class="service-thread-reply" data-thread="${id}"><input name="message" maxlength="2000" required placeholder="${state.locale==='mr'?'संदेश लिहा':'Write a message'}"><button class="primary-button">${state.locale==='mr'?'पाठवा':'Send'}</button></form></section>`;enhanceLocalServiceUi();if(state.serviceThreadPoll)clearInterval(state.serviceThreadPoll);state.serviceThreadPoll=setInterval(()=>refreshLocalServiceThread(id),5000);}catch(e){toast(e.message);}}
async function loadCommunityGroups(){const host=$('#communityGroups');if(!state.token||!hasFarmerRole()){host.innerHTML=`<div class="empty-state">${state.locale==='mr'?'Community पाहण्यासाठी शेतकरी म्हणून लॉग इन करा.':'Sign in as a farmer to join community groups.'}</div>`;return;}try{const groups=await api('/community/groups');host.innerHTML=groups.map(g=>`<article class="community-group-card"><div><b>${escapeHtml(g.name)}</b><small>${escapeHtml(g.locality||'')}</small><p>${escapeHtml(g.description)}</p><small>${g.memberCount} ${state.locale==='mr'?'सदस्य':'members'} · ${escapeHtml(g.createdByName)}</small></div><div>${g.joined?`<button class="secondary-button" data-community-open="${g.id}">${state.locale==='mr'?'उघडा':'Open chat'}</button><button class="text-button" data-community-leave="${g.id}">${state.locale==='mr'?'बाहेर पडा':'Leave'}</button>`:`<button class="primary-button" data-community-join="${g.id}">${state.locale==='mr'?'Join व्हा':'Join group'}</button>`}</div></article>`).join('')||'<p class="empty-state">No groups are available yet.</p>';}catch(e){host.innerHTML=`<p class="empty-state">${escapeHtml(e.message)}</p>`;}}
async function openCommunityGroup(id){state.activeCommunityGroup=id;try{const groups=await api('/community/groups'),g=groups.find(x=>x.id===id);const host=$('#communityChat');if(!g)return; if(!g.joined){host.innerHTML=`<div class="empty-panel"><h3>${escapeHtml(g.name)}</h3><p>${escapeHtml(g.description)}</p><button class="primary-button" data-community-join="${id}">Join group to read messages</button></div>`;return;}const [messages,members]=await Promise.all([api(`/community/groups/${id}/messages`),api(`/community/groups/${id}/members`)]);host.innerHTML=`<div class="community-chat-head"><div><h3>${escapeHtml(g.name)}</h3><small>${escapeHtml(g.locality||'')} · ${members.length} ${state.locale==='mr'?'सदस्य':'members'}</small></div><details><summary>${state.locale==='mr'?'सदस्य पहा':'View members'}</summary><ul>${members.map(m=>`<li>${escapeHtml(m.name)}${m.village?` · ${escapeHtml(m.village)}`:''}</li>`).join('')}</ul></details></div><div id="communityMessages" class="community-messages">${messages.map(m=>`<article><b>${escapeHtml(m.senderName)}</b><small>${escapeHtml(m.village||'')}</small><p>${escapeHtml(m.message)}</p><time>${new Date(m.createdAt).toLocaleString(state.locale==='mr'?'mr-IN':'en-IN')}</time></article>`).join('')}</div><form id="communityMessageForm" data-group="${id}"><input name="message" maxlength="2000" required placeholder="${state.locale==='mr'?'समुदायात संदेश लिहा':'Write to the group'}"><button class="primary-button">${state.locale==='mr'?'पाठवा':'Send'}</button></form>`;if(state.communityPoll)clearInterval(state.communityPoll);state.communityPoll=setInterval(()=>refreshCommunityMessages(id),5000);}catch(e){toast(e.message);}}
async function refreshCommunityMessages(id){if(state.activeCommunityGroup!==id)return;try{const rows=await api(`/community/groups/${id}/messages`),host=$('#communityMessages');if(!host)return;host.innerHTML=rows.map(m=>`<article><b>${escapeHtml(m.senderName)}</b><small>${escapeHtml(m.village||'')}</small><p>${escapeHtml(m.message)}</p><time>${new Date(m.createdAt).toLocaleTimeString(state.locale==='mr'?'mr-IN':'en-IN')}</time></article>`).join('');host.scrollTop=host.scrollHeight;}catch{}}
function showCommunityCreateForm(){if(!hasFarmerRole()){openAuth('login');return;}$('#communityChat').innerHTML=`<form id="communityCreateForm" class="portal-form"><h3 class="wide">${state.locale==='mr'?'नवीन शेतकरी group तयार करा':'Create a farmer group'}</h3><label>${state.locale==='mr'?'Group नाव':'Group name'}<input name="name" required maxlength="120"></label><label>${state.locale==='mr'?'गाव/बाजार/तालुका':'Village, market or taluka'}<input name="locality" maxlength="160"></label><label class="wide">${state.locale==='mr'?'थोडक्यात माहिती':'Description'}<textarea name="description" required maxlength="1000"></textarea></label><div class="wide"><button class="primary-button">${state.locale==='mr'?'Group तयार करा':'Create group'}</button></div></form>`;}
function restorePublicCommunityNodes(){const section=$('#community'),nav=section?.querySelector('.section-head'),layout=section?.querySelector('.community-layout');if(nav&&$('#createCommunityGroup'))nav.append($('#createCommunityGroup'));if(layout&&$('#communityGroups')&&$('#communityChat')){layout.append($('#communityGroups'),$('#communityChat'));}}
async function renderAccountActivity(tab=state.activityTab||'orders'){restorePublicCommunityNodes();state.activityTab=tab;$('#accountActivity').hidden=false;$('#activityWelcome').textContent=state.locale==='mr'?`नमस्कार ${state.user?.fullName||'शेतकरी'} — तुमचे वैयक्तिक खाते.`:`Hello ${state.user?.fullName||'farmer'} — your private account.`;const title=({orders:'Orders & tracking',requests:'Product requests',service:'Service bookings',listings:'My equipment & services',groups:'Groups & chat',help:'Help desk'})[tab]||'My account';$('#activityTitle').textContent=state.locale==='mr'?(enMr[title]||title):title;$('#accountActivityPanel').innerHTML=`<p class="empty-panel">${state.locale==='mr'?'माहिती लोड होत आहे…':'Loading activity…'}</p>`;$$('[data-account-activity-tab]').forEach(b=>b.classList.toggle('active',b.dataset.accountActivityTab===tab));const host=$('#accountActivityPanel');try{
 if(tab==='orders'){const page=await api('/orders?page=0&size=50'),orders=page.content||[];host.innerHTML=orders.length?`<div class="activity-list">${orders.map(renderCustomerOrder).join('')}</div>`:`<p class="empty-panel">${state.locale==='mr'?'तुमच्या अजून ऑर्डर्स नाहीत.':'You have no orders yet.'}</p>`;}
  else if(tab==='service')await loadServiceInbox();else if(tab==='requests'){const rows=await api('/requests');host.innerHTML=rows.length?rows.map(renderFarmerRequestCard).join(''):`<p class="empty-panel">${state.locale==='mr'?'Product requests अजून नाहीत.':'You have not sent a product request yet.'}</p>`;}
  else if(tab==='listings')await loadMyListings();else if(tab==='groups'){host.innerHTML='<div id="accountCommunityTools"></div><div class="community-layout"><div id="accountCommunityGroups"></div><div id="accountCommunityChat"></div></div>';$('#accountCommunityTools').append($('#createCommunityGroup'));$('#accountCommunityGroups').append($('#communityGroups'));$('#accountCommunityChat').append($('#communityChat'));await loadCommunityGroups();$('#communityChat').innerHTML='<div class="empty-state">Choose a group to read messages and see its members.</div>';}
  else if(tab==='help')await renderSupportMine(host,'Help desk');
 }catch(e){host.innerHTML=`<p class="empty-panel">${escapeHtml(e.message)}</p>`;}}
function renderCustomerOrder(o){const steps=['PENDING','CONFIRMED','PACKED','OUT_FOR_DELIVERY','DELIVERED'],labels=state.locale==='mr'?['ऑर्डर मिळाली','केंद्राने मान्य केली','पॅक झाली','डिलिव्हरीसाठी निघाली','पोहोचली']:['Order placed','Accepted by centre','Packed','Out for delivery','Delivered'];const current=o.status==='DISPATCHED'?3:steps.indexOf(o.status);const timeline=o.status==='CANCELLED'?`<p class="order-cancelled">${state.locale==='mr'?'ऑर्डर रद्द झाली':'Order cancelled'}</p>`:`<ol class="order-timeline">${steps.map((s,i)=>`<li class="${i<current?'done':i===current?'current':''}"><i></i><span>${labels[i]}</span></li>`).join('')}</ol>`;return `<article class="customer-order-card"><div class="order-summary"><b>${state.locale==='mr'?'ऑर्डर':'Order'} #${escapeHtml(o.id.slice(0,8).toUpperCase())}</b><span class="status-pill">${escapeHtml(o.status.replaceAll('_',' '))}</span><small>${escapeHtml(o.shopName||'')} · ${new Date(o.orderDate).toLocaleDateString(state.locale==='mr'?'mr-IN':'en-IN')}</small><strong>${formatMoney(o.totalAmount)}</strong></div>${timeline}<div class="order-items">${(o.items||[]).map(i=>`<span>${escapeHtml(i.productName)} × ${i.quantity}</span>`).join('')}</div></article>`;}
function renderFarmerRequestCard(r){return `<article class="request-card">${r.imageUrl?`<img class="request-photo" src="${escapeHtml(r.imageUrl)}" alt="Requested product">`:''}<div><span class="status-pill">${escapeHtml(r.status)}</span><h3>${escapeHtml(r.productName)}</h3><p>${escapeHtml(r.quantityDescription)} · ${escapeHtml([r.village,r.district].filter(Boolean).join(', '))}</p><small>${new Date(r.createdAt).toLocaleDateString(state.locale==='mr'?'mr-IN':'en-IN')}</small></div><div class="request-replies">${r.replies?.length?r.replies.map(x=>`<p><b>${escapeHtml(x.kendraName)}</b> · ${x.available?`${state.locale==='mr'?'उपलब्ध':'Available'} ${formatMoney(x.price)}`:(state.locale==='mr'?'उपलब्ध नाही':'Unavailable')} · ${escapeHtml(x.eta)}${x.message?` · ${escapeHtml(x.message)}`:''}</p>`).join(''):`<p>${state.locale==='mr'?'केंद्रांच्या उत्तराची प्रतीक्षा आहे.':'Waiting for centre responses.'}</p>`}</div></article>`;}
async function submitProfilePhoto(form){const file=new FormData(form).get('photo');if(!file?.size)return;try{const data=new FormData();data.append('file',file);const result=await api('/auth/profile/photo',{method:'PATCH',body:data});state.user.profilePhotoUrl=result.profilePhotoUrl;localStorage.setItem('agroconnect.user',JSON.stringify(state.user));updateAccountIdentity();toast(state.locale==='mr'?'Profile photo जतन झाला.':'Profile photo updated.');}catch(e){toast(e.message);}}
function serviceBookingMessage(form){const mr=state.locale==='mr',listing=(state.serviceResults||[]).find(x=>x.id===form.dataset.listingId),date=form.elements.requestedDate?.value,acres=form.elements.areaAcres?.value,details=form.elements.workDetails?.value?.trim(),from=state.user?.village||state.locationName||'';return mr?`नमस्कार, मला ${listing?.title||'या सेवे'}बद्दल विचारायचे आहे.${from?` माझे गाव: ${from}.`:''}${date?` अपेक्षित तारीख: ${date}.`:''}${acres?` क्षेत्र: ${acres} एकर.`:''}${details?` कामाचा तपशील: ${details}.`:''} कृपया उपलब्धता आणि अंतिम दर कळवा.`:`Hello, I’m interested in ${listing?.title||'this service'}.${from?` My village: ${from}.`:''}${date?` Preferred date: ${date}.`:''}${acres?` Area: ${acres} acres.`:''}${details?` Work details: ${details}.`:''} Please confirm availability and the final rate.`;}
function refreshServiceWhatsApp(form){const b=form.querySelector('[data-booking-whatsapp]'),listing=(state.serviceResults||[]).find(x=>x.id===form.dataset.listingId);if(!b||!listing?.allowWhatsApp||!listing.contactNumber)return;let phone=listing.contactNumber.replace(/\D/g,'');if(phone.length===10)phone=`91${phone}`;b.href=`https://wa.me/${phone}?text=${encodeURIComponent(serviceBookingMessage(form))}`;}
function modalizeServiceBooking(){document.querySelectorAll('.service-contact-panel:not([data-modalized])').forEach(panel=>{const card=panel.closest('.local-service-card'),id=panel.querySelector('.service-contact-form')?.dataset.listingId,row=(state.serviceResults||[]).find(x=>x.id===id);if(!card)return;panel.dataset.modalized='true';panel.classList.add('service-booking-modal');panel.insertAdjacentHTML('afterbegin',`<button type="button" class="booking-modal-close" data-close-service-booking aria-label="Close">×</button><header class="booking-summary">${row?.imageUrl?`<img src="${escapeHtml(row.imageUrl)}" alt="${escapeHtml(row.title)}">`:''}<div><small>${state.locale==='mr'?'सेवा विनंती':'SERVICE REQUEST'}</small><h3>${escapeHtml(row?.title||card.querySelector('h3')?.textContent||'Farm service')}</h3><p>${escapeHtml([row?.village,row?.taluka,row?.district].filter(Boolean).join(', '))}</p><b>${formatMoney(row?.price||0)} <small>${rateUnitLabel(row?.rateUnit,state.locale==='mr')}</small></b></div></header>`);const overlay=document.createElement('div');overlay.className='service-booking-backdrop';overlay.dataset.serviceBookingBackdrop='';panel.parentElement?.removeChild(panel);overlay.append(panel);document.body.append(overlay);overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-close-service-booking]'))overlay.remove();});const submit=panel.querySelector('.service-contact-form button[type="submit"]')||panel.querySelector('.service-contact-form button:not([type])');if(submit){submit.classList.add('service-request-submit');submit.innerHTML=`${state.locale==='mr'?'विनंती पाठवा':'Send request'} <span aria-hidden="true">→</span>`;}});}
function decorateServiceThread(){const t=(state.serviceInboxRows||[]).find(x=>x.id===state.activeServiceThread),heading=$('#serviceThreadView .thread-heading');if(heading&&t&&!heading.querySelector('.service-chat-thumb'))heading.insertAdjacentHTML('afterbegin',`<img class="service-chat-thumb" src="${escapeHtml(t.listingImageUrl)}" alt="">`);}
function enhanceLocalServiceUi(){const listingForm=$('#localServiceListingForm')||$('#localListingEditForm');if(listingForm&&!listingForm.querySelector('[data-contact-settings]')){const current=(state.myLocalListings||[]).find(x=>x.id===listingForm.dataset.listingId),anchor=listingForm.querySelector('[name="rateNotes"]')?.closest('label')||listingForm.querySelector('[name="availability"]')?.closest('label');anchor?.insertAdjacentHTML('afterend',`<fieldset class="service-contact-settings wide" data-contact-settings><legend>${state.locale==='mr'?'ग्राहकांशी थेट संपर्क':'Optional direct contact'}</legend><label class="wide">${state.locale==='mr'?'मोबाइल नंबर':'Mobile number'}<input name="contactNumber" type="tel" maxlength="20" autocomplete="tel" placeholder="+91 98765 43210" value="${escapeHtml(current?.contactNumber||'')}"></label><label class="service-contact-toggle"><input name="allowCalls" type="checkbox" ${current?.allowCalls?'checked':''}> ${state.locale==='mr'?'फोन कॉल स्वीकारा':'Allow phone calls'}</label><label class="service-contact-toggle"><input name="allowWhatsApp" type="checkbox" ${current?.allowWhatsApp?'checked':''}> ${state.locale==='mr'?'WhatsApp संदेश स्वीकारा':'Allow WhatsApp messages'}</label><small class="wide">${state.locale==='mr'?'नंबर फक्त तुम्ही Call किंवा WhatsApp सुरू केल्यासच सार्वजनिक listing मध्ये दिसेल.':'Your number appears on the public listing only when you enable at least one contact option.'}</small></fieldset>`);}
 document.querySelectorAll('.local-service-card:not(.demo-listing-card)').forEach(card=>{const contact=card.querySelector('[data-service-contact]');if(!contact||card.querySelector('.service-direct-actions'))return;const row=(state.serviceResults||[]).find(x=>x.id===contact.dataset.serviceContact);if(!row)return;const phone=(row.contactNumber||'').replace(/\D/g,''),wa=row.allowWhatsApp&&phone?`<a class="secondary-button" data-service-wa href="https://wa.me/${phone}?text=${encodeURIComponent(state.locale==='mr'?`नमस्कार, ${row.title} सेवा उपलब्ध आहे का? माझे गाव ${state.user?.village||state.locationName||''}. कृपया दर आणि उपलब्धता कळवा.`:`Hello, is ${row.title} available? My village is ${state.user?.village||state.locationName||''}. Please share rate and availability.`)}" target="_blank" rel="noopener">WhatsApp</a>`:'',call=row.allowCalls&&phone?`<a class="secondary-button" href="tel:${escapeHtml(row.contactNumber)}">${state.locale==='mr'?'कॉल':'Call'}</a>`:'';if(wa||call)contact.insertAdjacentHTML('afterend',`<div class="service-direct-actions">${call}${wa}</div>`);});
 document.querySelectorAll('.service-contact-form').forEach(form=>{if(!form.querySelector('[name="workDetails"]')){const message=form.querySelector('[name="message"]');message?.closest('label')?.insertAdjacentHTML('beforebegin',`<label class="booking-work-label">${state.locale==='mr'?'कामाचा तपशील / विशेष सूचना':'Work details / notes'}<textarea name="workDetails" maxlength="1000" rows="2" placeholder="${state.locale==='mr'?'उदा. शेताचा भाग, पिकाचे नाव किंवा कामाच्या सूचना':'Crop, field section, or work instructions'}"></textarea></label>`);if(message){message.required=false;message.value='';message.hidden=true;message.closest('label').hidden=true;}const row=(state.serviceResults||[]).find(x=>x.id===form.dataset.listingId),phone=(row?.contactNumber||'').replace(/\D/g,'');if(row?.allowWhatsApp&&phone){form.insertAdjacentHTML('beforeend',`<a class="secondary-button booking-whatsapp" data-booking-whatsapp href="https://wa.me/${phone}" target="_blank" rel="noopener">${state.locale==='mr'?'WhatsApp वर तपशील पाठवा':'Send details on WhatsApp'}</a>`);}}refreshServiceWhatsApp(form);});
 document.querySelectorAll('.service-thread-list [data-open-service-thread]').forEach(button=>{const t=(state.serviceInboxRows||[]).find(x=>x.id===button.dataset.openServiceThread);if(t?.unreadCount>0&&!button.querySelector('.unread-badge'))button.insertAdjacentHTML('beforeend',`<i class="unread-badge" aria-label="${t.unreadCount} unread messages">${Math.min(t.unreadCount,99)}</i>`);});modalizeServiceBooking();decorateServiceThread();}
async function submitLocalServiceContact(form){if(!state.user){openAuth('login');return;}const f=new FormData(form),message=serviceBookingMessage(form);try{const thread=await api(`/local-services/${form.dataset.listingId}/contact`,{method:'POST',body:JSON.stringify({message,requestedDate:f.get('requestedDate')||null,areaAcres:f.get('areaAcres')?Number(f.get('areaAcres')):null})});document.querySelector('[data-service-booking-backdrop]')?.remove();toast(state.locale==='mr'?'विनंती पाठवली. तुमची खाजगी chat उघडत आहे.':'Request sent. Opening your private service chat.');$('#localServiceInbox').innerHTML='';await renderAccountActivity('service');await openServiceThread(thread.id);}catch(e){toast(e.message);}}function bindEvents() {document.addEventListener('input',event=>{const form=event.target.closest('.service-contact-form');if(form)refreshServiceWhatsApp(form);});if(!state.serviceInboxPoll)state.serviceInboxPoll=setInterval(async()=>{if(state.activityTab!=='service'||$('#accountActivity').hidden||!state.token)return;try{state.serviceInboxRows=await api('/local-services/inbox');document.querySelectorAll('.service-thread-list [data-open-service-thread]').forEach(button=>{const t=state.serviceInboxRows.find(x=>x.id===button.dataset.openServiceThread),old=button.querySelector('.unread-badge');if(t?.unreadCount>0){if(old)old.textContent=Math.min(t.unreadCount,99);else button.insertAdjacentHTML('beforeend',`<i class="unread-badge" aria-label="${t.unreadCount} unread messages">${Math.min(t.unreadCount,99)}</i>`);}else old?.remove();});}catch{}},10000);
  if(!$('#adminSchemesNav')) { const nav=document.querySelector('.admin-sidebar .portal-nav'); if(nav){const b=document.createElement('button');b.id='adminSchemesNav';b.dataset.adminTab='schemes';b.innerHTML='▧ <span>Government schemes</span>';nav.append(b);} }
  new MutationObserver(()=>{const form=$('#ownerContent #ownerApplicationForm');if(form){const license=form.querySelector('[name="ownerLicenseNumber"]');const documentLink=form.querySelector('[name="documentUrl"]');const notice=form.closest('.portal-card')?.querySelector('.portal-card-head small');if(license)license.required=false;if(documentLink)documentLink.required=false;const copy='Add the available documents. If missing, the Super Admin may approve only after a warning and recorded override reason.';if(notice&&notice.textContent!==copy)notice.textContent=copy;if(!form.querySelector('[name="photoFile"]')){const label=document.createElement('label');label.className='wide';label.innerHTML='Attach agency / centre photo<input name="photoFile" type="file" accept="image/jpeg,image/png,image/webp"><small>JPG, PNG or WebP · up to 5 MB</small>';const anchor=form.querySelector('[name="photoUrl"]')?.closest('label');if(anchor)anchor.after(label);else form.append(label);}}enhanceLocalServiceUi();}).observe(document.body,{childList:true,subtree:true});
  $('#accountActivityOpen').addEventListener('click',()=>{ $('#accountMenu').hidden=true;void renderAccountActivity('orders');});
  $('#localeToggle').addEventListener('click',()=>{if(!$('#accountActivity').hidden&&state.user)void renderAccountActivity(state.activityTab);});
  $('#closeAccountActivity').addEventListener('click',()=>$('#accountActivity').hidden=true);
  $('#accountActivityPanel').addEventListener('click',async event=>{const tab=event.target.closest('[data-account-activity-tab]');if(tab){await renderAccountActivity(tab.dataset.accountActivityTab);return;}if(event.target.closest('#retryMyListings')){await loadMyListings();return;}if(event.target.closest('#activityAddListing')){$('#accountActivityPanel').innerHTML='<div id="localServiceFormHost"></div>';renderLocalServiceListingForm();return;}if(event.target.closest('[data-close-listing]')){await renderAccountActivity('listings');return;}if(event.target.closest('[data-use-listing-location]')){captureServiceLocation(()=>{const label=$('#listingLocationStatus');if(label)label.textContent=state.locale==='mr'?'ठिकाण मिळाले; coordinates खाजगी राहतील.':'Location captured; coordinates remain private.';});return;}const edit=event.target.closest('[data-edit-listing]');if(edit){editLocalServiceListing(edit.dataset.editListing);return;}if(event.target.closest('[data-cancel-listing-edit]')){event.target.closest('#localListingEditForm')?.remove();return;}const thread=event.target.closest('[data-open-service-thread]');if(thread){await openServiceThread(thread.dataset.openServiceThread);return;}const status=event.target.closest('[data-service-status]');if(status){try{await api(`/local-services/inbox/${status.dataset.thread}/status`,{method:'PATCH',body:JSON.stringify({status:status.dataset.serviceStatus})});await openServiceThread(status.dataset.thread);await loadServiceInbox();}catch(e){toast(e.message);}return;}const group=event.target.closest('[data-open-my-group]');if(group)await openCommunityGroup(group.dataset.openMyGroup);});
  $('#accountActivityPanel').addEventListener('click',async event=>{const b=event.target.closest('[data-remove-listing]');if(!b)return;if(!window.confirm(state.locale==='mr'?'ही listing काढून टाकायची?':'Remove this listing from the marketplace?'))return;try{await api(`/local-services/${b.dataset.removeListing}`,{method:'DELETE'});await loadMyListings();toast(state.locale==='mr'?'Listing काढली.':'Listing removed.');}catch(e){toast(e.message);}});
  $('#accountActivityPanel').addEventListener('submit',async event=>{if(event.target.id==='localServiceListingForm'){event.preventDefault();await submitLocalServiceListing(event.target);return;}const edit=event.target.closest('#localListingEditForm');if(edit){event.preventDefault();await saveLocalServiceEdit(edit);return;}const form=event.target.closest('.service-thread-reply');if(form){event.preventDefault();const f=new FormData(form);try{await api(`/local-services/inbox/${form.dataset.thread}/messages`,{method:'POST',body:JSON.stringify({message:f.get('message').trim()})});await openServiceThread(form.dataset.thread);}catch(e){toast(e.message);return;}}if(event.target.id==='supportTicketForm'){event.preventDefault();await submitSupportTicket(event.target);}});
  $('#profilePhotoForm').addEventListener('submit',event=>{event.preventDefault();void submitProfilePhoto(event.currentTarget);});
  $('#profilePhotoForm [name="photo"]').addEventListener('change',event=>{const file=event.target.files[0],preview=$('#profilePhotoPreview'),fallback=$('#profilePhotoFallback');if(file){if(preview.dataset.objectUrl)URL.revokeObjectURL(preview.dataset.objectUrl);preview.dataset.objectUrl=URL.createObjectURL(file);preview.src=preview.dataset.objectUrl;preview.hidden=false;fallback.hidden=true;}});
  $('#localServiceSearch').addEventListener('submit',event=>{event.preventDefault();void searchLocalServices();});
  $('#useServiceLocation').addEventListener('click',()=>captureServiceLocation());
  $('#refreshServiceListings').addEventListener('click',()=>void searchLocalServices(state.serviceCoordinates));
  $('.service-kind-filter').addEventListener('click',event=>{const b=event.target.closest('[data-service-type]');if(!b)return;state.serviceFilter=b.dataset.serviceType;$$('.service-kind-filter [data-service-type]').forEach(x=>x.classList.toggle('selected',x===b));if(state.serviceResults)void searchLocalServices(state.serviceCoordinates);});
  $('#localServiceResults').addEventListener('click',event=>{if(event.target.closest('[data-demo-listing]')){toast(state.locale==='mr'?'ही फक्त demo नोंद आहे; प्रत्यक्ष सेवा उपलब्ध नाही.':'This is a demo listing; no real service provider is attached.');return;}const b=event.target.closest('[data-service-contact]');if(!b)return;if(!state.user){openAuth('login');return;}if(!hasFarmerRole()){toast('Switch to your farmer account to contact this listing.');return;}$('#localServiceResults .service-contact-panel')?.remove();const mr=state.locale==='mr';b.closest('.local-service-card').insertAdjacentHTML('beforeend',`<div class="service-contact-panel"><form class="service-contact-form" data-listing-id="${b.dataset.serviceContact}"><label>${mr?'कामाची तारीख':'Requested date'}<input name="requestedDate" type="date" min="${new Date().toISOString().slice(0,10)}"></label><label>${mr?'एकर':'Acres'}<input name="areaAcres" type="number" min="0.01" step="0.01"></label><label>${mr?'संदेश':'Message'}<textarea name="message" maxlength="2000" required></textarea></label><button class="primary-button">${mr?'विनंती पाठवा':'Send request'}</button></form></div>`);});
  document.addEventListener('submit',event=>{const form=event.target.closest('.service-contact-form');if(form){event.preventDefault();const button=form.querySelector('.service-request-submit');if(button?.disabled)return;if(button){button.disabled=true;button.classList.add('is-sending');}void submitLocalServiceContact(form).finally(()=>{if(button&&document.body.contains(form)){button.disabled=false;button.classList.remove('is-sending');}});}});
  $('#communityGroups').addEventListener('click',async event=>{const join=event.target.closest('[data-community-join]'),leave=event.target.closest('[data-community-leave]'),open=event.target.closest('[data-community-open]');try{if(join){await api(`/community/groups/${join.dataset.communityJoin}/join`,{method:'POST'});await loadCommunityGroups();await openCommunityGroup(join.dataset.communityJoin);}else if(leave){await api(`/community/groups/${leave.dataset.communityLeave}/leave`,{method:'DELETE'});await loadCommunityGroups();}else if(open)await openCommunityGroup(open.dataset.communityOpen);}catch(e){toast(e.message);}});
  $('#communityChat').addEventListener('click',async event=>{const join=event.target.closest('[data-community-join]');if(join){try{await api(`/community/groups/${join.dataset.communityJoin}/join`,{method:'POST'});await loadCommunityGroups();await openCommunityGroup(join.dataset.communityJoin);}catch(e){toast(e.message);}}});
  $('#communityChat').addEventListener('submit',async event=>{if(event.target.id==='communityCreateForm'){event.preventDefault();const f=new FormData(event.target);try{const g=await api('/community/groups',{method:'POST',body:JSON.stringify({name:f.get('name').trim(),description:f.get('description').trim(),locality:f.get('locality').trim()||null})});await loadCommunityGroups();await openCommunityGroup(g.id);}catch(e){toast(e.message);}}else if(event.target.id==='communityMessageForm'){event.preventDefault();const f=new FormData(event.target),id=event.target.dataset.group;try{await api(`/community/groups/${id}/messages`,{method:'POST',body:JSON.stringify({message:f.get('message').trim()})});event.target.reset();await refreshCommunityMessages(id);}catch(e){toast(e.message);}}});
  $('#createCommunityGroup').addEventListener('click',()=>showCommunityCreateForm());
  $('#productGrid').addEventListener('click', event => {
    const add = event.target.closest('[data-add]');
    const adjust = event.target.closest('[data-cart-change]');
    const request=event.target.closest('[data-request-product]');
    if(request){requestProduct(request.dataset.requestProduct);return;}
    if (add) addToCart(add.dataset.add, 1);
    if (adjust) addToCart(adjust.dataset.id, Number(adjust.dataset.cartChange));
    if (!add && !adjust && event.target.closest('.product-card')) openProductDetail(event.target.closest('.product-card').dataset.productId);
  });
  $('#cartContents').addEventListener('click', event => {
    const adjust = event.target.closest('[data-cart-change]');
    const remove = event.target.closest('[data-remove]');
    if (adjust) addToCart(adjust.dataset.id, Number(adjust.dataset.cartChange));
    if (remove) { state.cart = state.cart.filter(item => item.id !== remove.dataset.remove); persistCart(); }
  });
  $('#cartButton').addEventListener('click', openCart);
  $('#mobileCartButton').addEventListener('click', openCart);
  $('#mobileCartBar').addEventListener('click', openCart);
  $('#mobileAccountButton').addEventListener('click', openAccount);
  $('#accountButton').addEventListener('click', openAccount);
  $('#accountSwitchRole').addEventListener('click', () => { const role=(state.user?.roles||[]).find(item=>item!==state.user?.role); $('#accountMenu').hidden=true; if(role) void switchActiveRole(role); });
  $('#accountLogout').addEventListener('click', () => void logout());
  $('#accountLogoutAll').addEventListener('click', () => void logout('Signed out from all devices.',true));
  $('#accountSupport').addEventListener('click', () => { $('#accountMenu').hidden=true; void renderAccountActivity('help'); });
  $('#accountCenterLogout').addEventListener('click',()=>void logout());
  $('#closeAccountDrawer').addEventListener('click',()=>$('#accountMenu').hidden=true);
  $('#accountActivity').addEventListener('click',event=>{const tab=event.target.closest('[data-account-activity-tab]');if(tab&&tab.closest('.account-center-sidebar'))void renderAccountActivity(tab.dataset.accountActivityTab);});
  document.addEventListener('click',event=>{if(!event.target.closest('#accountMenu')&&!event.target.closest('#accountButton'))$('#accountMenu').hidden=true;});
  $('#checkoutButton')?.addEventListener('click', openCheckout);
  $('#cartFooter').addEventListener('click', event => { if (event.target.closest('#checkoutButton')) openCheckout(); });
  $('#scrim').addEventListener('click', () => { if (!$('#cartDrawer').hidden) closeCart(); if (!$('#authPanel').hidden) closeAuth(); });
  $$('[data-close="cart"]').forEach(button => button.addEventListener('click', closeCart));
  $$('[data-close="checkout"]').forEach(button => button.addEventListener('click', closeCheckout));
  $$('[data-close="auth"]').forEach(button => button.addEventListener('click', closeAuth));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') { if (!$('#checkoutPanel').hidden) closeCheckout(); else if (!$('#cartDrawer').hidden) closeCart(); else if (!$('#authPanel').hidden) closeAuth(); }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); $('#searchInput').focus(); }
  });
  $('#searchForm').addEventListener('submit', event => { event.preventDefault(); state.search = $('#searchInput').value.trim(); loadProducts(); $('#products').scrollIntoView({ behavior: 'smooth' }); });
  $('#searchInput').addEventListener('input', () => { state.search = $('#searchInput').value.trim(); clearTimeout(searchTimer); searchTimer = setTimeout(() => loadProducts(), 220); });
  $('#categoryPills').addEventListener('click', event => { const button = event.target.closest('[data-filter]'); if (!button) return; setCategory(button.dataset.filter); });
  $('.category-nav').addEventListener('click', event => { const link = event.target.closest('[data-filter]'); if (!link) return; setCategory(link.dataset.filter); });
  function setCategory(category) { state.category = category; $$('#categoryPills [data-filter]').forEach(button => button.classList.toggle('selected', button.dataset.filter === category)); $$('.category-nav [data-filter]').forEach(link => link.classList.toggle('active', link.dataset.filter === category)); loadProducts(); }
  $('#sortSelect').addEventListener('change', event => { state.sort = event.target.value; loadProducts(); });
  $('#viewAll').addEventListener('click', () => { setCategory('ALL'); $('#searchInput').value = ''; state.search = ''; $('#products').scrollIntoView({ behavior: 'smooth' }); });
  $('#loadMore').addEventListener('click', () => loadProducts({ append: true }));
  $('#productGrid').addEventListener('click', event => { if (event.target.closest('#retryProducts')) loadProducts(); });
  $('#productRequestOpen').addEventListener('click',()=>requestProduct($('#productRequestOpen').dataset.requestName||state.search));
  $('#shopSearch').addEventListener('submit', event => { event.preventDefault(); const query = $('#shopQuery').value.trim(); if (query.length < 3) { toast('Enter an area name or full PIN code.'); return; }state.serviceCoordinates=null;state.serviceAreaResolvedFor='';state.serviceAreaDistrict='';sessionStorage.removeItem('agroconnect.location');state.locationName=query;localStorage.setItem('agroconnect.locationName',query);applyLocationLabel(query);loadShops(query); });
  $('#farmerRequestForm').addEventListener('submit',event=>{event.preventDefault();void submitFarmerRequest(event.currentTarget);});
  $('#closeProductRequest').addEventListener('click',()=>{$('#productRequestFormHost').hidden=true;});
  $('#customerSupportPanel').addEventListener('submit',event=>{if(event.target.id==='supportTicketForm'){event.preventDefault();void submitSupportTicket(event.target);}});
  $('#locationButton').addEventListener('click', () => captureServiceLocation());
  $$('[data-scroll]').forEach(button => button.addEventListener('click', () => document.getElementById(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth' })));
  [...$('#checkoutForm').elements.deliveryType].forEach(input => input.addEventListener('change', syncDeliveryMode));
  $('#marketRateSearch').addEventListener('submit',event=>{event.preventDefault();loadRates();});
  $('#ratesGrid').addEventListener('click',handleMarketBrowserClick);  $('#marketTicker').addEventListener('click', async event => {
    const item = event.target.closest('.market-ticker-item');
    if (!item) return;
    event.preventDefault();
    const search = $('#marketRateSearch [name="city"]');
    search.value = item.dataset.marketLocation || '';
    await loadRates();
    const marketIndex = state.marketGroups.findIndex(m => String(m.name).trim().toLowerCase() === String(item.dataset.marketName).trim().toLowerCase());
    if (marketIndex >= 0) {
      const market = state.marketGroups[marketIndex];
      state.activeMarket = marketIndex;
      state.activeMarketDistrict = market.district || market.city || '*';
      renderMarketBrowser(search.value.trim());
      const cropLabel = marketCropName(item.dataset.marketCrop || '').trim().toLowerCase();
      const row = Array.from($('#marketDetail tbody')?.rows || []).find(candidate => candidate.cells[0]?.textContent.trim().toLowerCase() === cropLabel);
      if (row) {
        row.classList.add('ticker-market-highlight');
        window.setTimeout(() => row.classList.remove('ticker-market-highlight'), 4200);
      }
    } else {
      toast(state.locale === 'mr' ? 'या नोंदीचा बाजार सापडला नाही; उपलब्ध दर दाखवत आहोत.' : 'Could not find that market record; showing the available rates.');
    }
    $('#rates').scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (marketIndex >= 0) window.setTimeout(() => $('#marketDetail')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 220);
  });
  $('#weatherSearch').addEventListener('submit',event=>{event.preventDefault();const city=new FormData(event.currentTarget).get('city').trim();state.serviceCoordinates=null;state.serviceAreaResolvedFor='';state.serviceAreaDistrict='';sessionStorage.removeItem('agroconnect.location');state.locationName=city;localStorage.setItem('agroconnect.locationName',city);applyLocationLabel(city);$('#shopQuery').value=city;$('#serviceVillage').value=city;void loadWeather(city);void loadShops(city);});
  $('#productDetailModal').addEventListener('submit',event=>{if(event.target.id==='productReviewForm'){event.preventDefault();void submitProductReview(event.target);}});
  $('#checkoutForm').addEventListener('input', event => { const group = event.target.closest('.field'); if (group && group.classList.contains('invalid')) { group.classList.remove('invalid'); group.querySelector('.field-error').textContent = ''; } });
  $('#checkoutForm').addEventListener('submit', event => { event.preventDefault(); submitOrder(); });
  $('#checkoutSummary').addEventListener('click', event => { if (event.target.closest('#placeOrderButton')) submitOrder(); });
  $('#mobileCheckoutSubmit').addEventListener('click', event => { if (event.target.closest('[data-place-order]')) submitOrder(); });
  $('#checkoutSignIn').addEventListener('click', () => openAuth('login'));
  $('#authPanel').addEventListener('click', event => { const button = event.target.closest('[data-auth-mode]'); if (button) setAuthMode(button.dataset.authMode); });
  $('#authPanel').addEventListener('click', async event => {
    try {
      if(event.target.closest('[data-resend-recovery]')) { await api('/auth/recovery/request',{method:'POST',body:JSON.stringify({email:state.recoveryEmail})}); toast('If available, a new code was sent.'); }
      if(event.target.closest('[data-resend-email]')) { const email=$('#emailVerificationForm [name="email"]')?.value || ''; await api('/auth/email/verification/resend',{method:'POST',body:JSON.stringify({email})}); toast('If verification is needed, a new code was sent.'); }
    } catch(error) { toast(error.message); }
  });
  $('#authPanel').addEventListener('click', event => { if(event.target.closest('[data-recovery-back]')||event.target.closest('[data-verify-back]')) setAuthMode(state.authMode); });
  $('#adminLoginMode').addEventListener('click', () => setAuthMode('admin'));
  $('#adminLoginBack').addEventListener('click', () => setAuthMode('login'));
  $('#continueGuest').addEventListener('click', closeAuth);
  $('#ownerApp').addEventListener('click', async event => {
    const nav=event.target.closest('[data-owner-tab]'); if(nav) portalNav(nav.dataset.ownerTab);
    if(event.target.closest('[data-owner-go]')) portalNav(event.target.closest('[data-owner-go]').dataset.ownerGo);
    if(event.target.closest('[data-switch-farmer]') || event.target.closest('#ownerSwitchFarmer')) return switchActiveRole('FARMER');
    if(event.target.closest('#ownerLogout')) return logout();
    if(event.target.closest('#ownerLogoutAll')) return logout('Signed out from all devices.',true);
    if(event.target.closest('#ownerProfile')) return logout();
    if(event.target.closest('#newOwnerProduct')) return showOwnerProductForm();
    const edit=event.target.closest('[data-edit-product]'); if(edit) return editOwnerProduct(edit.dataset.editProduct);
    const toggle=event.target.closest('[data-toggle-product]'); if(toggle) return toggleOwnerProduct(toggle.dataset.toggleProduct,toggle.dataset.active==='true');
    const status=event.target.closest('[data-order-status]'); if(status) return updateOrderStatus(status.dataset.orderId,status.dataset.orderStatus);
  });
  $('#ownerContent').addEventListener('submit', async event => { if(event.target.id==='ownerProductForm') { event.preventDefault(); await saveOwnerProduct(event.target); } else if(event.target.classList.contains('owner-reply-form')) { event.preventDefault(); await submitOwnerReply(event.target); } });
  $('#ownerContent').addEventListener('submit', async event => { if(event.target.id==='ownerApplicationForm') { event.preventDefault(); await submitOwnerApplication(event.target); } });
  $('#adminApp').addEventListener('click', async event => {
    if(event.target.closest('#adminQuickLogout')) return logout();
    if(event.target.closest('#adminLogout')) return logout();
    if(event.target.closest('#adminLogoutAll')) return logout('Signed out from all devices.',true);
    if(event.target.closest('#adminSwitchFarmer')) return switchActiveRole('FARMER');
    const tab=event.target.closest('[data-admin-tab]'); if(tab) { $$('#adminApp [data-admin-tab]').forEach(b=>b.classList.toggle('active',b===tab)); if(tab.dataset.adminTab==='rates') void renderAdminRates(); else if(tab.dataset.adminTab==='products') void renderAdminProducts(); else if(tab.dataset.adminTab==='support') void renderAdminSupport(); else if(tab.dataset.adminTab==='accounts') void renderAdminAccounts(); else if(tab.dataset.adminTab==='businesses') void renderAdminBusinesses(); else if(tab.dataset.adminTab==='schemes') void renderAdminSchemes(); else if(tab.dataset.adminTab==='community') void renderAdminCommunity(); else void loadAdminPanel(); }
    const approve=event.target.closest('[data-approve-shop]'); if(approve) { const shop=(state.adminPendingShops||[]).find(s=>s.id===approve.dataset.approveShop);const missing=!shop?.documentUrl||!shop?.ownerLicenseNumber;let reason='Reviewed submitted documents';if(missing){if(!window.confirm('Documents or licence are missing. Super Admin override can approve anyway. Continue only if you accept this risk; this decision will be audit logged.'))return;reason=window.prompt('Required audit reason for approving without documents:','Exception approved by Super Admin');if(!reason?.trim())return toast('Approval cancelled: an audit reason is required.');} try { await api(`/admin/kendras/${approve.dataset.approveShop}/verify`,{method:'PATCH',body:JSON.stringify({overrideMissingDocuments:missing,reason})}); toast(missing?'Approved with audited document override':'Centre approved'); await loadAdminPanel(); } catch(error) { toast(error.message); } }
    const reject=event.target.closest('[data-reject-shop]'); if(reject) { try { await api(`/admin/kendras/${reject.dataset.rejectShop}/reject`,{method:'PATCH'}); toast('Application rejected'); await loadAdminPanel(); } catch(error) { toast(error.message); } }
    const accountStatus=event.target.closest('[data-account-status]'); if(accountStatus) return updateAdminAccountStatus(accountStatus.dataset.accountStatus,accountStatus.dataset.enable==='true');
    const deleteRate=event.target.closest('[data-delete-rate]'); if(deleteRate) { try { await api(`/mandi-rates/${deleteRate.dataset.deleteRate}`,{method:'DELETE'}); toast('Rate removed'); await renderAdminRates(); }catch(error){toast(error.message);} }
    const hideScheme=event.target.closest('[data-hide-scheme]');if(hideScheme){try{await api(`/admin/schemes/${hideScheme.dataset.hideScheme}`,{method:'DELETE'});toast('Scheme hidden from customers');await renderAdminSchemes();}catch(error){toast(error.message);}}
  });
  $('#adminApp').addEventListener('click',async event=>{const b=event.target.closest('[data-moderate-group]');if(!b)return;if(!window.confirm('Deactivate this farmer group? Members will no longer be able to open or post in it.'))return;try{await api(`/community/admin/groups/${b.dataset.moderateGroup}`,{method:'DELETE'});toast('Community group deactivated');await renderAdminCommunity();}catch(e){toast(e.message);}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.id==='adminRateForm'){event.preventDefault();await saveAdminRate(event.target);}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.id==='adminSchemeForm'){event.preventDefault();const f=new FormData(event.target);const body={title:f.get('title').trim(),state:f.get('state').trim()||'Maharashtra',description:f.get('description').trim(),eligibility:f.get('eligibility').trim(),titleMr:f.get('titleMr').trim(),descriptionMr:f.get('descriptionMr').trim(),eligibilityMr:f.get('eligibilityMr').trim(),officialUrl:f.get('officialUrl').trim(),active:f.get('active')==='on'};try{await api('/admin/schemes',{method:'POST',body:JSON.stringify(body)});toast('Government scheme added');await renderAdminSchemes();}catch(error){toast(error.message);}}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.id==='adminAccountSearchForm'){event.preventDefault();await renderAdminAccounts(new FormData(event.target).get('query')||'');}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.id==='adminBusinessSearch'){event.preventDefault();const data=new FormData(event.target);await renderAdminBusinesses(data.get('city')||'',data.get('type')||'');}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.id==='adminProductSearch'){event.preventDefault();await renderAdminProducts(new FormData(event.target).get('query')||'');}else if(event.target.classList.contains('admin-moderation-form')){event.preventDefault();await moderateAdminProduct(event.target);}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.classList.contains('admin-support-reply')){event.preventDefault();await replySupportTicket(event.target);}});
  $('#adminApp').addEventListener('submit',event=>{if(event.target.id==='marketRateSearch'){event.preventDefault();void loadRates();}});
  $('#ownerContent').addEventListener('submit',event=>{if(event.target.id==='supportTicketForm'){event.preventDefault();void submitSupportTicket(event.target);}});
  $('#adminApp').addEventListener('submit',async event=>{if(event.target.id==='createSuperAdminForm'){event.preventDefault();await submitSuperAdminCreate(event.target);}else if(event.target.id==='resetSuperAdminForm'){event.preventDefault();await submitSuperAdminReset(event.target);}});
  $('#localeToggle').addEventListener('click', () => { state.locale = state.locale === 'en' ? 'mr' : 'en'; localStorage.setItem('agroconnect.locale', state.locale); document.documentElement.dataset.locale = state.locale; $('#localeToggle').textContent = state.locale === 'en' ? 'मराठी' : 'English'; translateVisibleText(); renderCart(); renderProducts(); void loadSchemes(); void loadRates(); void loadMarketTicker(); if(state.serviceResults)renderLocalServiceCards(state.serviceResults,!!state.serviceCoordinates); const wc=$('#weatherCity').value.trim(); if(wc)void loadWeather(wc); toast(state.locale === 'en' ? 'Language set to English' : 'भाषा मराठी केली'); });
  $('#authForm').addEventListener('submit', async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const mode = state.authMode;
    const payload = mode === 'admin'
      ? { accessId: form.get('phoneNumber').trim(), accessToken: form.get('password') }
      : { phoneNumber: form.get('phoneNumber').trim(), password: form.get('password') };
    if (mode === 'register') Object.assign(payload, { fullName: form.get('fullName').trim(), role: form.get('role') });
    else if (mode !== 'admin') payload.activeRole=form.get('role');
    const button = $('#authSubmit'); button.disabled = true;
    try {
      if (mode === 'register') {
        const user = await api('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
        await establishSession(user);
        return;
      }
      const user = await api(mode === 'admin' ? '/auth/admin/login' : `/auth/${mode}`, { method: 'POST', body: JSON.stringify(payload) });
      await establishSession(user);
    } catch (error) { $('#authError').textContent = error.message; $('#authError').hidden = false; }
    finally { button.disabled = false; }
  });
  $('#authPanel').addEventListener('submit', async event => {
    const form = event.target;
    try {
      if (form.id === 'recoveryRequestForm') {
        event.preventDefault(); state.recoveryEmail = new FormData(form).get('email').trim();
        await api('/auth/recovery/request',{method:'POST',body:JSON.stringify({email:state.recoveryEmail})}); showRecoveryCodeStep();
      } else if (form.id === 'recoveryCodeForm') {
        event.preventDefault(); const data=new FormData(form); const result=await api('/auth/recovery/verify',{method:'POST',body:JSON.stringify({email:data.get('email'),code:data.get('code')})}); state.recoveryToken=result.resetToken; showRecoveryPasswordStep();
      } else if (form.id === 'recoveryPasswordForm') {
        event.preventDefault(); const data=new FormData(form); if(data.get('newPassword')!==data.get('confirmPassword')) throw new Error('The passwords do not match.');
        await api('/auth/recovery/complete',{method:'POST',body:JSON.stringify({resetToken:state.recoveryToken,newPassword:data.get('newPassword')})}); state.recoveryToken=''; state.recoveryEmail=''; setAuthMode(state.authMode); toast('Password changed. Sign in with your mobile number.');
      } else if (form.id === 'emailVerificationRequestForm') {
        event.preventDefault(); const email=new FormData(form).get('email').trim(); await api('/auth/email/verification/request',{method:'POST',body:JSON.stringify({email})}); showEmailVerification(email); toast('If available, a verification code was sent.');
      } else if (form.id === 'emailVerificationForm') {
        event.preventDefault(); const data=new FormData(form); await api('/auth/email/verify',{method:'POST',body:JSON.stringify({email:data.get('email'),code:data.get('code')})});
        if(state.pendingAuth){const user=await api('/auth/login',{method:'POST',body:JSON.stringify(state.pendingAuth)});state.pendingAuth=null;await establishSession(user);} else {setAuthMode(state.authMode);toast('Recovery email verified. You can now sign in.');}
      }
    } catch(error) { toast(error.message); }
  });
}

function init() {
  document.documentElement.dataset.locale = state.locale;
  observeTranslatedContent();
  $('#localeToggle').textContent = state.locale === 'en' ? 'मराठी' : 'English';
  bindEvents();
  if(state.user && state.token) {
    updateAccountIdentity();
    activateRoleView();
  }
  try {
    renderCart();
    syncDeliveryMode();
    translateVisibleText();

  } catch (error) {
    console.error('AgroConnect UI initialization failed', error);
    toast('The page had a display issue. Reload and try again.');
  }
  loadRates();
  void loadMarketTicker();
  loadProducts();
  loadSchemes();
  if(state.locationName){applyLocationLabel(state.locationName);$('#shopQuery').value=state.locationName;$('#weatherCity').value=state.locationName;void loadWeather(state.locationName);void loadShops(state.locationName);}
  if(navigator.permissions?.query){navigator.permissions.query({name:'geolocation'}).then(permission=>{if(permission.state==='granted'&&(!state.locationName||state.serviceCoordinates))captureServiceLocation();else if(permission.state==='prompt'&&!state.locationName)captureServiceLocation();}).catch(()=>{if(!state.locationName)captureServiceLocation();});}
  else if(!state.locationName)captureServiceLocation();
}

init();




