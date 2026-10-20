"use client";

import { Languages } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const enToMl: Record<string, string> = {
  "Home": "ഹോം", "Services": "സേവനങ്ങൾ", "Blood": "രക്തം", "About": "ആമുഖം",
  "Aamugam": "ആമുഖം", "About Sevana": "സേവനയെക്കുറിച്ച്", "Learn about our platform": "നമ്മുടെ പ്ലാറ്റ്‌ഫോമിനെ അറിയാം",
  "Hotlines": "അടിയന്തര നമ്പറുകൾ", "Important local contacts": "പ്രധാനപ്പെട്ട പ്രാദേശിക കോൺടാക്ടുകൾ",
  "Who do you need?": "ആരെയാണ് ആവശ്യം?", "Select a category to view contact numbers.": "കോൺടാക്ട് നമ്പറുകൾ കാണാൻ ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക.",
  "Hospital": "ആശുപത്രി", "Ambulance": "ആംബുലൻസ്", "Police Station": "പോലീസ് സ്റ്റേഷൻ", "Fire Station": "ഫയർ സ്റ്റേഷൻ",
  "Blood Banks": "ബ്ലഡ് ബാങ്കുകൾ", "Child Line": "ചൈൽഡ് ലൈൻ", "Medical Shops": "മെഡിക്കൽ ഷോപ്പുകൾ", "Doctor's Clinic": "ഡോക്ടർ ക്ലിനിക്", "KSEB": "കെ.എസ്.ഇ.ബി.",
  "For immediate danger, use verified official emergency numbers. This directory may be incomplete until local contacts are added.": "അടിയന്തര സാഹചര്യങ്ങളിൽ ഔദ്യോഗിക നമ്പറുകൾ ഉപയോഗിക്കുക. പ്രാദേശിക കോൺടാക്ടുകൾ ചേർക്കുന്നതുവരെ ഈ പട്ടിക അപൂർണ്ണമായിരിക്കാം.",
  "Taxi Services": "ടാക്സി സേവനങ്ങൾ", "Taxi & Transport": "ടാക്സി & ഗതാഗതം", "Local trips and longer journeys": "പ്രാദേശിക യാത്രകളും ദീർഘയാത്രകളും",
  "Nearby rides and short trips": "സമീപ യാത്രകൾ", "Group travel and tours": "ഗ്രൂപ്പ് യാത്രകളും ടൂറുകളും", "Rental vehicle services": "വാടക വാഹന സേവനങ്ങൾ",
  "Goods & Lorry": "ചരക്ക് വാഹനങ്ങളും ലോറിയും", "Goods transport, pickups and lorry services": "ചരക്ക് ഗതാഗതം, പിക്കപ്പ്, ലോറി സേവനങ്ങൾ",
  "Where do you need to go?": "എവിടേക്കാണ് പോകേണ്ടത്?", "Choose a transport category to find local contacts.": "പ്രാദേശിക ഗതാഗത കോൺടാക്ടുകൾ കണ്ടെത്താൻ ഒരു വിഭാഗം തിരഞ്ഞെടുക്കുക.",
  "Driver listings are added by the local admin. Confirm fares and availability directly with the driver.": "ഡ്രൈവർ വിവരങ്ങൾ അഡ്മിൻ ചേർക്കുന്നു. നിരക്കും ലഭ്യതയും ഡ്രൈവറുമായി നേരിട്ട് ഉറപ്പാക്കുക.",
  "Local Workers": "പ്രാദേശിക തൊഴിലാളികൾ", "Find skilled help around you": "സമീപത്തുള്ള വിദഗ്ധ സഹായം കണ്ടെത്തുക",
  "What do you need help with?": "എന്ത് സഹായമാണ് വേണ്ടത്?", "Select a service to view worker contacts.": "തൊഴിലാളികളുടെ കോൺടാക്ടുകൾ കാണാൻ ഒരു സേവനം തിരഞ്ഞെടുക്കുക.",
  "Construction": "നിർമാണം", "Building and finishing work": "കെട്ടിട നിർമാണവും ഫിനിഷിങ്ങും", "Masonry Work": "കൽപ്പണി", "Masonry and brick work": "കൽപ്പണിയും ഇഷ്ടികപ്പണിയും",
  "Carpenter": "മരപ്പണി", "Doors, furniture and wood work": "വാതിൽ, ഫർണിച്ചർ, മരപ്പണികൾ", "Tiles & Marble Work": "ടൈൽസ് & മാർബിൾ പണി", "Tiles and marble fitting": "ടൈൽസ്, മാർബിൾ പാകൽ",
  "Plumbing & Wiring": "പ്ലംബിംഗ് & വയറിംഗ്", "Plumbing and electrical services": "പ്ലംബിംഗ്, ഇലക്ട്രിക്കൽ സേവനങ്ങൾ", "Plumbers and electricians": "പ്ലംബർമാരും ഇലക്ട്രീഷ്യന്മാരും",
  "Home Maintenance": "വീട്ടുപരിപാലനം", "Help to maintain your home": "വീട്ടുപരിപാലനത്തിനുള്ള സഹായം", "Painters": "പെയിന്റർമാർ", "Interior and exterior painting": "അകത്തും പുറത്തുമുള്ള പെയിന്റിംഗ്",
  "Welders": "വെൽഡർമാർ", "Welding and metal work": "വെൽഡിംഗും ലോഹപ്പണിയും", "Home Workers": "വീട്ടുജോലിക്കാർ", "General home help": "വീട്ടിലെ പൊതുജോലികൾ",
  "Garden Services": "തോട്ടപ്പണികൾ", "Garden care and maintenance": "തോട്ടപരിപാലനം", "Agricultural Works": "കാർഷിക ജോലികൾ", "Agriculture and local farm work": "കൃഷിയും പ്രാദേശിക കാർഷിക ജോലികളും", "Agricultural and farming work": "കൃഷിയുമായി ബന്ധപ്പെട്ട ജോലികൾ",
  "Category not found": "വിഭാഗം കണ്ടെത്താനായില്ല", "Back to Workers": "തൊഴിലാളികളിലേക്ക് മടങ്ങുക", "Back to Hotlines": "ഹോട്ട്‌ലൈനുകളിലേക്ക് മടങ്ങുക", "Back to Taxi": "ടാക്സിയിലേക്ക് മടങ്ങുക",
  "Local worker directory": "പ്രാദേശിക തൊഴിലാളികളുടെ പട്ടിക", "Local contact directory": "പ്രാദേശിക കോൺടാക്ട് പട്ടിക", "Local transport contacts": "പ്രാദേശിക ഗതാഗത കോൺടാക്ടുകൾ",
  "No workers listed yet": "തൊഴിലാളികളെ ഇതുവരെ ചേർത്തിട്ടില്ല", "Worker details will appear here when added by the admin.": "അഡ്മിൻ ചേർക്കുമ്പോൾ തൊഴിലാളികളുടെ വിവരങ്ങൾ ഇവിടെ കാണാം.",
  "No contacts added yet": "കോൺടാക്ടുകൾ ഇതുവരെ ചേർത്തിട്ടില്ല", "No drivers listed yet": "ഡ്രൈവർമാരെ ഇതുവരെ ചേർത്തിട്ടില്ല", "Call": "വിളിക്കുക",
  "Please verify service information before relying on it.": "സേവനം ഉപയോഗിക്കുന്നതിന് മുമ്പ് വിവരങ്ങൾ ഉറപ്പുവരുത്തുക.", "Need urgent help?": "അടിയന്തര സഹായം വേണോ?", "Find emergency contacts quickly.": "അടിയന്തര കോൺടാക്ടുകൾ വേഗത്തിൽ കണ്ടെത്തുക.",
  "All": "എല്ലാം", "Explore all services": "എല്ലാ സേവനങ്ങളും കാണുക", "Discover available services": "ലഭ്യമായ സേവനങ്ങൾ കണ്ടെത്തുക",
  "Local help.": "പ്രാദേശിക സഹായം.", "When you need it.": "ആവശ്യമുള്ളപ്പോൾ.", "Trusted local services around Meenarkuzhi, all in one place.": "മീനാർകുഴിയിലെയും സമീപ പ്രദേശങ്ങളിലെയും സേവനങ്ങൾ ഒരിടത്ത്.",
  "HERE FOR OUR COMMUNITY": "നമ്മുടെ നാടിനൊപ്പം", "Made for you": "നിങ്ങൾക്കായി", "YOUR COMMUNITY SERVICES": "നമ്മുടെ നാട്ടിലെ സേവനങ്ങൾ", "How can we help?": "എന്താണ് ആവശ്യം?", "Everything you need, just a tap away.": "വേണ്ട സേവനങ്ങൾ ഒരു ടാപ്പിൽ.",
  "Find a Donor": "രക്തദാതാക്കളെ കണ്ടെത്തുക", "Need Blood?": "രക്തം ആവശ്യമുണ്ടോ?", "Taxi & Travel": "ടാക്സി & യാത്ര",
  "MEENARKUZHI SHIHAB THANGAL CHARITY": "മീനാർകുഴി ശിഹാബ് തങ്ങൾ ചാരിറ്റി", "Sevanangal ellam oridathil.": "എല്ലാ സേവനങ്ങളും ഒരിടത്ത്.",
  "Find useful local services and contacts in your community.": "നമ്മുടെ നാട്ടിലെ സേവനങ്ങളും കോൺടാക്ടുകളും കണ്ടെത്തുക.",
  "No listings yet": "വിവരങ്ങൾ ചേർത്തിട്ടില്ല", "Add listing": "വിവരം ചേർക്കുക", "Edit listing": "വിവരം തിരുത്തുക", "Save listing": "സേവ് ചെയ്യുക",
  "Visible to users": "ഉപയോക്താക്കൾക്ക് കാണാം", "Hidden from users": "ഉപയോക്താക്കളിൽ നിന്ന് മറച്ചിരിക്കുന്നു", "Position": "സ്ഥാനം", "Search": "തിരയുക",
  "DIRECTORY MANAGEMENT": "ഡയറക്ടറി മാനേജ്മെന്റ്", "Choose a category to manage its listings": "വിവരങ്ങൾ നിയന്ത്രിക്കാൻ വിഭാഗം തിരഞ്ഞെടുക്കുക", "All categories": "എല്ലാ വിഭാഗങ്ങളും",
  "Drag records using the handle to change the order shown to users.": "ഹാൻഡിൽ വലിച്ചുകൊണ്ട് ഉപയോക്താക്കൾക്ക് കാണുന്ന ക്രമം മാറ്റാം.", "Changes here also update the public Sevana listing.": "ഇവിടെയുള്ള മാറ്റങ്ങൾ പൊതുജനങ്ങളുടെ സേവന പട്ടികയിലും പ്രതിഫലിക്കും.",
  "Name / business / contact": "പേര് / സ്ഥാപനം / കോൺടാക്ട്", "Phone number": "ഫോൺ നമ്പർ", "Vehicle type (optional)": "വാഹന തരം (ഐച്ഛികം)", "Area": "പ്രദേശം", "Address / landmark": "വിലാസം / ലാൻഡ്മാർക്ക്", "Description (optional)": "വിവരണം (ഐച്ഛികം)",
  "Admin setup required": "അഡ്മിൻ ക്രമീകരണം ആവശ്യമാണ്", "Access restricted": "പ്രവേശനം നിയന്ത്രിച്ചിരിക്കുന്നു", "Back to login": "ലോഗിനിലേക്ക് മടങ്ങുക", "Back": "തിരികെ",
  "SEVANA DIRECTORY": "സേവന ഡയറക്ടറി", "All services": "എല്ലാ സേവനങ്ങളും", "Choose what you need and find the right contact.": "നിങ്ങൾക്ക് വേണ്ട സേവനം തിരഞ്ഞെടുത്ത് കോൺടാക്ട് കണ്ടെത്തുക.",
  "Search by blood group": "രക്തഗ്രൂപ്പ് ഉപയോഗിച്ച് തിരയുക", "Find a matching donor": "അനുയോജ്യമായ രക്തദാതാവിനെ കണ്ടെത്തുക", "Choose the blood group you need.": "ആവശ്യമുള്ള രക്തഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക.",
  "Donor information is sensitive. Only use contact details for genuine blood donation coordination. Please verify availability directly.": "രക്തദാതാക്കളുടെ വിവരങ്ങൾ സ്വകാര്യമാണ്. രക്തദാന ആവശ്യങ്ങൾക്ക് മാത്രം ബന്ധപ്പെടുക. ലഭ്യത നേരിട്ട് ഉറപ്പാക്കുക.",
  "Need Blood": "രക്തം ആവശ്യമുണ്ട്", "Submit a blood request": "രക്തത്തിനുള്ള അഭ്യർത്ഥന നൽകുക", "Blood request details": "രക്ത അഭ്യർത്ഥനയുടെ വിവരങ്ങൾ", "Enter accurate information so people can respond.": "ബന്ധപ്പെടാൻ കഴിയുന്ന കൃത്യമായ വിവരങ്ങൾ നൽകുക.",
  "Please fill in the details and send.": "വിവരങ്ങൾ പൂരിപ്പിച്ച് അയയ്ക്കുക.", "Urgency": "അടിയന്തരത", "Blood group": "രക്തഗ്രൂപ്പ്", "All blood groups": "എല്ലാ രക്തഗ്രൂപ്പുകളും", "Find Donors": "രക്തദാതാക്കളെ കണ്ടെത്തുക", "Searching...": "തിരയുന്നു...", "No donors found": "രക്തദാതാക്കളെ കണ്ടെത്തിയില്ല", "No matching donors are listed yet. Try another group later.": "ഈ ഗ്രൂപ്പിൽ ദാതാക്കളെ ചേർത്തിട്ടില്ല. പിന്നീട് വീണ്ടും ശ്രമിക്കുക.",
  "YOUR COMMUNITY, CONNECTED": "നിങ്ങളുടെ നാട്, ഒരുമിച്ച്", "Meenarkuzhi, Malappuram, Kerala": "മീനാർകുഴി, മലപ്പുറം, കേരളം", "OUR PURPOSE": "നമ്മുടെ ലക്ഷ്യം", "Community support": "സമൂഹത്തിനുള്ള പിന്തുണ", "Helping people find the support they need.": "ആവശ്യമായ സഹായം കണ്ടെത്താൻ ആളുകളെ സഹായിക്കുന്നു.", "Simple and accessible": "ലളിതവും എല്ലാവർക്കും ഉപയോഗിക്കാവുന്നതും", "Useful local services in one easy-to-use platform.": "പ്രാദേശിക സേവനങ്ങൾ ഉപയോഗിക്കാൻ എളുപ്പമുള്ള ഒരിടത്ത്.", "Use information responsibly": "വിവരങ്ങൾ ഉത്തരവാദിത്തത്തോടെ ഉപയോഗിക്കുക", "Confirm contact details and service availability before use.": "ഉപയോഗിക്കുന്നതിന് മുമ്പ് കോൺടാക്ടും സേവനലഭ്യതയും ഉറപ്പാക്കുക.", "THE PERSON BEHIND THE CODE": "ഈ പ്ലാറ്റ്‌ഫോമിന് പിന്നിൽ", "Meet the Developer": "ഡെവലപ്പറെ പരിചയപ്പെടാം", "Developer & Creator": "ഡെവലപ്പറും സ്രഷ്ടാവും", "Web Development": "വെബ് ഡെവലപ്‌മെന്റ്", "Built for our community": "നമ്മുടെ നാടിനായി നിർമ്മിച്ചത്", "Designed with local people and everyday needs in mind.": "നാട്ടുകാരുടെയും ദൈനംദിന ആവശ്യങ്ങളുടെയും അടിസ്ഥാനത്തിൽ രൂപകൽപ്പന ചെയ്തത്.", "Made with care for the community.": "നമ്മുടെ സമൂഹത്തോടുള്ള കരുതലോടെ നിർമ്മിച്ചത്.",
  "ADMIN WORKSPACE": "അഡ്മിൻ വർക്ക്‌സ്‌പേസ്", "CONTROL CENTRE": "നിയന്ത്രണ കേന്ദ്രം", "Good to see you.": "സ്വാഗതം.", "Manage your community services from one place.": "നാട്ടിലെ സേവനങ്ങൾ ഒരിടത്ത് നിന്ന് നിയന്ത്രിക്കുക.", "Service listings": "സേവന വിവരങ്ങൾ", "Across all categories": "എല്ലാ വിഭാഗങ്ങളിലുമായി", "Blood donors": "രക്തദാതാക്കൾ", "Directory entries": "ഡയറക്ടറി വിവരങ്ങൾ", "MANAGE YOUR DIRECTORY": "ഡയറക്ടറി നിയന്ത്രിക്കുക", "Services & categories": "സേവനങ്ങളും വിഭാഗങ്ങളും", "Changes are managed securely through your Supabase admin account.": "Supabase അഡ്മിൻ അക്കൗണ്ട് വഴി മാറ്റങ്ങൾ സുരക്ഷിതമായി നിയന്ത്രിക്കുന്നു.",
  "Manage donor records carefully": "രക്തദാതാക്കളുടെ വിവരങ്ങൾ ശ്രദ്ധയോടെ കൈകാര്യം ചെയ്യുക", "Get each donor&apos;s explicit consent before publishing their name and phone number. Keep availability up to date.": "പേരും ഫോൺ നമ്പറും പ്രസിദ്ധീകരിക്കുന്നതിന് മുമ്പ് ദാതാവിന്റെ വ്യക്തമായ സമ്മതം നേടുക. ലഭ്യത പുതുക്കുക.", "Donor name": "ദാതാവിന്റെ പേര്", "Available for requests": "അഭ്യർത്ഥനകൾക്കായി ലഭ്യമാണ്", "Save donor": "ദാതാവിന്റെ വിവരങ്ങൾ സേവ് ചെയ്യുക", "No donors added yet": "ദാതാക്കളെ ചേർത്തിട്ടില്ല", "Add donors only with their permission.": "അവരുടെ അനുമതിയോടെ മാത്രം ദാതാക്കളെ ചേർക്കുക.", "Available": "ലഭ്യമാണ്", "Unavailable": "ലഭ്യമല്ല", "Delete donor record?": "ദാതാവിന്റെ വിവരം ഇല്ലാതാക്കണോ?", "Donor deleted.": "ദാതാവിന്റെ വിവരം ഇല്ലാതാക്കി.",
  "Email address": "ഇമെയിൽ വിലാസം", "Password": "പാസ്‌വേഡ്", "Sign in": "സൈൻ ഇൻ", "Signing in...": "സൈൻ ഇൻ ചെയ്യുന്നു...", "Search donors": "ദാതാക്കളെ തിരയുക", "Phone": "ഫോൺ", "Name": "പേര്", "Description": "വിവരണം", "Address": "വിലാസം", "Save": "സേവ് ചെയ്യുക", "Delete": "ഇല്ലാതാക്കുക", "Edit": "തിരുത്തുക", "Cancel": "റദ്ദാക്കുക",
};

