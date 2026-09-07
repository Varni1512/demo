import news1 from "../Component/photos/news1.jpeg";
import news2 from "../Component/photos/news2.jpeg";
import news3 from "../Component/photos/news3.jpeg";
import news4 from "../Component/photos/news4.jpeg";
import news5 from "../Component/photos/news5.jpeg";
import news6 from "../Component/photos/news6.jpeg";
import news7 from "../Component/photos/news7.jpeg";
import news8 from "../Component/photos/news8.jpeg";
import news9 from "../Component/photos/news9.jpeg";
import news10 from "../Component/photos/news10.jpeg";
import Betla from "../Component/photos/Betla.jpeg";
import Hundrufalls from "../Component/photos/Hundrufalls.jpeg";
import Maluti from "../Component/photos/Maluti.jpeg";
import Palamu from "../Component/photos/Palamu.jpeg";
import baba from "../Component/photos/baba.jpeg";
import baidyanath from "../Component/photos/baidyanath.jpg";
import basukinath from "../Component/photos/basukinath.jpg";
import dassam from "../Component/photos/dassam.jpg";
import dumka from "../Component/photos/dumka.jpeg";
import hijla from "../Component/photos/hijla.jpeg";
import jagannath from "../Component/photos/jagannath.jpg";
import jonha from "../Component/photos/jonha.jpg";
import jubileepark from "../Component/photos/jubileepark.jpg";
import mccluskieganj from "../Component/photos/mccluskieganj.jpg";
import naulakha from "../Component/photos/naulakha.jpg";
import netarhat from "../Component/photos/netarhat.jpg";
import parasnath from "../Component/photos/parasnath.jpg";
import patratu from "../Component/photos/patratu.jpg";
import railwaystation from "../Component/photos/railwaystation.jpeg";
import rajmahal from "../Component/photos/rajmahal.jpg";
import ratu from "../Component/photos/ratu.jpeg";
import trikut from "../Component/photos/trikut.jpg";
export { toHindiNumber } from "../utils/hindiNumbers";
import { broadcastLocalEvent } from "../utils/realtimeEngine";
import { convex } from "../utils/convexClient";
import { api } from "../../convex/_generated/api";
import { safeStorage } from "../utils/safeStorage";

export const JHARKHAND_DISTRICTS = [
  "Ranchi",
  "Dhanbad",
  "Bokaro",
  "East Singhbhum (Jamshedpur)",
  "West Singhbhum (Chaibasa)",
  "Deoghar",
  "Dumka",
  "Hazaribagh",
  "Giridih",
  "Latehar",
  "Palamu",
  "Garhwa",
  "Chatra",
  "Koderma",
  "Jamtara",
  "Godda",
  "Sahibganj",
  "Pakur",
  "Ramgarh",
  "Lohardaga",
  "Gumla",
  "Simdega",
  "Khunti",
  "Seraikela Kharsawan",
  "State / National / Other",
];

