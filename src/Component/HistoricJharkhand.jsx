import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  History,
  Compass,
  ArrowRight,
  Clock,
  User,
  Bookmark,
  Sparkles,
  TreePine,
  Waves,
  Mountain,
  CheckCircle2,
} from "lucide-react";
import {
  getAllArticles,
  syncArticlesFromServer,
  toHindiNumber,
  getCategoryFallbackImage,
  resolveArticleImage,
} from "../data/newsData";
import { useLanguage } from "../context/LanguageContext";

// Local authentic photos for every single place
import baidyanathImage from "./photos/baidyanath.jpg";
import netarhatImage from "./photos/netarhat.jpg";
import hundruFallsImage from "./photos/Hundrufalls.jpeg";
import dassamFallsImage from "./photos/dassam.jpg";
import jonhaFallsImage from "./photos/jonha.jpg";
import parasnathImage from "./photos/parasnath.jpg";
import palamuFortImage from "./photos/Palamu.jpeg";
import betlaParkImage from "./photos/Betla.jpeg";
import malutiTemplesImage from "./photos/Maluti.jpeg";
import basukinathTempleImage from "./photos/basukinath.jpg";
import trikutHillsImage from "./photos/trikut.jpg";
import mccluskieganjImage from "./photos/mccluskieganj.jpg";
import patratuValleyImage from "./photos/patratu.jpg";
import jagannathTempleImage from "./photos/jagannath.jpg";
import ratuPalaceImage from "./photos/ratu.jpeg";
import jubileeParkImage from "./photos/jubileepark.jpg";
import naulakhaMandirImage from "./photos/naulakha.jpg";
import rajmahalHillsImage from "./photos/rajmahal.jpg";
import hijlaMelaImage from "./photos/hijla.jpeg";
import dumkaRailwayImage from "./photos/railwaystation.jpeg";
import dumkaCityImage from "./photos/dumka.jpeg";