const mlToEn = Object.fromEntries(Object.entries(enToMl).map(([en, ml]) => [ml, en]));

function translateDom(language: "en" | "ml") {
  const map = language === "ml" ? enToMl : mlToEn;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  for (const node of nodes) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script,style,noscript,[data-no-translate]")) continue;
    const raw = node.nodeValue ?? "";
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const translated = map[trimmed];
    if (translated) node.nodeValue = raw.replace(trimmed, translated);
  }
  const attrs = ["placeholder", "aria-label", "title"];
  document.querySelectorAll<HTMLElement>("input,textarea,button,a,[title],[aria-label]").forEach((el) => {
    if (el.closest("[data-no-translate]")) return;
    for (const attr of attrs) {
      const value = el.getAttribute(attr);
      if (value && map[value]) el.setAttribute(attr, map[value]);
    }
  });
}

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "ml">("en");

  const applyLanguage = useCallback((next: "en" | "ml") => {
    setLanguage(next);
    document.documentElement.lang = next;
    localStorage.setItem("sevana-language", next);
    translateDom(next);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("sevana-language");
    const initial: "en" | "ml" = saved === "ml" ? "ml" : "en";
    setLanguage(initial);
    document.documentElement.lang = initial;
    translateDom(initial);

    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        translateDom(document.documentElement.lang === "ml" ? "ml" : "en");
      });
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return (
    <button
      type="button"
      className="global-language-toggle"
      data-no-translate="true"
      onClick={() => applyLanguage(language === "en" ? "ml" : "en")}
      aria-label={language === "en" ? "Switch to Malayalam" : "Switch to English"}
      title={language === "en" ? "Switch to Malayalam" : "Switch to English"}
    >
      <Languages size={16} />
      <span>{language === "en" ? "മലയാളം" : "English"}</span>
    </button>
  );
}