export const JHARKHAND_DISTRICTS_DATA = {
  "Ranchi": {
    hi: "रांची",
    en: "Ranchi",
    subDistricts: [
      { hi: "सदर रांची", en: "Ranchi Sadar" },
      { hi: "कांके", en: "Kanke" },
      { hi: "रातू", en: "Ratu" },
      { hi: "नामकुम", en: "Namkum" },
      { hi: "नगड़ी", en: "Nagri" },
      { hi: "ओरमांझी", en: "Ormanjhi" },
      { hi: "अनगड़ा", en: "Angara" },
      { hi: "सिल्ली", en: "Silli" },
      { hi: "बुंडू", en: "Bundu" },
      { hi: "तमाड़", en: "Tamar" },
      { hi: "सोनाहातू", en: "Sonahatu" },
      { hi: "राहे", en: "Rahe" },
      { hi: "बेड़ो", en: "Bero" },
      { hi: "इटकी", en: "Itki" },
      { hi: "मांडर", en: "Mandar" },
      { hi: "चान्हो", en: "Chanho" },
      { hi: "लापुंग", en: "Lapung" },
      { hi: "बुढ़मू", en: "Burmu" },
      { hi: "खलारी", en: "Khelari" }
    ]
  },
  "Dumka": {
    hi: "दुमका",
    en: "Dumka",
    subDistricts: [
      { hi: "दुमका सदर", en: "Dumka Sadar" },
      { hi: "जरमुंडी", en: "Jarmundi" },
      { hi: "शिकारीपाड़ा", en: "Shikaripara" },
      { hi: "रानीश्वर", en: "Ranishwar" },
      { hi: "जामा", en: "Jama" },
      { hi: "रामगढ़", en: "Ramgarh" },
      { hi: "काठीकुंड", en: "Kathikund" },
      { hi: "गोपीकांदर", en: "Gopikandar" },
      { hi: "मसलिया", en: "Masalia" },
      { hi: "सरैयाहाट", en: "Saraiyahat" }
    ]
  },
  "Deoghar": {
    hi: "देवघर",
    en: "Deoghar",
    subDistricts: [
      { hi: "देवघर सदर", en: "Deoghar Sadar" },
      { hi: "मधुपुर", en: "Madhupur" },
      { hi: "सारठ", en: "Sarath" },
      { hi: "सारवां", en: "Sarwan" },
      { hi: "मोहनपुर", en: "Mohanpur" },
      { hi: "देवीपुर", en: "Devipur" },
      { hi: "पालोजोरी", en: "Palojori" },
      { hi: "करौं", en: "Karon" },
      { hi: "मारगोमुंडा", en: "Margomunda" },
      { hi: "सोनारायठाढ़ी", en: "Sonaraithari" }
    ]
  },
  "Dhanbad": {
    hi: "धनबाद",
    en: "Dhanbad",
    subDistricts: [
      { hi: "धनबाद सदर", en: "Dhanbad Sadar" },
      { hi: "झरिया", en: "Jharia" },
      { hi: "बाघमारा", en: "Baghmara" },
      { hi: "निरसा", en: "Nirsa" },
      { hi: "गोविंदपुर", en: "Govindpur" },
      { hi: "टुंडी", en: "Tundi" },
      { hi: "तोपचांची", en: "Topchanchi" },
      { hi: "बलियापुर", en: "Baliapur" },
      { hi: "एग्यारकुंड", en: "Egarkund" },
      { hi: "कलियासोल", en: "Kaliasole" },
      { hi: "पूर्वी टुंडी", en: "Purba Tundi" }
    ]
  },
  "Bokaro": {
    hi: "बोकारो",
    en: "Bokaro",
    subDistricts: [
      { hi: "चास", en: "Chas" },
      { hi: "चंदनकियारी", en: "Chandankyari" },
      { hi: "बेरमो", en: "Bermo" },
      { hi: "गोमिया", en: "Gomia" },
      { hi: "पेटरवार", en: "Peterbar" },
      { hi: "जरीडीह", en: "Jaridih" },
      { hi: "कसमार", en: "Kasmar" },
      { hi: "नावाडीह", en: "Nawadih" },
      { hi: "चंद्रपुरा", en: "Chandrapura" }
    ]
  },
  "East Singhbhum (Jamshedpur)": {
    hi: "पूर्वी सिंहभूम (जमशेदपुर)",
    en: "East Singhbhum (Jamshedpur)",
    subDistricts: [
      { hi: "जमशेदपुर (गोलमुरी-जुगसलाई)", en: "Jamshedpur (Golmuri-Jugsalai)" },
      { hi: "घाटशिला", en: "Ghatshila" },
      { hi: "पोटका", en: "Potka" },
      { hi: "पटमदा", en: "Patamda" },
      { hi: "बोड़ाम", en: "Boram" },
      { hi: "मुसाबनी", en: "Musabani" },
      { hi: "चाकुलिया", en: "Chakulia" },
      { hi: "बहरागोड़ा", en: "Baharagora" },
      { hi: "धालभूमगढ़", en: "Dhalbhumgarh" },
      { hi: "डुमरिया", en: "Dumaria" },
      { hi: "गुड़ाबांदा", en: "Gurabandha" }
    ]
  },
  "West Singhbhum (Chaibasa)": {
    hi: "पश्चिमी सिंहभूम (चाईबासा)",
    en: "West Singhbhum (Chaibasa)",
    subDistricts: [
      { hi: "चाईबासा सदर", en: "Chaibasa Sadar" },
      { hi: "चक्रधरपुर", en: "Chakradharpur" },
      { hi: "जगन्नाथपुर", en: "Jagannathpur" },
      { hi: "मनोहरपुर", en: "Manoharpur" },
      { hi: "नोवामुंडी", en: "Noamundi" },
      { hi: "झिंकपानी", en: "Jhinkpani" },
      { hi: "टोंटो", en: "Tonto" },
      { hi: "खूंटपानी", en: "Khuntpani" },
      { hi: "तांतनगर", en: "Tantnagar" },
      { hi: "मझगांव", en: "Majhgaon" },
      { hi: "कुमारडुंगी", en: "Kumardungi" },
      { hi: "हाटगम्हरिया", en: "Hatgamharia" },
      { hi: "सोनुवा", en: "Sonua" },
      { hi: "आनंदपुर", en: "Anandpur" },
      { hi: "गोइलकेरा", en: "Goilkera" },
      { hi: "गुदरी", en: "Gudri" },
      { hi: "बंदगांव", en: "Bandgaon" }
    ]
  },
  "Hazaribagh": {
    hi: "हजारीबाग",
    en: "Hazaribagh",
    subDistricts: [
      { hi: "हजारीबाग सदर", en: "Hazaribagh Sadar" },
      { hi: "बरही", en: "Barhi" },
      { hi: "बड़कागांव", en: "Barkagaon" },
      { hi: "कटकमसांडी", en: "Katkamsandi" },
      { hi: "चौपारण", en: "Chouparan" },
      { hi: "इचाक", en: "Ichak" },
      { hi: "दारू", en: "Daru" },
      { hi: "पद्मा", en: "Padma" },
      { hi: "चुरचू", en: "Churchu" },
      { hi: "विष्णुगढ़", en: "Vishnugarh" },
      { hi: "बरकट्ठा", en: "Barkatha" },
      { hi: "चलकुशा", en: "Chalkusha" },
      { hi: "कटकमदाग", en: "Katkamdag" },
      { hi: "डाडी", en: "Dadi" },
      { hi: "केरेडारी", en: "Keredari" }
    ]
  },
  "Giridih": {
    hi: "गिरिडीह",
    en: "Giridih",
    subDistricts: [
      { hi: "गिरिडीह सदर", en: "Giridih Sadar" },
      { hi: "गांडेय", en: "Gandey" },
      { hi: "बेंगाबाद", en: "Bengabad" },
      { hi: "पीरटांड़", en: "Pirtand" },
      { hi: "डुमरी", en: "Dumri" },
      { hi: "बगोदर", en: "Bagodar" },
      { hi: "सरिया", en: "Sariya" },
      { hi: "बिरनी", en: "Birni" },
      { hi: "धनवार", en: "Dhanwar" },
      { hi: "जमुआ", en: "Jamua" },
      { hi: "देवरी", en: "Deori" },
      { hi: "तिसरी", en: "Tisri" },
      { hi: "गावां", en: "Gawan" }
    ]
  },
  "Palamu": {
    hi: "पलामू",
    en: "Palamu",
    subDistricts: [
      { hi: "मेदिनीनगर (डाल्टनगंज)", en: "Medininagar (Daltonganj)" },
      { hi: "हुसैनाबाद", en: "Hussainabad" },
      { hi: "छतरपुर", en: "Chhatarpur" },
      { hi: "चैनपुर", en: "Chainpur" },
      { hi: "पाटन", en: "Patan" },
      { hi: "विश्रामपुर", en: "Vishrampur" },
      { hi: "हरिहरगंज", en: "Hariharganj" },
      { hi: "पांडु", en: "Pandu" },
      { hi: "ऊंटारी रोड", en: "Untari Road" },
      { hi: "लेस्लीगंज (नीलांबर-पीतांबरपुर)", en: "Lesliganj" },
      { hi: "मनातू", en: "Manatu" },
      { hi: "तरहासी", en: "Tarhasi" },
      { hi: "पांकी", en: "Panki" },
      { hi: "सतबरवा", en: "Satbarwa" },
      { hi: "हैदरनगर", en: "Haidarnagar" },
      { hi: "मोहम्मदगंज", en: "Mohammadganj" },
      { hi: "पिपरा", en: "Pipra" },
      { hi: "नौडीहा बाजार", en: "Naudiha Bazar" },
      { hi: "नावा बाजार", en: "Nawa Bazar" }
    ]
  },
  "Garhwa": {
    hi: "गढ़वा",
    en: "Garhwa",
    subDistricts: [
      { hi: "गढ़वा सदर", en: "Garhwa Sadar" },
      { hi: "नगर उंटारी (श्री बंशीधर नगर)", en: "Nagar Untari" },
      { hi: "रंका", en: "Ranka" },
      { hi: "मेराल", en: "Meral" },
      { hi: "भवनाथपुर", en: "Bhawnathpur" },
      { hi: "मझिआंव", en: "Majhiaon" },
      { hi: "कांडी", en: "Kandi" },
      { hi: "खरौंधी", en: "Kharoundhi" },
      { hi: "धुरकी", en: "Dhurki" },
      { hi: "रमना", en: "Ramna" },
      { hi: "डंडई", en: "Dandai" },
      { hi: "चिनिया", en: "Chiniya" },
      { hi: "रामकंडा", en: "Ramkanda" },
      { hi: "भंडारिया", en: "Bhandaria" },
      { hi: "सगमा", en: "Sagma" },
      { hi: "केतार", en: "Ketar" },
      { hi: "बरडीहा", en: "Bardiha" }
    ]
  },
  "Godda": {
    hi: "गोड्डा",
    en: "Godda",
    subDistricts: [
      { hi: "गोड्डा सदर", en: "Godda Sadar" },
      { hi: "महागामा", en: "Mahagama" },
      { hi: "मेहरमा", en: "Meharma" },
      { hi: "बोआरीजोर", en: "Boarijor" },
      { hi: "पथरगामा", en: "Pathargama" },
      { hi: "पोड़ैयाहाट", en: "Poraiyahat" },
      { hi: "सुंदरपहाड़ी", en: "Sundarpahari" },
      { hi: "ठाकुरगंगती", en: "Thakurgangti" },
      { hi: "बसंतराय", en: "Basantrai" }
    ]
  },
  "Sahibganj": {
    hi: "साहिबगंज",
    en: "Sahibganj",
    subDistricts: [
      { hi: "साहिबगंज सदर", en: "Sahibganj Sadar" },
      { hi: "राजमहल", en: "Rajmahal" },
      { hi: "बोरियो", en: "Borio" },
      { hi: "बरहेट", en: "Barhait" },
      { hi: "तालझारी", en: "Taljhari" },
      { hi: "पतना", en: "Pathna" },
      { hi: "बरहरवा", en: "Barharwa" },
      { hi: "मंडरो", en: "Mandro" },
      { hi: "उधवा", en: "Udhwa" }
    ]
  },
  "Pakur": {
    hi: "पाकुड़",
    en: "Pakur",
    subDistricts: [
      { hi: "पाकुड़ सदर", en: "Pakur Sadar" },
      { hi: "हिरणपुर", en: "Hiranpur" },
      { hi: "लिट्टीपाड़ा", en: "Littipara" },
      { hi: "अमड़ापाड़ा", en: "Amrapara" },
      { hi: "महेशपुर", en: "Maheshpur" },
      { hi: "पाकुड़िया", en: "Pakuria" }
    ]
  },
  "Jamtara": {
    hi: "जामताड़ा",
    en: "Jamtara",
    subDistricts: [
      { hi: "जामताड़ा सदर", en: "Jamtara Sadar" },
      { hi: "करमाटांड़ (विद्यासागर)", en: "Karmatar" },
      { hi: "नाला", en: "Nala" },
      { hi: "कुंडहित", en: "Kundhit" },
      { hi: "नारायणपुर", en: "Narayanpur" },
      { hi: "फतेहपुर", en: "Fatehpur" }
    ]
  },
  "Latehar": {
    hi: "लातेहार",
    en: "Latehar",
    subDistricts: [
      { hi: "लातेहार सदर", en: "Latehar Sadar" },
      { hi: "महुआडांड़", en: "Mahuadanr" },
      { hi: "चंदवा", en: "Chandwa" },
      { hi: "बालूमाथ", en: "Balumath" },
      { hi: "मनिका", en: "Manika" },
      { hi: "बरवाडीह", en: "Barwadih" },
      { hi: "गारू", en: "Garu" },
      { hi: "बारियातू", en: "Bariyatu" },
      { hi: "हेरहंज", en: "Herhanj" }
    ]
  },
  "Chatra": {
    hi: "चतरा",
    en: "Chatra",
    subDistricts: [
      { hi: "चतरा सदर", en: "Chatra Sadar" },
      { hi: "सिमरिया", en: "Simaria" },
      { hi: "हंटरगंज", en: "Hunterganj" },
      { hi: "इटखोरी", en: "Itkhori" },
      { hi: "टंडवा", en: "Tandwa" },
      { hi: "प्रतापपुर", en: "Pratappur" },
      { hi: "कान्हाचट्टी", en: "Kanhachatti" },
      { hi: "गिद्धौर", en: "Gidhour" },
      { hi: "लावालोंग", en: "Lawalong" },
      { hi: "पत्थलगड़ा", en: "Pathalgada" },
      { hi: "मयूरहंड", en: "Mayurhand" },
      { hi: "कुंदा", en: "Kunda" }
    ]
  },
  "Gumla": {
    hi: "गुमला",
    en: "Gumla",
    subDistricts: [
      { hi: "गुमला सदर", en: "Gumla Sadar" },
      { hi: "बिशुनपुर", en: "Bishunpur" },
      { hi: "घाघरा", en: "Ghaghra" },
      { hi: "सिसई", en: "Sisai" },
      { hi: "भरनो", en: "Bharno" },
      { hi: "कामडारा", en: "Kamdara" },
      { hi: "बसिया", en: "Basia" },
      { hi: "रायडीह", en: "Raidih" },
      { hi: "पालकोट", en: "Palkot" },
      { hi: "चैनपुर", en: "Chainpur" },
      { hi: "डुमरी", en: "Dumri" },
      { hi: "अल्बर्ट एक्का (जारी)", en: "Albert Ekka (Jari)" }
    ]
  },
  "Simdega": {
    hi: "सिमडेगा",
    en: "Simdega",
    subDistricts: [
      { hi: "सिमडेगा सदर", en: "Simdega Sadar" },
      { hi: "कोलेबिरा", en: "Kolebira" },
      { hi: "ठेठईटांगर", en: "Thethaitangar" },
      { hi: "बोलबा", en: "Bolba" },
      { hi: "कुरडेग", en: "Kurdeg" },
      { hi: "जलडेगा", en: "Jaldega" },
      { hi: "बानो", en: "Bano" },
      { hi: "केरसई", en: "Kersai" },
      { hi: "पाकरटांड़", en: "Pakartanr" }
    ]
  },
  "Lohardaga": {
    hi: "लोहरदगा",
    en: "Lohardaga",
    subDistricts: [
      { hi: "लोहरदगा सदर", en: "Lohardaga Sadar" },
      { hi: "कुडू", en: "Kuru" },
      { hi: "सेन्हा", en: "Senha" },
      { hi: "भंडरा", en: "Bhandra" },
      { hi: "किस्को", en: "Kisko" },
      { hi: "पेशरार", en: "Peshrar" }
    ]
  },
  "Ramgarh": {
    hi: "रामगढ़",
    en: "Ramgarh",
    subDistricts: [
      { hi: "रामगढ़ सदर", en: "Ramgarh Sadar" },
      { hi: "गोला", en: "Gola" },
      { hi: "मांडू", en: "Mandu" },
      { hi: "पतरातू", en: "Patratu" },
      { hi: "दुलमी", en: "Dulmi" },
      { hi: "चितरपुर", en: "Chitarpur" }
    ]
  },
  "Koderma": {
    hi: "कोडरमा",
    en: "Koderma",
    subDistricts: [
      { hi: "कोडरमा सदर", en: "Koderma Sadar" },
      { hi: "झुमरी तिलैया / चंदवारा", en: "Chandwara (Jhumri Telaiya)" },
      { hi: "जयनगर", en: "Jainagar" },
      { hi: "मरकच्चो", en: "Markacho" },
      { hi: "सतगावां", en: "Satgawan" },
      { hi: "डोमचांच", en: "Domchanch" }
    ]
  },
  "Khunti": {
    hi: "खूंटी",
    en: "Khunti",
    subDistricts: [
      { hi: "खूंटी सदर", en: "Khunti Sadar" },
      { hi: "मुरहू", en: "Murhu" },
      { hi: "तोरपा", en: "Torpa" },
      { hi: "रनियां", en: "Rania" },
      { hi: "कर्रा", en: "Karra" },
      { hi: "अड़की", en: "Arki" }
    ]
  },
  "Seraikela Kharsawan": {
    hi: "सरायकेला खरसावां",
    en: "Seraikela Kharsawan",
    subDistricts: [
      { hi: "सरायकेला", en: "Seraikela" },
      { hi: "खरसावां", en: "Kharsawan" },
      { hi: "चांडिल", en: "Chandil" },
      { hi: "आदित्यपुर (गम्हरिया)", en: "Adityapur (Gamharia)" },
      { hi: "राजनगर", en: "Rajnagar" },
      { hi: "कुचाई", en: "Kuchai" },
      { hi: "नीमडीह", en: "Nimdih" },
      { hi: "ईचागढ़", en: "Ichagarh" },
      { hi: "कुकड़ू", en: "Kukru" }
    ]
  },
  "State / National / Other": {
    hi: "अन्य / राज्य स्तर",
    en: "State / National / Other",
    subDistricts: [
      { hi: "समस्त झारखंड", en: "All Jharkhand" },
      { hi: "राष्ट्रीय स्तर", en: "National Level" }
    ]
  }
};

