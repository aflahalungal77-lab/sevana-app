
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MapPin,
  HeartPulse,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Building2,
  Ambulance,
  Sparkles,
  Languages,
  Heart,
} from "lucide-react";
import { ServiceCard } from "@/components/service-card";

type Language = "ml" | "en";

const translations = {
  en: {
    about: "Aamugam",
    community: "Made for you",
    heroTag: "HERE FOR OUR COMMUNITY",
    heroTitle: "Local help.",
    heroSubtitle: "When you need it.",
    heroDescription:
      "Trusted local services around Meenarkuzhi, all in one place.",
    sectionEyebrow: "YOUR COMMUNITY SERVICES",
    sectionTitle: "How can we help?",
    sectionDescription: "Everything you need, just a tap away.",
    all: "All Services",
    hotlines: "Hotlines",
    transport: "Taxi & Travel",
    findDonor: "Find a Donor",
    needBlood: "Need Blood?",
    workers: "Local Workers",
    emergencyTitle: "Need urgent help?",
    emergencyDescription: "Find emergency contacts quickly.",
    charity: "MEENARKUZHI SHIHAB THANGAL CHARITY",
    charityTitle: "All services in one place.",
    charityDescription:
      "Find useful local services and contacts in your community.",
    explore: "Explore all services",
    exploreDescription: "Discover available services",
    aboutSevana: "About Sevana",
    aboutDescription: "Learn about our platform",
    footer: "Please verify service information before relying on it.",
    home: "Home",
    services: "Services",
    donors: "Donors",
    notifications: "Notifications",
    profile: "Profile",
  },
  ml: {
    about: "ആമുഖം",
    community: "നിങ്ങൾക്കായി",
    heroTag: "നമ്മുടെ നാടിനൊപ്പം",
    heroTitle: "പ്രാദേശിക സഹായം.",
    heroSubtitle: "ആവശ്യമുള്ളപ്പോൾ, എളുപ്പത്തിൽ.",
    heroDescription:
      "മീനാർകുഴിയിലെയും സമീപ പ്രദേശങ്ങളിലെയും സേവനങ്ങൾ ഒരിടത്ത്.",
    sectionEyebrow: "നമ്മുടെ നാട്ടിലെ സേവനങ്ങൾ",
    sectionTitle: "എന്താണ് ആവശ്യം?",
    sectionDescription: "നിങ്ങൾക്ക് വേണ്ട സേവനങ്ങൾ ഒരു ടാപ്പിൽ.",
    all: "എല്ലാ സേവനങ്ങളും",
    hotlines: "അടിയന്തര നമ്പറുകൾ",
    transport: "ടാക്സി & യാത്ര",
    findDonor: "രക്തദാതാക്കളെ കണ്ടെത്താം",
    needBlood: "രക്തം ആവശ്യമുണ്ടോ?",
    workers: "പ്രാദേശിക തൊഴിലാളികൾ",
    emergencyTitle: "അടിയന്തര സഹായം വേണോ?",
    emergencyDescription: "അടിയന്തര കോൺടാക്ടുകൾ വേഗത്തിൽ കണ്ടെത്താം.",
    charity: "മീനാർകുഴി ശിഹാബ് തങ്ങൾ ചാരിറ്റി",
    charityTitle: "എല്ലാ സേവനങ്ങളും ഒരിടത്ത്.",
    charityDescription:
      "നമ്മുടെ നാട്ടിലെ സേവനങ്ങളും കോൺടാക്ടുകളും കണ്ടെത്താം.",
    explore: "എല്ലാ സേവനങ്ങളും കാണുക",
    exploreDescription: "ലഭ്യമായ സേവനങ്ങൾ കണ്ടെത്താം",
    aboutSevana: "സേവനയെക്കുറിച്ച്",
    aboutDescription: "നമ്മുടെ പ്ലാറ്റ്‌ഫോമിനെ അറിയാം",
    footer: "സേവനം ഉപയോഗിക്കുന്നതിന് മുമ്പ് വിവരങ്ങൾ ഉറപ്പുവരുത്തുക.",
    home: "ഹോം",
    services: "സേവനങ്ങൾ",
    donors: "ദാതാക്കൾ",
    notifications: "അറിയിപ്പുകൾ",
    profile: "പ്രൊഫൈൽ",
  },
} as const;


function ServiceImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <img
      className="sevana-3d-icon"
      src={src}
      alt={alt}
      loading="lazy"
      width={76}
      height={76}
    />
  );
}

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");

  const location =
    process.env.NEXT_PUBLIC_APP_LOCATION || "Meenarkuzhi, Malappuram";

  useEffect(() => {
    const savedLanguage = localStorage.getItem("sevana-language");

    if (savedLanguage === "ml" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }
  }, []);

  function toggleLanguage() {
    const nextLanguage: Language = language === "en" ? "ml" : "en";
    setLanguage(nextLanguage);
    localStorage.setItem("sevana-language", nextLanguage);
  }

  const t = translations[language];

  return (
    <main className="page home-page sevana-home" lang={language}>
      {/* Header */}
      <header className="sevana-header">
        <Link href="/" className="sevana-brand" aria-label="Sevana home">
          <span className="sevana-brand-mark">
            <HeartPulse size={28} strokeWidth={2.2} />
          </span>
          <span className="sevana-brand-copy">
            <strong>
              Sevana<span>.</span>
            </strong>
            <small>Together for a Better Tomorrow</small>
          </span>
        </Link>

        <div className="sevana-header-actions">


          <Link href="/profile" className="sevana-about-button">
            <Building2 size={18} />
            <span>{t.about}</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </header>

      {/* Location */}
      <div className="sevana-location-row">
        <div className="sevana-location-pill">
          <MapPin size={18} />
          <span>{location}</span>
          <span className="sevana-location-dot" />
        </div>

        <span className="sevana-community-tag">
          <Sparkles size={15} />
          {t.community}
        </span>
      </div>


{/* Hero */}
<section className="sevana-hero sevana-hero-image-layout">
<img
  className="sevana-hero-background"
  src="/images/hero-bg.webp"
  alt=""
  aria-hidden="true"
/>

  <div className="sevana-hero-image-shade" />

  <div className="sevana-hero-copy">
    <span className="sevana-hero-tag">
      <HeartPulse size={15} />
      {t.heroTag}
    </span>

    <h1>
      {t.heroTitle}
      <br />
      <span>{t.heroSubtitle}</span>
    </h1>

    <p>{t.heroDescription}</p>

    <div className="sevana-hero-trust">
      <span className="sevana-hero-trust-icon">
        <ShieldCheck size={23} />
      </span>
      <span>
        <strong>
          {language === "en"
            ? "Your community, your support"
            : "നിങ്ങളുടെ നാട്, നിങ്ങളുടെ സഹായം"}
        </strong>
        <small>
          {language === "en"
            ? "Local services in one place"
            : "നാട്ടിലെ സേവനങ്ങൾ ഒരിടത്ത്"}
        </small>
      </span>
    </div>
  </div>
</section>


      {/* Services */}
      <section className="sevana-services-section">
        <div className="sevana-section-heading">
          <div>
            <p className="sevana-eyebrow">{t.sectionEyebrow}</p>
            <h2>{t.sectionTitle}</h2>
            <p className="sevana-section-description">
              {t.sectionDescription}
            </p>
          </div>

          <Link href="/services" className="sevana-view-all">
            {t.all}
            <ChevronRight size={18} />
          </Link>
        </div>

        
<div className="sevana-service-grid">
  <Link
    href="/hotlines"
    className="sevana-service-item sevana-service-hotline sevana-image-service"
  >
    <ServiceImage src="/images/hotlines-3d.webp" alt="" />
    <span>{t.hotlines}</span>
    <ChevronRight size={18} />
  </Link>

  <Link
    href="/transport"
    className="sevana-service-item sevana-service-transport sevana-image-service"
  >
    <ServiceImage src="/images/transport-3d.webp" alt="" />
    <span>{t.transport}</span>
    <ChevronRight size={18} />
  </Link>

  <Link
    href="/donors"
    className="sevana-service-item sevana-service-donor sevana-image-service"
  >
    <ServiceImage src="/images/donor-3d.webp" alt="" />
    <span>{t.findDonor}</span>
    <ChevronRight size={18} />
  </Link>

  <Link
    href="/blood-request"
    className="sevana-service-item sevana-service-blood sevana-image-service"
  >
    <ServiceImage src="/images/blood-3d.webp" alt="" />
    <span>{t.needBlood}</span>
    <ChevronRight size={18} />
  </Link>

  <Link
    href="/workers"
    className="sevana-service-item sevana-service-workers sevana-image-service"
  >
    <ServiceImage src="/images/localworkers-3d.webp" alt="" />
    <span>{t.workers}</span>
    <ChevronRight size={18} />
  </Link>
</div>

        
      </section>

      {/* Emergency */}
      <Link href="/hotlines" className="sevana-emergency-banner">
        <span className="sevana-emergency-icon">
          <Ambulance size={31} />
        </span>

        <span className="sevana-emergency-content">
          <strong>{t.emergencyTitle}</strong>
          <small>{t.emergencyDescription}</small>
        </span>

        <span className="sevana-emergency-arrow">
          <ArrowRight size={21} />
        </span>
      </Link>

      {/* Charity */}
      <section className="sevana-charity-strip">
        <span className="sevana-charity-icon">
          <ShieldCheck size={32} />
        </span>

        <div className="sevana-charity-content">
          <p>{t.charity}</p>
          <h2>{t.charityTitle}</h2>
          <span>{t.charityDescription}</span>
        </div>

        <div className="sevana-charity-decoration" aria-hidden="true">
          <HeartPulse size={54} />
        </div>
      </section>

      {/* Quick Links */}
      <section className="sevana-quick-links-section">
        <h2 className="sevana-quick-links-title">
          {language === "en" ? "Quick Links" : "വേഗത്തിലുള്ള ലിങ്കുകൾ"}
        </h2>

        <div className="sevana-quick-links">
          <Link href="/services" className="sevana-quick-link sevana-quick-link-green">
            <span className="sevana-quick-link-icon">
              <Building2 size={22} />
            </span>
            <span className="sevana-quick-link-copy">
              <strong>{t.explore}</strong>
              <small>{t.exploreDescription}</small>
            </span>
            <ChevronRight size={20} />
          </Link>

          <Link href="/profile" className="sevana-quick-link sevana-quick-link-blue">
            <span className="sevana-quick-link-icon">
              <HeartPulse size={22} />
            </span>
            <span className="sevana-quick-link-copy">
              <strong>{t.aboutSevana}</strong>
              <small>{t.aboutDescription}</small>
            </span>
            <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="sevana-footer-note">
        <ShieldCheck size={16} />
        <span>{t.footer}</span>
      </footer>

      
    </main>
  );
}
