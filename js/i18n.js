// ============================================================
//  MOM Finland – Lightweight i18n engine
//  Strategy: JS object store + data-i18n attributes
//  Supports: English (en), Finnish (fi), Swedish (sv)
// ============================================================

const translations = {
  en: {
    nav_home: "Home",
    nav_services: "Services",
    nav_about: "About",
    nav_contact: "Contact",
    nav_book: "Book a Call",

    hero_badge: "Your Guide to Finland",
    hero_title_1: "Moving to",
    hero_title_2: "Finland?",
    hero_subtitle: "We make the transition seamless — housing, registration, language, events, and everything in between.",
    hero_cta_primary: "View Services",
    hero_cta_secondary: "Book a Free Call",

    persona_title: "Where are you in your journey?",
    persona_moving: "Moving to Finland",
    persona_moving_desc: "Preparing your move, need housing, registration & first steps",
    persona_living: "Already in Finland",
    persona_living_desc: "Settled in but need language support, events & community",

    services_title: "Our Services",
    services_subtitle: "Everything you need, all in one place",
    svc_housing_title: "Housing",
    svc_housing_desc: "Navigate Oikotie, Vuokraovi and city housing applications",
    svc_registration_title: "Registration & ID",
    svc_registration_desc: "DVV registration, Finnish ID card, bank account setup",
    svc_language_title: "Language Learning",
    svc_language_desc: "Finnish & Swedish courses tailored to your daily life",
    svc_events_title: "Local Events",
    svc_events_desc: "Community events, networking and cultural experiences",
    svc_jobs_title: "Jobs & Benefits",
    svc_jobs_desc: "TE Services, Kela benefits and job search strategies",
    svc_healthcare_title: "Healthcare",
    svc_healthcare_desc: "Navigate the Finnish healthcare system confidently",

    booking_title: "Book a Free Consultation",
    booking_subtitle: "30-minute call to map out your Finland journey",
    booking_name: "Full Name",
    booking_email: "Email Address",
    booking_topic: "Topic",
    booking_topic_placeholder: "Select a topic",
    booking_topic_housing: "Housing & Accommodation",
    booking_topic_registration: "Registration & Legal",
    booking_topic_language: "Language Learning",
    booking_topic_jobs: "Jobs & Benefits",
    booking_topic_events: "Local Events",
    booking_topic_other: "Other / General Advice",
    booking_submit: "Confirm Booking",
    booking_success: "🎉 Booking confirmed! We'll email you shortly.",
    booking_avail: "Select a date",

    hub_title: "Services Hub",
    hub_subtitle: "Choose a category to explore your options",
    hub_moving_path: "Moving to Finland Path",
    hub_living_path: "Already in Finland Path",

    housing_title: "Housing in Finland",
    housing_p1: "Most rentals are listed on Oikotie and Vuokraovi. Good apartments disappear fast — apply within hours of a listing appearing.",
    housing_requirements: "You'll typically need:",
    housing_r1: "Valid ID / passport",
    housing_r2: "Proof of income or benefits",
    housing_r3: "Deposit of 1–2 months rent",
    housing_tip: "💡 Pro Tip: Apply for city-owned housing (Helsinki: Helsingin kaupungin asunnot) for cheaper rent — but expect longer waiting queues.",

    reg_title: "Registration & ID",
    reg_step1: "Step 1: Visit DVV (Digi- ja väestötietovirasto) to register your address and get a Finnish personal identity code.",
    reg_step2: "Step 2: Visit the Police of Finland to get your ID card — needed for almost everything.",
    reg_step3: "Step 3: Open a bank account (Nordea, OP, etc.) to get your Finnish bank ID for online government services.",

    lang_title: "Language Learning",
    lang_p1: "Basic Finnish gives you a huge advantage in the job market and daily life. We offer structured courses for all levels.",
    lang_levels: "Available levels: Beginner · Intermediate · Conversational · Business Finnish",

    events_title: "Local Events & Community",
    events_p1: "Connect with expat communities, attend cultural events, and build your network in Finland.",

    jobs_title: "Jobs & Benefits",
    jobs_p1: "Register at TE Services immediately upon arrival. Apply to Kela for housing benefit and basic unemployment allowance if needed.",
    jobs_warning: "⚠️ You must actively apply for jobs or benefit payments may stop.",

    footer_tagline: "Your trusted guide to life in Finland.",
    footer_rights: "© 2025 MOM Finland. All rights reserved.",

    back_home: "← Back to Home",
  },

  fi: {
    nav_home: "Etusivu",
    nav_services: "Palvelut",
    nav_about: "Tietoa meistä",
    nav_contact: "Yhteystiedot",
    nav_book: "Varaa puhelu",

    hero_badge: "Oppaasi Suomeen",
    hero_title_1: "Muutatko",
    hero_title_2: "Suomeen?",
    hero_subtitle: "Teemme siirtymäsi sujuvaksi — asuminen, rekisteröinti, kielet, tapahtumat ja kaikki muu.",
    hero_cta_primary: "Katso palvelut",
    hero_cta_secondary: "Varaa ilmainen puhelu",

    persona_title: "Missä vaiheessa olet matkallasi?",
    persona_moving: "Muutan Suomeen",
    persona_moving_desc: "Valmistelet muuttoa, tarvitset asunnon ja ensiaskeleet",
    persona_living: "Asun jo Suomessa",
    persona_living_desc: "Olet asettunut, mutta tarvitset kielitukea, tapahtumia ja yhteisöä",

    services_title: "Palvelumme",
    services_subtitle: "Kaikki mitä tarvitset, yhdessä paikassa",
    svc_housing_title: "Asuminen",
    svc_housing_desc: "Navigoi Oikotie, Vuokraovi ja kaupungin asuntohakemukset",
    svc_registration_title: "Rekisteröinti & henkilöllisyys",
    svc_registration_desc: "DVV-rekisteröinti, suomalainen henkilökortti, pankkitilin avaus",
    svc_language_title: "Kielen oppiminen",
    svc_language_desc: "Suomen ja ruotsin kielen kurssit arkielämääsi varten",
    svc_events_title: "Paikalliset tapahtumat",
    svc_events_desc: "Yhteisötapahtumat, verkostoituminen ja kulttuurikokemukset",
    svc_jobs_title: "Työ & etuudet",
    svc_jobs_desc: "TE-palvelut, Kela-etuudet ja työnhakustrategiat",
    svc_healthcare_title: "Terveydenhuolto",
    svc_healthcare_desc: "Navigoi suomalaista terveydenhuoltojärjestelmää luottavaisesti",

    booking_title: "Varaa ilmainen konsultaatio",
    booking_subtitle: "30 minuutin puhelu Suomi-matkasi kartoittamiseksi",
    booking_name: "Koko nimi",
    booking_email: "Sähköpostiosoite",
    booking_topic: "Aihe",
    booking_topic_placeholder: "Valitse aihe",
    booking_topic_housing: "Asuminen",
    booking_topic_registration: "Rekisteröinti & juridiikka",
    booking_topic_language: "Kielen oppiminen",
    booking_topic_jobs: "Työ & etuudet",
    booking_topic_events: "Paikalliset tapahtumat",
    booking_topic_other: "Muu / yleinen neuvonta",
    booking_submit: "Vahvista varaus",
    booking_success: "🎉 Varaus vahvistettu! Lähetämme sinulle sähköpostin pian.",
    booking_avail: "Valitse päivämäärä",

    hub_title: "Palvelukeskus",
    hub_subtitle: "Valitse kategoria tutustuaksesi vaihtoehtoihin",
    hub_moving_path: "Suomeen muuttajan polku",
    hub_living_path: "Jo Suomessa asuvan polku",

    housing_title: "Asuminen Suomessa",
    housing_p1: "Suurin osa vuokra-asunnoista on listattuna Oikotiellä ja Vuokraovella. Hyvät asunnot menevät nopeasti.",
    housing_requirements: "Tarvitset yleensä:",
    housing_r1: "Voimassa oleva henkilötodistus / passi",
    housing_r2: "Todistus tuloista tai etuuksista",
    housing_r3: "Vakuus 1–2 kuukauden vuokra",
    housing_tip: "💡 Vinkki: Hae kaupungin omistamaa asuntoa (Helsinki: Helsingin kaupungin asunnot) halvempaan vuokraan — odota pidempiä jonoja.",

    reg_title: "Rekisteröinti & henkilöllisyys",
    reg_step1: "Vaihe 1: Käy DVV:ssä rekisteröidäksesi osoitteesi ja saadaksesi suomalaisen henkilötunnuksen.",
    reg_step2: "Vaihe 2: Käy Suomen poliisilla saadaksesi henkilökortin.",
    reg_step3: "Vaihe 3: Avaa pankkitili (Nordea, OP jne.) saadaksesi verkkopankkitunnukset.",

    lang_title: "Kielen oppiminen",
    lang_p1: "Perustason suomi antaa suuren edun työmarkkinoilla ja arjessa.",
    lang_levels: "Tasot: Aloittelija · Keskitaso · Keskusteleva · Liike-elämän suomi",

    events_title: "Paikalliset tapahtumat & yhteisö",
    events_p1: "Verkostoidu expat-yhteisöjen kanssa, osallistu kulttuuritapahtumiin.",

    jobs_title: "Työ & etuudet",
    jobs_p1: "Rekisteröidy TE-palveluihin heti saapumisen jälkeen. Hae Kelalta asumistukea ja peruspäivärahaa tarvittaessa.",
    jobs_warning: "⚠️ Sinun on haettava aktiivisesti töitä tai etuusmaksut voivat loppua.",

    footer_tagline: "Luotettava oppaasi elämään Suomessa.",
    footer_rights: "© 2025 MOM Finland. Kaikki oikeudet pidätetään.",

    back_home: "← Takaisin etusivulle",
  },

  sv: {
    nav_home: "Hem",
    nav_services: "Tjänster",
    nav_about: "Om oss",
    nav_contact: "Kontakt",
    nav_book: "Boka ett samtal",

    hero_badge: "Din guide till Finland",
    hero_title_1: "Flyttar du till",
    hero_title_2: "Finland?",
    hero_subtitle: "Vi gör övergången smidig — bostad, registrering, språk, evenemang och allt däremellan.",
    hero_cta_primary: "Se tjänster",
    hero_cta_secondary: "Boka ett gratis samtal",

    persona_title: "Var befinner du dig på din resa?",
    persona_moving: "Flyttar till Finland",
    persona_moving_desc: "Förbereder flytten, behöver bostad, registrering och första steg",
    persona_living: "Bor redan i Finland",
    persona_living_desc: "Bosatt men behöver språkstöd, evenemang och gemenskap",

    services_title: "Våra tjänster",
    services_subtitle: "Allt du behöver, på ett ställe",
    svc_housing_title: "Bostad",
    svc_housing_desc: "Navigera Oikotie, Vuokraovi och kommunala bostadsansökningar",
    svc_registration_title: "Registrering & ID",
    svc_registration_desc: "DVV-registrering, finskt ID-kort, bankkontoinrättning",
    svc_language_title: "Språkinlärning",
    svc_language_desc: "Finska och svenska kurser anpassade för ditt vardagsliv",
    svc_events_title: "Lokala evenemang",
    svc_events_desc: "Gemenskapsevenemang, nätverkande och kulturupplevelser",
    svc_jobs_title: "Jobb & förmåner",
    svc_jobs_desc: "TE-tjänster, Fpa-förmåner och jobbsökningsstrategier",
    svc_healthcare_title: "Hälsovård",
    svc_healthcare_desc: "Navigera det finska sjukvårdssystemet med självförtroende",

    booking_title: "Boka en gratis konsultation",
    booking_subtitle: "30-minuters samtal för att kartlägga din Finland-resa",
    booking_name: "Fullständigt namn",
    booking_email: "E-postadress",
    booking_topic: "Ämne",
    booking_topic_placeholder: "Välj ett ämne",
    booking_topic_housing: "Bostad & boende",
    booking_topic_registration: "Registrering & juridik",
    booking_topic_language: "Språkinlärning",
    booking_topic_jobs: "Jobb & förmåner",
    booking_topic_events: "Lokala evenemang",
    booking_topic_other: "Övrigt / allmänna råd",
    booking_submit: "Bekräfta bokning",
    booking_success: "🎉 Bokning bekräftad! Vi skickar ett e-postmeddelande snart.",
    booking_avail: "Välj ett datum",

    hub_title: "Tjänstehub",
    hub_subtitle: "Välj en kategori för att utforska dina alternativ",
    hub_moving_path: "Väg för den som flyttar till Finland",
    hub_living_path: "Väg för den som redan bor i Finland",

    housing_title: "Bostad i Finland",
    housing_p1: "De flesta hyresrätter annonseras på Oikotie och Vuokraovi. Bra lägenheter försvinner snabbt.",
    housing_requirements: "Du behöver vanligtvis:",
    housing_r1: "Giltigt ID / pass",
    housing_r2: "Inkomst- eller förmånsbevis",
    housing_r3: "Deposition på 1–2 månaders hyra",
    housing_tip: "💡 Tips: Ansök om kommunalt boende (Helsingfors: Helsingin kaupungin asunnot) för billigare hyra — men räkna med längre kö.",

    reg_title: "Registrering & ID",
    reg_step1: "Steg 1: Besök DVV för att registrera din adress och få ett finskt personnummer.",
    reg_step2: "Steg 2: Besök Finlands polisen för att få ett ID-kort.",
    reg_step3: "Steg 3: Öppna ett bankkonto (Nordea, OP etc.) för att få bank-ID för onlinetjänster.",

    lang_title: "Språkinlärning",
    lang_p1: "Grundläggande finska ger dig en stor fördel på arbetsmarknaden och i vardagen.",
    lang_levels: "Nivåer: Nybörjare · Mellannivå · Konversation · Affärsfinska",

    events_title: "Lokala evenemang & gemenskap",
    events_p1: "Nätverka med expat-gemenskaper, delta i kulturevenemang.",

    jobs_title: "Jobb & förmåner",
    jobs_p1: "Registrera dig hos TE-tjänster direkt vid ankomst. Ansök om bostadsbidrag och grunddagpenning via FPA vid behov.",
    jobs_warning: "⚠️ Du måste aktivt ansöka om jobb annars kan förmånsbetalningar upphöra.",

    footer_tagline: "Din pålitliga guide till livet i Finland.",
    footer_rights: "© 2025 MOM Finland. Alla rättigheter förbehållna.",

    back_home: "← Tillbaka till startsidan",
  }
};

// ---- Engine ----
let currentLang = localStorage.getItem("momLang") || "en";

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) ||
         (translations["en"] && translations["en"][key]) ||
         key;
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-ph]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-ph"));
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });
  document.documentElement.lang = currentLang;
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

function setLang(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("momLang", lang);
  applyTranslations();
}

document.addEventListener("DOMContentLoaded", () => {
  applyTranslations();
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLang(btn.dataset.lang));
  });
});