export const getSubDistrictsForDistrict = (districtName) => {
  if (!districtName) return [];
  const found = JHARKHAND_DISTRICTS_DATA[districtName];
  if (found && found.subDistricts) return found.subDistricts;

  // Search by partial or Hindi
  const entry = Object.entries(JHARKHAND_DISTRICTS_DATA).find(([key, val]) =>
    key.toLowerCase() === districtName.toLowerCase() ||
    val.hi === districtName ||
    val.en.toLowerCase() === districtName.toLowerCase()
  );
  return entry ? entry[1].subDistricts : [];
};

export const NEWS_CATEGORIES = [
  "राजनीति",
  "शिक्षा",
  "स्वास्थ्य",
  "खेल",
  "अपराध",
  "प्रशासन",
  "झारखंड",
  "देश-विदेश",
  "तकनीक",
  "व्यापार",
  "मनोरंजन",
  "धर्म",
  "आपदा",
  "दुर्घटना",
  "ऐतिहासिक झारखंड",
  "मौसम व कृषि",
];

function getSeedIndex(key, poolLength) {
  if (!key || poolLength <= 1) return 0;
  let hash = 0;
  const s = String(key);
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % poolLength;
}

export const getCategoryFallbackImage = (categoryName, seedKey = "") => {
  const cat = String(categoryName || "").toLowerCase().trim();
  let pool = [news1, news2, news3, news4, news5, news6, news7, news8, news9, news10];

  if (cat.includes("sport") || cat.includes("खेल")) {
    pool = [news9, news5, news10, jubileepark];
  } else if (cat.includes("tech") || cat.includes("तकनीक")) {
    pool = [news10, news4, news6, news5];
  } else if (cat.includes("edu") || cat.includes("शिक्षा")) {
    pool = [news3, news4, news6, news10, news5, news2, jubileepark, mccluskieganj];
  } else if (cat.includes("politic") || cat.includes("राजनीति") || cat.includes("प्रशासन") || cat.includes("admin")) {
    pool = [news2, news6, news1, news5, ratu, Palamu];
  } else if (
    cat.includes("crime") ||
    cat.includes("अपराध") ||
    cat.includes("दुर्घटना") ||
    cat.includes("accident") ||
    cat.includes("हादसा") ||
    cat.includes("आपदा") ||
    cat.includes("disaster")
  ) {
    pool = [news8, news1, news7, Palamu];
  } else if (cat.includes("health") || cat.includes("स्वास्थ्य")) {
    pool = [news7, news5, news6, news3];
  } else if (cat.includes("धर्म") || cat.includes("religion") || cat.includes("spiritual")) {
    pool = [basukinath, baidyanath, Maluti, jagannath, parasnath, trikut, baba, news7];
  } else if (cat.includes("दुमका") || cat.includes("dumka")) {
    pool = [dumka, Maluti, basukinath, hijla, railwaystation, baidyanath, rajmahal];
  } else if (
    cat.includes("ऐतिहासिक") ||
    cat.includes("झारखंड") ||
    cat.includes("jharkhand") ||
    cat.includes("पर्यटन") ||
    cat.includes("tour")
  ) {
    pool = [Betla, Hundrufalls, dassam, jonha, netarhat, patratu, rajmahal, jubileepark, Maluti, basukinath];
  } else if (cat.includes("bussiness") || cat.includes("व्यापार")) {
    pool = [news5, news6, news10, news2];
  }

  const index = getSeedIndex(seedKey, pool.length);
  return pool[index] || pool[0];
};

