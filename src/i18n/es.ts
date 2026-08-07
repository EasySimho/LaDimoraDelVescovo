import type { Dict } from "./types";

const es: Dict = {
  app: {
    name: "Libro de Bienvenida",
    tagline: "Todo lo que necesitas, en un solo lugar",
  },
  nav: {
    back: "Atrás",
    home: "Inicio",
    language: "Idioma",
  },
  sections: {
    benvenuto: { label: "Bienvenido", hint: "Un saludo de tu anfitrión" },
    checkin: { label: "Check-in", hint: "Cómo entrar" },
    regole: { label: "Normas", hint: "Unas pocas cosas importantes" },
    posizione: { label: "Ubicación", hint: "Dónde estamos" },
    trasporti: { label: "Transporte", hint: "Cómo moverse" },
    servizi: { label: "Servicios", hint: "Farmacias, bancos, básicos" },
    attivita: { label: "Actividades", hint: "Qué hacer por aquí" },
    ristoranti: { label: "Restaurantes", hint: "Dónde comer bien" },
    bar: { label: "Bares y cafés", hint: "Desayuno y aperitivo" },
    shopping: { label: "Compras", hint: "Supermercados y tiendas" },
    informazioni: { label: "Información", hint: "Preguntas frecuentes" },
    video: { label: "Vídeo guías", hint: "Vídeos breves y prácticos" },
    emergenza: { label: "Emergencias", hint: "Números útiles" },
    checkout: { label: "Check-out", hint: "Antes de irte" },
    contatti: { label: "Contacto", hint: "Escríbenos o llámanos" },
  },
  common: {
    call: "Llamar",
    directions: "Cómo llegar",
    website: "Web",
    copy: "Copiar",
    copied: "Copiado",
    hours: "Horario",
    recommended: "Recomendado",
    empty: "Todavía no hay nada aquí. Vuelve pronto.",
    walkMinutes: (m) => `${m} min a pie`,
    meters: (m) => `${m} m`,
    kilometers: (km) => `${km} km`,
    filterAll: "Todos",
    showMore: "Ver todo",
    showLess: "Ver menos",
  },
  checkin: {
    from: "Check-in desde las",
    videoTitle: "Mira cómo entrar",
  },
  checkout: {
    by: "Check-out antes de las",
  },
  posizione: {
    address: "Dirección",
    openMaps: "Abrir en Google Maps",
  },
  contatti: {
    phone: "Teléfono",
    whatsapp: "WhatsApp",
    email: "Correo",
    hint: "Solemos responder en menos de una hora.",
  },
  emergenza: {
    generic: "Número único de emergencias",
    hint: "En caso de peligro inmediato llama al 112 — gratuito desde cualquier teléfono.",
  },
  video: {
    play: "Reproducir",
    watchOn: "Ver el vídeo",
  },
};

export default es;
