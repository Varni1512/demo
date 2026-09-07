import React, { createContext, useContext, useState, useEffect } from "react";

const LANGUAGE_KEY = "sv_language_preference";

export const translations = {
  hi: {
    // Navigation & Global
    home: "होम",
    allNews: "सभी समाचार",
    districtNews: "जिले",
    education: "शिक्षा",
    worldNews: "देश-विदेश",
    technology: "तकनीक",
    sports: "खेल",
    religion: "धर्म",
    disaster: "आपदा",
    accident: "दुर्घटना",
    historicJharkhand: "झारखंड",
    dumkaSpecial: "दुमका",
    videos: "यूट्यूब वीडियो",
    advertisement: "विज्ञापन",
    aboutUs: "हमारे बारे में",
    adminPanel: "एडमिन पैनल",
    adminLogin: "एडमिन लॉगिन",
    menu: "मेन्यू",
    search: "खोजें",
    searchPlaceholder: "समाचार या रिपोर्टर खोजें...",
    notifications: "सूचनाएं",
    markAllRead: "सभी पढ़ी गईं",
    clearAll: "सभी हटाएं",
    noNotifications: "कोई नई सूचना नहीं है।",
    viewAllNews: "सभी ताज़ा खबरें",
    login: "लॉगिन",
    logout: "लॉगआउट",
    adminActive: "एडमिन सक्रिय",
    goToDashboard: "डैशबोर्ड पर जाएं",
    selectLanguage: "भाषा चुनें",
    switchLanguage: "हिंदी / EN",

    // Sidebar Section Headers
    mainMenu: "मुख्य मेन्यू",
    categories: "समाचार श्रेणियां",
    jharkhandFeatures: "झारखंड विशेष",
    adminAccount: "व्यवस्थापक",

    // Homepage Sections
    latestNews: "ताज़ा खबरें",
    breakingNews: "ब्रेकिंग न्यूज़",
    todayHighlights: "आज की प्रमुख खबरें",
    todayTopStories: "आज की प्रमुख खबरें",
    todayTopStoriesSubtitle: "स्थानीय, जिला, राज्य और देश की ताजा खबरें",
    allRegionalNews: "स्थानीय, जिला, राज्य और देश की ताजा खबरें",
    allNewsHeading: "सभी समाचार",
    featuredStories: "प्रमुख खबरें",
    featuredBadge: "सुर्खियां",
    readMore: "पूरी खबर पढ़ें",
    readStory: "पढ़ें",
    read: "पढ़ें",
    breakingUpdates: "ताज़ा ब्रेकिंग अपडेट्स",
    reporterFallback: "स्वदेश वाणी संवाददाता",
    sponsoredAd: "Sponsored / प्रायोजित विज्ञापन",
    footerTagline: "आपके क्षेत्र, राज्य और देश की महत्वपूर्ण खबरें सही और सरल भाषा में आप तक पहुंचाने का हमारा प्रयास।",
    backToTop: "शीर्ष पर जाएं",
    quickLinks: "महत्वपूर्ण लिंक्स",
    contactUs: "संपर्क करें",
    copyright: "सर्वाधिकार सुरक्षित",
    privacyPolicy: "गोपनीयता नीति",
    termsConditions: "नियम व शर्तें",
    footerAddress: "दुमका, झारखंड, भारत",
    minutesRead: "मिनट",
    reporter: "संवाददाता",
    byReporter: "स्वदेश वाणी ब्यूरो",
    sponsored: "प्रायोजित विज्ञापन",
    learnMore: "विस्तार से जानें",
    trendingNews: "सबसे ज्यादा पढ़ी गई",
    topHeadlines: "प्रमुख सुर्खियां",
    photoGallery: "फोटो गैलरी",
    viewAll: "सभी देखें",
    exploreNow: "अभी देखें",
    totalNewsAvailable: "कुल समाचार उपलब्ध",

    // Subscription Section
    subscribeTitle: "दैनिक समाचार सदस्यता",
    subscribeHeading: "न्यूज़ अपडेट और ब्रेकिंग अलर्ट्स प्राप्त करें",
    subscribeDesc: "झारखंड, देश और दुनिया की ताजा खबरें, ब्रेकिंग न्यूज़ एवं महत्वपूर्ण सूचनाएं सीधे अपने व्हाट्सएप या ईमेल पर प्राप्त करें।",
    subscribeHint: "💡 मोबाइल नंबर या ईमेल — कोई भी एक दर्ज करें",
    mobileTab: "📱 मोबाइल नंबर (WhatsApp)",
    emailTab: "✉️ ईमेल (Email Address)",
    enterMobile: "अपना 10 अंकों का मोबाइल नंबर दर्ज करें (WhatsApp / SMS)",
    enterEmail: "अपना ईमेल पता दर्ज करें (Enter Email Address)",
    mobileHint: "✓ प्रतिदिन सुबह ताज़ा मुख्य समाचार सीधे आपके फोन पर भेजे जाएंगे",
    emailHint: "✓ दैनिक ई-न्यूज़लेटर एवं ताज़ा ब्रेकिंग अपडेट्स आपके इनबॉक्स में प्राप्त होंगे",
    subscribeMobileBtn: "मुफ़्त व्हाट्सएप / एसएमएस सदस्यता लें",
    subscribeEmailBtn: "मुफ़्त ईमेल न्यूज़लेटर सदस्यता लें",
    subscribing: "सब्सक्राइब किया जा रहा है...",
    subscribeSuccess: "धन्यवाद! आप स्वदेश वाणी न्यूज़ नेटवर्क से सफलतापूर्वक जुड़ गए हैं।",
    dataSafe: "🔒 आपका डेटा 100% सुरक्षित और गोपनीय है",
    noSpam: "📰 कोई स्पैम नहीं",
    unsubscribeAnytime: "🚫 कभी भी अनसब्सक्राइब करें",
    orText: "या",

    // Category Pages
    districtTitle: "जिला समाचार",
    districtSubtitle: "झारखंड के सभी जिलों से जुड़ी ताजा खबरें, स्थानीय अपडेट, प्रशासन, शिक्षा, स्वास्थ्य और जनसमस्याएं।",
    selectDistrict: "जिला चुनें",
    allDistricts: "सभी जिले",
    allCategories: "सभी खबरें",
    searchDistrictPlaceholder: "जिले या खबर के नाम से खोजें...",
    noNewsFound: "कोई खबर नहीं मिली",
    noNewsHint: "कृपया किसी दूसरे जिले या श्रेणी का चयन करें।",
    viewAllNewsBtn: "सभी खबरें देखें",
    districtCoverage: "जिला कवरेज",
    sendNewsTitle: "अपने जिले की खबर सबसे पहले पढ़ें",
    sendNewsDesc: "अपने क्षेत्र की खबर, समस्या और स्थानीय अपडेट हम तक भेजें।",
    sendNewsBtn: "खबर भेजें",

    educationTitle: "शिक्षा एवं करियर",
    educationSubtitle: "झारखंड बोर्ड, जेपीएससी, जेएसएससी, विश्वविद्यालय, परीक्षा परिणाम और करियर गाइडेंस।",
    worldTitle: "देश-विदेश एवं अंतरराष्ट्रीय",
    worldSubtitle: "वैश्विक कूटनीति, अंतरराष्ट्रीय अर्थव्यवस्था, पर्यावरण सम्मेलन और दुनिया भर के प्रमुख घटनाक्रम।",
    techTitle: "तकनीक एवं डिजिटल भारत",
    techSubtitle: "आर्टिफिशियल इंटेलिजेंस, स्मार्टफोन, साइबर सुरक्षा, गैजेट्स और आधुनिक तकनीकी नवाचार।",
    sportsTitle: "खेल जगत",
    sportsSubtitle: "क्रिकेट, फुटबॉल, हॉकी, तीरंदाजी, राष्ट्रीय खेल और झारखंड के उभरते खिलाड़ी।",
    historicTitle: "ऐतिहासिक झारखंड",
    historicSubtitle: "झारखंड की समृद्ध विरासत, स्वतंत्रता सेनानी, पर्यटन स्थल, परंपराएं और जनजातीय संस्कृति।",
    videosTitle: "यूट्यूब वीडियो",
    videosSubtitle: "हमारे यूट्यूब चैनल से ताज़ा खबरें, साक्षात्कार, ज़मीनी रिपोर्ट और विशेष कवरेज देखें।",
    adsTitle: "विज्ञापन एवं प्रचार",
    adsSubtitle: "स्वदेश वाणी डिजिटल नेटवर्क पर अपने व्यापार और सेवाओं का विज्ञापन प्रसारित करें।",
    advertiseWithUs: "हमारे साथ विज्ञापन करें",
    adsMainHeading: "अपने व्यवसाय का प्रचार हमारे समाचार प्लेटफॉर्म पर करें",
    adsMainDesc: "अपने व्यवसाय, संस्था, कार्यक्रम या सेवा का प्रचार करने के लिए नीचे दिया गया फॉर्म भरें। हमारी टीम आपकी जानकारी की समीक्षा करके आपसे संपर्क करेगी।",
    brandReachTitle: "अपने ब्रांड को लोगों तक पहुंचाएं",
    brandReachDesc: "हमारे स्थानीय पाठकों और दर्शकों तक अपने व्यवसाय की जानकारी पहुंचाएं।",
    adFeature1: "स्थानीय दर्शकों और पाठकों तक पहुंच",
    adFeature2: "व्यवसाय और कार्यक्रम का प्रचार",
    adFeature3: "किफायती विज्ञापन पैकेज",
    adFeature4: "हमारी टीम से सीधा संपर्क",
    adProcessTitle: "विज्ञापन प्रक्रिया",
    adStep1Title: "फॉर्म भरें",
    adStep1Desc: "अपनी और अपने व्यवसाय की जानकारी दर्ज करें।",
    adStep2Title: "समीक्षा",
    adStep2Desc: "हमारी टीम आपके विज्ञापन अनुरोध की समीक्षा करेगी।",
    adStep3Title: "संपर्क",
    adStep3Desc: "हमारी टीम कीमत और प्रचार की जानकारी के लिए आपसे संपर्क करेगी।",
    adImportantTitle: "महत्वपूर्ण जानकारी",
    adImportantDesc: "फॉर्म जमा करने के बाद हमारी टीम उपलब्धता, कीमत और विज्ञापन सामग्री के संबंध में आपसे संपर्क करेगी।",
    adFormTitle: "विज्ञापन अनुरोध फॉर्म",
    adFormSubtitle: "कृपया सभी आवश्यक जानकारी सही-सही भरें।",
    yourName: "आपका नाम",
    enterYourName: "अपना नाम दर्ज करें",
    businessName: "व्यवसाय / संस्था का नाम",
    enterBusinessName: "व्यवसाय का नाम",
    mobileNumber: "मोबाइल नंबर",
    enterMobileNumber: "मोबाइल नंबर",
    emailAddress: "ईमेल पता",
    enterEmailAddress: "ईमेल पता",
    cityLocation: "शहर / स्थान",
    enterCityLocation: "शहर या स्थान",
    adTypeLabel: "विज्ञापन का प्रकार",
    adDurationLabel: "विज्ञापन की अवधि",
    estimatedBudget: "अनुमानित बजट",
    budgetPlaceholder: "उदाहरण: ₹5,000",
    uploadCreative: "विज्ञापन सामग्री अपलोड करें",
    uploadCreativeBtn: "विज्ञापन फाइल अपलोड करें",
    uploadCreativeHint: "JPG, PNG, PDF या MP4 फाइल",
    additionalInfo: "अतिरिक्त जानकारी",
    additionalInfoPlaceholder: "अपने विज्ञापन या आवश्यकता के बारे में बताएं...",
    adConsentCheckbox: "मैं पुष्टि करता/करती हूं कि मेरे द्वारा दी गई जानकारी सही है और मैं विज्ञापन संबंधी बातचीत के लिए सहमत हूं।",
    sendAdRequestBtn: "विज्ञापन अनुरोध भेजें",
    adNeedHelpTitle: "विज्ञापन से जुड़ी जानकारी चाहिए?",
    adNeedHelpDesc: "हमारी टीम से सीधे संपर्क करें।",
    adSuccessTitle: "आपका अनुरोध सफलतापूर्वक भेज दिया गया है",
    adSuccessDesc: "धन्यवाद। हमारी विज्ञापन टीम जल्द ही आपसे संपर्क करेगी।",
    sendAnotherRequest: "दूसरा अनुरोध भेजें",

    // Article Detail
    shareArticle: "शेयर करें",
    copyLink: "लिंक कॉपी करें",
    linkCopied: "लिंक कॉपी हो गया!",
    whatsappShare: "WhatsApp शेयर",
    facebookShare: "Facebook शेयर",
    publishedOn: "प्रकाशन तिथि",
    relatedNews: "संबंधित समाचार",
    backToHome: "← मुख्य पृष्ठ पर लौटें",
    articleNotFound: "खबर उपलब्ध नहीं है",
    articleNotFoundDesc: "आप जिस खबर को ढूंढ रहे हैं, वह या तो हटा दी गई है या उसका लिंक बदल गया है।",
    goBack: "वापस जाएं",

    // Admin Panel
    adminTitle: "स्वदेश वाणी",
    adminSubtitle: "एडमिन पैनल",
    adminTagline: "सत्य, निष्पक्ष और सटीक पत्रकारिता • स्वदेश वाणी",
    dashboard: "डैशबोर्ड",
    newsList: "सभी समाचार",
    addNews: "नया लेख लिखें",
    editNews: "समाचार संपादित करें",
    notificationsTab: "सूचनाएं (Alerts)",
    subscribersTab: "सब्सक्राइबर्स",
    advertisementsTab: "विज्ञापन (Ads)",
    visitWebsite: "वेबसाइट देखें",
    addNewArticleBtn: "+ नया समाचार जोड़ें",
    publishNews: "नया समाचार प्रकाशित करें",
    updateNews: "समाचार अपडेट करें",
    articleTitle: "समाचार का मुख्य शीर्षक (NEWS HEADLINE) *",
    enterHeadline: "प्रभावशाली और स्पष्ट शीर्षक लिखें...",
    selectCategory: "श्रेणी (CATEGORY) *",
    selectDistrictLabel: "जिला (DISTRICT - यदि झारखंड से है)",
    reporterName: "संवाददाता / लेखक (REPORTER / AUTHOR)",
    summaryExcerpt: "संक्षिप्त विवरण (SHORT SUMMARY / EXCERPT)",
    summaryPlaceholder: "समाचार का 1-2 पंक्तियों में मुख्य सार...",
    fullContent: "विस्तृत समाचार (FULL STORY CONTENT) *",
    fullContentPlaceholder: "पूरी खबर विस्तार से यहां लिखें...",
    featuredImage: "मुख्य तस्वीर (FEATURED IMAGE)",
    uploadImageClick: "कंप्यूटर / मोबाइल से तस्वीर चुनें (Click to Upload)",
    pasteImageUrl: "या फिर इमेज URL पेस्ट करें (e.g. https://...)",
    publishStatus: "प्रकाशन स्थिति (STATUS)",
    statusPublished: "Published (लाइव प्रकाशित)",
    statusDraft: "Draft (ड्राफ्ट रखें)",
    publishAndNotify: "प्रकाशित करें एवं सूचना भेजें (Publish & Notify)",
    updateChanges: "अपडेट सुरक्षित करें (Save Changes)",
    cancel: "रद्द करें (Cancel)",
    totalPublishedNews: "कुल प्रकाशित समाचार",
    totalSubscribers: "कुल सब्सक्राइबर्स",
    activeNotifications: "सक्रिय सूचनाएं",
    liveAds: "लाइव विज्ञापन",
    recentNewsArticles: "हाल में प्रकाशित समाचार (Recent Articles)",
    action: "कार्रवाई",
    edit: "संपादित करें",
    delete: "हटाएं",
    viewLive: "लाइव देखें",
    confirmDeleteNews: "क्या आप वाकई इस समाचार को हटाना चाहते हैं?",
    confirmDeleteSub: "क्या आप इस सब्सक्राइबर को हटाना चाहते हैं?",
    publishSuccessTitle: "समाचार सफलतापूर्वक प्रकाशित हुआ!",
    publishSuccessDesc: "यह समाचार अब मुख्य पृष्ठ एवं सभी संबंधित श्रेणियों में लाइव दिखाई दे रहा है।",
    openLiveArticle: "लाइव खबर खोलें",
    closeModal: "बंद करें",
    legal: "कानूनी व नीतियां",
  },
  en: {
    // Navigation & Global
    home: "Home",
    allNews: "All News",
    districtNews: "Districts",
    education: "Education",
    worldNews: "World",
    technology: "Technology",
    sports: "Sports",
    religion: "Religion",
    disaster: "Disaster",
    accident: "Accidents",
    historicJharkhand: "Jharkhand",
    dumkaSpecial: "Dumka",
    videos: "YouTube Videos",
    advertisement: "Advertisement",
    aboutUs: "About Us",
    adminPanel: "Admin Panel",
    adminLogin: "Admin Login",
    menu: "Menu",
    search: "Search",
    searchPlaceholder: "Search news or reporter...",
    notifications: "Notifications",
    markAllRead: "Mark all read",
    clearAll: "Clear all",
    noNotifications: "No new notifications.",
    viewAllNews: "View all latest news",
    login: "Login",
    logout: "Logout",
    adminActive: "Admin Active",
    goToDashboard: "Go to Dashboard",
    selectLanguage: "Select Language",
    switchLanguage: "हिंदी / EN",

    // Sidebar Section Headers
    mainMenu: "MAIN MENU",
    categories: "CATEGORIES",
    jharkhandFeatures: "JHARKHAND & FEATURES",
    adminAccount: "ADMIN & ACCOUNT",

    // Homepage Sections
    latestNews: "Latest News",
    breakingNews: "Breaking News",
    todayHighlights: "Today's Highlights",
    todayTopStories: "Today's Top Headlines",
    todayTopStoriesSubtitle: "Local, district, state, and national breaking stories",
    allRegionalNews: "Local, district, national, and world top stories",
    allNewsHeading: "All News & Reports",
    featuredStories: "Featured Stories",
    featuredBadge: "FEATURED",
    readMore: "Read Full Story",
    readStory: "Read",
    read: "Read",
    breakingUpdates: "Latest Breaking Updates",
    reporterFallback: "Swadesh Vani Reporter",
    sponsoredAd: "Sponsored / Advertisement",
    footerTagline: "Our mission to deliver accurate, impartial, and reliable news from your region, state, and country in clear language.",
    backToTop: "Top",
    quickLinks: "Quick Links",
    contactUs: "Contact Us",
    copyright: "All Rights Reserved",
    privacyPolicy: "Privacy Policy",
    termsConditions: "Terms & Conditions",
    footerAddress: "Dumka, Jharkhand, India",
    minutesRead: "min read",
    reporter: "Reporter",
    byReporter: "Swadesh Vani Bureau",
    sponsored: "Sponsored Ad",
    learnMore: "Learn More",
    trendingNews: "Trending News",
    topHeadlines: "Top Headlines",
    photoGallery: "Photo Gallery",
    viewAll: "View All",
    exploreNow: "Explore Now",
    totalNewsAvailable: "Total News Available",

    // Subscription Section
    subscribeTitle: "Daily News Subscription",
    subscribeHeading: "Get News Updates & Breaking Alerts",
    subscribeDesc: "Receive the latest Jharkhand, national, and international breaking news directly on WhatsApp or Email.",
    subscribeHint: "💡 Enter either mobile number or email address",
    mobileTab: "📱 Mobile Number (WhatsApp)",
    emailTab: "✉️ Email Address",
    enterMobile: "Enter your 10-digit mobile number (WhatsApp / SMS)",
    enterEmail: "Enter your email address",
    mobileHint: "✓ Daily morning breaking news will be sent directly to your phone",
    emailHint: "✓ Daily e-newsletter & breaking updates delivered to your inbox",
    subscribeMobileBtn: "Subscribe Free on WhatsApp / SMS",
    subscribeEmailBtn: "Subscribe Free to Email Newsletter",
    subscribing: "Subscribing...",
    subscribeSuccess: "Thank you! You have successfully subscribed to Swadesh Vani News Network.",
    dataSafe: "🔒 Your data is 100% safe & private",
    noSpam: "📰 No Spam",
    unsubscribeAnytime: "🚫 Unsubscribe anytime",
    orText: "OR",

    // Category Pages
    districtTitle: "District News",
    districtSubtitle: "Latest updates, administration, education, healthcare, sports, and local issues from all districts of Jharkhand.",
    selectDistrict: "Select District",
    allDistricts: "All Districts",
    allCategories: "All Categories",
    searchDistrictPlaceholder: "Search by district or story title...",
    noNewsFound: "No News Found",
    noNewsHint: "Please select another district or category filter.",
    viewAllNewsBtn: "View All News",
    districtCoverage: "District Coverage",
    sendNewsTitle: "Be the first to share news from your district",
    sendNewsDesc: "Submit local stories, community issues, and news updates to our editorial team.",
    sendNewsBtn: "Submit Story",

    educationTitle: "Education & Careers",
    educationSubtitle: "Jharkhand Board, JPSC, JSSC, Universities, Examination Results, and Career Guidance.",
    worldTitle: "National & Global News",
    worldSubtitle: "Global diplomacy, international economy, environment summits, and top worldwide headlines.",
    techTitle: "Technology & Digital India",
    techSubtitle: "Artificial Intelligence, smartphones, cybersecurity, gadgets, and modern tech innovation.",
    sportsTitle: "Sports Arena",
    sportsSubtitle: "Cricket, football, hockey, archery, national tournaments, and Jharkhand's emerging athletes.",
    historicTitle: "Historic Jharkhand",
    historicSubtitle: "Rich heritage of Jharkhand, freedom fighters, scenic destinations, and tribal culture.",
    videosTitle: "YouTube Videos",
    videosSubtitle: "Watch the latest news, exclusive interviews, ground reports, and special coverage from our channel.",
    adsTitle: "Advertising & Partnerships",
    adsSubtitle: "Advertise and promote your business or services on Swadesh Vani Digital Network.",
    advertiseWithUs: "Advertise With Us",
    adsMainHeading: "Promote Your Business on Our News Platform",
    adsMainDesc: "Fill out the form below to promote your business, organization, event, or service. Our team will review your details and contact you.",
    brandReachTitle: "Expand Your Brand's Reach",
    brandReachDesc: "Reach our vast network of local readers and digital audiences across Jharkhand and beyond.",
    adFeature1: "Access to hyper-local & regional audiences",
    adFeature2: "Business, enterprise, and event publicity",
    adFeature3: "Cost-effective, high-ROI ad packages",
    adFeature4: "Direct dedicated support from our team",
    adProcessTitle: "Advertising Process",
    adStep1Title: "Submit Form",
    adStep1Desc: "Enter your details and advertising requirements.",
    adStep2Title: "Review",
    adStep2Desc: "Our editorial and sales team will review your request.",
    adStep3Title: "Direct Contact",
    adStep3Desc: "We will reach out to discuss slots, pricing, and campaign launch.",
    adImportantTitle: "Important Information",
    adImportantDesc: "After submission, our advertising team will get in touch regarding slot availability, custom pricing, and creative material.",
    adFormTitle: "Advertisement Request Form",
    adFormSubtitle: "Please provide accurate information for quick processing.",
    yourName: "Your Name",
    enterYourName: "Enter your full name",
    businessName: "Business / Organization Name",
    enterBusinessName: "Enter business or entity name",
    mobileNumber: "Mobile Number",
    enterMobileNumber: "Enter 10-digit mobile number",
    emailAddress: "Email Address",
    enterEmailAddress: "Enter email address",
    cityLocation: "City / Location",
    enterCityLocation: "Enter city or district",
    adTypeLabel: "Advertisement Type",
    adDurationLabel: "Campaign Duration",
    estimatedBudget: "Estimated Budget",
    budgetPlaceholder: "e.g. ₹5,000 / $100",
    uploadCreative: "Upload Creative / Asset",
    uploadCreativeBtn: "Upload Advertisement File",
    uploadCreativeHint: "JPG, PNG, PDF, or MP4 files",
    additionalInfo: "Additional Details & Requirements",
    additionalInfoPlaceholder: "Tell us more about your target audience, goals, or design needs...",
    adConsentCheckbox: "I confirm that the details provided are correct and agree to be contacted for advertisement coordination.",
    sendAdRequestBtn: "Submit Advertisement Request",
    adNeedHelpTitle: "Need Assistance with Advertising?",
    adNeedHelpDesc: "Contact our media sales team directly.",
    adSuccessTitle: "Your Request Has Been Submitted Successfully!",
    adSuccessDesc: "Thank you! Our advertising team will contact you shortly.",
    sendAnotherRequest: "Submit Another Request",

    // Article Detail
    shareArticle: "Share",
    copyLink: "Copy Link",
    linkCopied: "Link Copied!",
    whatsappShare: "WhatsApp Share",
    facebookShare: "Facebook Share",
    publishedOn: "Published Date",
    relatedNews: "Related Stories",
    backToHome: "← Back to Homepage",
    articleNotFound: "Article Not Found",
    articleNotFoundDesc: "The article you are looking for has either been removed or the link has changed.",
    goBack: "Go Back",

    // Admin Panel
    adminTitle: "Swadesh Vani",
    adminSubtitle: "Admin Panel",
    adminTagline: "Truthful, impartial, and precise journalism • Swadesh Vani",
    dashboard: "Dashboard",
    newsList: "News List",
    addNews: "Write New Article",
    editNews: "Edit Article",
    notificationsTab: "Notifications (Alerts)",
    subscribersTab: "Subscribers",
    advertisementsTab: "Advertisements (Ads)",
    visitWebsite: "Visit Website",
    addNewArticleBtn: "+ Add New Article",
    publishNews: "Publish News Article",
    updateNews: "Update News Article",
    articleTitle: "News Headline *",
    enterHeadline: "Write a compelling and clear headline...",
    selectCategory: "Category *",
    selectDistrictLabel: "District (If from Jharkhand)",
    reporterName: "Reporter / Author",
    summaryExcerpt: "Short Summary / Excerpt",
    summaryPlaceholder: "1-2 lines summarizing the main story...",
    fullContent: "Full Story Content *",
    fullContentPlaceholder: "Write the full story details here...",
    featuredImage: "Featured Image",
    uploadImageClick: "Select photo from computer / mobile (Click to Upload)",
    pasteImageUrl: "Or paste an image URL (e.g. https://...)",
    publishStatus: "Publication Status",
    statusPublished: "Published (Live on Website)",
    statusDraft: "Draft (Keep in Drafts)",
    publishAndNotify: "Publish & Notify Readers",
    updateChanges: "Save Changes",
    cancel: "Cancel",
    totalPublishedNews: "Total Published Articles",
    totalSubscribers: "Total Subscribers",
    activeNotifications: "Active Alerts",
    liveAds: "Live Advertisements",
    recentNewsArticles: "Recently Published Articles",
    action: "Action",
    edit: "Edit",
    delete: "Delete",
    viewLive: "View Live",
    confirmDeleteNews: "Are you sure you want to delete this news article?",
    confirmDeleteSub: "Are you sure you want to delete this subscriber?",
    publishSuccessTitle: "Article Published Successfully!",
    publishSuccessDesc: "This article is now live on the homepage and across all related category sections.",
    openLiveArticle: "Open Live Article",
    closeModal: "Close",
    legal: "Legal & Policies",
  },
};