export const initialArticles = [];

// LocalStorage keys
const STORAGE_KEY = "savdeshvani_articles_store";
const SUBSCRIBERS_KEY = "savdeshvani_subscribers";
const NOTIFICATIONS_KEY = "savdeshvani_notifications";
const ADVERTISEMENTS_KEY = "savdeshvani_advertisements";

// Default advertisements (stored and synced dynamically via Convex DB)
export const initialAdvertisements = [];

const DELETED_ADS_KEY = "savdeshvani_deleted_ad_ids";

export const syncAdvertisementsFromServer = async () => {
  try {
    // 1. Try Convex live database query
    try {
      const convexAds = await Promise.race([
        convex.query(api.advertisements.get),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
      ]);
      if (Array.isArray(convexAds) && convexAds.length > 0) {
        safeStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(convexAds));
        window.dispatchEvent(new Event("sv_ads_change"));
        return getAdvertisements();
      }
    } catch {}

    // 2. Fallback to API server
    const res = await fetch("/api/advertisements");
    if (res.ok) {
      const data = await res.json();
      if (data) {
        if (Array.isArray(data.deletedIds)) {
          const currentDeleted = new Set(
            JSON.parse(safeStorage.getItem(DELETED_ADS_KEY) || "[]").map(String)
          );
          data.deletedIds.forEach((id) => currentDeleted.add(String(id)));
          safeStorage.setItem(DELETED_ADS_KEY, JSON.stringify([...currentDeleted]));
        }
        if (Array.isArray(data.advertisements)) {
          safeStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(data.advertisements));
        }
        window.dispatchEvent(new Event("sv_ads_change"));
        return getAdvertisements();
      }
    }
  } catch (e) {}
  return getAdvertisements();
};

