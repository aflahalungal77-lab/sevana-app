"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Ambulance,
  Building2,
  BriefcaseBusiness,
  CarFront,
  ChevronRight,
  HeartPulse,
  Hotel,
  Languages,
  MapPin,
  Search,
  ShieldCheck,
  Users,
  Wrench,
  X,
  Droplet,
  HandHeart,
} from "lucide-react";

type Language = "ml" | "en";

const translations = {
  en: {
    about: "About",
    community: "Made for our community",
    heroTag: "LOCAL SUPPORT, MADE SIMPLE",
    heroTitle: "A little help can",
    heroAccent: "make a big difference.",
    heroDescription: "Find trusted local services, important contacts and everyday support — all in one place.",
    searchPlaceholder: "What do you need help with?",
    searchHint: "Try “ambulance”, “taxi”, “blood” or “jobs”",
    sectionEyebrow: "EXPLORE SEVANA",
    sectionTitle: "How can we help today?",
    sectionDescription: "Choose a service to get started. Everything is designed to be simple.",
    all: "View all",
    hotlines: "Help & helplines",
    hotlinesDesc: "Hospitals, emergency and support contacts",
    transport: "Taxi & travel",
    transportDesc: "Cars, auto, buses and local rides",
    findDonor: "Find blood donors",
    findDonorDesc: "Search by blood group",
    needBlood: "Request blood",
    needBloodDesc: "Share a blood requirement",
    workers: "Local workers",
    workersDesc: "Find skilled people near you",
    members: "Panchayat & ward",
    membersDesc: "Connect with local representatives",
    hotels: "Hotels & restaurants",
    hotelsDesc: "Find places to stay and eat",
    vacancies: "Job opportunities",
    vacanciesDesc: "Explore local job listings",
    supportTitle: "Support for every generation",
    supportDescription: "Quick access to dedicated community support.",
    women: "Women & safety",
    counselling: "Mental health",
    senior: "Senior citizens",
    emergencyTitle: "Need urgent help?",
    emergencyDescription: "Open the help directory to find important emergency contacts.",
    emergencyAction: "Find help",
    charity: "MEENARKUZHI SHIHAB THANGAL CHARITABLE SOCIETY",
    charityTitle: "Our community. Connected.",
    charityDescription: "A simple way to discover useful services and support around Meenarkuzhi.",
    exploreDescription: "Discover available services",
    aboutSevana: "About Sevana",
    aboutDescription: "Our purpose and the people behind it",
    footer: "Please confirm contact details and service availability before relying on them.",
    noResults: "No matching services",
    noResultsDescription: "Try a different word, or view all services.",
    clearSearch: "Clear search",
    language: "മലയാളം",
    locationFallback: "Meenarkuzhi, Malappuram",
  },
  ml: {
    about: "ആമുഖം",
    community: "നമ്മുടെ നാടിനായി",
    heroTag: "പ്രാദേശിക സഹായം, ഇനി എളുപ്പത്തിൽ",
    heroTitle: "ചെറിയൊരു സഹായം",
    heroAccent: "വലിയ മാറ്റമാകാം.",
    heroDescription: "നാട്ടിലെ സേവനങ്ങളും പ്രധാന കോൺടാക്ടുകളും ആവശ്യമായ സഹായങ്ങളും ഒരിടത്ത് കണ്ടെത്താം.",
    searchPlaceholder: "എന്ത് സഹായമാണ് വേണ്ടത്?",
    searchHint: "ഉദാ: ആംബുലൻസ്, ടാക്സി, രക്തം, ജോലി",
    sectionEyebrow: "സേവന പര്യവേക്ഷണം",
    sectionTitle: "ഇന്ന് എന്ത് സഹായമാണ് വേണ്ടത്?",
    sectionDescription: "ആവശ്യമായ സേവനം തിരഞ്ഞെടുക്കൂ. ഉപയോഗിക്കാൻ വളരെ എളുപ്പം.",
    all: "എല്ലാം കാണുക",
    hotlines: "സഹായ നമ്പറുകൾ",
    hotlinesDesc: "ആശുപത്രി, അടിയന്തര, മറ്റ് സഹായ കോൺടാക്ടുകൾ",
    transport: "ടാക്സിയും യാത്രയും",
    transportDesc: "കാർ, ഓട്ടോ, ബസ്, പ്രാദേശിക യാത്രകൾ",
    findDonor: "രക്തദാതാക്കളെ കണ്ടെത്താം",
    findDonorDesc: "രക്തഗ്രൂപ്പ് അനുസരിച്ച് തിരയാം",
    needBlood: "രക്തം ആവശ്യപ്പെടാം",
    needBloodDesc: "രക്തത്തിനുള്ള അഭ്യർത്ഥന നൽകാം",
    workers: "പ്രാദേശിക തൊഴിലാളികൾ",
    workersDesc: "സമീപത്തെ വിദഗ്ധ തൊഴിലാളികളെ കണ്ടെത്താം",
    members: "പഞ്ചായത്ത് & വാർഡ്",
    membersDesc: "പ്രാദേശിക ജനപ്രതിനിധികളെ ബന്ധപ്പെടാം",
    hotels: "ഹോട്ടലുകളും റെസ്റ്റോറന്റുകളും",
    hotelsDesc: "താമസിക്കാനും ഭക്ഷണം കഴിക്കാനുമുള്ള ഇടങ്ങൾ",
    vacancies: "തൊഴിൽ അവസരങ്ങൾ",
    vacanciesDesc: "പ്രാദേശിക തൊഴിൽ വിവരങ്ങൾ കണ്ടെത്താം",
    supportTitle: "എല്ലാ തലമുറകൾക്കും സഹായം",
    supportDescription: "പ്രത്യേക സഹായ വിഭാഗങ്ങളിലേക്ക് വേഗത്തിൽ എത്താം.",
    women: "വനിതാ സഹായം",
    counselling: "മാനസികാരോഗ്യം",
    senior: "മുതിർന്ന പൗരന്മാർ",
    emergencyTitle: "അടിയന്തര സഹായം വേണോ?",
    emergencyDescription: "പ്രധാനപ്പെട്ട അടിയന്തര കോൺടാക്ടുകൾ ഇവിടെ കണ്ടെത്താം.",
    emergencyAction: "സഹായം കണ്ടെത്തുക",
    charity: "മീനാർകുഴി ശിഹാബ് തങ്ങൾ ചാരിറ്റബിൾ സൊസൈറ്റി",
    charityTitle: "നമ്മുടെ നാട്, ഒരുമിച്ച്.",
    charityDescription: "മീനാർകുഴിയിലെയും സമീപ പ്രദേശങ്ങളിലെയും സേവനങ്ങൾ കണ്ടെത്താനുള്ള ലളിതമായ മാർഗം.",
    exploreDescription: "ലഭ്യമായ സേവനങ്ങൾ കണ്ടെത്താം",
    aboutSevana: "സേവനയെക്കുറിച്ച്",
    aboutDescription: "നമ്മുടെ ലക്ഷ്യവും ഇതിന് പിന്നിലുള്ളവരും",
    footer: "ബന്ധപ്പെടുന്നതിന് മുമ്പ് ഫോൺ നമ്പറും സേവനലഭ്യതയും ഉറപ്പാക്കുക.",
    noResults: "പൊരുത്തപ്പെടുന്ന സേവനങ്ങൾ കണ്ടെത്തിയില്ല",
    noResultsDescription: "മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് തിരയുക, അല്ലെങ്കിൽ എല്ലാ സേവനങ്ങളും കാണുക.",
    clearSearch: "തിരച്ചിൽ മായ്ക്കുക",
    language: "English",
    locationFallback: "മീനാർകുഴി, മലപ്പുറം",
  },
} as const;

