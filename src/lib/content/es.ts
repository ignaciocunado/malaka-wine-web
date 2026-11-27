import type { FaqQuestion } from "./faq";

/** Every piece of Spanish text on the site outside the wine guide. `en.ts` mirrors this file key by key. */
export const es = {
  meta: {
    home: {
      title: "Vinos de Málaga a domicilio · Suscripción de vino | Malaka Wine",
      description:
        "La mayor comunidad de vinos de Málaga: cada cuatro meses, una caja con vinos de pequeñas bodegas de la Axarquía, Ronda y los Montes de Málaga, elegidos según tus gustos.",
      keywords: [
        "vinos de Málaga",
        "vino de Málaga",
        "suscripción de vino",
        "suscripción de vinos",
        "club de vinos",
        "suscripción caja de vino",
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
    about: {
      title: "Quiénes somos: Antonio Cuñado Bernal | Malaka Wine",
      description:
        "El fundador de Malaka Wine, Antonio Cuñado Bernal, lleva más de 20 años en el turismo de Málaga, del Caminito del Rey a la Gran Senda, y conoce a sus productores.",
    },
    notFound: { title: "Página no encontrada | Malaka Wine" },
  },

  nav: {
    home: "Malaka Wine, inicio",
    howItWorks: "Cómo funciona",
    plans: "Planes",
    guide: "Vinos de Málaga",
    about: "Quiénes somos",
    register: "Apúntate",
    /** The link to the other language: its visible label and what it says to screen readers. */
    switchLabel: "EN",
    switchTitle: "Read this page in English",
    /** The other language by name, as the phone menu lists it. */
    otherLanguage: "English",
    /** What screen readers call the main navigation, and the button that opens it on phones. */
    label: "Principal",
    menu: "Menú",
  },

  footer: {
    legal: "Malaka solo vende bebidas alcohólicas a mayores de 18 años. Bebe con moderación.",
    made: "Hecho en Málaga.",
    credit: "Relieve 3D: datos de elevación abiertos de Mapzen Terrain Tiles.",
    plans: "Planes",
    register: "Apúntate",
    about: "Quiénes somos",
    privacy: "Privacidad",
    linkedin: "LinkedIn",
    /** Names the footer's mail icon, which has no visible text. */
    email: (address: string) => `Escríbenos a ${address}`,
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
      eyebrow: "Suscripción de vinos de Málaga",
      title: "Los vinos de Málaga, a tu gusto.",
      body: "La mayor comunidad de vinos de Málaga. Una caja con los vinos de las mejores pequeñas bodegas de la provincia, elegidos según tus gustos.",
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
        { title: "Elegimos tus vinos", body: "Botellas seleccionadas entre las últimas novedades de toda la provincia." },
        { title: "Cuéntanos qué te ha parecido", body: "Unas palabras sobre cada botella cuando la hayas abierto." },
        { title: "Tu siguiente caja encaja mejor", body: "Ajustamos tu perfil con cada respuesta, así cada caja acertamos más." },
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
      body: "Cambia de plan o cancela cuando quieras.",
      featured: "El más elegido",
      period: "/ cada 4 meses",
      choose: (plan: string) => `Elegir ${plan}`,
    },
    faq: {
      title: "¿Preguntas? Respuestas.",
      questions: [
        {
          q: "¿Qué es Malaka Wine?",
          a: [
            "Malaka Wine propone transformar la manera de descubrir y consumir el vino malagueño, convirtiendo productos exclusivos de pequeños productores en experiencias personalizadas. El objetivo es crear un Club Gourmet \"Inteligente\", esto es, una forma de conjugar lo tradicional con las nuevas tecnologías de la inteligencia artificial, de forma que cada cliente reciba sólo los vinos que le gustan.",
            "Con ello queremos crear la mayor comunidad de vinos de Málaga y ayudar a los productores malagueños a que puedan vivir de su pasión sin tener que abandonar sus tierras. Así ayudamos a fijar la población al territorio, luchamos contra el cambio climático, y hacemos de nuestra provincia un territorio más sostenible.",
            "El proyecto combina gastronomía, tecnología, exclusividad y territorio en un modelo de suscripción diseñado para comenzar con una validación pequeña y controlada en Málaga.",
            "Cada cuatro meses el suscriptor recibe en casa una caja de dos o tres botellas de las bodegas de la provincia, la gran mayoría pequeñas empresas, elegidas según tus gustos y acompañadas de fichas de cata.",
          ],
        },
        {
          q: "¿A qué bodegas nos referimos?",
          a: [
            "Malaka Wine abarca las bodegas de toda la provincia de Málaga, muchas de ellas familiares. Estas bodegas elaboran pequeñas partidas difíciles de encontrar en el mercado.",
            "La provincia cuenta con más de 300 referencias, de las cuales sólo una treintena se consiguen con más o menos facilidad en el mercado, pertenecientes a unas 53 bodegas. De ellas, 46 están registradas en las denominaciones de origen Málaga y Sierras de Málaga (distribuidas en unos 24 municipios) y el resto son vinos sin Denominación de Origen (DO), proyectos pequeños o de nicho o bodegas no inscritas en el registro de la DO.",
          ],
        },
        {
          q: "¿Qué tipos de vinos de Málaga puedo recibir?",
          a: [
            "Los que se producen en la provincia, sobre todo los que están dentro de la Denominación de Origen Protegida (DOP) Málaga o Sierras de Málaga, que superan el centenar.",
            "La **DOP Málaga** data de 1933 y es una de las más antiguas de España y se ha especializado tradicionalmente en **vinos dulces, de licor y generosos** elaborados principalmente con uvas Pedro Ximénez y Moscatel de Alejandría, pero también existen otras variedades blancas complementarias como la Doradilla y la Lairén, así como la Romé, una variedad autóctona muy escasa que aporta notas de color y estructura. Su zona de producción abarca 67 municipios repartidos en cinco ámbitos geográficos: Axarquía, Montes de Málaga, Norte, Manilva y Serranía de Ronda.",
            "Por su parte, la **DOP Sierras de Málaga** nació en 2001 para amparar **los vinos tranquilos** (blancos, rosados y tintos secos, además de algunos tintos dulces) que no son encabezados ni dulces tradicionales. Su zona de producción se extiende por toda la provincia de Málaga, dividida en siete unidades geográficas (Axarquía, Costa Occidental, Manilva, Montes de Málaga, Norte de Málaga, Serranía de Ronda y Sierra de las Nieves). Aquí se utilizan distintas variedades de uva para la producción de vino, como:",
            {
              list: [
                "**Variedades blancas.** Se emplean las uvas locales (Pedro Ximénez, Moscatel de Alejandría, Moscatel Morisco, Doradilla, Lairén, Vijariego Blanco, Montúa, Perruno y Pardina). También se cultivan variedades nacionales e internacionales como Chardonnay, Sauvignon Blanc, Verdejo, Viognier, Riesling, Gewürztraminer, Macabeo, Colombard, Garnacha Blanca, Malvasía Aromática y Vermentino.",
                "**Variedades tintas.** Destaca la uva autóctona Romé, junto a variedades recuperadas históricamente en la zona como la Melonera o Tintilla de Rota. Las variedades más extendidas para tintos de crianza (especialmente en la Serranía de Ronda) son Syrah, Cabernet Sauvignon, Merlot, Petit Verdot, Tempranillo, Garnacha, Cabernet Franc, Pinot Noir, Graciano, Malbec, Monastrell, Jaén Tinto y Blauer Limberger.",
              ],
            },
            "Como ves, no todo el vino de Málaga es dulce. Pero eso no es todo. También incluiremos vinos de productores que aún no están dentro de la DOP porque aún no cumplen con todos los requisitos que exige una denominación de origen; lo cual no quita calidad, variedad y exquisitez a los mismos (espumosos, vermuts, etc.). En nuestro proyecto tú eliges el vino que más te gusta tras una \"cata virtual\" y nuestro \"sumiller digital\" empezará a recomendarte. Mientras más consumas y más tiempo formes parte del Club mejor conoceremos tus gustos y podremos satisfacer tus intereses.",
          ],
        },
        {
          q: "¿Cómo se eligen los vinos de mi caja?",
          a: [
            "Tu perfil de gustos marca los estilos, el cuerpo y el presupuesto. Con cada caja lo cruzamos con las novedades de nuestras bodegas e incluimos fichas de cata para que sepas qué estás abriendo. Después de cada caja puedes contarnos qué te ha parecido, y ajustamos tu perfil.",
          ],
        },
        {
          q: "¿Cuándo llega mi caja?",
          a: [
            "Las cajas salen la primera semana cada cuatro meses a cualquier dirección de la España peninsular.",
          ],
        },
        {
          q: "¿Qué otros beneficios obtengo por formar parte del Club?",
          a: [
            "Además de la suscripción, el Club contempla venta cruzada de productos, ediciones limitadas y experiencias y eventos exclusivos para miembros, tales como catas o visitas a bodegas.",
          ],
        },
        {
          q: "¿Puedo cambiar de plan o cancelar?",
          a: [
            "Sí. Cambia de plan o cancela tu suscripción cuando quieras desde tu cuenta, sin permanencia.",
          ],
        },
        {
          q: "¿Hay una edad mínima para suscribirse?",
          a: [
            "Sí. Solo vendemos vino a mayores de 18 años, y la entrega debe recogerla un adulto.",
          ],
        },
      ] as FaqQuestion[],
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

  about: {
    eyebrow: "Quiénes somos",
    title: "Conocemos a quien hace el vino.",
    intro:
      "Malaka Wine es el proyecto de Antonio Cuñado Bernal, que lleva más de veinte años trabajando en el turismo de Málaga y conoce a los pequeños productores de toda la provincia.",
    founder: {
      role: "Fundador",
      body: [
        "Antonio ha sido responsable de proyectos como el Caminito del Rey, la Gran Senda de Málaga, la Senda Litoral, Málaga Destino o Málaga No Caduca.",
        "Son proyectos que recorren la provincia de punta a punta. Por el camino, Antonio ha conocido a bodegueros y pequeños productores de cada comarca.",
      ],
      linkedIn: "Antonio en LinkedIn",
    },
    projects: {
      title: "Algunos de sus proyectos",
      /** Each project as [name, what it is]. Names stay in Spanish in both languages. */
      items: [
        ["Caminito del Rey", "La pasarela del Desfiladero de los Gaitanes, reabierta en 2015."],
        ["Gran Senda de Málaga", "El sendero de gran recorrido GR 249, que da la vuelta a la provincia."],
        ["Senda Litoral", "El proyecto para recorrer a pie toda la costa de la provincia, de Nerja a Manilva."],
        ["Málaga Destino", "Descuentos para comprar en comercios y negocios locales de toda la provincia."],
        ["Málaga No Caduca", "La iniciativa provincial contra el desperdicio de alimentos."],
      ] as [string, string][],
    },
    why: {
      title: "Por qué Malaka Wine",
      body: [
        "Muchas bodegas de Málaga hacen vinos muy buenos en partidas tan pequeñas que casi no salen de su pueblo, y mucho menos llegan a las tiendas. Queremos llevarlos a tu casa y ayudar a que quienes los hacen vivan de su trabajo sin dejar su tierra.",
        "Como conocemos a quienes los hacen, podemos elegir para ti botellas que no encontrarías por tu cuenta y contarte de dónde viene cada una.",
      ],
    },
    name: {
      title: "De dónde viene el nombre",
      /** What the Phoenician inscription says, for screen readers. */
      inscription: "Malaka, escrito en alfabeto fenicio",
      caption: "Se lee de derecha a izquierda: mem, lámed, kaf y álef.",
      body: [
        "Los fenicios de Tiro fundaron la ciudad hacia el siglo VIII a. C. y la llamaron Malaka. Para los romanos fue Malaca y en árabe Mālaqa, de donde viene Málaga. Nosotros nos quedamos con el más antiguo.",
        // m‑l‑k is written with non-breaking hyphens (U+2011) so the root never splits across lines.
        "El fenicio solo escribía las consonantes, así que a Malaka le bastan cuatro letras. No se sabe con certeza qué significaba; la explicación más aceptada lo relaciona con la raíz semítica m‑l‑k, «reinar».",
        "Siglos después, la ciudad acuñó monedas con ese mismo nombre en letras neopúnicas, una forma más tardía del mismo alfabeto.",
      ],
    },
    cta: {
      title: "¿Quieres probar estos vinos?",
      body: "Malaka Wine abre muy pronto. Déjanos tu email y te avisamos cuando puedas pedir tu primera caja.",
      button: "Apúntate",
    },
  },

  taste: {
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
  },
};

export type Dictionary = typeof es;