export const getAdvertisements = () => {
  try {
    const saved = safeStorage.getItem(ADVERTISEMENTS_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const deletedIds = new Set(
          JSON.parse(safeStorage.getItem(DELETED_ADS_KEY) || "[]").map(String)
        );
        return parsed.filter((a) => !deletedIds.has(String(a.id)));
      }
    }
  } catch (e) {
    console.error("Error reading advertisements:", e);
  }
  return initialAdvertisements;
};

export const saveAdvertisement = (adData) => {
  try {
    const ads = getAdvertisements();
    const adId = String(adData.id || `ad-${Date.now()}`);

    const adToSave = {
      ...adData,
      id: adId,
      title: adData.title || "नया विज्ञापन",
      sponsor: adData.sponsor || "प्रायोजक",
      position: adData.position || "middle_banner",
      image: adData.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      link: adData.link || "/advertisement",
      tagline: adData.tagline || "",
      status: adData.status || "Active",
      clicks: Number(adData.clicks || 0),
      impressions: Number(adData.impressions || 0),
      createdAt:
        adData.createdAt ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    };

    // Remove from deleted list if restoring or creating
    try {
      const deletedIds = new Set(
        JSON.parse(safeStorage.getItem(DELETED_ADS_KEY) || "[]").map(String)
      );
      if (deletedIds.has(adId)) {
        deletedIds.delete(adId);
        safeStorage.setItem(DELETED_ADS_KEY, JSON.stringify([...deletedIds]));
      }
    } catch {}

    const index = ads.findIndex((a) => String(a.id) === String(adToSave.id));
    let updated;
    if (index >= 0) {
      updated = [...ads];
      updated[index] = adToSave;
    } else {
      updated = [adToSave, ...ads];
    }

    try {
      safeStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(updated));
    } catch {}
    window.dispatchEvent(new Event("sv_ads_change"));

    // Persist to Convex Real-time DB
    convex.mutation(api.advertisements.save, {
      customId: adId,
      title: adToSave.title,
      sponsor: adToSave.sponsor,
      tagline: adToSave.tagline,
      position: adToSave.position,
      image: adToSave.image,
      link: adToSave.link,
      status: adToSave.status,
      clicks: Number(adToSave.clicks || 0),
      impressions: Number(adToSave.impressions || 0),
    }).catch(() => {});

    // Async persist to Express server
    fetch("/api/advertisements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adToSave),
    }).catch(() => {});

    return { success: true, advertisement: adToSave, ads: updated };
  } catch (e) {
    console.error("Error saving advertisement:", e);
    return { success: false, error: e.message };
  }
};

