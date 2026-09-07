import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaEnvelope,
  FaLanguage,
  FaCheckCircle,
} from "react-icons/fa";
import { useLanguage } from "../context/LanguageContext";

const aboutContent = {
  hi: {
    language: "हिंदी",
    badge: "हमारे बारे में",
    title: "आपकी खबर। आपकी आवाज़। आपका स्वदेश।",
    intro:
      "हर खबर की अपनी एक कहानी होती है और हर व्यक्ति को सही, तेज़ और निष्पक्ष खबर जानने का अधिकार है। इसी सोच और उद्देश्य के साथ 15 अगस्त 2025 को झारखंड के दुमका से स्वदेशवाणी न्यूज़ नेटवर्क की शुरुआत हुई।",

    paragraphs: [
      "श्री बसंत कुमार भालोटिया द्वारा स्थापित स्वदेशवाणी की शुरुआत एक सरल लेकिन महत्वपूर्ण उद्देश्य के साथ की गई — लोगों तक महत्वपूर्ण खबरें तेज़ी और जिम्मेदारी के साथ पहुँचाना और एक ऐसा मंच तैयार करना जहाँ समाचार को सत्य, निष्पक्षता और ईमानदारी के साथ प्रस्तुत किया जाए।",

      "झारखंड की धरती से शुरू हुआ हमारा न्यूज़ नेटवर्क झारखंड के साथ-साथ पूरे भारत से जुड़ी महत्वपूर्ण खबरें और घटनाक्रम आप तक पहुँचाने का प्रयास करता है। हमारा उद्देश्य खबरों को तेज़ी से आप तक पहुँचाने के साथ-साथ उनकी सटीकता और निष्पक्षता को भी प्राथमिकता देना है।",

      "हमारे लिए पत्रकारिता केवल खबर पहुँचाने का माध्यम नहीं है। यह हमारे पाठकों के साथ एक विश्वास और जुड़ाव बनाने की जिम्मेदारी भी है। हम मानते हैं कि आपके विचार, सुझाव और हमारे समाचारों पर आपकी प्रतिक्रिया हमें बेहतर काम करने के लिए प्रेरित करती है।",

      "चाहे खबर झारखंड के किसी छोटे से शहर या गाँव से जुड़ी हो या देशभर को प्रभावित करने वाली कोई बड़ी घटना हो, हमारा प्रयास हमेशा यही रहेगा कि आप तक महत्वपूर्ण खबरें सही समय पर और सही रूप में पहुँचें।",

      "स्वदेशवाणी की यह यात्रा अभी शुरू हुई है और हम आने वाले समय में इसे और बेहतर बनाने के लिए लगातार प्रयासरत रहेंगे। हम आपसे आग्रह करते हैं कि स्वदेशवाणी न्यूज़ नेटवर्क से जुड़े रहें, हमारी खबरें पढ़ें, अपनी राय साझा करें और हमारे लेखों पर अपनी प्रतिक्रिया दें।",

      "आपका विश्वास, आपका समर्थन और आपका प्यार ही हमारी सबसे बड़ी प्रेरणा है। हमें उम्मीद है कि हमारी इस यात्रा और विकास के हर कदम पर आपका साथ हमारे साथ बना रहेगा।",

      "आपके सुझाव, प्रतिक्रिया या किसी खबर से संबंधित जानकारी हमारे लिए महत्वपूर्ण है। आप हमसे संपर्क करने के लिए नीचे दिए गए ईमेल पर लिख सकते हैं।",
    ],

    emailLabel: "ईमेल",
    contactButton: "हमसे संपर्क करें",
    valuesTitle: "हमारी प्राथमिकताएं",
    values: [
      "सत्य और निष्पक्ष पत्रकारिता",
      "तेज़ और सटीक समाचार",
      "स्थानीय आवाज़ों को मंच देना",
      "पाठकों के साथ विश्वास कायम करना",
    ],
    footerLine: "आपकी खबर। आपकी आवाज़। आपका स्वदेश।",
  },

  en: {
    language: "English",
    badge: "About Us",
    title: "Your News. Your Voice. Your Swadesh.",
    intro:
      "Every news story has its own story, and every person has the right to know accurate, fast, and unbiased news. With this thought and purpose, Swadeshvani News Network was started on 15 August 2025 from Dumka, Jharkhand.",

    paragraphs: [
      "Founded by Mr. Basant Kumar Bhalotia, Swadeshvani began with a simple but important objective — to deliver important news to people quickly and responsibly, while creating a platform where news is presented with truth, fairness, and honesty.",

      "Started from the land of Jharkhand, our news network aims to bring you important news and developments from Jharkhand as well as from across India. Along with delivering news quickly, we give equal priority to accuracy and impartiality.",

      "For us, journalism is not only a way of delivering news. It is also a responsibility to build trust and a meaningful connection with our readers. We believe that your thoughts, suggestions, and feedback on our news inspire us to do better.",

      "Whether the news is connected to a small town or village in Jharkhand or is a major event affecting the entire country, our constant effort will be to bring important news to you at the right time and in the right form.",

      "The journey of Swadeshvani has just begun, and we will continue working to make it better in the coming years. We invite you to stay connected with Swadeshvani News Network, read our news, share your opinions, and provide feedback on our articles.",

      "Your trust, support, and love are our greatest motivation. We hope that you will continue to stand with us at every step of our journey and growth.",

      "Your suggestions, feedback, or information related to any news are important to us. You can write to us using the email address below.",
    ],

    emailLabel: "Email",
    contactButton: "Contact Us",
    valuesTitle: "Our Priorities",
    values: [
      "Truthful and unbiased journalism",
      "Fast and accurate news",
      "Giving a voice to local communities",
      "Building trust with our readers",
    ],
    footerLine: "Your News. Your Voice. Your Swadesh.",
  },
};

