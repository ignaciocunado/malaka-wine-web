/** Every piece of Spanish text on the site outside the wine guide. `en.ts` mirrors this file key by key. */
export const es = {
  meta: {
    home: {
      title: "Vinos de Málaga a domicilio · Suscripción de vino | Malaka Wine",
      description:
        "Suscripción de vinos de Málaga: cada dos meses, una caja con vinos de pequeñas bodegas de la Axarquía, Ronda y los Montes de Málaga, elegidos según tus gustos. Envío gratis a la península.",
      keywords: [
        "vinos de Málaga",
        "vino de Málaga",
        "suscripción de vino",
        "suscripción de vinos",
        "club de vinos",
        "caja de vino bimestral",
        "comprar vino de Málaga online",
        "vino Moscatel de Málaga",
        "vinos de Ronda",
        "vinos de la Axarquía",
        "regalar vino de Málaga",
      ],
    },
    interest: {
      title: "Apúntate: te avisamos cuando abramos | Malaka Wine",
      description:
        "Déjanos tu email y te avisaremos cuando abra Malaka Wine, la suscripción de vinos de pequeñas bodegas de Málaga.",
    },
    privacy: {
      title: "Política de privacidad | Malaka Wine",
      description:
        "Qué datos personales recoge Malaka Wine cuando te apuntas a la lista de interesados, para qué los usa y cómo puedes ejercer tus derechos.",
    },
    notFound: { title: "Página no encontrada | Malaka Wine" },
  },

  nav: {
    home: "Malaka, inicio",
    howItWorks: "Cómo funciona",
    plans: "Planes",
    guide: "Vinos de Málaga",
    register: "Apúntate",
    /** The link to the other language: its visible label and what it says to screen readers. */
    switchLabel: "EN",
    switchTitle: "Read this page in English",
  },

  footer: {
    legal: "Malaka solo vende bebidas alcohólicas a mayores de 18 años. Bebe con moderación.",
    sample: "Las bodegas, los precios y las cajas que aparecen en esta web son contenido de ejemplo.",
    made: "Hecho en Málaga.",
    credit: "Relieve 3D: datos de elevación abiertos de Mapzen Terrain Tiles.",
    plans: "Planes",
    register: "Apúntate",
    privacy: "Privacidad",
    guide: "Guía de vinos de Málaga",
    otherLanguage: "English",
  },

  ageGate: {
    title: "¿Tienes 18 años o más?",
    body: "Malaka vende bebidas alcohólicas y solo puede mostrarte la web si eres mayor de edad.",
    yes: "Sí, tengo 18 años o más",
    no: "No, soy menor",
    deniedTitle: "Lo sentimos",
    deniedBody: "Malaka solo vende bebidas alcohólicas a mayores de 18 años, así que no puedes acceder a la web.",
    back: "Volver",
  },

  notFound: {
    eyebrow: "Error 404",
    title: "No encontramos esta página.",
    body: "Puede que el enlace esté mal o que la página ya no exista.",
    cta: "Volver al inicio",
  },

  home: {
    hero: {
      eyebrow: "La mayor comunidad de vinos de Málaga",
      title: "Málaga, cada dos meses en tu copa.",
      body: "Una comunidad que apoya los vinos de Málaga. Recibe una caja con los vinos de las mejores pequeñas bodegas de la provincia, elegidos según tus gustos.",
      cta: "Apúntate",
      plans: "Ver planes",
      scroll: "Baja hasta el lagar",
      /** What the hero's 3D scene shows, for screen readers. */
      scene:
        "Maqueta 3D de Málaga al anochecer vista desde una viña de los Montes: hileras de cepas a los lados de un camino que baja hasta un lagar iluminado, con Gibralfaro, la catedral, la bahía y la sierra de Mijas al fondo.",
    },
    how: {
      eyebrow: "Cómo funciona",
      title: "Cada caja nos enseña tu gusto.",
      body: "Empiezas con un test de dos minutos. Después de cada caja nos cuentas qué te ha parecido, y la siguiente se acerca más.",
      steps: [
        { title: "Cuéntanos qué te gusta", body: "Dos minutos sobre estilos, cuerpo y presupuesto." },
        { title: "Elegimos tus vinos", body: "Botellas seleccionadas entre las novedades de toda la provincia." },
        { title: "Cuéntanos qué te ha parecido", body: "Unas palabras sobre cada botella cuando la hayas abierto." },
        { title: "Tu siguiente caja encaja mejor", body: "Ajustamos tu perfil con cada respuesta, así cada vez acertamos más." },
      ],
      cta: "Apúntate y te avisamos cuando abramos",
      /** What the cellar scene behind this section shows, for screen readers. */
      scene: "Dentro del lagar: maqueta 3D de una bodega de solera, con arcos encalados, faroles y botas apiladas en tres alturas.",
    },
    /** The picture of a taste profile narrowing box by box. Its three scales borrow their labels from `taste`. */
    profile: {
      title: "Tu perfil de gusto, caja a caja.",
      body: "El test nos da un margen amplio donde elegir. Cada respuesta lo estrecha, y las botellas que te mandamos se acercan más a lo que te gusta.",
      stages: [
        { title: "Después del test", body: "Sabemos qué estilos has pedido, así que empezamos con margen." },
        { title: "Después de tu primera caja", body: "Lo que te ha parecido cada botella mueve el margen y lo estrecha." },
        { title: "Después de unas cuantas", body: "Elegimos dentro de una franja estrecha que es solo tuya." },
      ],
      note: "Es una ilustración de la idea, no un perfil real.",
    },
    plans: {
      eyebrow: "Planes",
      title: "Elige tu caja de vinos de Málaga.",
      body: "Envío gratis a la península. Cambia de plan o cancela cuando quieras.",
      featured: "El más elegido",
      perShipment: "/ cada dos meses",
      choose: (plan: string) => `Elegir ${plan}`,
    },
    faq: {
      title: "¿Preguntas? Respuestas.",
      questions: [
        {
          q: "¿Qué es Malaka Wine?",
          a: "Malaka Wine es una suscripción de vinos de Málaga: cada dos meses recibes en casa una caja de dos o tres botellas de pequeñas bodegas de la provincia, elegidas según tus gustos y acompañadas de fichas de cata.",
        },
        {
          q: "¿Quiénes son las bodegas?",
          a: "Bodegas familiares de toda la provincia de Málaga (Axarquía, Montes de Málaga, Serranía de Ronda, Costa Occidental y Norte) que elaboran pequeñas partidas difíciles de encontrar fuera de su pueblo.",
        },
        {
          q: "¿Qué tipos de vino de Málaga puedo recibir?",
          a: "Blancos secos y dulces de Moscatel de Alejandría, dulces tradicionales de Pedro Ximénez, rosados y tintos ligeros de Romé y tintos de altura de la Serranía de Ronda. No todo el vino de Málaga es dulce: tú eliges los estilos.",
        },
        {
          q: "¿Cómo elegís los vinos de mi caja?",
          a: "Tu perfil de gustos marca los estilos, el cuerpo y el presupuesto. Cada vez lo cruzamos con las novedades de nuestras bodegas e incluimos fichas de cata para que sepas qué estás abriendo. Después de cada caja puedes contarnos qué te ha parecido, y ajustamos tu perfil.",
        },
        {
          q: "¿Cuándo llega mi caja?",
          a: "Las cajas salen cada dos meses, durante la primera semana del mes, a cualquier dirección de la España peninsular.",
        },
        {
          q: "¿Puedo cambiar de plan o cancelar?",
          a: "Sí. Cambia de plan o cancela cuando quieras desde tu cuenta, sin permanencia.",
        },
        {
          q: "¿Hay una edad mínima?",
          a: "Sí. Solo vendemos vino a mayores de 18 años, y la entrega debe recogerla un adulto.",
        },
      ],
    },
  },

  interest: {
    eyebrow: "Muy pronto",
    title: "Apúntate y te avisamos.",
    body: "Malaka Wine todavía no ha abierto. Déjanos tu email y te escribiremos cuando puedas pedir tu primera caja.",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    /** The consent sentence is `consent` + a link reading `consentLink` + `consentEnd`. */
    consent: "Tengo 18 años o más y acepto que Malaka Wine me escriba por email sobre su lanzamiento, según la ",
    consentLink: "política de privacidad",
    consentEnd: ".",
    submit: "Apuntarme",
    sending: "Enviando…",
    note: "Solo te escribiremos sobre el lanzamiento. Puedes borrarte cuando quieras.",
    errors: {
      email: "Escribe un email válido.",
      consent: "Marca la casilla para poder apuntarte.",
      send: "No hemos podido apuntarte. Inténtalo de nuevo dentro de un momento.",
    },
    success: {
      title: "Ya estás en la lista.",
      body: "Te escribiremos en cuanto abramos. Mientras tanto, conoce los vinos de la provincia.",
      guide: "Leer la guía de vinos de Málaga",
      home: "Volver al inicio",
    },
  },

  taste: {
    eyebrow: "Test de gustos",
    title: "Descubre tu gusto.",
    body: "Unas preguntas rápidas para que cada caja parezca elegida solo para ti. Porque lo está.",
    steps: {
      styles: { title: "¿Qué vinos te gustan?", subtitle: "Del Moscatel de la Axarquía a los tintos de altura de Ronda." },
      palate: { title: "Tu paladar", subtitle: "Así sabremos por dónde empezar." },
      box: { title: "Tu caja", subtitle: "Cuánto y lo que debamos saber." },
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
    /** Boxes always ship every two months, so this is shown in the review but never asked. */
    frequency: "Cada 2 meses",
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
      perShipment: "/ cada dos meses",
      demo: "Esto es una demo: las suscripciones abrirán muy pronto.",
      allPlans: "Ver todos los planes",
      editAnswers: "Editar mis respuestas",
    },
  },
};

export type Dictionary = typeof es;