export const deleteAdvertisement = (id) => {
  try {
    const idStr = String(id);
    const deletedIds = new Set(
      JSON.parse(safeStorage.getItem(DELETED_ADS_KEY) || "[]").map(String)
    );
    deletedIds.add(idStr);
    safeStorage.setItem(DELETED_ADS_KEY, JSON.stringify([...deletedIds]));

    const ads = getAdvertisements();
    const filtered = ads.filter((a) => String(a.id) !== idStr);
    try {
      safeStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(filtered));
    } catch {}
    window.dispatchEvent(new Event("sv_ads_change"));

    // Delete in Convex DB
    convex.mutation(api.advertisements.remove, { id: idStr }).catch(() => {});

    fetch(`/api/advertisements/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => {});
    return filtered;
  } catch (e) {
    console.error("Error deleting advertisement:", e);
    return [];
  }
};

export const toggleAdStatus = (id) => {
  try {
    const ads = getAdvertisements();
    const updated = ads.map((ad) => {
      if (String(ad.id) === String(id)) {
        return {
          ...ad,
          status: ad.status === "Active" ? "Paused" : "Active",
        };
      }
      return ad;
    });
    try {
      safeStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(updated));
    } catch {}
    window.dispatchEvent(new Event("sv_ads_change"));

    // Toggle in Convex DB
    convex.mutation(api.advertisements.toggleStatus, { id: String(id) }).catch(() => {});

    fetch(`/api/advertisements/${encodeURIComponent(id)}/toggle`, {
      method: "POST",
    }).catch(() => {});
    return updated;
  } catch (e) {
    console.error("Error toggling ad status:", e);
    return [];
  }
};

export const recordAdClick = (id) => {
  try {
    const ads = getAdvertisements();
    const updated = ads.map((ad) => {
      if (String(ad.id) === String(id)) {
        return {
          ...ad,
          clicks: (Number(ad.clicks) || 0) + 1,
        };
      }
      return ad;
    });
    try {
      safeStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(updated));
    } catch {}
    window.dispatchEvent(new Event("sv_ads_change"));

    // Record in Convex DB
    convex.mutation(api.advertisements.recordClick, { id: String(id) }).catch(() => {});

    fetch(`/api/advertisements/${encodeURIComponent(id)}/click`, {
      method: "POST",
    }).catch(() => {});
  } catch (e) {
    console.error("Error recording ad click:", e);
  }
};

// Helper to generate URL-safe slug
export const generateSlug = (text) => {
  if (!text) return "news-" + Date.now();
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60) || "news-" + Date.now();
};

// ----------------------------------------------------
// NOTIFICATION SYSTEM APIS
// ----------------------------------------------------

export const getNotifications = () => {
  try {
    const saved = safeStorage.getItem(NOTIFICATIONS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading notifications:", e);
  }
  return [];
};

export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return "unsupported";
  }
  if (Notification.permission === "granted") {
    return "granted";
  }
  if (Notification.permission !== "denied") {
    const perm = await Notification.requestPermission();
    return perm;
  }
  return Notification.permission;
};

export const addNotification = (article) => {
  try {
    if (!article) return;
    const notifications = getNotifications();
    const newNotif = {
      id: "notif-" + Date.now(),
      articleId: String(article.id),
      title: article.title || "ताज़ा समाचार प्रकाशित हुआ",
      category: article.category || "Jharkhand",
      district: article.district || "Ranchi",
      image: article.image || "",
      timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }),
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      read: false,
    };

    const updated = [newNotif, ...notifications].slice(0, 30); // keep last 30
    safeStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));

    // Dispatch global custom event for Navbar & UI reactivity
    window.dispatchEvent(new CustomEvent("sv_notification_received", { detail: newNotif }));

    // Persist to Convex DB
    convex.mutation(api.notifications.send, {
      title: article.title || "ताज़ा समाचार प्रकाशित हुआ",
      message: article.excerpt || article.title || "स्वदेश वाणी ताज़ा समाचार",
      type: article.category || "Breaking",
      target: "all",
    }).catch(() => {});

    // Browser Push / Web Notification
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("📰 स्वदेश वाणी - ताज़ा समाचार", {
          body: article.title,
          icon: "/photos/logo.jpeg",
          tag: `news-${article.id}`,
        });
      } catch (err) {
        console.log("Desktop notification suppressed or not supported:", err);
      }
    }

    return newNotif;
  } catch (e) {
    console.error("Error adding notification:", e);
  }
};

export const saveNotification = addNotification;

export const markNotificationAsRead = (id) => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map((n) =>
      String(n.id) === String(id) ? { ...n, read: true } : n
    );
    safeStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("sv_notifications_change"));

    // Convex mark read
    convex.mutation(api.notifications.markRead, { id: String(id) }).catch(() => {});

    return updated;
  } catch (e) {
    console.error("Error marking notification as read:", e);
    return [];
  }
};

export const markAllNotificationsAsRead = () => {
  try {
    const notifications = getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    safeStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("sv_notifications_change"));
    return updated;
  } catch (e) {
    console.error("Error marking all notifications as read:", e);
    return [];
  }
};

export const syncNotificationsFromServer = async () => {
  try {
    // 1. Try Convex query
    try {
      const convexNotifs = await convex.query(api.notifications.get);
      if (Array.isArray(convexNotifs) && convexNotifs.length > 0) {
        safeStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(convexNotifs));
        window.dispatchEvent(new Event("sv_notifications_change"));
        return convexNotifs;
      }
    } catch {}

    // 2. Fallback to API server
    const res = await fetch("/api/notifications");
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.notifications)) {
        safeStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(data.notifications));
        window.dispatchEvent(new Event("sv_notifications_change"));
        return data.notifications;
      }
    }
  } catch (e) {}
  return getNotifications();
};

export const clearNotifications = () => {
  try {
    safeStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("sv_notifications_change"));
    fetch("/api/notifications", { method: "DELETE" }).catch(() => {});
    return [];
  } catch (e) {
    console.error("Error clearing notifications:", e);
    return [];
  }
};

// Sync articles and deletions from backend server across all user devices
export const syncArticlesFromServer = async () => {
  try {
    // 1. Try Convex real-time DB query first
    try {
      const convexArticles = await Promise.race([
        convex.query(api.articles.get),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
      ]);
      if (Array.isArray(convexArticles) && convexArticles.length > 0) {
        safeStorage.setItem(STORAGE_KEY, JSON.stringify(convexArticles));
        window.dispatchEvent(new Event("sv_articles_change"));
        return getAllArticles();
      }
    } catch {}

    // 2. Fallback to API server
    const res = await fetch("/api/articles");
    if (res.ok) {
      const data = await res.json();
      if (data) {
        // 1. Sync deleted article IDs across devices so deleted news never reappears
        if (Array.isArray(data.deletedIds)) {
          const currentDeleted = new Set(
            JSON.parse(safeStorage.getItem(DELETED_ARTICLES_KEY) || "[]").map(String)
          );
          data.deletedIds.forEach((id) => currentDeleted.add(String(id)));
          safeStorage.setItem(DELETED_ARTICLES_KEY, JSON.stringify([...currentDeleted]));
        }

        // 2. Sync articles list
        if (Array.isArray(data.articles)) {
          safeStorage.setItem(STORAGE_KEY, JSON.stringify(data.articles));
        }

        window.dispatchEvent(new Event("sv_articles_change"));
        return getAllArticles();
      }
    }
  } catch (e) {
    // Backend offline or local fallback
  }
  return getAllArticles();
};

export const resolveArticleImage = (image) => {
  if (!image || typeof image !== "string" || !image.trim() || image === "none" || image === "null") {
    return "";
  }
  const trimmed = image.trim();

  // If it is already a full http/https URL or base64 data URI, return as-is
  if (
    trimmed.startsWith("data:image/") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://")
  ) {
    return trimmed;
  }

  // Relative /uploads path - resolve on localhost to live server
  if (trimmed.startsWith("/uploads/")) {
    if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      return `https://swadeshvaani.com${trimmed}`;
    }
    return trimmed;
  }

  // Relative path or local asset path
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  return trimmed;
};

