"use client";

import { Languages } from "lucide-react";
import { usePathname } from "next/navigation";
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
  "Plastering Work": "തേപ്പ് പണി",
  "Wall plastering and finishing work": "ചുമർ തേയ്ക്കലും ഫിനിഷിങ് ജോലികളും",
  "Laterite Stone Quarrying": "ചെങ്കല്ല് കോരൽ",
  "Laterite stone cutting and quarrying": "ചെങ്കല്ല് വെട്ടിയെടുക്കുന്ന ജോലി",
  "Others": "മറ്റുള്ളവ",
  "Agriculture & Farming": "കൃഷിയും കാർഷിക മേഖലയും",
  "Agricultural Workers": "കാർഷിക തൊഴിലാളികൾ",
  "Local agricultural services": "പ്രാദേശിക കാർഷിക സേവനങ്ങൾ",
  "Agricultural work and farm services": "കാർഷിക ജോലികളും കൃഷിസേവനങ്ങളും",
  "Painting & Wood Polishing": "പെയിന്റിംഗ് & വുഡ് പോളിഷിംഗ്",
  "Painting and wood polishing": "പെയിന്റിംഗും വുഡ് പോളിഷിംഗും",
  "Curtain & Carpet Works": "കർട്ടൻ & കാർപെറ്റ് ജോലികൾ",
  "Curtain and carpet work": "കർട്ടൻ, കാർപെറ്റ് ജോലികൾ",
  "Mechanical Engineering": "മെക്കാനിക്കൽ എഞ്ചിനീയറിംഗ്",
  "Mechanical engineering services": "മെക്കാനിക്കൽ എഞ്ചിനീയറിംഗ് സേവനങ്ങൾ",
  "Videography & Editing": "വീഡിയോഗ്രഫി & എഡിറ്റിംഗ്",
  "Videography and video editing": "വീഡിയോഗ്രഫിയും വീഡിയോ എഡിറ്റിംഗും",
  "Other skilled professions": "മറ്റ് വിദഗ്ധ തൊഴിലുകൾ",
  "Other local skills and services": "മറ്റ് പ്രാദേശിക തൊഴിലുകളും സേവനങ്ങളും",
  "Other professions and local services": "മറ്റ് തൊഴിൽ മേഖലകളും പ്രാദേശിക സേവനങ്ങളും",
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


