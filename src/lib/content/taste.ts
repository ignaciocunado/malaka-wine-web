import type { Lang } from "@/lib/site";

/**
 * The taste quiz's text, parked with the quiz until launch (see the README). Unlike the rest of the site's text in
 * `content/`, it stays in code: it isn't edited in the CMS and some of it is formatting functions.
 */
const es = {
  eyebrow: "Test de gustos",
  title: "Descubre tu gusto.",
  body: "Unas preguntas rápidas para que cada caja parezca elegida solo para ti. Porque lo está.",
  steps: {
    styles: { title: "¿Qué vinos te gustan?", subtitle: "Del Moscatel de la Axarquía a los tintos de altura de Ronda." },
    palate: { title: "Tu paladar", subtitle: "Así sabremos por dónde empezar." },
    box: { title: "Tu caja", subtitle: "Cuánto, cada cuánto y lo que debamos saber." },
    review: { title: "Revisa tus respuestas", subtitle: "Comprueba que todo está bien antes de terminar." },
  },
  progress: (step: number, total: number) => `Paso ${step} de ${total}`,
  progressLabel: "Progreso del test",
  back: "Atrás",
  next: "Continuar",
  finish: "Ver mi caja",
  edit: "Editar",
  styles: {
    title: "Estilos",
    hint: "Elige todos los que quieras.",
    label: "Estilos de vino",
    options: { RED: "Tinto", WHITE: "Blanco", ROSE: "Rosado", SWEET: "Dulce y Moscatel", SPARKLING: "Espumoso" },
    none: "Sin preferencia",
  },
  sweetness: {
    title: "¿Seco o dulce?",
    label: "Dulzor",
    options: { DRY: "Seco", OFF_DRY: "Semiseco", SWEET: "Dulce" },
  },
  body_: {
    title: "¿Con cuánto cuerpo?",
    label: "Cuerpo",
    min: "Ligero y fresco",
    max: "Intenso y con cuerpo",
    levels: ["Muy ligero", "Ligero", "Medio", "Con cuerpo", "Muy intenso"],
  },
  adventure: {
    title: "¿Cuánto te gusta arriesgar?",
    label: "Ganas de probar cosas nuevas",
    min: "Mis favoritos de siempre",
    max: "Uvas raras como la Romé",
    levels: ["Solo clásicos", "Sobre todo clásicos", "Un poco de todo", "Con curiosidad", "Sorpréndeme"],
  },
  bottles: {
    title: "Botellas por caja",
    count: (bottles: number) => `${bottles} botellas`,
    decrease: "Reducir botellas por caja",
    increase: "Aumentar botellas por caja",
  },
  frequency: {
    value: "Cada 4 meses",
  },
  budget: {
    title: "Presupuesto por caja",
    valueText: (amount: number) => `${amount} euros`,
    perBox: (amount: string) => `${amount} por caja`,
  },
  notes: {
    title: "¿Algo que debamos saber?",
    hint: "Alergias, cosas que no te gustan, una bodega favorita…",
    label: "Notas",
    placeholder: "p. ej., nada de blancos con madera.",
  },
  review: {
    styles: "Estilos",
    wines: "Vinos",
    sweetness: "Dulzor",
    palate: "Paladar",
    body: "Cuerpo",
    adventure: "Novedades",
    box: "Caja",
    bottles: "Botellas",
    delivery: "Envío",
    budget: "Presupuesto",
    notes: "Notas",
  },
  result: {
    chosenTitle: (plan: string) => `Tu caja ${plan}, a tu gusto.`,
    recommendedTitle: (plan: string) => `Te recomendamos ${plan}.`,
    chosenBody: "Con tus respuestas elegiremos cada botella de tu caja.",
    recommendedBody: "Es el plan que mejor encaja con tus respuestas.",
    period: "/ cada 4 meses",
    demo: "Esto es una demo: las suscripciones abrirán muy pronto.",
    allPlans: "Ver todos los planes",
    editAnswers: "Editar mis respuestas",
  },
};

/** The English text, key for key the same as the Spanish. */
const en: typeof es = {
  eyebrow: "Taste quiz",
  title: "Find your taste.",
  body: "A few quick questions so that every box feels chosen just for you. Because it is.",
  steps: {
    styles: { title: "Which wines do you like?", subtitle: "From Axarquía Moscatel to the high-altitude reds of Ronda." },
    palate: { title: "Your palate", subtitle: "So we know where to start." },
    box: { title: "Your box", subtitle: "How much, how often and anything we should know." },
    review: { title: "Check your answers", subtitle: "Make sure everything is right before you finish." },
  },
  progress: (step: number, total: number) => `Step ${step} of ${total}`,
  progressLabel: "Quiz progress",
  back: "Back",
  next: "Continue",
  finish: "See my box",
  edit: "Edit",
  styles: {
    title: "Styles",
    hint: "Choose as many as you like.",
    label: "Wine styles",
    options: { RED: "Red", WHITE: "White", ROSE: "Rosé", SWEET: "Sweet and Moscatel", SPARKLING: "Sparkling" },
    none: "No preference",
  },
  sweetness: {
    title: "Dry or sweet?",
    label: "Sweetness",
    options: { DRY: "Dry", OFF_DRY: "Off-dry", SWEET: "Sweet" },
  },
  body_: {
    title: "How full-bodied?",
    label: "Body",
    min: "Light and fresh",
    max: "Rich and full-bodied",
    levels: ["Very light", "Light", "Medium", "Full-bodied", "Very rich"],
  },
  adventure: {
    title: "How adventurous are you?",
    label: "Appetite for trying new things",
    min: "My usual favourites",
    max: "Rare grapes like Romé",
    levels: ["Classics only", "Mostly classics", "A bit of everything", "Curious", "Surprise me"],
  },
  bottles: {
    title: "Bottles per box",
    count: (bottles: number) => `${bottles} bottles`,
    decrease: "Fewer bottles per box",
    increase: "More bottles per box",
  },
  frequency: {
    value: "Every 4 months",
  },
  budget: {
    title: "Budget per box",
    valueText: (amount: number) => `${amount} euros`,
    perBox: (amount: string) => `${amount} per box`,
  },
  notes: {
    title: "Anything we should know?",
    hint: "Allergies, things you don't like, a favourite winery…",
    label: "Notes",
    placeholder: "e.g. no oaked whites.",
  },
  review: {
    styles: "Styles",
    wines: "Wines",
    sweetness: "Sweetness",
    palate: "Palate",
    body: "Body",
    adventure: "New things",
    box: "Box",
    bottles: "Bottles",
    delivery: "Delivery",
    budget: "Budget",
    notes: "Notes",
  },
  result: {
    chosenTitle: (plan: string) => `Your ${plan} box, made to your taste.`,
    recommendedTitle: (plan: string) => `We recommend ${plan}.`,
    chosenBody: "We'll use your answers to choose every bottle in your box.",
    recommendedBody: "It's the plan that fits your answers best.",
    period: "/ every 4 months",
    demo: "This is a demo: subscriptions will open very soon.",
    allPlans: "See all plans",
    editAnswers: "Edit my answers",
  },
};

export const TASTE: Record<Lang, typeof es> = { es, en };
