/* DELETE-FROM STUDIO — i18n + interactions */

const i18n = {
  es: {
    "nav.game": "Juego", "nav.about": "Estudio", "nav.devlog": "Devlog", "nav.contact": "Contacto",
    "hero.tag": "indie game studio · santiago, chile",
    "hero.sub": "Hacemos juegos pequeños con alma grande. Pixel art, combate honesto y espíritus por exorcizar.",
    "hero.cta1": "Ver el juego", "hero.cta2": "Leer el devlog",
    "hero.press": "insert coin · power-hour a la vez",
    "manifesto": "Un estudio de juegos hecho con tiempos rescatados de la vida adulta: entre la pega, dos hijos y un perro de alta demanda, una power-hour a la vez. No hacemos juegos a pesar de la vida adulta — los hacemos con lo que ella deja.",
    "game.eyebrow": "// juego actual", "game.h2": "En el taller",
    "game.art": "arte en progreso", "game.badge": "En desarrollo",
    "game.working": "título de trabajo · sin nombre aún", "game.title": "SIN TÍTULO",
    "game.meta": "2D · Run-and-gun · Godot 4",
    "game.desc": "Un exorcista que no dispara: devuelve. Lees al yokai, esquivas apenas, y le regresas su propio ataque con el gohei. Combate legible y honesto al estilo Pocky & Rocky, con alma retro.",
    "game.p1": "Slide con i-frames", "game.p2": "Reflejo con gohei", "game.p3": "Ataques telegrafiados", "game.p4": "Combo & graze",
    "game.cta": "Seguir el desarrollo →",
    "devlog.eyebrow": "// devlog", "devlog.h2": "Última entrada",
    "devlog.post1.title": "Vertical slice de combate: yokai, telegrafía y reflejo",
    "devlog.post1.excerpt": "Cerramos el bucle jugable completo — tres arquetipos de yokai, ataques que se avisan, y puntaje que premia el riesgo.",
    "devlog.more": "Más entradas en camino…",
    "about.eyebrow": "// el estudio", "about.h2": "Quiénes somos",
    "about.p1": "Somos un estudio independiente en Santiago, Chile. Hacemos juegos 2D con estética pixel art y retro — pequeños, terminados y con personalidad propia.",
    "about.p2": "Creemos en juegos gratis primero, sin microtransacciones. Si te gusta lo que hacemos, un café es suficiente.",
    "about.who": "> Quiénes", "about.who1": "Julio — programación + game design", "about.who2": "Hermana — arte 2D, pixel art", "about.who3": "Primo — OST + SFX",
    "about.what": "> Qué hacemos", "about.what1": "Juegos 2D indie (PC / Android)", "about.what2": "Pixel art + estética retro", "about.what3": "Gratis o pay-what-you-want",
    "contact.eyebrow": "// contacto", "contact.h2": "Escríbenos",
    "contact.desc": "Preguntas, fanmail o propuestas — la puerta está abierta.",
    "contact.coffee": "☕ Cómprame un café",
    "footer.privacy": "Privacidad",
    "devlog.tag": "bitácora de desarrollo",
    "devlog.intro": "Notas de desarrollo de un estudio que hace juegos con tiempos rescatados de la vida adulta. Sin calendario, sin promesas — solo lo que se avanzó.",
    "devlog.back": "← Volver al inicio",
    "privacy.tag": "aviso de privacidad",
    "privacy.intro": "Esto es un sitio estático. No usamos analytics, no ponemos cookies de seguimiento, y no recopilamos datos de navegación.",
    "privacy.h1": "> Si nos escribes",
    "privacy.b1": "El único dato que recibimos es el que tú nos mandas por correo a hello@delete-from.com. Lo usamos solo para responderte. No lo compartimos con terceros ni te sumamos a ninguna lista.",
    "privacy.h2": "> Terceros",
    "privacy.b2": "Las tipografías se cargan desde Google Fonts. Los enlaces externos (itch.io, Buy Me a Coffee) tienen sus propias políticas cuando los visitas.",
  },
  en: {
    "nav.game": "Game", "nav.about": "Studio", "nav.devlog": "Devlog", "nav.contact": "Contact",
    "hero.tag": "indie game studio · santiago, chile",
    "hero.sub": "We make small games with big soul. Pixel art, honest combat, and spirits to exorcise.",
    "hero.cta1": "See the game", "hero.cta2": "Read the devlog",
    "hero.press": "insert coin · one power-hour at a time",
    "manifesto": "A game studio built from time rescued from adult life: between a day job, two kids and a high-maintenance dog, one power-hour at a time. We don't make games in spite of adult life — we make them with what it leaves behind.",
    "game.eyebrow": "// current game", "game.h2": "On the workbench",
    "game.art": "art in progress", "game.badge": "In development",
    "game.working": "working title · unnamed yet", "game.title": "UNTITLED",
    "game.meta": "2D · Run-and-gun · Godot 4",
    "game.desc": "An exorcist who doesn't shoot: he sends it back. You read the yokai, dodge by a hair, and return its own attack with the gohei. Legible, honest combat in the Pocky & Rocky vein, with a retro soul.",
    "game.p1": "Slide with i-frames", "game.p2": "Gohei reflect", "game.p3": "Telegraphed attacks", "game.p4": "Combo & graze",
    "game.cta": "Follow development →",
    "devlog.eyebrow": "// devlog", "devlog.h2": "Latest entry",
    "devlog.post1.title": "Combat vertical slice: yokai, telegraphs and reflection",
    "devlog.post1.excerpt": "We closed the full playable loop — three yokai archetypes, attacks that warn you, and scoring that rewards risk.",
    "devlog.more": "More entries on the way…",
    "about.eyebrow": "// the studio", "about.h2": "Who we are",
    "about.p1": "We're an independent studio in Santiago, Chile. We make 2D games with pixel art and retro aesthetics — small, finished, and full of personality.",
    "about.p2": "We believe in free games first, no microtransactions. If you like what we make, a coffee is enough.",
    "about.who": "> Who", "about.who1": "Julio — programming + game design", "about.who2": "Sister — 2D art, pixel art", "about.who3": "Cousin — OST + SFX",
    "about.what": "> What we make", "about.what1": "2D indie games (PC / Android)", "about.what2": "Pixel art + retro aesthetics", "about.what3": "Free or pay-what-you-want",
    "contact.eyebrow": "// contact", "contact.h2": "Say hello",
    "contact.desc": "Questions, fanmail or proposals — the door is open.",
    "contact.coffee": "☕ Buy me a coffee",
    "footer.privacy": "Privacy",
    "devlog.tag": "development log",
    "devlog.intro": "Development notes from a studio that makes games with time rescued from adult life. No schedule, no promises — just what got done.",
    "devlog.back": "← Back to home",
    "privacy.tag": "privacy notice",
    "privacy.intro": "This is a static site. We use no analytics, set no tracking cookies, and collect no browsing data.",
    "privacy.h1": "> If you write to us",
    "privacy.b1": "The only data we get is what you send us by email at hello@delete-from.com. We use it only to reply. We don't share it or add you to any list.",
    "privacy.h2": "> Third parties",
    "privacy.b2": "Fonts load from Google Fonts. External links (itch.io, Buy Me a Coffee) have their own policies when you visit them.",
  },
};

let currentLang = "es";

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = i18n[lang][el.dataset.i18n];
    if (v == null) return;
    el.textContent = v;
  });
  const t = document.getElementById("lang-toggle");
  if (t) t.textContent = lang === "es" ? "EN" : "ES";
  try { localStorage.setItem("df-lang", lang); } catch (_) {}
}

(function init() {
  let saved = null;
  try { saved = localStorage.getItem("df-lang"); } catch (_) {}
  applyLang(saved === "en" ? "en" : "es");

  document.getElementById("lang-toggle")?.addEventListener("click", () =>
    applyLang(currentLang === "es" ? "en" : "es")
  );

  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
})();