const DELETED_ARTICLES_KEY = "sv_deleted_article_ids";

// Get all articles (Returns localStorage / synced articles, fallback to initial seeds only on cold start)
export const getAllArticles = () => {
  try {
    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        const deletedIds = new Set(
          JSON.parse(safeStorage.getItem(DELETED_ARTICLES_KEY) || "[]").map(String)
        );
        return parsed
          .filter((a) => !deletedIds.has(String(a.id)))
          .map((a) => ({
            ...a,
            image: resolveArticleImage(a.image),
          }));
      }
    }
  } catch (e) {
    console.error("Error reading articles from storage:", e);
  }
  return initialArticles;
};

// Find single article by exact ID, slug, or title match
export const getArticleById = (idOrSlug) => {
  if (!idOrSlug) return null;
  const rawKey = decodeURIComponent(String(idOrSlug)).trim();
  const searchKey = rawKey.replace(/\/+$/, "").replace(/\?.*$/, "").toLowerCase();

  const articles = getAllArticles();

  // 1. Exact ID or slug match
  let found = articles.find((a) => {
    const aId = String(a.id).toLowerCase();
    const aSlug = (a.slug || "").toLowerCase();
    const aLink = (a.link || "").toLowerCase();
    return (
      aId === searchKey ||
      aSlug === searchKey ||
      aLink === searchKey ||
      aLink.endsWith(`/${searchKey}`)
    );
  });

  if (found) return found;

  // 2. Title slug or title match
  found = articles.find((a) => {
    const aTitleSlug = a.title ? generateSlug(a.title).toLowerCase() : "";
    const aTitle = (a.title || "").toLowerCase().trim();
    return aTitleSlug === searchKey || aTitle === searchKey;
  });

  return found || null;
};

// Filter articles by category (handles aliases and multilingual matching)
export const getArticlesByCategory = (categoryQuery) => {
  if (!categoryQuery) return getAllArticles();
  const q = categoryQuery.toLowerCase().trim();
  const articles = getAllArticles();

  return articles.filter((a) => {
    const cat = (a.category || "").toLowerCase();
    if (cat === q) return true;
    if (q === "sports" && (cat.includes("sport") || cat.includes("खेल"))) return true;
    if (q === "technology" && (cat.includes("tech") || cat.includes("तकनीक"))) return true;
    if (q === "education" && (cat.includes("edu") || cat.includes("शिक्षा"))) return true;
    if (q === "world" && (cat.includes("world") || cat.includes("international") || cat.includes("विदेश") || cat.includes("अंतरराष्ट्रीय"))) return true;
    if (q === "historic jharkhand" && (cat.includes("historic") || cat.includes("heritage") || cat.includes("jharkhand") || cat.includes("झारखंड"))) return true;
    if (q === "jharkhand" && (cat.includes("jharkhand") || cat.includes("झारखंड") || cat.includes("दुमका") || cat.includes("देवघर") || cat.includes("रांची") || cat.includes("रामगढ़") || cat.includes("जरमुंडी"))) return true;
    if ((q === "धर्म" || q === "dharm" || q === "dharma" || q === "religion") && (cat.includes("धर्म") || cat.includes("dharm") || cat.includes("religion") || cat.includes("spiritual") || cat.includes("पूजा") || cat.includes("मंदिर"))) return true;
    if ((q === "आपदा" || q === "aapda" || q === "disaster") && (cat.includes("आपदा") || cat.includes("disaster") || cat.includes("calamity") || cat.includes("बाढ़") || cat.includes("तूफान"))) return true;
    if ((q === "दुर्घटना" || q === "durghatna" || q === "accident") && (cat.includes("दुर्घटना") || cat.includes("accident") || cat.includes("हादसा") || cat.includes("crash") || cat.includes("mishap"))) return true;
    return cat.includes(q);
  });
};