export const incredibleJharkhandPlaces = [
  {
    id: "baidyanath-dham",
    name: "बाबा बैद्यनाथ धाम (द्वादश ज्योतिर्लिंग)",
    category: "धार्मिक एवं तीर्थ स्थल",
    type: "spiritual",
    location: "देवघर जिला",
    image: baidyanathImage,
    description:
      "भगवान शिव के 12 पवित्र ज्योतिर्लिंगों में से एक और 51 शक्तिपीठों में से एक, बाबा बैद्यनाथ धाम संपूर्ण भारत के सबसे पावन तीर्थस्थलों में गिना जाता है। सावन के पावन माह में यहाँ लगने वाला विश्वप्रसिद्ध श्रावणी मेला एशिया का सबसे लंबा मानव समागम है, जहाँ लाखों कांवरिये सुल्तानगंज से 105 किमी पैदल गंगाजल लेकर जलार्पण करते हैं।",
    highlight:
      "श्रावणी मेले और महाशिवरात्रि पर दर्शन के लिए शीघ्र दर्शन कतार अथवा सुबह-शाम की आरती का समय चुनें।",
  },
  {
    id: "netarhat",
    name: "नेतरहाट — 'छोटानागपुर की रानी'",
    category: "हिल स्टेशन एवं प्राकृतिक सौंदर्य",
    type: "nature",
    location: "लातेहार जिला (समुद्र तल से 3,700 फीट)",
    image: netarhatImage,
    description:
      "घने देवदार, साल और चीड़ के वनों से घिरा नेतरहाट झारखंड का सबसे मनोरम हिल स्टेशन है। मैग्नोलिया प्वाइंट का विहंगम सूर्यास्त, सनराइज प्वाइंट, कोयल व्यू प्वाइंट और नेतरहाट आवासीय विद्यालय यहाँ के मुख्य आकर्षण हैं। सर्दियों में यहाँ का शांत और ठंडा वातावरण पर्यटकों को अद्भुत शांति प्रदान करता है।",
    highlight:
      "मैग्नोलिया सनसेट प्वाइंट पर शाम 5 बजे से पहले पहुँचें और ब्रिटिश काल की लोकगाथाओं का अनुभव करें।",
  },
  {
    id: "hundru-falls",
    name: "हुंडरू जलप्रपात (Hundru Falls)",
    category: "प्राकृतिक जलप्रपात",
    type: "nature",
    location: "अंगड़ा प्रखंड, रांची जिला",
    image: hundruFallsImage,
    description:
      "स्वर्णरेखा नदी का 320 फीट की ऊंचाई से विशाल चट्टानों पर गिरना हुंडरू जलप्रपात को झारखंड का सबसे शानदार जलप्रपात बनाता है। गिरने वाले पानी से नीचे बने प्राकृतिक कुंड और चारों ओर फैले घने जंगल पर्यटकों और फोटोग्राफरों के लिए स्वर्ग समान हैं।",
    highlight:
      "मानसून के बाद अक्टूबर से फरवरी का समय जलप्रपात के शांत और स्वच्छ रूप को देखने के लिए सर्वोत्तम है।",
  },
  {
    id: "dassam-falls",
    name: "दसम जलप्रपात (Dassam Falls)",
    category: "प्राकृतिक जलप्रपात",
    type: "nature",
    location: "ताैमारा के पास, कांची नदी, रांची",
    image: dassamFallsImage,
    description:
      "कांची नदी का पानी जब 144 फीट की ऊंचाई से 10 अलग-अलग धाराओं में नीचे गिरता है, तो इसे 'दसम' (दस धार) कहा जाता है। पहाड़ियों और हरी-भरी घाटियों के बीच स्थित यह जलप्रपात अपनी गर्जना और दूधिया फुहारों के लिए विख्यात है।",
    highlight:
      "सीढ़ियों से नीचे उतरते समय निर्धारित रेलिंग वाले सुरक्षित व्यू-प्वाइंट्स का ही उपयोग करें।",
  },
  {
    id: "jonha-falls",
    name: "जोन्हा जलप्रपात (गौतमधारा)",
    category: "जलप्रपात एवं बौद्ध धरोहर",
    type: "nature",
    location: "राढ़ू नदी, अनगड़ा, रांची",
    image: jonhaFallsImage,
    description:
      "राढ़ू नदी पर स्थित 141 फीट ऊंचा जोन्हा जलप्रपात प्राकृतिक सौंदर्य के साथ-साथ आध्यात्मिक महत्व भी रखता है। मान्यता है कि भगवान बुद्ध ने यहाँ स्नान किया था। जलप्रपात के समीप स्थित बौद्ध आश्रम और 722 सीढ़ियों का रोमांचक सफर पर्यटकों को आकर्षित करता है।",
    highlight:
      "जलप्रपात के शीर्ष पर स्थित भगवान बुद्ध के मंदिर और ध्यान कक्ष के भी दर्शन अवश्य करें।",
  },
  {
    id: "parasnath-shikharji",
    name: "पारसनाथ / सम्मेद शिखरजी (सर्वोच्च शिखर)",
    category: "जैन महातीर्थ एवं सर्वोच्च पर्वत",
    type: "spiritual",
    location: "गिरिडीह जिला (ऊंचाई: 1,365 मीटर)",
    image: parasnathImage,
    description:
      "पारसनाथ पहाड़ी झारखंड की सबसे ऊंची पर्वत चोटी है। जैन धर्म के 24 तीर्थंकरों में से 20 तीर्थंकरों ने इसी पवित्र पर्वत पर मोक्ष (निर्वाण) प्राप्त किया था। विश्वभर के जैन श्रद्धालुओं के लिए सम्मेद शिखरजी की 27 किलोमीटर की वंदना परिक्रमा जीवन की सबसे पुण्य यात्रा मानी जाती है।",
    highlight:
      "शिखरजी की वंदना यात्रा तड़के 3-4 बजे मधुबन से प्रारंभ करना सबसे सुगम और शांत रहता है।",
  },
  {
    id: "palamu-fort",
    name: "पलामू किला (चेरो राजवंश की धरोहर)",
    category: "ऐतिहासिक किला एवं विरासत",
    type: "historic",
    location: "बेतला के पास, लातेहार/पलामू जिला",
    image: palamuFortImage,
    description:
      "औरंगा नदी के तट पर घने जंगलों के बीच खड़े पुराना और नया पलामू किला 16वीं-17वीं शताब्दी के चेरो राजाओं (मेदिनी राय) के वैभवशाली इतिहास के गवाह हैं। किले का प्रसिद्ध 'नागपुरी दरवाजा' और पत्थर की बारीक नक्काशी आज भी स्थापत्य कला का नायाब नमूना है।",
    highlight:
      "किले के साथ बेतला नेशनल पार्क की वन्यजीव सफारी को मिलाकर एक संपूर्ण ऐतिहासिक-प्राकृतिक ट्रिप बनाएं।",
  },
  {
    id: "betla-park",
    name: "बेतला राष्ट्रीय उद्यान (प्रोजेक्ट टाइगर)",
    category: "वन्यजीव एवं राष्ट्रीय उद्यान",
    type: "nature",
    location: "लातेहार एवं पलामू जिला",
    image: betlaParkImage,
    description:
      "1974 में भारत के प्रारंभिक टाइगर प्रोजेक्ट रिजर्व्स में शामिल बेतला नेशनल पार्क साल और बांस के घने जंगलों में हाथियों, बाघों, तेंदुओं, चीतलों, गौर (भारतीय बाइसन) और दुर्लभ पक्षियों का प्राकृतिक आवास है। यहाँ की जीप सफारी वन्यजीव प्रेमियों को रोमांच से भर देती है।",
    highlight:
      "सुबह 6:00 बजे की पहली वन सफारी में वन्यजीवों के दीदार की संभावना सर्वाधिक रहती है।",
  },
  {
    id: "maluti-temples",
    name: "मलूटी टेराकोटा मंदिर समूह (गुप्त काशी)",
    category: "प्राचीन टेराकोटा मंदिर संकुल",
    type: "spiritual",
    location: "मलूटी, शिकारीपाड़ा, दुमका जिला",
    image: malutiTemplesImage,
    description:
      "दुमका जिले का मलूटी गांव 108 प्राचीन टेराकोटा मंदिरों के अद्भुत संकुल के लिए वैश्विक स्तर पर प्रसिद्ध है। 17वीं शताब्दी के ननकर राजाओं द्वारा निर्मित इन मंदिरों की लाल पकी ईंटों पर रामायण, महाभारत और मां दुर्गा के महिषासुर मर्दिनी प्रसंगों की अद्वितीय नक्काशी की गई है।",
    highlight:
      "मौलीक्षा माता के मुख्य मंदिर में दर्शन और टेराकोटा कला के फोटोग्राफी के लिए यह स्थान अद्वितीय है।",
  },
  {
    id: "basukinath-temple",
    name: "बाबा बासुकीनाथ धाम (फौजदारी दरबार)",
    category: "प्रसिद्ध धार्मिक तीर्थस्थल",
    type: "spiritual",
    location: "बासुकीनाथ, जरमुंडी, दुमका जिला",
    image: basukinathTempleImage,
    description:
      "भगवान शिव का अत्यंत जागृत दरबार, जहाँ भक्त अपनी मनोकामनाएं लेकर 'फौजदारी बाबा' के समक्ष अर्जी लगाते हैं। देवघर बैद्यनाथ धाम में जलार्पण के उपरांत बासुकीनाथ में पूजा करने की सनातन परंपरा सदियों से चली आ रही है।",
    highlight:
      "देवघर से दुमका मार्ग पर स्थित बासुकीनाथ धाम में संध्या कालीन श्रृंगार आरती का दर्शन अत्यंत मनोहारी होता है।",
  },
  {
    id: "trikut-hills",
    name: "त्रिकूट पर्वत एवं त्रिकूटाचल आश्रम",
    category: "पर्वतीय पर्यटन एवं साहसिक स्थल",
    type: "nature",
    location: "देवघर-दुमका मार्ग, देवघर",
    image: trikutHillsImage,
    description:
      "ब्रह्मा, विष्णु और महेश के नाम पर तीन चोटियों वाला त्रिकूट पर्वत 2,470 फीट ऊंचा है। यहाँ मयूराक्षी नदी का उद्गम स्थल, रावण का हेलीपैड कही जाने वाली प्राचीन शिला, स्वामी दयानंद का त्रिकूटाचल आश्रम और भारत का सबसे तीव्र ऊर्ध्वाधर रोपवे स्थित है।",
    highlight:
      "चोटी से मिलने वाले 360-डिग्री विहंगम दृश्य और ताजी पहाड़ी हवा पर्यटकों के मन को तरोताजा कर देती है।",
  },
  {
    id: "mccluskieganj",
    name: "मैक्लुस्कीगंज — 'भारत का मिनी लंदन'",
    category: "औपनिवेशिक धरोहर एवं हिल रिट्रीट",
    type: "historic",
    location: "रांची जिला (रांची से 60 किमी)",
    image: mccluskieganjImage,
    description:
      "1930 के दशक में अर्नेस्ट टिमोथी मैक्लुस्की द्वारा बसाई गई दुनिया की एकमात्र एंग्लो-इंडियन बस्ती। यहाँ अंग्रेजों के जमाने के लाल खपरैल वाले कॉटेज, यूरोपीय शैली के बंगले, पुरानी बेकरी और साल के शांत जंगल ब्रिटिश काल के खूबसूरत इतिहास को जीवंत करते हैं।",
    highlight:
      "हैरी कॉटेज, डॉन बॉस्को अकादमी और जागृति विहार की यात्रा कर औपनिवेशिक जीवनशैली को करीब से महसूस करें।",
  },
  {
    id: "patratu-valley",
    name: "पतरातू घाटी एवं डैम",
    category: "घुमावदार घाटी एवं जल पर्यटन",
    type: "nature",
    location: "रामगढ़ जिला (रांची से 35 किमी)",
    image: patratuValleyImage,
    description:
      "जलेबीनुमा घुमावदार हरी-भरी सड़कें, गहरे मोड़ और खूबसूरत पतरातू डैम इस घाटी को झारखंड का सबसे लोकप्रिय वीकेंड ड्राइव बनाता है। डैम में बोटिंग, वाटर स्पोर्ट्स, आइलैंड कैफे और सूर्यास्त का दृश्य पर्यटकों को मंत्रमुग्ध कर देता है।",
    highlight:
      "शाम के समय पतरातू वैली व्यू-प्वाइंट से घुमावदार सड़कों की जगमगाती लाइटों का दृश्य फोटोग्राफी के लिए श्रेष्ठ है।",
  },
  {
    id: "jagannath-temple-ranchi",
    name: "ऐतिहासिक जगन्नाथ मंदिर, रांची",
    category: "17वीं सदी का ऐतिहासिक मंदिर",
    type: "historic",
    location: "धुर्वा पहाड़ी, रांची",
    image: jagannathTempleImage,
    description:
      "1691 ईस्वी में बड़कागढ़ के राजा ठाकुर एनी नाथ शाहदेव द्वारा पुरी के जगन्नाथ मंदिर की स्थापत्य शैली पर निर्मित यह पहाड़ी मंदिर रांची का गौरव है। आषाढ़ माह में यहाँ आयोजित होने वाली ऐतिहासिक रथ यात्रा में लाखों श्रद्धालु शामिल होते हैं।",
    highlight:
      "पहाड़ी की चोटी से पूरे रांची शहर और एचईसी परिसर का मनोरम विहंगम दृश्य दिखाई देता है।",
  },
  {
    id: "ratu-palace",
    name: "रातू राजमहल (नागवंशी राजघराना)",
    category: "शाही राजमहल एवं ऐतिहासिक धरोहर",
    type: "historic",
    location: "रातू, रांची जिला",
    image: ratuPalaceImage,
    description:
      "छोटानागपुर के 2000 साल पुराने नागवंशी राजवंश की अंतिम राजधानी रातू का यह विशाल राजमहल ब्रिटिश और भारतीय वास्तुकला के सम्मिश्रण का सुंदर उदाहरण है। यहाँ की ऐतिहासिक दुर्गा पूजा और राजमहल का पुराना वैभव आज भी दर्शनीय है।",
    highlight:
      "राजमहल के परिसर में स्थित प्राचीन मंदिरों और पारंपरिक नागवंशी स्थापत्य को देखना न भूलें।",
  },
  {
    id: "jubilee-park-dalma",
    name: "जुबली पार्क एवं दलमा वन्यजीव अभयारण्य",
    category: "उद्यान एवं जंगली हाथी अभयारण्य",
    type: "nature",
    location: "जमशेदपुर / पूर्वी सिंहभूम",
    image: jubileeParkImage,
    description:
      "मैसूर के वृंदावन गार्डन की तर्ज पर बना 200 एकड़ का जुबली पार्क और निकट स्थित दलमा की पहाड़ियों में एशियाई जंगली हाथियों, हिरणों और तेंदुओं का अभयारण्य जमशेदपुर को 'ग्रीन स्टील सिटी' का दर्जा दिलाते हैं।",
    highlight:
      "दलमा पीक पर स्थित भगवान शिव मंदिर और वॉचटावर से सुवर्णरेखा नदी घाटी का नजारा अवश्य देखें।",
  },
  {
    id: "naulakha-mandir",
    name: "नौलाखा मंदिर, देवघर",
    category: "भव्य राधा-कृष्ण स्थापत्य मंदिर",
    type: "spiritual",
    location: "देवघर शहर (बैद्यनाथ धाम से 1.5 किमी)",
    image: naulakhaMandirImage,
    description:
      "146 फीट ऊंचा यह भव्य मंदिर बेलूर मठ की स्थापत्य कला से प्रेरित है। 1948 में रानी चारुशीला द्वारा 9 लाख रुपये के दान से निर्मित होने के कारण इसे 'नौलाखा मंदिर' कहा जाता है। मंदिर में स्थापित राधा-कृष्ण की संगमरमरी प्रतिमाएं अत्यंत मनमोहक हैं।",
    highlight:
      "शांत वातावरण और सुंदर बाग-बगीचे ध्यान और शांति के लिए अत्यंत उपयुक्त हैं।",
  },
  {
    id: "rajmahal-hills-fossils",
    name: "राजमहल की पहाड़ियां एवं जुरासिक फॉसिल्स",
    category: "भूगर्भीय धरोहर एवं गंगा संगम",
    type: "nature",
    location: "साहिबगंज जिला",
    image: rajmahalHillsImage,
    description:
      "6.8 करोड़ से 15 करोड़ वर्ष पुराने जुरासिक काल के पादप जीवाश्मों (Plant Fossils) को संजोए राजमहल की पहाड़ियां विश्वभर के भूवैज्ञानिकों के आकर्षण का केंद्र हैं। साहिबगंज में पतित पावनी गंगा नदी झारखंड की सीमा को स्पर्श करती हुई आगे बढ़ती है।",
    highlight:
      "साहिबगंज फॉसिल पार्क और ऐतिहासिक तेलीगढ़ी किले के अवशेषों का भ्रमण अवश्य करें।",
  },
  {
    id: "hijla-mela",
    name: "ऐतिहासिक हिजला मेला स्थल",
    category: "जनजातीय लोक-संस्कृति एवं मेला",
    type: "historic",
    location: "हिजला, मयूराक्षी नदी तट, दुमका",
    image: hijlaMelaImage,
    description:
      "1890 से आयोजित होने वाला हिजला मेला संताल परगना की समृद्ध आदिवासी संस्कृति, लोककला, हस्तशिल्प, लोकनृत्य और पारंपरिक जीवनशैली का ऐतिहासिक उत्सव है, जो मयूराक्षी नदी के मनोरम तट पर लगता है।",
    highlight:
      "मेले में स्थानीय हस्तशिल्प, पारंपरिक व्यंजन और संताली लोकनृत्य का आनंद लें।",
  },
  {
    id: "dumka-city-railway",
    name: "दुमका रेलवे स्टेशन एवं उप-राजधानी",
    category: "संताल परगना का मुख्य केंद्र",
    type: "historic",
    location: "दुमका शहर, दुमका जिला",
    image: dumkaRailwayImage,
    description:
      "झारखंड की उप-राजधानी दुमका और इसका आधुनिक रेलवे स्टेशन संताल परगना के प्रमुख धार्मिक स्थलों (बासुकीनाथ, मलूटी) और पर्यटन केंद्रों का मुख्य प्रवेश द्वार है।",
    highlight:
      "दुमका से बासुकीनाथ, मलूटी और मसानजोर डैम की यात्रा की बेहतरीन शुरुआत यहाँ से होती है।",
  },
];

