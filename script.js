const i18n = {
  es: {
    "nav.games":          "Juegos",
    "nav.about":          "About",
    "nav.devlog":         "Devlog",
    "nav.contact":        "Contacto",
    "hero.tag":           "indie game studio · Santiago, Chile",
    "about.manifesto":    "Un estudio de juegos hecho con tiempos rescatados de la vida adulta: entre la pega, dos hijos y un perro de alta demanda, un power-hour a la vez. No hacemos juegos a pesar de la vida adulta — los hacemos con lo que ella deja.",
    "hero.subtitle":      "Hacemos juegos pequeños\ncon alma grande.",
    "hero.cta1":          "Ver juegos",
    "hero.cta2":          "☕ Apóyanos",
    "games.title":        "// JUEGOS",
    "games.badge1":       "EN DESARROLLO",
    "games.badge2":       "PRÓXIMAMENTE",
    "games.pintada.desc": "Un chamán que danza para invocar espíritus y restaurar el equilibrio del mundo.",
    "games.pintada.meta": "2D · Plataformero · Godot",
    "games.soon.desc":    "El siguiente juego está en incubación.",
    "about.title":        "// ABOUT",
    "about.p1":           "Somos un estudio independiente de dos personas en Santiago, Chile. Hacemos juegos 2D con estética pixel art y retro — pequeños, terminados, y con personalidad propia.",
    "about.p2":           "Creemos en juegos gratis primero, sin microtransacciones. Si te gusta lo que hacemos, un café es suficiente.",
    "about.label.who":    "> Quiénes somos",
    "about.item1":        "Julio — programación + game design",
    "about.item2":        "Hermana — arte 2D, pixel art",
    "about.item3":        "Primo — OST + SFX",
    "about.label.what":   "> Qué hacemos",
    "about.item4":        "Juegos 2D indie (PC / Android)",
    "about.item5":        "Pixel art + retro aesthetics",
    "about.item6":        "Gratis o pay-what-you-want",
    "contact.title":      "// CONTACTO",
    "contact.desc":       "Preguntas, fanmail o propuestas:",
    "contact.coffee":     "☕ Cómprame un café",
    "devlog.tag":         "bitácora de desarrollo",
    "devlog.intro":       "Notas de desarrollo de un estudio que hace juegos con tiempos rescatados de la vida adulta. Sin calendario, sin promesas — solo lo que se avanzó.",
    "privacy.tag":        "aviso de privacidad",
    "privacy.intro":      "Esto es un sitio estático. No usamos analytics, no ponemos cookies de seguimiento, y no recopilamos datos de navegación.",
    "privacy.contactTitle": "> Si nos escribes",
    "privacy.contactBody":  "El único dato que recibimos es el que tú nos mandas por correo a hello@delete-from.com. Lo usamos solo para responderte. No lo compartimos con terceros ni te sumamos a ninguna lista.",
    "privacy.thirdTitle": "> Terceros",
    "privacy.thirdBody":  "Las tipografías se cargan desde Google Fonts. Enlaces externos (itch.io, Buy Me a Coffee) tienen sus propias políticas cuando los visitas.",
    "footer.privacy":     "Privacidad",
  },
  en: {
    "nav.games":          "Games",
    "nav.about":          "About",
    "nav.devlog":         "Devlog",
    "nav.contact":        "Contact",
    "hero.tag":           "indie game studio · Santiago, Chile",
    "about.manifesto":    "A game studio built from time rescued from adult life: between a day job, two kids and a high-maintenance dog, one power-hour at a time. We don't make games in spite of adult life — we make them with what it leaves behind.",
    "hero.subtitle":      "We make small games\nwith big soul.",
    "hero.cta1":          "See games",
    "hero.cta2":          "☕ Support us",
    "games.title":        "// GAMES",
    "games.badge1":       "IN DEVELOPMENT",
    "games.badge2":       "COMING SOON",
    "games.pintada.desc": "A shaman who dances to summon spirits and restore balance to the world.",
    "games.pintada.meta": "2D · Platformer · Godot",
    "games.soon.desc":    "Next game in incubation.",
    "about.title":        "// ABOUT",
    "about.p1":           "We're a two-person indie studio from Santiago, Chile. We make 2D games with pixel art and retro aesthetics — small, finished, and full of personality.",
    "about.p2":           "We believe in free games first, no microtransactions. If you like what we make, a coffee is enough.",
    "about.label.who":    "> Who we are",
    "about.item1":        "Julio — programming + game design",
    "about.item2":        "Sister — 2D art, pixel art",
    "about.item3":        "Cousin — OST + SFX",
    "about.label.what":   "> What we make",
    "about.item4":        "2D indie games (PC / Android)",
    "about.item5":        "Pixel art + retro aesthetics",
    "about.item6":        "Free or pay-what-you-want",
    "contact.title":      "// CONTACT",
    "contact.desc":       "Questions, fanmail or proposals:",
    "contact.coffee":     "☕ Buy me a coffee",
    "devlog.tag":         "development log",
    "devlog.intro":       "Development notes from a studio that makes games with time rescued from adult life. No schedule, no promises — just what got done.",
    "privacy.tag":        "privacy notice",
    "privacy.intro":      "This is a static site. We use no analytics, set no tracking cookies, and collect no browsing data.",
    "privacy.contactTitle": "> If you write to us",
    "privacy.contactBody":  "The only data we get is what you send us by email at hello@delete-from.com. We use it only to reply. We don't share it with third parties or add you to any list.",
    "privacy.thirdTitle": "> Third parties",
    "privacy.thirdBody":  "Fonts load from Google Fonts. External links (itch.io, Buy Me a Coffee) have their own policies when you visit them.",
    "footer.privacy":     "Privacy",
  },
};

let currentLang = "es";

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = i18n[lang][key];
    if (value == null) return;
    if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
      el.placeholder = value;
    } else {
      el.textContent = value;
    }
  });

  const toggle = document.getElementById("lang-toggle");
  if (toggle) toggle.textContent = lang === "es" ? "EN" : "ES";

  try {
    localStorage.setItem("df-lang", lang);
  } catch (_) {}
}

function initLang() {
  let saved = null;
  try {
    saved = localStorage.getItem("df-lang");
  } catch (_) {}
  applyLang(saved === "en" ? "en" : "es");
}

document.getElementById("lang-toggle")?.addEventListener("click", () => {
  applyLang(currentLang === "es" ? "en" : "es");
});

// Sticky header border highlight on scroll
(function () {
  const header = document.getElementById("site-header");
  if (!header) return;
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

initLang();