const serviceKeywords: Record<string, string> = {
  hotlines: "ambulance hospital police fire women safety counselling senior citizen helpline അടിയന്തര ആശുപത്രി പോലീസ് വനിതാ സുരക്ഷ മാനസികാരോഗ്യം മുതിർന്ന പൗരന്മാർ",
  transport: "taxi car auto bus travel driver ടാക്സി കാർ ഓട്ടോ ബസ് യാത്ര",
  findDonor: "blood donor group രക്തം രക്തദാതാവ് ബ്ലഡ്",
  needBlood: "blood request patient hospital രക്തം അഭ്യർത്ഥന രോഗി ആശുപത്രി",
  workers: "worker plumber electrician carpenter mason repair തൊഴിലാളി പ്ലംബർ ഇലക്ട്രീഷ്യൻ മരപ്പണി കൽപ്പണി",
  members: "panchayat ward president representative പഞ്ചായത്ത് വാർഡ് പ്രസിഡന്റ് ജനപ്രതിനിധി",
  hotels: "hotel restaurant food stay ഹോട്ടൽ റെസ്റ്റോറന്റ് ഭക്ഷണം താമസം",
  vacancies: "job vacancy employment work career ജോലി തൊഴിൽ അവസരം",
};

const serviceItems = [
  { id: "hotlines", href: "/hotlines", image: "/images/hotlines-3d.webp", Icon: HeartPulse, tone: "rose" },
  { id: "transport", href: "/transport", image: "/images/transport-3d.webp", Icon: CarFront, tone: "amber" },
  { id: "findDonor", href: "/donors", image: "/images/donor-3d.webp", Icon: Droplet, tone: "red" },
  { id: "needBlood", href: "/blood-request", image: "/images/blood-3d.webp", Icon: HandHeart, tone: "red" },
  { id: "workers", href: "/workers", image: "/images/localworkers-3d.webp", Icon: Wrench, tone: "blue" },
  { id: "members", href: "/members", image: "/emojis/members.png", Icon: Users, tone: "green" },
  { id: "hotels", href: "/hotels", image: "/emojis/hotels.png", Icon: Hotel, tone: "amber" },
  { id: "vacancies", href: "/vacancies", image: "/emojis/vacancy.png", Icon: BriefcaseBusiness, tone: "violet" },
] as const;

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [search, setSearch] = useState("");

  const location = process.env.NEXT_PUBLIC_APP_LOCATION || "Meenarkuzhi, Malappuram";

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("sevana-language");
    if (savedLanguage === "ml" || savedLanguage === "en") setLanguage(savedLanguage);
  }, []);

  function toggleLanguage() {
    const nextLanguage: Language = language === "en" ? "ml" : "en";
    setLanguage(nextLanguage);
    window.localStorage.setItem("sevana-language", nextLanguage);
    document.documentElement.lang = nextLanguage;
    window.dispatchEvent(new CustomEvent("sevana:language-change", { detail: nextLanguage }));
  }

  const t = translations[language];
  const filteredServices = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return serviceItems;
    return serviceItems.filter(({ id }) => {
      const item = t[id];
      const description = t[`${id}Desc` as keyof typeof t];
      return `${item} ${description} ${id} ${serviceKeywords[id]}`.toLocaleLowerCase().includes(query);
    });
  }, [search, t]);

  return (
    <main className="page sevana-home sh-home" lang={language}>
      <header className="sh-header">
        <Link href="/" className="sh-brand" aria-label="Sevana home">
          <span className="sh-brand-mark"><img src="/sevana-logo.png" alt="" /></span>
          <span className="sh-brand-copy">
            <strong>Sevana<span>.</span></strong>
            <small>Together for a Better Tomorrow</small>
          </span>
        </Link>
        <div className="sh-header-actions">
          <button type="button" className="sh-language-toggle" onClick={toggleLanguage} aria-label={language === "en" ? "Switch to Malayalam" : "Switch to English"} aria-pressed={language === "ml"}>
            <Languages size={17} />
            <span>{t.language}</span>
          </button>
          <Link href="/about" className="sh-about-link"><Building2 size={17} /><span>{t.about}</span></Link>
        </div>
      </header>

      <div className="sh-location-row">
        <span className="sh-location-pill"><MapPin size={15} /><span>{language === "ml" && location === "Meenarkuzhi, Malappuram" ? t.locationFallback : location}</span></span>
        <span className="sh-community-label"><span className="sh-live-dot" />{t.community}</span>
      </div>

      <section className="sh-hero">
        <img className="sh-hero-image" src="/images/hero.webp" alt="" aria-hidden="true" />
        <div className="sh-hero-overlay" />
        <div className="sh-hero-content">
          <span className="sh-hero-eyebrow"><HeartPulse size={15} />{t.heroTag}</span>
          <h1>{t.heroTitle}<br /><span>{t.heroAccent}</span></h1>
          <p>{t.heroDescription}</p>
          <div className="sh-hero-proof"><span><ShieldCheck size={19} /></span><div><strong>{language === "en" ? "Local support you can find easily" : "നാട്ടിലെ സഹായം ഇനി വിരൽത്തുമ്പിൽ"}</strong><small>{language === "en" ? "Useful services, one simple place" : "പ്രധാന സേവനങ്ങൾ ഒരിടത്ത്"}</small></div></div>
        </div>
        <span className="sh-hero-decoration" aria-hidden="true"><HeartPulse size={120} /></span>
      </section>

      <section className="sh-services" aria-labelledby="sh-services-title">
        <div className="sh-section-heading">
          <div><span className="sh-eyebrow">{t.sectionEyebrow}</span><h2 id="sh-services-title">{t.sectionTitle}</h2><p>{t.sectionDescription}</p></div>
          <Link href="/services" className="sh-view-all">{t.all}<ArrowUpRight size={16} /></Link>
        </div>

        <label className="sh-search">
          <Search size={19} aria-hidden="true" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={t.searchPlaceholder} aria-label={t.searchPlaceholder} />
          {search && <button type="button" onClick={() => setSearch("")} aria-label={t.clearSearch}><X size={17} /></button>}
        </label>
        <p className="sh-search-hint">{t.searchHint}</p>

        {filteredServices.length > 0 ? (
          <div className="sh-service-grid">
            {filteredServices.map(({ id, href, image, Icon, tone }) => (
              <Link key={id} href={href} className={`sh-service-card sh-tone-${tone}`}>
                <span className="sh-service-icon"><img src={image} alt="" loading="lazy" /><Icon className="sh-service-fallback" size={24} /></span>
                <span className="sh-service-copy"><strong>{t[id]}</strong><small>{t[`${id}Desc` as keyof typeof t]}</small></span>
                <ArrowUpRight className="sh-service-arrow" size={17} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="sh-no-results"><Search size={24} /><strong>{t.noResults}</strong><span>{t.noResultsDescription}</span><button type="button" onClick={() => setSearch("")}>{t.clearSearch}</button></div>
        )}
      </section>

      <section className="sh-support">
        <div className="sh-support-heading"><span className="sh-eyebrow">{language === "en" ? "DEDICATED COMMUNITY CARE" : "പ്രത്യേക സമൂഹ സഹായം"}</span><h2>{t.supportTitle}</h2><p>{t.supportDescription}</p></div>
        <div className="sh-support-links">
          <Link href="/hotlines/women" className="sh-support-link"><img src="/emojis/women.png" alt="" /><span>{t.women}</span><ChevronRight size={17} /></Link>
          <Link href="/hotlines/mental-health-counselling" className="sh-support-link"><img src="/emojis/counselling.png" alt="" /><span>{t.counselling}</span><ChevronRight size={17} /></Link>
          <Link href="/hotlines/senior-citizen-support" className="sh-support-link"><img src="/emojis/citizen.png" alt="" /><span>{t.senior}</span><ChevronRight size={17} /></Link>
        </div>
      </section>

      <Link href="/hotlines" className="sh-emergency">
        <span className="sh-emergency-icon"><Ambulance size={27} /></span>
        <span className="sh-emergency-copy"><strong>{t.emergencyTitle}</strong><small>{t.emergencyDescription}</small></span>
        <span className="sh-emergency-action">{t.emergencyAction}<ArrowRight size={16} /></span>
      </Link>

      <section className="sh-community-card">
        <span className="sh-community-icon"><ShieldCheck size={27} /></span>
        <div><span>{t.charity}</span><h2>{t.charityTitle}</h2><p>{t.charityDescription}</p></div>
      </section>

      <section className="sh-bottom-links">
        <Link href="/services"><span className="sh-bottom-link-icon"><Building2 size={20} /></span><span><strong>{t.all}</strong><small>{t.exploreDescription}</small></span><ChevronRight size={18} /></Link>
        <Link href="/about"><span className="sh-bottom-link-icon"><Users size={20} /></span><span><strong>{t.aboutSevana}</strong><small>{t.aboutDescription}</small></span><ChevronRight size={18} /></Link>
      </section>

      <footer className="sh-footer"><ShieldCheck size={15} /><span>{t.footer}</span></footer>
    </main>
  );
}