// Additional translations for the newer Sevana modules and dynamic page states.
// Keep these labels here so the global toggle also covers newly added routes.
Object.assign(enToMl, {
  "Women Help & Safety": "വനിതാ സഹായവും സുരക്ഷയും",
  "Women Help": "വനിതാ സഹായം",
  "Women Safety": "വനിതാ സുരക്ഷ",
  "Women Support": "വനിതാ പിന്തുണ",
  "Women Helpline": "വനിതാ ഹെൽപ്‌ലൈൻ",
  "Women Help Line": "വനിതാ സഹായ നമ്പർ",
  "Cyber Crime Help": "സൈബർ കുറ്റകൃത്യ സഹായം",
  "Mental Health & Counselling": "മാനസികാരോഗ്യവും കൗൺസിലിംഗും",
  "Senior Citizen Support": "മുതിർന്ന പൗരന്മാർക്കുള്ള സഹായം",
  "Tele-MANAS Mental Health Helpline": "ടെലി-മാനസ് മാനസികാരോഗ്യ ഹെൽപ്‌ലൈൻ",
  "DISHA Kerala Health Helpline": "ദിശ കേരള ആരോഗ്യ ഹെൽപ്‌ലൈൻ",
  "Manodarpan Student Support": "മനോദർപ്പൺ വിദ്യാർത്ഥി സഹായം",
  "KIRAN Mental Health Helpline": "കിരൺ മാനസികാരോഗ്യ ഹെൽപ്‌ലൈൻ",
  "Elderline Senior Citizen Helpline": "എൽഡർലൈൻ മുതിർന്ന പൗരന്മാരുടെ ഹെൽപ്‌ലൈൻ",
  "District Social Justice Office": "ജില്ലാ സാമൂഹ്യനീതി ഓഫീസ്",
  "Directorate of Social Justice Kerala": "കേരള സാമൂഹ്യനീതി ഡയറക്ടറേറ്റ്",
  "NALSA Free Legal Aid Helpline": "നാൽസ സൗജന്യ നിയമസഹായ ഹെൽപ്‌ലൈൻ",

  "Hotels & Restaurants": "ഹോട്ടലുകളും റെസ്റ്റോറന്റുകളും",
  "Find places to stay and eat nearby": "സമീപത്തെ താമസ-ഭക്ഷണ കേന്ദ്രങ്ങൾ കണ്ടെത്തുക",
  "Explore local places": "പ്രാദേശിക സ്ഥാപനങ്ങൾ കണ്ടെത്തുക",
  "Search by name, phone number or location, and filter hotels and restaurants.": "പേര്, ഫോൺ നമ്പർ, സ്ഥലം എന്നിവ ഉപയോഗിച്ച് തിരയുകയും ഹോട്ടലുകളും റെസ്റ്റോറന്റുകളും വേർതിരിക്കുകയും ചെയ്യാം.",
  "Search name, place, area or phone number...": "പേര്, സ്ഥലം, പ്രദേശം അല്ലെങ്കിൽ ഫോൺ നമ്പർ തിരയുക...",
  "Filter by listing type": "സ്ഥാപനത്തിന്റെ തരം അനുസരിച്ച് ഫിൽട്ടർ ചെയ്യുക",
  "Hotels": "ഹോട്ടലുകൾ",
  "Restaurants": "റെസ്റ്റോറന്റുകൾ",
  "Hotel": "ഹോട്ടൽ",
  "Restaurant": "റെസ്റ്റോറന്റ്",
  "No matching places found": "പൊരുത്തപ്പെടുന്ന സ്ഥാപനങ്ങൾ കണ്ടെത്തിയില്ല",
  "No restaurants listed yet": "റെസ്റ്റോറന്റുകൾ ഇതുവരെ ചേർത്തിട്ടില്ല",
  "No hotels listed yet": "ഹോട്ടലുകൾ ഇതുവരെ ചേർത്തിട്ടില്ല",
  "Try another name, phone number or location.": "മറ്റൊരു പേര്, ഫോൺ നമ്പർ അല്ലെങ്കിൽ സ്ഥലം ഉപയോഗിച്ച് തിരയുക.",
  "Listings added by the Sevana admin will appear here.": "സേവന അഡ്മിൻ ചേർക്കുന്ന സ്ഥാപനങ്ങളുടെ വിവരങ്ങൾ ഇവിടെ കാണാം.",
  "Showing": "കാണിക്കുന്നത്",
  "places": "സ്ഥാപനങ്ങൾ",
  "Please contact the business directly to confirm availability, prices and services.": "ലഭ്യത, നിരക്ക്, സേവനങ്ങൾ എന്നിവ ഉറപ്പാക്കാൻ സ്ഥാപനവുമായി നേരിട്ട് ബന്ധപ്പെടുക.",

  "Members": "ജനപ്രതിനിധികൾ",
  "Local Panchayat & Ward representatives": "പ്രാദേശിക പഞ്ചായത്ത്, വാർഡ് ജനപ്രതിനിധികൾ",
  "Your local representatives": "നിങ്ങളുടെ പ്രാദേശിക ജനപ്രതിനിധികൾ",
  "Find a representative and contact them directly.": "ജനപ്രതിനിധിയെ കണ്ടെത്തി നേരിട്ട് ബന്ധപ്പെടുക.",
  "Panchayat": "പഞ്ചായത്ത്",
  "Ward Members": "വാർഡ് അംഗങ്ങൾ",
  "Ward Member": "വാർഡ് അംഗം",
  "President": "പ്രസിഡന്റ്",
  "Vice President": "വൈസ് പ്രസിഡന്റ്",
  "Panchayat President": "പഞ്ചായത്ത് പ്രസിഡന്റ്",
  "Panchayat Vice President": "പഞ്ചായത്ത് വൈസ് പ്രസിഡന്റ്",
  "Members unavailable": "ജനപ്രതിനിധികളുടെ വിവരങ്ങൾ ലഭ്യമല്ല",
  "No members added yet": "ജനപ്രതിനിധികളെ ഇതുവരെ ചേർത്തിട്ടില്ല",
  "Verified local representatives will appear here when available.": "സ്ഥിരീകരിച്ച പ്രാദേശിക ജനപ്രതിനിധികളുടെ വിവരങ്ങൾ ഇവിടെ ലഭ്യമാകും.",
  "Contact details are provided for community assistance. Please use them respectfully.": "സമൂഹത്തിന്റെ ആവശ്യങ്ങൾക്കായാണ് കോൺടാക്ട് വിവരങ്ങൾ നൽകിയിരിക്കുന്നത്. മാന്യമായി മാത്രം ഉപയോഗിക്കുക.",
  "Call": "വിളിക്കുക",

  "Vacancies": "തൊഴിൽ അവസരങ്ങൾ",
  "Local job opportunities around your community": "നിങ്ങളുടെ പ്രദേശത്തെ തൊഴിൽ അവസരങ്ങൾ",
  "Find your next opportunity": "നിങ്ങളുടെ അടുത്ത തൊഴിൽ അവസരം കണ്ടെത്തുക",
  "Job listings published by the Sevana admin team.": "സേവന അഡ്മിൻ ടീം പ്രസിദ്ധീകരിക്കുന്ന തൊഴിൽ വിവരങ്ങൾ.",
  "Search job, company or location": "ജോലി, കമ്പനി അല്ലെങ്കിൽ സ്ഥലം തിരയുക",
  "Loading vacancies…": "തൊഴിൽ വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു…",
  "Vacancies unavailable": "തൊഴിൽ വിവരങ്ങൾ ലഭ്യമല്ല",
  "No vacancies found": "തൊഴിൽ അവസരങ്ങൾ കണ്ടെത്തിയില്ല",
  "Try another search.": "മറ്റൊരു രീതിയിൽ തിരയുക.",
  "New local job opportunities will appear here when published.": "പുതിയ പ്രാദേശിക തൊഴിൽ അവസരങ്ങൾ പ്രസിദ്ധീകരിക്കുമ്പോൾ ഇവിടെ കാണാം.",
  "opportunity": "അവസരം",
  "opportunities": "അവസരങ്ങൾ",
  "available": "ലഭ്യമാണ്",
  "View details →": "വിശദാംശങ്ങൾ കാണുക →",
  "Salary not specified": "ശമ്പളം വ്യക്തമാക്കിയിട്ടില്ല",
  "Please verify the employer and job details independently before sharing personal information or accepting an offer. Never pay money to secure a job.": "വ്യക്തിഗത വിവരങ്ങൾ പങ്കിടുന്നതിനോ ജോലി സ്വീകരിക്കുന്നതിനോ മുമ്പ് തൊഴിലുടമയെയും ജോലിയുടെ വിശദാംശങ്ങളും ഉറപ്പാക്കുക. ജോലി ലഭിക്കാൻ പണം നൽകരുത്.",
  "Job details": "ജോലി വിവരങ്ങൾ",
  "Sevana Vacancies": "സേവന തൊഴിൽ അവസരങ്ങൾ",
  "Loading job details…": "ജോലി വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു…",
  "Vacancy unavailable": "തൊഴിൽ അവസരം ലഭ്യമല്ല",
  "This vacancy is unavailable.": "ഈ തൊഴിൽ അവസരം ലഭ്യമല്ല.",
  "This vacancy may have expired or is no longer available.": "ഈ തൊഴിൽ അവസരത്തിന്റെ കാലാവധി കഴിഞ്ഞിരിക്കാം അല്ലെങ്കിൽ ഇനി ലഭ്യമല്ല.",
  "Browse vacancies": "തൊഴിൽ അവസരങ്ങൾ കാണുക",
  "Posted": "പ്രസിദ്ധീകരിച്ചത്",
  "About this role": "ഈ ജോലിയെക്കുറിച്ച്",
  "Requirements": "യോഗ്യതകൾ",
  "Eligibility": "അർഹത",
  "Experience:": "പരിചയം:",
  "Minimum age:": "കുറഞ്ഞ പ്രായം:",
  "Apply before": "ഇതിന് മുമ്പ് അപേക്ഷിക്കുക",
  "Call employer": "തൊഴിലുടമയെ വിളിക്കുക",
  "WhatsApp": "വാട്സ്ആപ്പ്",
  "Apply online": "ഓൺലൈനായി അപേക്ഷിക്കുക",
  "Not specified": "വ്യക്തമാക്കിയിട്ടില്ല",
  "From": "മുതൽ",
  "Up to": "വരെ",
  "Full-time": "മുഴുവൻ സമയ ജോലി",

  "Patient name": "രോഗിയുടെ പേര്",
  "Enter patient name": "രോഗിയുടെ പേര് നൽകുക",
  "Contact number": "ബന്ധപ്പെടാനുള്ള നമ്പർ",
  "Enter contact number": "ഫോൺ നമ്പർ നൽകുക",
  "Units needed": "ആവശ്യമായ യൂണിറ്റുകൾ",
  "Unit": "യൂണിറ്റ്",
  "Units": "യൂണിറ്റുകൾ",
  "Place / Hospital": "സ്ഥലം / ആശുപത്രി",
  "Hospital or clinic name": "ആശുപത്രി അല്ലെങ്കിൽ ക്ലിനിക്കിന്റെ പേര്",
  "Normal": "സാധാരണ",
  "Urgent": "അടിയന്തരം",
  "Very Urgent": "അതീവ അടിയന്തരം",
  "Additional notes (optional)": "കൂടുതൽ വിവരങ്ങൾ (ഐച്ഛികം)",
  "Any useful information": "ആവശ്യമായ മറ്റ് വിവരങ്ങൾ",
  "Submit genuine requests only. Contact details are shared for donation coordination.": "യഥാർത്ഥ ആവശ്യങ്ങൾക്കായി മാത്രം അഭ്യർത്ഥന നൽകുക. രക്തദാന ഏകോപനത്തിനായി മാത്രമാണ് കോൺടാക്ട് വിവരങ്ങൾ പങ്കിടുന്നത്.",
  "Via WhatsApp": "വാട്സ്ആപ്പ് വഴി",
  "The request service is not configured yet. Please contact the administrator.": "അഭ്യർത്ഥനാ സംവിധാനം ഇതുവരെ ക്രമീകരിച്ചിട്ടില്ല. അഡ്മിനുമായി ബന്ധപ്പെടുക.",
  "Could not save your request. Please check your connection and try again.": "അഭ്യർത്ഥന സേവ് ചെയ്യാനായില്ല. ഇന്റർനെറ്റ് കണക്ഷൻ പരിശോധിച്ച് വീണ്ടും ശ്രമിക്കുക.",
  "Request saved successfully. Please send the prepared WhatsApp message to notify the admin.": "അഭ്യർത്ഥന വിജയകരമായി സേവ് ചെയ്തു. അഡ്മിനെ അറിയിക്കാൻ തയ്യാറാക്കിയ വാട്സ്ആപ്പ് സന്ദേശം അയയ്ക്കുക.",
  "Something went wrong. Please try again.": "എന്തോ പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.",

  "Total donors": "ആകെ രക്തദാതാക്കൾ",
  "Blood groups": "രക്തഗ്രൂപ്പുകൾ",
  "Groups with donors": "ദാതാക്കളുള്ള ഗ്രൂപ്പുകൾ",
  "All registered records": "രജിസ്റ്റർ ചെയ്ത എല്ലാ വിവരങ്ങളും",
  "Donor analytics": "രക്തദാതാക്കളുടെ കണക്ക്",
  "Blood Group Distribution": "രക്തഗ്രൂപ്പുകളുടെ വിതരണം",
  "Live breakdown of registered donors": "രജിസ്റ്റർ ചെയ്ത ദാതാക്കളുടെ തത്സമയ കണക്ക്",
  "Live data": "തത്സമയ വിവരങ്ങൾ",
  "Donor": "രക്തദാതാവ്",
  "donor": "ദാതാവ്",
  "donors": "ദാതാക്കൾ",
  "found": "കണ്ടെത്തി",

  "Members Management": "ജനപ്രതിനിധികളുടെ നിയന്ത്രണം",
  "Manage panchayat and ward representatives": "പഞ്ചായത്ത്, വാർഡ് ജനപ്രതിനിധികളുടെ വിവരങ്ങൾ നിയന്ത്രിക്കുക",
  "REPRESENTATIVE DIRECTORY": "ജനപ്രതിനിധി ഡയറക്ടറി",
  "Edit member": "ജനപ്രതിനിധിയുടെ വിവരം തിരുത്തുക",
  "Add a member": "ജനപ്രതിനിധിയെ ചേർക്കുക",
  "Full name": "പൂർണ്ണ പേര്",
  "Member name": "ജനപ്രതിനിധിയുടെ പേര്",
  "Designation": "പദവി",
  "Ward number": "വാർഡ് നമ്പർ",
  "e.g. 5": "ഉദാ. 5",
  "Profile photo": "പ്രൊഫൈൽ ചിത്രം",
  "JPG, PNG or WebP · maximum 5 MB": "JPG, PNG അല്ലെങ്കിൽ WebP · പരമാവധി 5 MB",
  "Saving…": "സേവ് ചെയ്യുന്നു…",
  "Save changes": "മാറ്റങ്ങൾ സേവ് ചെയ്യുക",
  "Add member": "ജനപ്രതിനിധിയെ ചേർക്കുക",
  "Cancel": "റദ്ദാക്കുക",
  "DIRECTORY": "ഡയറക്ടറി",
  "All members": "എല്ലാ ജനപ്രതിനിധികളും",
  "Loading…": "ലോഡ് ചെയ്യുന്നു…",
  "Add the first representative using the form above.": "മുകളിലുള്ള ഫോം ഉപയോഗിച്ച് ആദ്യത്തെ ജനപ്രതിനിധിയെ ചേർക്കുക.",
  "Member updated successfully.": "ജനപ്രതിനിധിയുടെ വിവരങ്ങൾ പുതുക്കി.",
  "Member added successfully.": "ജനപ്രതിനിധിയെ ചേർത്തു.",
  "Member deleted.": "ജനപ്രതിനിധിയുടെ വിവരം നീക്കം ചെയ്തു.",
  "Delete": "ഇല്ലാതാക്കുക",
  "Choose a JPG, PNG or WebP image.": "JPG, PNG അല്ലെങ്കിൽ WebP ചിത്രം തിരഞ്ഞെടുക്കുക.",
  "Photo must be 5 MB or smaller.": "ചിത്രത്തിന്റെ വലുപ്പം 5 MB-ൽ താഴെയായിരിക്കണം.",
  "Unable to save member.": "ജനപ്രതിനിധിയുടെ വിവരം സേവ് ചെയ്യാനായില്ല.",
  "Delete from the directory?": "ഡയറക്ടറിയിൽ നിന്ന് നീക്കം ചെയ്യണോ?",

  "Install Sevana": "സേവന ഇൻസ്റ്റാൾ ചെയ്യുക",
  "Quick access to useful services around your area, right from your home screen.": "നിങ്ങളുടെ പ്രദേശത്തെ സേവനങ്ങൾ ഹോം സ്ക്രീനിൽ നിന്ന് വേഗത്തിൽ ഉപയോഗിക്കാം.",
  "Install App": "ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക",
  "Continue on Website": "വെബ്സൈറ്റിൽ തുടരുക",
  "Installation availability depends on your browser.": "ഇൻസ്റ്റാൾ സൗകര്യം നിങ്ങളുടെ ബ്രൗസറിനെ ആശ്രയിച്ചിരിക്കുന്നു.",
  "YOUR LOCAL SERVICES, ONE APP": "നാട്ടിലെ സേവനങ്ങൾ, ഒരൊറ്റ ആപ്പിൽ",

  "Find a Donor": "രക്തദാതാക്കളെ കണ്ടെത്തുക",
  "Search by blood group": "രക്തഗ്രൂപ്പ് ഉപയോഗിച്ച് തിരയുക",
  "Find Donors": "രക്തദാതാക്കളെ കണ്ടെത്തുക",
  "Searching...": "തിരയുന്നു...",
  "No donors found": "രക്തദാതാക്കളെ കണ്ടെത്തിയില്ല",
  "No matching donors are listed yet. Try another group later.": "ഈ ഗ്രൂപ്പിൽ ദാതാക്കളെ ചേർത്തിട്ടില്ല. പിന്നീട് വീണ്ടും ശ്രമിക്കുക.",

  "All services": "എല്ലാ സേവനങ്ങളും",
  "Choose what you need and find the right contact.": "നിങ്ങൾക്ക് വേണ്ട സേവനം തിരഞ്ഞെടുത്ത് ശരിയായ കോൺടാക്ട് കണ്ടെത്തുക.",
  "Hospitals, ambulance and important contacts": "ആശുപത്രികൾ, ആംബുലൻസ്, പ്രധാന കോൺടാക്ടുകൾ",
  "Cars, auto, tourist bus and rentals": "കാറുകൾ, ഓട്ടോ, ടൂറിസ്റ്റ് ബസ്, വാടക വാഹനങ്ങൾ",
  "Search available donors by blood group": "രക്തഗ്രൂപ്പ് അനുസരിച്ച് ലഭ്യമായ ദാതാക്കളെ തിരയുക",
  "Send a blood request through WhatsApp": "വാട്സ്ആപ്പ് വഴി രക്തത്തിനുള്ള അഭ്യർത്ഥന അയയ്ക്കുക",
  "Plumbing, wiring, repairs and more": "പ്ലംബിംഗ്, വയറിംഗ്, അറ്റകുറ്റപ്പണികൾ തുടങ്ങിയവ",
  "Explore local job opportunities": "പ്രാദേശിക തൊഴിൽ അവസരങ്ങൾ കണ്ടെത്തുക",
  "Find local hotels and restaurants": "പ്രാദേശിക ഹോട്ടലുകളും റെസ്റ്റോറന്റുകളും കണ്ടെത്തുക",
  "Workers": "തൊഴിലാളികൾ",
  "All Services": "എല്ലാ സേവനങ്ങളും",
  "Taxi Services": "ടാക്സി സേവനങ്ങൾ",
  "Local trips and longer journeys": "പ്രാദേശിക യാത്രകളും ദീർഘയാത്രകളും",
  "Local transport services": "പ്രാദേശിക ഗതാഗത സേവനങ്ങൾ",
  "Where do you need to go?": "എവിടേക്കാണ് പോകേണ്ടത്?",
  "Choose a transport category to find local contacts.": "പ്രാദേശിക ഗതാഗത കോൺടാക്ടുകൾ കണ്ടെത്താൻ ഗതാഗത വിഭാഗം തിരഞ്ഞെടുക്കുക.",
  "Cars": "കാറുകൾ",
  "Auto": "ഓട്ടോ",
  "Tourist Bus": "ടൂറിസ്റ്റ് ബസ്",
  "Rent a Car": "കാർ വാടകയ്ക്ക്",
  "Back to Taxi": "ടാക്സിയിലേക്ക് മടങ്ങുക",
  "Local transport contacts": "പ്രാദേശിക ഗതാഗത കോൺടാക്ടുകൾ",
  "No drivers listed yet": "ഡ്രൈവർമാരെ ഇതുവരെ ചേർത്തിട്ടില്ല",
  "Local drivers and transport providers will appear here after the admin adds them.": "അഡ്മിൻ ചേർക്കുമ്പോൾ പ്രാദേശിക ഡ്രൈവർമാരുടെയും ഗതാഗത സേവനദാതാക്കളുടെയും വിവരങ്ങൾ ഇവിടെ കാണാം.",

  "Women": "വനിതകൾ",
  "Emergency": "അടിയന്തര സഹായം",
  "Back to home": "ഹോമിലേക്ക് മടങ്ങുക",
  "Back to admin": "അഡ്മിനിലേക്ക് മടങ്ങുക",
  "Back to vacancies": "തൊഴിൽ അവസരങ്ങളിലേക്ക് മടങ്ങുക",
  "Local contact directory": "പ്രാദേശിക കോൺടാക്ട് പട്ടിക",
  "Local worker directory": "പ്രാദേശിക തൊഴിലാളികളുടെ പട്ടിക",
  "No workers listed yet": "തൊഴിലാളികളെ ഇതുവരെ ചേർത്തിട്ടില്ല",
  "Worker details will appear here when added by the admin.": "അഡ്മിൻ ചേർക്കുമ്പോൾ തൊഴിലാളികളുടെ വിവരങ്ങൾ ഇവിടെ കാണാം.",
  "Loading categories…": "വിഭാഗങ്ങൾ ലോഡ് ചെയ്യുന്നു…",
  "No worker categories available": "തൊഴിൽ വിഭാഗങ്ങൾ ലഭ്യമല്ല",
  "Categories added by the admin will appear here.": "അഡ്മിൻ ചേർക്കുന്ന വിഭാഗങ്ങൾ ഇവിടെ കാണാം.",
  "View available workers": "ലഭ്യമായ തൊഴിലാളികളെ കാണുക",
  "Local services and skilled professionals": "പ്രാദേശിക സേവനങ്ങളും വിദഗ്ധ തൊഴിലാളികളും",
  "service categories": "സേവന വിഭാഗങ്ങൾ",
  "Loading members…": "ജനപ്രതിനിധികളുടെ വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു…",
  "Directory is not configured yet.": "ഡയറക്ടറി ഇതുവരെ ക്രമീകരിച്ചിട്ടില്ല.",
  "Unable to load members. Please try again later.": "ജനപ്രതിനിധികളുടെ വിവരങ്ങൾ ലോഡ് ചെയ്യാനായില്ല. പിന്നീട് ശ്രമിക്കുക."
});