export default function About() {
  const { language, setLanguage } = useLanguage();
  const langKey = language === "en" ? "en" : "hi";
  const content = aboutContent[langKey] || aboutContent.hi;

  return (
    <main className="min-h-screen bg-[#fffdf9] text-slate-800">
      {/* Tricolor accent */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-green-600" />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-orange-100 bg-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-24">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-orange-500" />

              <span className="text-xs font-bold uppercase tracking-[0.25em] text-orange-600">
                {content.badge}
              </span>
            </div>

            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-[#063d3a] sm:text-4xl md:text-6xl">
              {content.title}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
              {content.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 md:py-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Article */}
          <article className="lg:col-span-8">
            <div className="space-y-6">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-base leading-8 text-slate-600 md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Email contact */}
            <div className="mt-10 rounded-2xl border border-orange-200 bg-orange-50 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-800">
                    {content.emailLabel}
                  </p>

                  <a
                    href="mailto:swadeshvaaniofficial@gmail.com"
                    className="mt-1 inline-block break-all text-sm font-medium text-[#063d3a] transition hover:text-orange-600 sm:text-base"
                  >
                    swadeshvaaniofficial@gmail.com
                  </a>
                </div>

                <a
                  href="mailto:swadeshvaaniofficial@gmail.com"
                  className="inline-flex w-fit items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                >
                  <FaEnvelope />
                  {content.contactButton}
                </a>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-[#063d3a] p-6 text-white shadow-xl sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
                Swadeshvani
              </p>

              <h2 className="mt-4 text-2xl font-bold">
                {content.valuesTitle}
              </h2>

              <div className="mt-7 space-y-5">
                {content.values.map((value) => (
                  <div key={value} className="flex items-start gap-3">
                    <FaCheckCircle className="mt-1 shrink-0 text-orange-400" />

                    <p className="text-sm leading-6 text-green-50">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 border-t border-white/15 pt-6">
                <p className="text-lg font-semibold leading-7 text-white">
                  {content.footerLine}
                </p>
              </div>

              <Link
                to="/"
                className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition hover:text-white"
              >
                {language === "hindi" ? "होम पेज पर जाएं" : "Go to Homepage"}
                <FaArrowRight size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Bottom statement */}
      <section className="border-t border-green-100 bg-[#f3faf5]">
        <div className="mx-auto max-w-4xl px-5 py-10 text-center sm:px-8">
          <p className="text-lg font-semibold text-[#063d3a] md:text-xl">
            {content.footerLine}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            {language === "hindi"
              ? "स्वदेशवाणी न्यूज़ नेटवर्क से जुड़े रहें।"
              : "Stay connected with Swadeshvani News Network."}
          </p>
        </div>
      </section>
    </main>
  );
}