// Save a new or updated article (used when Admin publishes or edits)
export const saveArticleToStore = (articleData) => {
  try {
    const saved = safeStorage.getItem(STORAGE_KEY);
    let customArticles = saved ? JSON.parse(saved) : [];

    const articleId = String(articleData.id || `art-${Date.now()}`);
    const articleSlug = articleData.slug || generateSlug(articleData.title || articleId);

    const articleToSave = {
      ...articleData,
      id: articleId,
      slug: articleSlug,
      link: `/news/${articleId}`,
      category: articleData.category || "Jharkhand",
      district: articleData.district || "Ranchi",
      subDistrict: articleData.subDistrict || "",
      reporter: articleData.reporter || articleData.author || "स्वदेश वाणी ब्यूरो",
      author: articleData.reporter || articleData.author || "स्वदेश वाणी ब्यूरो",
      status: articleData.status || "Published",
      date:
        articleData.date ||
        new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    };

    // Remove from deleted list if restoring or creating
    try {
      const deletedIds = new Set(
        JSON.parse(safeStorage.getItem(DELETED_ARTICLES_KEY) || "[]").map(String)
      );
      if (deletedIds.has(String(articleToSave.id))) {
        deletedIds.delete(String(articleToSave.id));
        safeStorage.setItem(DELETED_ARTICLES_KEY, JSON.stringify([...deletedIds]));
      }
    } catch {}

    // Check if exists, update or prepend
    const index = customArticles.findIndex((a) => String(a.id) === String(articleToSave.id));
    const isNew = index < 0;
    if (index >= 0) {
      customArticles[index] = articleToSave;
    } else {
      customArticles = [articleToSave, ...customArticles];
    }
    // Safely persist to storage with quota-exceeded fallback
    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(customArticles));
    } catch (quotaErr) {
      console.warn("Storage quota limit reached. Pruning older articles to save new article:", quotaErr);
      while (customArticles.length > 5) {
        customArticles.pop();
        try {
          safeStorage.setItem(STORAGE_KEY, JSON.stringify(customArticles));
          break;
        } catch {}
      }
    }

    // Dispatch global events for instant reactivity across all open views
    window.dispatchEvent(new Event("sv_articles_change"));
    broadcastLocalEvent("articles_update", { article: articleToSave });

    // If published, trigger notification
    if (articleToSave.status === "Published") {
      addNotification(articleToSave);
    }

    // Persist to Convex Real-time DB
    convex.mutation(api.articles.save, {
      customId: articleId,
      title: articleToSave.title,
      slug: articleToSave.slug,
      category: articleToSave.category,
      district: articleToSave.district,
      subDistrict: articleToSave.subDistrict,
      reporter: articleToSave.reporter,
      author: articleToSave.author,
      excerpt: articleToSave.excerpt,
      content: articleToSave.content,
      image: articleToSave.image,
      date: articleToSave.date,
      readTime: articleToSave.readTime,
    }).catch(() => {});

    // Persist to Express backend (fire-and-forget / async)
    fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(articleToSave),
    }).catch(() => {});

    return { articles: customArticles, savedArticle: articleToSave, isNew };
  } catch (e) {
    console.error("Error saving article:", e);
  }
  return { articles: [], savedArticle: null, isNew: false };
};

// Delete article from store (Permanent deletion for both custom and initial seed articles)
export const deleteArticleFromStore = (id) => {
  try {
    const idStr = String(id);
    const deletedIds = new Set(
      JSON.parse(safeStorage.getItem(DELETED_ARTICLES_KEY) || "[]").map(String)
    );
    deletedIds.add(idStr);
    safeStorage.setItem(DELETED_ARTICLES_KEY, JSON.stringify([...deletedIds]));

    const saved = safeStorage.getItem(STORAGE_KEY);
    if (saved) {
      const customArticles = JSON.parse(saved).filter((a) => String(a.id) !== idStr);
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(customArticles));
    }

    window.dispatchEvent(new Event("sv_articles_change"));
    broadcastLocalEvent("articles_update", { deletedId: idStr, action: "delete" });

    // Delete in Convex DB
    convex.mutation(api.articles.remove, { id: idStr }).catch(() => {});

    fetch(`/api/articles/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => {});
    return true;
  } catch (e) {
    console.error("Error deleting article:", e);
    return false;
  }
};


// ----------------------------------------------------
// SUBSCRIBERS STORE APIS (Email + Mobile Number)
// ----------------------------------------------------

export const syncSubscribersFromServer = async () => {
  try {
    // 1. Try Convex query
    try {
      const convexSubs = await convex.query(api.subscribers.get);
      if (Array.isArray(convexSubs) && convexSubs.length > 0) {
        safeStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(convexSubs));
        window.dispatchEvent(new Event("sv_subscribers_change"));
        return convexSubs;
      }
    } catch {}

    // 2. Fallback to API server
    const res = await fetch("/api/subscribers");
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.subscribers)) {
        safeStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(data.subscribers));
        window.dispatchEvent(new Event("sv_subscribers_change"));
        return data.subscribers;
      }
    }
  } catch (e) {}
  return getSubscribers();
};

export const getSubscribers = () => {
  try {
    const saved = safeStorage.getItem(SUBSCRIBERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Error reading subscribers:", e);
  }
  return [];
};

export const saveSubscriber = ({ email, phone }) => {
  try {
    const subscribers = getSubscribers();
    const cleanEmail = email ? email.trim().toLowerCase() : "";
    const cleanPhone = phone ? phone.trim().replace(/\D/g, "") : "";

    // Check for duplicates
    const alreadyExists = subscribers.some(
      (s) =>
        (cleanEmail && s.email && s.email.toLowerCase() === cleanEmail) ||
        (cleanPhone && s.phone && s.phone === cleanPhone)
    );

    if (alreadyExists) {
      return { success: false, message: "यह ईमेल या मोबाइल नंबर पहले से सब्सक्राइब है।" };
    }

    const newSub = {
      id: "sub-" + Date.now(),
      phone: cleanPhone,
      email: cleanEmail,
      subscribedAt: new Date().toLocaleString("en-IN"),
      status: "Active",
    };

    const updated = [newSub, ...subscribers];
    safeStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("sv_subscribers_change"));

    // Persist to Convex DB
    convex.mutation(api.subscribers.subscribe, {
      email: cleanEmail,
      phone: cleanPhone,
    }).catch(() => {});

    // Async persist to server
    fetch("/api/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, phone: cleanPhone }),
    }).catch(() => {});

    return { success: true, message: "सफलतापूर्वक सब्सक्राइब किया गया!", subscriber: newSub };
  } catch (e) {
    console.error("Error saving subscriber:", e);
    return { success: false, message: "सब्सक्रिप्शन में त्रुटि आई।" };
  }
};

export const deleteSubscriber = (idOrPhone) => {
  try {
    const subscribers = getSubscribers();
    const filtered = subscribers.filter(
      (s) => String(s.id) !== String(idOrPhone) && String(s.phone) !== String(idOrPhone)
    );
    safeStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("sv_subscribers_change"));

    // Delete in Convex DB
    convex.mutation(api.subscribers.remove, { id: String(idOrPhone) }).catch(() => {});

    fetch(`/api/subscribers/${encodeURIComponent(idOrPhone)}`, {
      method: "DELETE",
    }).catch(() => {});

    return filtered;
  } catch (e) {
    console.error("Error deleting subscriber:", e);
    return [];
  }
};