const LanguageContext = createContext({
  language: "hi",
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key) => key,
});

import { safeStorage } from "../utils/safeStorage";

export const LanguageProvider = ({ children }) => {
  const [language, setLangState] = useState(() => {
    try {
      return safeStorage.getItem(LANGUAGE_KEY) || "hi";
    } catch {
      return "hi";
    }
  });

  // Apply Google Translate cookie & trigger translation
  const applyDOMTranslation = (targetLang) => {
    try {
      const gValue = targetLang === "en" ? "/hi/en" : "/hi/hi";
      const hostname = window.location.hostname;
      
      // Set translate cookies for both domain and subdomains
      document.cookie = `googtrans=${gValue}; path=/;`;
      if (hostname) {
        document.cookie = `googtrans=${gValue}; path=/; domain=${hostname}`;
        const parts = hostname.split(".");
        if (parts.length > 2) {
          document.cookie = `googtrans=${gValue}; path=/; domain=.${parts.slice(-2).join(".")}`;
        }
      }

      // If google translate select dropdown is rendered, update it
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = targetLang;
        select.dispatchEvent(new Event("change"));
      }
    } catch (e) {
      console.warn("Translation sync error:", e);
    }
  };

  useEffect(() => {
    // Initialize Google Translate Script dynamically if not present
    if (typeof window !== "undefined" && !window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "hi",
              includedLanguages: "hi,en",
              autoDisplay: false,
            },
            "google_translate_element"
          );
        }
      };

      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.type = "text/javascript";
        script.async = true;
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.head.appendChild(script);
      }
    }

    // Apply saved language on mount
    applyDOMTranslation(language);
  }, []);

  const setLanguage = (lang) => {
    const validLang = lang === "en" ? "en" : "hi";
    setLangState(validLang);
    try {
      safeStorage.setItem(LANGUAGE_KEY, validLang);
    } catch {}
    applyDOMTranslation(validLang);
    window.dispatchEvent(new CustomEvent("sv_language_change", { detail: validLang }));
  };

  const toggleLanguage = () => {
    const nextLang = language === "hi" ? "en" : "hi";
    setLanguage(nextLang);
  };

  const t = (key) => {
    if (!key) return "";
    return translations[language]?.[key] || translations["hi"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