// Admin tools and small dynamic labels used by the newer modules.
Object.assign(enToMl, {
  "Ward": "വാർഡ്",
  "of": "ൽ",
  "Showing": "കാണിക്കുന്നത്",
  "places": "സ്ഥാപനങ്ങൾ",
  "Total": "ആകെ",
  "Published": "പ്രസിദ്ധീകരിച്ചത്",
  "Filled": "ഒഴിവ് നികഞ്ഞു",
  "Simple local job listings": "ലളിതമായ പ്രാദേശിക തൊഴിൽ വിവരങ്ങൾ",
  "ADMIN ONLY": "അഡ്മിന് മാത്രം",
  "Edit vacancy": "തൊഴിൽ വിവരം തിരുത്തുക",
  "Add a vacancy": "പുതിയ തൊഴിൽ വിവരം ചേർക്കുക",
  "Job title *": "ജോലിയുടെ പേര് *",
  "Company / employer *": "കമ്പനി / തൊഴിലുടമ *",
  "Location *": "സ്ഥലം *",
  "Short description *": "ചുരുക്ക വിവരണം *",
  "e.g. Sales Assistant": "ഉദാ. സെയിൽസ് അസിസ്റ്റന്റ്",
  "Employer name": "തൊഴിലുടമയുടെ പേര്",
  "e.g. Koottilangadi": "ഉദാ. കൂട്ടിലങ്ങാടി",
  "What is the work? Add the important details…": "ജോലി എന്താണ്? പ്രധാന വിവരങ്ങൾ ചേർക്കുക…",
  "Contact phone": "ബന്ധപ്പെടാനുള്ള ഫോൺ",
  "Save vacancy": "തൊഴിൽ വിവരം സേവ് ചെയ്യുക",
  "Vacancy updated.": "തൊഴിൽ വിവരം പുതുക്കി.",
  "Vacancy published and is now live.": "തൊഴിൽ വിവരം പ്രസിദ്ധീകരിച്ചു.",
  "Marked as filled.": "ഒഴിവ് നികഞ്ഞതായി അടയാളപ്പെടുത്തി.",
  "Vacancy published.": "തൊഴിൽ വിവരം പ്രസിദ്ധീകരിച്ചു.",
  "Moved to draft.": "ഡ്രാഫ്റ്റിലേക്ക് മാറ്റി.",
  "Vacancy deleted.": "തൊഴിൽ വിവരം നീക്കം ചെയ്തു.",
  "Delete this vacancy permanently?": "ഈ തൊഴിൽ വിവരം സ്ഥിരമായി നീക്കം ചെയ്യണോ?",
  "Could not load donors. Check admin permissions.": "രക്തദാതാക്കളുടെ വിവരങ്ങൾ ലോഡ് ചെയ്യാനായില്ല. അഡ്മിൻ അനുമതി പരിശോധിക്കുക.",
  "Could not save donor. Check fields and permissions.": "ദാതാവിന്റെ വിവരം സേവ് ചെയ്യാനായില്ല. വിവരങ്ങളും അനുമതികളും പരിശോധിക്കുക.",
  "Could not delete donor.": "ദാതാവിന്റെ വിവരം നീക്കം ചെയ്യാനായില്ല.",
  "Donor analytics": "രക്തദാതാക്കളുടെ കണക്ക്",
  "Search name, place, area or phone number...": "പേര്, സ്ഥലം, പ്രദേശം അല്ലെങ്കിൽ ഫോൺ നമ്പർ തിരയുക...",
  "Your password": "നിങ്ങളുടെ പാസ്‌വേഡ്",
  "admin@example.com": "admin@example.com",
  "Close": "അടയ്ക്കുക",
  "Sign out": "സൈൻ ഔട്ട്",
  "Back to Sevana": "സേവനയിലേക്ക് മടങ്ങുക",
  "Add donor": "രക്തദാതാവിനെ ചേർക്കുക",
  "Donors": "രക്തദാതാക്കൾ",
  "No donors added yet": "രക്തദാതാക്കളെ ഇതുവരെ ചേർത്തിട്ടില്ല",
  "Add donors only with their permission.": "അനുമതിയുള്ളവരെ മാത്രം രക്തദാതാക്കളായി ചേർക്കുക.",
  "Available for requests": "അഭ്യർത്ഥനകൾക്കായി ലഭ്യമാണ്",
  "Delete this donor record?": "ഈ രക്തദാതാവിന്റെ വിവരം നീക്കം ചെയ്യണോ?",
  "Donor saved.": "രക്തദാതാവിന്റെ വിവരം സേവ് ചെയ്തു.",
  "Donor deleted.": "രക്തദാതാവിന്റെ വിവരം നീക്കം ചെയ്തു.",
  "Panchayat & Ward representatives": "പഞ്ചായത്ത്, വാർഡ് ജനപ്രതിനിധികൾ",
  "Members Management": "ജനപ്രതിനിധികളുടെ നിയന്ത്രണം",
  "Manage panchayat and ward representatives": "പഞ്ചായത്ത്, വാർഡ് ജനപ്രതിനിധികളുടെ വിവരങ്ങൾ നിയന്ത്രിക്കുക",
  "Delete ": "നീക്കം ചെയ്യുക ",
  " from the directory?": " ഡയറക്ടറിയിൽ നിന്ന്?"
});

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
  const attrs = ["placeholder", "aria-label", "title", "alt"];
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

  const pathname = usePathname();

  useEffect(() => {
    const handleLanguageChange = (event: Event) => {
      const next = (event as CustomEvent<"en" | "ml">).detail;
      if (next === "en" || next === "ml") applyLanguage(next);
    };
    window.addEventListener("sevana:language-change", handleLanguageChange);
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
    return () => {
      observer.disconnect();
      window.removeEventListener("sevana:language-change", handleLanguageChange);
    };
  }, [applyLanguage]);

  if (pathname === "/") return null;

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