export default function HistoricJharkhandPage() {
  const { language, t } = useLanguage();
  const [dynamicArticles, setDynamicArticles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const fetchHeritageNews = () => {
      const all = getAllArticles();
      const heritage = all.filter(
        (a) =>
          a.category === "ऐतिहासिक झारखंड" ||
          a.category === "Historic" ||
          a.category === "Historic Jharkhand" ||
          a.category === "धरोहर" ||
          a.category === "संस्कृति" ||
          (a.title &&
            (a.title.includes("इतिहास") ||
              a.title.includes("धरोहर") ||
              a.title.includes("संस्कृति") ||
              a.title.includes("किला") ||
              a.title.includes("मंदिर") ||
              a.title.includes("झारखंड")))
      );
      setDynamicArticles(heritage);
    };

    fetchHeritageNews();
    syncArticlesFromServer().then(() => fetchHeritageNews());

    window.addEventListener("sv_articles_change", fetchHeritageNews);
    window.addEventListener("storage", fetchHeritageNews);

    return () => {
      window.removeEventListener("sv_articles_change", fetchHeritageNews);
      window.removeEventListener("storage", fetchHeritageNews);
    };
  }, []);

  const filterTabs = [
    { id: "all", label: "सभी स्थल (All Places)", icon: <Compass size={14} /> },
    { id: "spiritual", label: "धार्मिक एवं तीर्थ (Spiritual)", icon: <Sparkles size={14} /> },
    { id: "nature", label: "जलप्रपात व प्रकृति (Nature & Waterfalls)", icon: <Waves size={14} /> },
    { id: "historic", label: "किले व ऐतिहासिक धरोहर (Heritage & Forts)", icon: <History size={14} /> },
  ];

  const filteredPlaces = incredibleJharkhandPlaces.filter((p) => {
    if (selectedFilter === "all") return true;
    return p.type === selectedFilter;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* मुख्य परिचय / Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-slate-950 text-white py-14 sm:py-18">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300">
              <History size={14} />
              इंक्रेडिबल इंडिया • झारखंड विशेषांक
            </span>
            <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-orange-300 rounded-full text-xs font-semibold">
              कुल {toHindiNumber(incredibleJharkhandPlaces.length)} प्रमुख दर्शनीय स्थल
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            <span className="text-orange-500">ऐतिहासिक झारखंड</span> —{" "}
            <span className="bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              धरोहर, संस्कृति एवं पर्यटन
            </span>
          </h1>

          <p className="mt-4 max-w-3xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            द्वादश ज्योतिर्लिंग बाबा बैद्यनाथ धाम से लेकर छोटानागपुर की रानी नेतरहाट,
            320 फीट ऊंचे हुंडरू जलप्रपात, मलूटी के 108 टेराकोटा मंदिरों, चेरो राजाओं के
            पलामू किले और सम्मेद शिखरजी तक — झारखंड की समृद्ध सांस्कृतिक और प्राकृतिक
            धरोहर का संपूर्ण सचित्र संकलन।
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10">
            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                प्रसिद्ध ज्योतिर्लिंग
              </p>
              <p className="text-base font-bold text-orange-400 mt-0.5">
                बाबा बैद्यनाथ धाम
              </p>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                सर्वोच्च पर्वत शिखर
              </p>
              <p className="text-base font-bold text-white mt-0.5">
                पारसनाथ (1,365 मी)
              </p>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                प्रमुख हिल स्टेशन
              </p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">
                नेतरहाट (3,700 फीट)
              </p>
            </div>

            <div className="p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
              <p className="text-[11px] text-slate-400 uppercase font-semibold">
                लाइव शोध लेख
              </p>
              <p className="text-base font-bold text-white mt-0.5 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                {toHindiNumber(dynamicArticles.length)} प्रकाशित
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Articles Published from Admin Panel */}
      {dynamicArticles.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">
                ताज़ा प्रकाशन
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mt-1 flex items-center gap-2">
                <Bookmark className="text-orange-500" size={22} />
                ऐतिहासिक शोध, धरोहर एवं संस्कृति विशेषांक
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-200/70 px-3 py-1 rounded-full">
              {toHindiNumber(dynamicArticles.length)} लेख
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dynamicArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <div>
                  {article.image ? (
                    <Link
                      to={`/news/${article.id}`}
                      className="block relative h-48 overflow-hidden bg-slate-100"
                    >
                      <img
                        src={resolveArticleImage(article.image, article.category || "झारखंड", article.id || article.title)}
                        alt={article.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          if (article.image && article.image.startsWith("/uploads/") && !e.currentTarget.src.startsWith("https://swadeshvaani.com")) {
                            e.currentTarget.src = `https://swadeshvaani.com${article.image}`;
                          } else {
                            e.currentTarget.parentElement.style.display = "none";
                          }
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-emerald-600/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
                          {article.category || "ऐतिहासिक झारखंड"}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div className="p-5 pb-0">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-bold">
                        {article.category || "ऐतिहासिक झारखंड"}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    {article.district && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 mb-2">
                        <MapPin size={12} className="text-orange-500" />
                        {article.district}
                      </span>
                    )}

                    <h3 className="font-bold text-base text-blue-950 group-hover:text-orange-600 line-clamp-2 leading-snug">
                      <Link to={`/news/${article.id}`}>{article.title}</Link>
                    </h3>

                    {article.excerpt && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {article.date || "हालिया"}
                  </span>
                  <Link
                    to={`/news/${article.id}`}
                    className="inline-flex items-center gap-1 font-bold text-orange-600 hover:text-orange-700"
                  >
                    पूरा पढ़ें <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* सभी स्थायी धरोहर एवं पर्यटन स्थल (Incredible India Complete List with 100% Unique Authentic Photos) */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 border-t border-slate-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-orange-600 text-xs font-extrabold uppercase tracking-widest">
              <Compass size={16} />
              Incredible India • झारखंड के प्रमाणिक दर्शनीय स्थल
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              झारखंड के प्रमुख ऐतिहासिक, धार्मिक एवं पर्यटन स्थल
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedFilter === tab.id
                    ? "bg-orange-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {filteredPlaces.map((place, idx) => (
            <article
              key={place.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300 transition duration-300"
            >
              <div>
                {/* Photo with Overlay */}
                <div className="relative h-[250px] sm:h-[280px] w-full overflow-hidden bg-slate-100">
                  <img
                    src={place.image}
                    alt={place.name}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = getCategoryFallbackImage("झारखंड");
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="rounded-full bg-orange-600/95 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white shadow-md">
                      #{toHindiNumber(idx + 1)} {place.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {place.name}
                    </h3>
                    <p className="text-xs text-orange-200 flex items-center gap-1 mt-1 font-medium">
                      <MapPin size={13} />
                      {place.location}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3 p-6 sm:p-7">
                  <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                    {place.description}
                  </p>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-3.5 text-xs text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>यात्रा सुझाव / महत्व:</strong> {place.highlight}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin size={12} className="text-orange-500" />
                  {place.location}
                </span>
                <span className="font-semibold text-orange-600">
                  इंक्रेडिबल इंडिया स्थल
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}