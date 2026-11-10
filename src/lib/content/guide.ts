import type { Lang } from "@/lib/site";

/**
 * The guide to Málaga wines: one overview page plus a page for each wine area and grape. Unlike the catalog, this
 * is real reference content about the province, written to answer the questions people search for. Headings are
 * phrased as questions and each section opens with the direct answer.
 */

export type Section = { heading: string; body: string[] };
export type TopicKind = "zone" | "grape";

export type Topic = {
  slug: string;
  kind: TopicKind;
  /** Short name, used in links and breadcrumbs. */
  name: string;
  /** One line under the name on the overview page. */
  summary: string;
  title: string;
  metaTitle: string;
  description: string;
  intro: string;
  /** Quick reference table: label and value. */
  facts: [string, string][];
  sections: Section[];
};

export type Guide = {
  metaTitle: string;
  description: string;
  keywords: string[];
  eyebrow: string;
  title: string;
  intro: string;
  /** Sections before the lists of areas and grapes. */
  opening: Section[];
  zones: Section;
  grapes: Section;
  /** Sections after them. */
  closing: Section[];
  cta: { title: string; body: string; button: string };
  labels: {
    breadcrumbHome: string;
    kind: Record<TopicKind, string>;
    facts: string;
    related: string;
    backToGuide: string;
    updated: string;
  };
  topics: Topic[];
};

/** Shown on the pages and published in their structured data. Update it when the guide's content changes. */
export const GUIDE_UPDATED = "2026-11-10";

const es: Guide = {
  metaTitle: "Vinos de Málaga: guía de zonas, uvas y estilos | Malaka Wine",
  description:
    "Guía de los vinos de Málaga: las DO Málaga y Sierras de Málaga, sus cinco zonas (Axarquía, Montes, Norte, Manilva y Serranía de Ronda), las uvas Moscatel, Pedro Ximénez y Romé, y cómo maridarlos.",
  keywords: [
    "vinos de Málaga",
    "vino de Málaga",
    "DO Málaga",
    "DO Sierras de Málaga",
    "vino dulce de Málaga",
    "Moscatel de Málaga",
    "vinos de la Axarquía",
    "vinos de Ronda",
    "uva Romé",
    "Pedro Ximénez Málaga",
  ],
  eyebrow: "Guía",
  title: "Vinos de Málaga: zonas, uvas y estilos",
  intro:
    "Los vinos de Málaga son los que se elaboran en la provincia de Málaga, al sur de España: dulces históricos de Moscatel y Pedro Ximénez, blancos secos y aromáticos de la Axarquía y tintos de montaña de la Serranía de Ronda. Esta guía resume qué son, dónde se hacen y con qué uvas.",
  opening: [
    {
      heading: "¿Qué son los vinos de Málaga?",
      body: [
        "Son los vinos amparados por las dos denominaciones de origen de la provincia, que comparten Consejo Regulador. La DO Málaga, reconocida en 1933, protege los vinos dulces y de licor que dieron fama a la ciudad. La DO Sierras de Málaga, creada en 2001, ampara los vinos tranquilos: blancos, rosados y tintos. El mismo Consejo regula la DO Pasas de Málaga.",
        "En Málaga se hace vino desde la Antigüedad. La ciudad la fundaron los fenicios hacia el siglo VIII a. C. con el nombre de Malaka, y de ahí viene el nuestro.",
      ],
    },
    {
      heading: "¿Todos los vinos de Málaga son dulces?",
      body: [
        "No. Los dulces son los más conocidos, pero hoy buena parte de las bodegas pequeñas elabora vinos secos: blancos de Moscatel de Alejandría en la Axarquía y Manilva, tintos de Syrah, Tempranillo o Petit Verdot en la Serranía de Ronda, y rosados y tintos ligeros de Romé.",
      ],
    },
  ],
  zones: {
    heading: "¿Cuáles son las zonas del vino de Málaga?",
    body: [
      "La zona de producción se reparte en cinco áreas con suelos y climas muy distintos: la Axarquía al este, los Montes de Málaga alrededor de la capital, el Norte en la comarca de Antequera, Manilva en la costa occidental y la Serranía de Ronda en el interior oeste.",
    ],
  },
  grapes: {
    heading: "¿Qué uvas se cultivan en Málaga?",
    body: [
      "Las dos variedades principales de la DO Málaga son blancas: Pedro Ximénez y Moscatel de Alejandría. También están autorizadas la Moscatel Morisco (de grano menudo), la Doradilla y la Lairén. Entre las tintas destaca la Romé, autóctona de la provincia. La DO Sierras de Málaga admite además variedades como Chardonnay, Sauvignon Blanc, Syrah, Tempranillo, Cabernet Sauvignon, Merlot o Petit Verdot.",
    ],
  },
  closing: [
    {
      heading: "¿Cómo se elaboran los vinos dulces de Málaga?",
      body: [
        "Hay dos grandes familias. Los vinos de licor se encabezan: se les añade alcohol de vino para detener la fermentación y conservar el azúcar de la uva. Los vinos naturalmente dulces no llevan alcohol añadido; su dulzor procede solo de uvas muy maduras o asoleadas, es decir, secadas al sol sobre esteras o en paseros hasta que casi son pasas.",
        "Algunos estilos tradicionales incorporan arrope, mosto cocido y concentrado que da el color oscuro y las notas de caramelo. Según el tiempo de crianza en madera, la etiqueta puede decir Málaga (de 6 a 24 meses), Málaga Noble (de 2 a 3 años), Málaga Añejo (de 3 a 5 años) o Málaga Trasañejo (más de 5 años).",
      ],
    },
    {
      heading: "¿Cuál es la historia del vino de Málaga?",
      body: [
        "Los vinos dulces de Málaga se exportaron durante siglos por el puerto de la ciudad. En la Inglaterra de los siglos XVII y XVIII se conocían como «Mountain wine», el vino de los montes.",
        "En 1878 se detectó la filoxera en un lagar de Moclinejo, en la Axarquía: fue el primer foco de la plaga en España y arrasó el viñedo de la provincia. La recuperación ha sido lenta, y en las últimas décadas la han impulsado sobre todo bodegas pequeñas y familiares.",
      ],
    },
    {
      heading: "¿Con qué se maridan los vinos de Málaga?",
      body: [
        "El Moscatel seco, fresco y aromático, va bien con pescaíto frito, espetos de sardinas, mariscos y ensaladas. Los dulces de Moscatel acompañan frutas, repostería y foie. Los dulces oscuros de Pedro Ximénez piden quesos azules, frutos secos, chocolate o helado de vainilla. Los tintos de la Serranía de Ronda acompañan carnes a la brasa, guisos e ibéricos.",
      ],
    },
    {
      heading: "¿Dónde comprar vinos de Málaga?",
      body: [
        "Muchas bodegas pequeñas venden casi toda su producción en su propio pueblo, así que fuera de la provincia cuesta encontrarlas. Malaka Wine las reúne en una suscripción: cada mes, una caja con vinos de distintas zonas, elegidos según tus gustos y enviados a cualquier dirección de la España peninsular.",
      ],
    },
  ],
  cta: {
    title: "Prueba los vinos de Málaga en casa.",
    body: "Haz el test de gustos en dos minutos y descubre qué caja encaja contigo.",
    button: "Descubre tu gusto",
  },
  labels: {
    breadcrumbHome: "Inicio",
    kind: { zone: "Zona", grape: "Uva" },
    facts: "En resumen",
    related: "Sigue leyendo",
    backToGuide: "Guía de vinos de Málaga",
    updated: "Actualizado el",
  },
  topics: [
    {
      slug: "axarquia",
      kind: "zone",
      name: "Axarquía",
      summary: "Laderas de pizarra sobre el mar, Moscatel de Alejandría y Romé.",
      title: "Vinos de la Axarquía",
      metaTitle: "Vinos de la Axarquía: Moscatel y Romé en Málaga | Malaka Wine",
      description:
        "Los vinos de la Axarquía, la comarca oriental de Málaga: Moscatel de Alejandría seco y dulce, la uva tinta Romé, laderas de pizarra y vendimia a mano en pueblos como Cómpeta y Moclinejo.",
      intro:
        "La Axarquía es la comarca oriental de la provincia de Málaga y la zona más conocida de sus vinos de Moscatel. Sus viñas crecen en laderas de pizarra muy inclinadas que miran al Mediterráneo, y se vendimian a mano.",
      facts: [
        ["Dónde", "Este de la provincia de Málaga; capital comarcal, Vélez-Málaga"],
        ["Pueblos del vino", "Cómpeta, Sayalonga, Moclinejo, Almáchar, El Borge"],
        ["Uvas", "Moscatel de Alejandría y Romé"],
        ["Suelos", "Pizarra en pendientes que a menudo superan el 30 %"],
        ["Vinos", "Blancos secos, dulces de uva asoleada, rosados y tintos ligeros"],
      ],
      sections: [
        {
          heading: "¿Cómo son los vinos de la Axarquía?",
          body: [
            "Los blancos secos de Moscatel de Alejandría son muy aromáticos, con recuerdos de azahar, cítricos y uva fresca, y un punto salino. Los dulces se elaboran con uva asoleada y saben a pasa, miel y fruta escarchada. Con la Romé, la tinta autóctona, se hacen rosados y tintos ligeros.",
          ],
        },
        {
          heading: "¿Por qué se vendimia a mano?",
          body: [
            "Las pendientes impiden mecanizar el trabajo. Las cajas de uva se sacan de la viña a hombros o con mulos, como se ha hecho siempre. Parte de la cosecha se tiende al sol en los paseros, unas eras inclinadas donde la uva se convierte en pasa. Este sistema de cultivo de la uva pasa está reconocido por la FAO como Sistema Importante del Patrimonio Agrícola Mundial.",
          ],
        },
        {
          heading: "¿Qué tradiciones del vino tiene la Axarquía?",
          body: [
            "Cómpeta celebra cada 15 de agosto la Noche del Vino, una de las fiestas del vino más conocidas de la provincia. En Moclinejo se detectó en 1878 el primer foco de filoxera de España, que acabó con buena parte del viñedo histórico de la comarca.",
          ],
        },
      ],
    },
    {
      slug: "montes-de-malaga",
      kind: "zone",
      name: "Montes de Málaga",
      summary: "Los montes que rodean la capital, cuna de los dulces de Pedro Ximénez.",
      title: "Vinos de los Montes de Málaga",
      metaTitle: "Vinos de los Montes de Málaga: dulces de Pedro Ximénez | Malaka Wine",
      description:
        "Los Montes de Málaga, la sierra que rodea la capital, fueron el corazón histórico del vino dulce de Málaga. Uvas Pedro Ximénez y Moscatel, lagares y suelos de pizarra.",
      intro:
        "Los Montes de Málaga son la sierra que rodea la ciudad por el norte. Fueron el corazón histórico del vino de Málaga hasta la filoxera, y hoy conservan un viñedo pequeño dedicado sobre todo a los dulces tradicionales.",
      facts: [
        ["Dónde", "Al norte de la ciudad de Málaga"],
        ["Uvas", "Pedro Ximénez y Moscatel de Alejandría"],
        ["Suelos", "Pizarra en laderas pronunciadas"],
        ["Vinos", "Dulces tradicionales de uva asoleada"],
        ["Para visitar", "Lagar de Torrijos, ecomuseo en el Parque Natural Montes de Málaga"],
      ],
      sections: [
        {
          heading: "¿Qué vinos se hacen en los Montes de Málaga?",
          body: [
            "Sobre todo dulces de Pedro Ximénez y Moscatel elaborados con uva asoleada. Son vinos de color ámbar a caoba, con aromas de pasa, higo seco, café y frutos secos, que ganan complejidad con la crianza en bota.",
          ],
        },
        {
          heading: "¿Qué es un lagar?",
          body: [
            "En Málaga se llama lagar a la casa de campo que tenía su propia prensa para hacer vino. Los Montes estaban salpicados de lagares cuando el viñedo cubría sus laderas; de ellos salía el vino que los ingleses llamaban «Mountain wine».",
          ],
        },
        {
          heading: "¿Qué pasó con el viñedo de los Montes?",
          body: [
            "La filoxera, llegada en 1878, destruyó casi todas las viñas. Muchas laderas se abandonaron y, a partir de la década de 1930, se repoblaron con pinos para frenar las riadas del río Guadalmedina sobre la ciudad. Ese bosque es hoy el Parque Natural Montes de Málaga.",
          ],
        },
      ],
    },
    {
      slug: "serrania-de-ronda",
      kind: "zone",
      name: "Serranía de Ronda",
      summary: "Viñedos de montaña y tintos frescos y con estructura.",
      title: "Vinos de la Serranía de Ronda",
      metaTitle: "Vinos de Ronda: tintos de altura de la Serranía | Malaka Wine",
      description:
        "Los vinos de la Serranía de Ronda: viñedos de montaña entre unos 600 y 1000 metros, noches frescas y tintos de Syrah, Tempranillo, Cabernet Sauvignon y Petit Verdot de bodegas pequeñas.",
      intro:
        "La Serranía de Ronda, en el interior occidental de la provincia, es la zona de los tintos de Málaga. Sus viñedos de montaña, entre unos 600 y 1000 metros de altitud, dan vinos frescos y con estructura que se etiquetan dentro de la DO Sierras de Málaga.",
      facts: [
        ["Dónde", "Oeste de la provincia, en torno a Ronda y Arriate"],
        ["Altitud", "Entre unos 600 y 1000 metros"],
        ["Uvas", "Syrah, Tempranillo, Cabernet Sauvignon, Merlot, Petit Verdot, Pinot Noir"],
        ["Clima", "De montaña, con gran diferencia de temperatura entre el día y la noche"],
        ["Vinos", "Tintos sobre todo; también blancos y rosados"],
      ],
      sections: [
        {
          heading: "¿Cómo son los vinos de Ronda?",
          body: [
            "Son tintos de color intenso, con fruta madura y buena acidez. La altitud alarga la maduración: los días son cálidos y las noches frescas, y la uva conserva frescura a pesar de la latitud. Muchos se crían en barrica.",
          ],
        },
        {
          heading: "¿Desde cuándo se hace vino en Ronda?",
          body: [
            "Desde época romana. La ciudad de Acinipo, cuyas ruinas están a unos veinte kilómetros de Ronda, acuñó monedas con racimos de uva. La filoxera acabó con el viñedo a finales del siglo XIX, y la recuperación empezó en las últimas décadas del siglo XX con bodegas nuevas, casi todas pequeñas.",
          ],
        },
        {
          heading: "¿Qué bodegas hay en la Serranía de Ronda?",
          body: [
            "Hoy trabajan en la zona más de una veintena de bodegas, la mayoría familiares y de producción limitada. Muchas cultivan sus propias viñas y venden buena parte del vino en la propia bodega.",
          ],
        },
      ],
    },
    {
      slug: "norte-de-malaga",
      kind: "zone",
      name: "Norte de Málaga",
      summary: "Las llanuras de Antequera y Mollina, tierra de Pedro Ximénez.",
      title: "Vinos del Norte de Málaga",
      metaTitle: "Vinos del Norte de Málaga: Mollina y Antequera | Malaka Wine",
      description:
        "La zona Norte de Málaga, en la comarca de Antequera: llanuras a unos 500 metros, clima continental y uvas Pedro Ximénez y Doradilla en pueblos como Mollina, Humilladero y Fuente de Piedra.",
      intro:
        "La zona Norte ocupa las llanuras de la comarca de Antequera, en el límite con Córdoba y Sevilla. Reúne una de las mayores superficies de viñedo de la provincia y es la tierra de la Pedro Ximénez malagueña.",
      facts: [
        ["Dónde", "Comarca de Antequera, al norte de la provincia"],
        ["Pueblos del vino", "Mollina, Humilladero, Fuente de Piedra, Antequera"],
        ["Altitud", "En torno a 500 metros"],
        ["Uvas", "Pedro Ximénez, Doradilla y Lairén"],
        ["Vinos", "Dulces y de licor, blancos, rosados y tintos jóvenes"],
      ],
      sections: [
        {
          heading: "¿Cómo son los vinos del Norte de Málaga?",
          body: [
            "Aquí nacen muchos de los vinos dulces y de licor de Pedro Ximénez de la DO Málaga, además de blancos secos y, cada vez más, rosados y tintos jóvenes dentro de la DO Sierras de Málaga.",
          ],
        },
        {
          heading: "¿En qué se diferencia del resto de la provincia?",
          body: [
            "El paisaje es una meseta suave, no una ladera. El clima es continental, con inviernos fríos y veranos muy calurosos y secos, y los suelos son calizos. Las viñas se pueden trabajar con maquinaria, algo imposible en la Axarquía.",
          ],
        },
        {
          heading: "¿Qué fiestas del vino hay?",
          body: ["Mollina celebra su Feria de la Vendimia cada mes de septiembre."],
        },
      ],
    },
    {
      slug: "manilva",
      kind: "zone",
      name: "Manilva",
      summary: "Moscatel sobre tierras blancas frente al Estrecho.",
      title: "Vinos de Manilva",
      metaTitle: "Vinos de Manilva: Moscatel de la Costa del Sol | Malaka Wine",
      description:
        "Manilva, en la costa occidental de Málaga, cultiva Moscatel de Alejandría sobre tierras blancas calizas a la vista del mar. Blancos secos y dulces con carácter marino.",
      intro:
        "Manilva es la zona vinícola más occidental de Málaga, en el extremo de la Costa del Sol y junto a la provincia de Cádiz. Sus viñas de Moscatel de Alejandría crecen sobre tierras blancas calizas a la vista del mar.",
      facts: [
        ["Dónde", "Costa occidental de Málaga, junto a Cádiz"],
        ["Uva", "Moscatel de Alejandría"],
        ["Suelos", "Albarizas: tierras blancas, calizas, que retienen la humedad"],
        ["Clima", "Marítimo, con vientos de levante y poniente"],
        ["Vinos", "Blancos secos y dulces de Moscatel"],
      ],
      sections: [
        {
          heading: "¿Cómo son los vinos de Manilva?",
          body: [
            "Moscateles secos, florales y salinos, y dulces de uva asoleada. La cercanía del mar y las tierras albarizas, parecidas a las del vecino Marco de Jerez, les dan frescura.",
          ],
        },
        {
          heading: "¿Qué tradición tiene la uva en Manilva?",
          body: [
            "La Moscatel de Manilva se ha cultivado tradicionalmente como uva de mesa y para pasa, además de para vino. El pueblo celebra la Fiesta de la Vendimia el primer fin de semana de septiembre.",
          ],
        },
      ],
    },
    {
      slug: "moscatel-de-alejandria",
      kind: "grape",
      name: "Moscatel de Alejandría",
      summary: "La uva blanca aromática de la Axarquía y Manilva.",
      title: "Moscatel de Alejandría, la uva aromática de Málaga",
      metaTitle: "Moscatel de Alejandría: la uva del Moscatel de Málaga | Malaka Wine",
      description:
        "La Moscatel de Alejandría es la uva blanca aromática de los vinos Moscatel de Málaga. Se cultiva en la Axarquía y Manilva y da blancos secos, dulces de uva asoleada y pasas.",
      intro:
        "La Moscatel de Alejandría es una uva blanca muy antigua y muy aromática, y una de las dos variedades principales de la DO Málaga. En la provincia se cultiva sobre todo en la Axarquía y en Manilva.",
      facts: [
        ["Tipo", "Uva blanca aromática, de grano grueso"],
        ["Zonas", "Axarquía y Manilva"],
        ["Aromas", "Azahar, jazmín, cítricos, uva fresca"],
        ["Vinos", "Blancos secos, naturalmente dulces y de licor"],
        ["Otros usos", "Uva de mesa y pasas de Málaga"],
      ],
      sections: [
        {
          heading: "¿A qué sabe un vino de Moscatel de Alejandría?",
          body: [
            "En seco es un blanco ligero y muy perfumado: azahar, jazmín, piel de limón y la propia uva. En dulce, con la uva asoleada, aparecen la pasa, la miel, el albaricoque seco y la naranja confitada.",
          ],
        },
        {
          heading: "¿Moscatel es siempre un vino dulce?",
          body: [
            "No. La Moscatel es una uva, no un estilo. Tradicionalmente se usaba para dulces, pero las bodegas malagueñas llevan años elaborando Moscatel seco, que se ha convertido en uno de los blancos más reconocibles de la provincia.",
          ],
        },
        {
          heading: "¿Con qué se toma?",
          body: [
            "El seco, muy frío, con pescado frito, mariscos, ensaladas y cocina asiática. El dulce, con fruta, repostería, foie o quesos cremosos.",
          ],
        },
      ],
    },
    {
      slug: "pedro-ximenez",
      kind: "grape",
      name: "Pedro Ximénez",
      summary: "La uva de los dulces oscuros tradicionales.",
      title: "Pedro Ximénez en Málaga",
      metaTitle: "Pedro Ximénez de Málaga: la uva del vino dulce | Malaka Wine",
      description:
        "La Pedro Ximénez, llamada Pero Ximén en Málaga, es la uva de los dulces tradicionales de la DO Málaga. Se cultiva en el Norte y los Montes y se asolea para concentrar su azúcar.",
      intro:
        "La Pedro Ximénez es una uva blanca de piel fina y mucho azúcar, y la variedad histórica de los vinos dulces de Málaga, donde también se la llama Pero Ximén. Se cultiva sobre todo en la zona Norte y en los Montes de Málaga.",
      facts: [
        ["Tipo", "Uva blanca de piel fina y alto contenido en azúcar"],
        ["Nombre local", "Pero Ximén"],
        ["Zonas", "Norte de Málaga y Montes de Málaga"],
        ["Aromas (en dulce)", "Pasa, higo seco, dátil, café, caramelo"],
        ["Vinos", "Dulces y de licor, con o sin crianza; también blancos secos"],
      ],
      sections: [
        {
          heading: "¿Cómo se hace un dulce de Pedro Ximénez?",
          body: [
            "Tras la vendimia, los racimos se extienden al sol durante varios días. La uva pierde agua y concentra azúcar hasta casi convertirse en pasa. De su prensado sale un mosto muy denso que apenas fermenta. Después el vino puede criarse años en botas de roble, donde se oscurece y gana complejidad.",
          ],
        },
        {
          heading: "¿En qué se diferencia del Pedro Ximénez de otras zonas?",
          body: [
            "La misma uva se cultiva en Montilla-Moriles, en Córdoba, y se usa en los vinos de Jerez. En Málaga se etiqueta dentro de la DO Málaga con sus propias menciones de crianza: Noble, Añejo y Trasañejo.",
          ],
        },
        {
          heading: "¿Con qué se toma?",
          body: [
            "Con queso azul, frutos secos, chocolate negro o sobre helado de vainilla. Se sirve fresco, no helado, en copa pequeña.",
          ],
        },
      ],
    },
    {
      slug: "rome",
      kind: "grape",
      name: "Romé",
      summary: "La uva tinta autóctona, casi desaparecida.",
      title: "Romé, la uva tinta autóctona de Málaga",
      metaTitle: "Uva Romé: la tinta autóctona de Málaga | Malaka Wine",
      description:
        "La Romé es la uva tinta autóctona de Málaga. Quedan pocas viñas, casi todas en la Axarquía, y con ella se elaboran rosados y tintos ligeros y afrutados dentro de la DO Sierras de Málaga.",
      intro:
        "La Romé es la uva tinta autóctona de Málaga. Estuvo cerca de desaparecer y hoy quedan pocas viñas, casi todas en la Axarquía. Da vinos de poco color, ligeros y afrutados.",
      facts: [
        ["Tipo", "Uva tinta autóctona de poco color"],
        ["Zona", "Axarquía"],
        ["Aromas", "Fruta roja fresca, flores, hierbas de monte"],
        ["Vinos", "Rosados, tintos ligeros y algún blanco de uva tinta"],
        ["Denominación", "Autorizada en la DO Sierras de Málaga"],
      ],
      sections: [
        {
          heading: "¿Cómo son los vinos de Romé?",
          body: [
            "Su piel tiene poco color, así que da de forma natural rosados pálidos y tintos claros, de cuerpo ligero y buena acidez. Recuerdan a fresa, granada y hierbas mediterráneas, y se beben frescos.",
          ],
        },
        {
          heading: "¿Por qué es tan poco conocida?",
          body: [
            "Tras la filoxera, la Axarquía se replantó sobre todo con Moscatel, más rentable para pasa y para vino dulce. La Romé sobrevivió mezclada en viñas viejas, y solo en los últimos años algunas bodegas pequeñas han empezado a vinificarla por separado.",
          ],
        },
        {
          heading: "¿Con qué se toma?",
          body: ["Con arroces, verduras a la brasa, embutidos suaves y pescado azul. Un tinto de Romé admite servirse ligeramente frío."],
        },
      ],
    },
  ],
};

const en: Guide = {
  metaTitle: "Málaga Wines: A Guide to Regions, Grapes and Styles | Malaka Wine",
  description:
    "A guide to the wines of Málaga, Spain: the DO Málaga and DO Sierras de Málaga appellations, the five wine areas (Axarquía, Montes, Norte, Manilva and Serranía de Ronda), the Moscatel, Pedro Ximénez and Romé grapes, and food pairings.",
  keywords: [
    "Málaga wines",
    "Malaga wine",
    "wines of Málaga",
    "DO Málaga",
    "DO Sierras de Málaga",
    "Málaga sweet wine",
    "Málaga Moscatel",
    "Axarquía wine",
    "Ronda wine",
    "Romé grape",
    "Pedro Ximénez Málaga",
  ],
  eyebrow: "Guide",
  title: "Málaga wines: regions, grapes and styles",
  intro:
    "Málaga wines are the wines made in the province of Málaga, in southern Spain: historic sweet wines from Moscatel and Pedro Ximénez, dry aromatic whites from the Axarquía and mountain reds from the Serranía de Ronda. This guide explains what they are, where they are made and which grapes go into them.",
  opening: [
    {
      heading: "What are Málaga wines?",
      body: [
        "They are the wines covered by the province's two appellations (denominaciones de origen, or DOs), which share one regulatory council. DO Málaga, recognised in 1933, protects the sweet and fortified wines that made the city famous. DO Sierras de Málaga, created in 2001, covers still wines: whites, rosés and reds. The same council also regulates DO Pasas de Málaga, for raisins.",
        "Wine has been made in Málaga since antiquity. The Phoenicians founded the city around the 8th century BC and called it Malaka, which is where our name comes from.",
      ],
    },
    {
      heading: "Are all Málaga wines sweet?",
      body: [
        "No. The sweet wines are the best known, but many small wineries now make dry wines: Moscatel de Alejandría whites in the Axarquía and Manilva, reds from Syrah, Tempranillo or Petit Verdot in the Serranía de Ronda, and rosés and light reds from Romé.",
      ],
    },
  ],
  zones: {
    heading: "What are the wine areas of Málaga?",
    body: [
      "The production zone is split into five areas with very different soils and climates: the Axarquía in the east, the Montes de Málaga around the city, the Norte zone around Antequera, Manilva on the western coast and the Serranía de Ronda in the inland west.",
    ],
  },
  grapes: {
    heading: "Which grapes are grown in Málaga?",
    body: [
      "The two main grapes of DO Málaga are white: Pedro Ximénez and Moscatel de Alejandría (Muscat of Alexandria). Moscatel Morisco (small-berried Muscat), Doradilla and Lairén are also permitted. The best-known red is Romé, which is native to the province. DO Sierras de Málaga also allows grapes such as Chardonnay, Sauvignon Blanc, Syrah, Tempranillo, Cabernet Sauvignon, Merlot and Petit Verdot.",
    ],
  },
  closing: [
    {
      heading: "How are Málaga's sweet wines made?",
      body: [
        "There are two broad families. Fortified wines (vinos de licor) have grape spirit added to stop fermentation and keep the grapes' sugar. Naturally sweet wines have no added alcohol: their sweetness comes only from very ripe or sun-dried grapes, laid out on mats or drying beds until they are almost raisins.",
        "Some traditional styles include arrope, grape must boiled down to a syrup, which gives a dark colour and caramel notes. Depending on how long the wine ages in wood, the label may say Málaga (6 to 24 months), Málaga Noble (2 to 3 years), Málaga Añejo (3 to 5 years) or Málaga Trasañejo (more than 5 years).",
      ],
    },
    {
      heading: "What is the history of Málaga wine?",
      body: [
        "Málaga's sweet wines were shipped from the city's port for centuries. In 17th- and 18th-century England they were known as “Mountain wine”.",
        "In 1878 phylloxera was found at a farm in Moclinejo, in the Axarquía. It was the first outbreak of the pest in Spain, and it devastated the province's vineyards. Recovery has been slow, and in recent decades it has been led mostly by small family wineries.",
      ],
    },
    {
      heading: "What food goes with Málaga wines?",
      body: [
        "Dry Moscatel, fresh and aromatic, suits fried fish, grilled sardines, shellfish and salads. Sweet Moscatel goes with fruit, pastries and foie gras. Dark, sweet Pedro Ximénez calls for blue cheese, nuts, chocolate or vanilla ice cream. Reds from the Serranía de Ronda go with grilled meat, stews and Ibérico ham.",
      ],
    },
    {
      heading: "Where can you buy Málaga wines?",
      body: [
        "Many small wineries sell almost everything they make in their own village, so their wines are hard to find outside the province. Malaka Wine brings them together in a subscription: each month, a box of wines from different areas, chosen to match your taste and delivered to any address in mainland Spain.",
      ],
    },
  ],
  cta: {
    title: "Taste Málaga wines at home.",
    body: "Take the two-minute taste quiz and see which box suits you.",
    button: "Find your taste",
  },
  labels: {
    breadcrumbHome: "Home",
    kind: { zone: "Wine area", grape: "Grape" },
    facts: "At a glance",
    related: "Keep reading",
    backToGuide: "Guide to Málaga wines",
    updated: "Updated",
  },
  topics: [
    {
      slug: "axarquia",
      kind: "zone",
      name: "Axarquía",
      summary: "Slate slopes above the sea, Moscatel de Alejandría and Romé.",
      title: "Wines of the Axarquía",
      metaTitle: "Axarquía Wines: Moscatel and Romé from Málaga | Malaka Wine",
      description:
        "The wines of the Axarquía, the eastern district of Málaga: dry and sweet Moscatel de Alejandría, the red Romé grape, slate slopes and hand harvests in villages such as Cómpeta and Moclinejo.",
      intro:
        "The Axarquía is the eastern district of the province of Málaga and the best-known source of its Moscatel wines. The vines grow on very steep slate slopes facing the Mediterranean and are harvested by hand.",
      facts: [
        ["Where", "East of the province of Málaga; the main town is Vélez-Málaga"],
        ["Wine villages", "Cómpeta, Sayalonga, Moclinejo, Almáchar, El Borge"],
        ["Grapes", "Moscatel de Alejandría and Romé"],
        ["Soils", "Slate, on slopes that often exceed a 30% gradient"],
        ["Wines", "Dry whites, sweet wines from sun-dried grapes, rosés and light reds"],
      ],
      sections: [
        {
          heading: "What are Axarquía wines like?",
          body: [
            "The dry whites from Moscatel de Alejandría are very aromatic, with orange blossom, citrus and fresh grape, and a saline edge. The sweet wines are made from sun-dried grapes and taste of raisins, honey and candied fruit. Romé, the native red grape, is made into rosés and light reds.",
          ],
        },
        {
          heading: "Why are the grapes picked by hand?",
          body: [
            "The slopes are too steep for machines. Crates of grapes are carried out of the vineyard on people's shoulders or by mule, as they always have been. Part of the crop is laid in the sun on paseros, sloping drying beds where the grapes turn into raisins. The FAO recognises this raisin-growing system as a Globally Important Agricultural Heritage System.",
          ],
        },
        {
          heading: "What wine traditions does the Axarquía have?",
          body: [
            "Every 15 August the village of Cómpeta holds the Noche del Vino (Night of Wine), one of the best-known wine festivals in the province. Moclinejo is where Spain's first phylloxera outbreak was found in 1878; it wiped out much of the district's historic vineyard.",
          ],
        },
      ],
    },
    {
      slug: "montes-de-malaga",
      kind: "zone",
      name: "Montes de Málaga",
      summary: "The hills around the city, home of sweet Pedro Ximénez.",
      title: "Wines of the Montes de Málaga",
      metaTitle: "Montes de Málaga Wines: Sweet Pedro Ximénez | Malaka Wine",
      description:
        "The Montes de Málaga, the hills around the city, were the historic heart of Málaga's sweet wine. Pedro Ximénez and Moscatel grapes, old wine-press farmhouses and slate soils.",
      intro:
        "The Montes de Málaga are the hills that ring the city to the north. They were the historic heart of Málaga wine until phylloxera arrived, and today they have a small vineyard devoted mostly to traditional sweet wines.",
      facts: [
        ["Where", "North of the city of Málaga"],
        ["Grapes", "Pedro Ximénez and Moscatel de Alejandría"],
        ["Soils", "Slate, on steep hillsides"],
        ["Wines", "Traditional sweet wines from sun-dried grapes"],
        ["To visit", "Lagar de Torrijos, a museum in the Montes de Málaga Natural Park"],
      ],
      sections: [
        {
          heading: "What wines are made in the Montes de Málaga?",
          body: [
            "Mostly sweet wines from sun-dried Pedro Ximénez and Moscatel. They range from amber to mahogany in colour, with aromas of raisin, dried fig, coffee and nuts, and they grow more complex as they age in barrel.",
          ],
        },
        {
          heading: "What is a lagar?",
          body: [
            "In Málaga, a lagar is a farmhouse with its own wine press. The hills were dotted with them when vineyards covered the slopes, and they produced the wine the English called “Mountain wine”.",
          ],
        },
        {
          heading: "What happened to the vineyards?",
          body: [
            "Phylloxera arrived in 1878 and destroyed nearly all the vines. Many slopes were abandoned, and from the 1930s they were replanted with pine trees to stop the Guadalmedina river from flooding the city. That forest is now the Montes de Málaga Natural Park.",
          ],
        },
      ],
    },
    {
      slug: "serrania-de-ronda",
      kind: "zone",
      name: "Serranía de Ronda",
      summary: "Mountain vineyards and fresh, structured reds.",
      title: "Wines of the Serranía de Ronda",
      metaTitle: "Ronda Wines: High-Altitude Reds from Málaga | Malaka Wine",
      description:
        "The wines of the Serranía de Ronda: mountain vineyards at roughly 600 to 1,000 metres, cool nights, and reds from Syrah, Tempranillo, Cabernet Sauvignon and Petit Verdot made by small wineries.",
      intro:
        "The Serranía de Ronda, in the inland west of the province, is Málaga's red wine country. Its mountain vineyards, at roughly 600 to 1,000 metres above sea level, give fresh, structured wines that are labelled under DO Sierras de Málaga.",
      facts: [
        ["Where", "West of the province, around Ronda and Arriate"],
        ["Altitude", "Roughly 600 to 1,000 metres"],
        ["Grapes", "Syrah, Tempranillo, Cabernet Sauvignon, Merlot, Petit Verdot, Pinot Noir"],
        ["Climate", "Mountain, with a wide gap between day and night temperatures"],
        ["Wines", "Mostly reds; also whites and rosés"],
      ],
      sections: [
        {
          heading: "What are Ronda wines like?",
          body: [
            "They are deeply coloured reds with ripe fruit and good acidity. Altitude stretches out the ripening season: days are warm and nights are cool, so the grapes stay fresh despite the southern latitude. Many of the wines are aged in oak.",
          ],
        },
        {
          heading: "How long has wine been made in Ronda?",
          body: [
            "Since Roman times. The city of Acinipo, whose ruins lie about twenty kilometres from Ronda, minted coins showing bunches of grapes. Phylloxera ended winegrowing here at the end of the 19th century, and the revival began in the last decades of the 20th with new wineries, almost all of them small.",
          ],
        },
        {
          heading: "Which wineries are in the Serranía de Ronda?",
          body: [
            "More than twenty wineries now work in the area, most of them family-run with limited production. Many grow their own grapes and sell much of their wine at the cellar door.",
          ],
        },
      ],
    },
    {
      slug: "norte-de-malaga",
      kind: "zone",
      name: "Norte de Málaga",
      summary: "The plains of Antequera and Mollina, Pedro Ximénez country.",
      title: "Wines of the Norte de Málaga",
      metaTitle: "Norte de Málaga Wines: Mollina and Antequera | Malaka Wine",
      description:
        "The Norte wine zone of Málaga, around Antequera: plains at about 500 metres, a continental climate, and Pedro Ximénez and Doradilla grapes in villages such as Mollina, Humilladero and Fuente de Piedra.",
      intro:
        "The Norte (northern) zone covers the plains around Antequera, on the border with the provinces of Córdoba and Seville. It has one of the largest vineyard areas in the province and is the home of Málaga's Pedro Ximénez.",
      facts: [
        ["Where", "The Antequera district, in the north of the province"],
        ["Wine villages", "Mollina, Humilladero, Fuente de Piedra, Antequera"],
        ["Altitude", "About 500 metres"],
        ["Grapes", "Pedro Ximénez, Doradilla and Lairén"],
        ["Wines", "Sweet and fortified wines, whites, rosés and young reds"],
      ],
      sections: [
        {
          heading: "What are the wines of the Norte zone like?",
          body: [
            "Many of DO Málaga's sweet and fortified Pedro Ximénez wines come from here, along with dry whites and a growing number of rosés and young reds under DO Sierras de Málaga.",
          ],
        },
        {
          heading: "How is it different from the rest of the province?",
          body: [
            "The landscape is a gentle plateau, not a hillside. The climate is continental, with cold winters and very hot, dry summers, and the soils are limestone. The vineyards can be worked by machine, which is impossible in the Axarquía.",
          ],
        },
        {
          heading: "Are there any wine festivals?",
          body: ["Mollina holds its Feria de la Vendimia (harvest fair) every September."],
        },
      ],
    },
    {
      slug: "manilva",
      kind: "zone",
      name: "Manilva",
      summary: "Moscatel on white soils facing the Strait of Gibraltar.",
      title: "Wines of Manilva",
      metaTitle: "Manilva Wines: Moscatel from the Costa del Sol | Malaka Wine",
      description:
        "Manilva, on Málaga's western coast, grows Moscatel de Alejandría on white limestone soils within sight of the sea. Dry and sweet whites with a maritime character.",
      intro:
        "Manilva is Málaga's westernmost wine area, at the far end of the Costa del Sol and next to the province of Cádiz. Its Moscatel de Alejandría vines grow on white limestone soils within sight of the sea.",
      facts: [
        ["Where", "Western coast of Málaga, next to Cádiz"],
        ["Grape", "Moscatel de Alejandría"],
        ["Soils", "Albariza: white, chalky soils that hold moisture"],
        ["Climate", "Maritime, with easterly and westerly winds"],
        ["Wines", "Dry and sweet Moscatel whites"],
      ],
      sections: [
        {
          heading: "What are Manilva wines like?",
          body: [
            "Dry, floral, saline Moscatel, and sweet wines from sun-dried grapes. The nearby sea and the albariza soils, similar to those of the neighbouring Sherry region, keep them fresh.",
          ],
        },
        {
          heading: "What is Manilva's grape-growing tradition?",
          body: [
            "Manilva's Moscatel has traditionally been grown as a table grape and for raisins as well as for wine. The town holds its Fiesta de la Vendimia (harvest festival) on the first weekend of September.",
          ],
        },
      ],
    },
    {
      slug: "moscatel-de-alejandria",
      kind: "grape",
      name: "Moscatel de Alejandría",
      summary: "The aromatic white grape of the Axarquía and Manilva.",
      title: "Moscatel de Alejandría, Málaga's aromatic grape",
      metaTitle: "Moscatel de Alejandría: The Grape Behind Málaga Moscatel | Malaka Wine",
      description:
        "Moscatel de Alejandría (Muscat of Alexandria) is the aromatic white grape behind Málaga's Moscatel wines. It grows in the Axarquía and Manilva and gives dry whites, sweet wines and raisins.",
      intro:
        "Moscatel de Alejandría, known in English as Muscat of Alexandria, is a very old and very aromatic white grape, and one of the two main varieties of DO Málaga. In the province it is grown mostly in the Axarquía and Manilva.",
      facts: [
        ["Type", "Aromatic white grape with large berries"],
        ["Areas", "Axarquía and Manilva"],
        ["Aromas", "Orange blossom, jasmine, citrus, fresh grape"],
        ["Wines", "Dry whites, naturally sweet wines and fortified wines"],
        ["Other uses", "Table grapes and Málaga raisins"],
      ],
      sections: [
        {
          heading: "What does Moscatel de Alejandría taste like?",
          body: [
            "Dry, it is a light and very perfumed white: orange blossom, jasmine, lemon peel and the grape itself. Sweet, made from sun-dried grapes, it shows raisin, honey, dried apricot and candied orange.",
          ],
        },
        {
          heading: "Is Moscatel always a sweet wine?",
          body: [
            "No. Moscatel is a grape, not a style. It was traditionally used for sweet wines, but Málaga wineries have been making dry Moscatel for years, and it has become one of the province's most recognisable whites.",
          ],
        },
        {
          heading: "What do you drink it with?",
          body: [
            "Dry and well chilled, with fried fish, shellfish, salads and Asian food. Sweet, with fruit, pastries, foie gras or creamy cheeses.",
          ],
        },
      ],
    },
    {
      slug: "pedro-ximenez",
      kind: "grape",
      name: "Pedro Ximénez",
      summary: "The grape of the traditional dark sweet wines.",
      title: "Pedro Ximénez in Málaga",
      metaTitle: "Pedro Ximénez from Málaga: The Sweet Wine Grape | Malaka Wine",
      description:
        "Pedro Ximénez, called Pero Ximén in Málaga, is the grape of DO Málaga's traditional sweet wines. It grows in the Norte zone and the Montes and is dried in the sun to concentrate its sugar.",
      intro:
        "Pedro Ximénez is a thin-skinned white grape that is high in sugar, and the historic variety of Málaga's sweet wines. Locally it is also called Pero Ximén. It is grown mostly in the Norte zone and the Montes de Málaga.",
      facts: [
        ["Type", "Thin-skinned white grape, high in sugar"],
        ["Local name", "Pero Ximén"],
        ["Areas", "Norte de Málaga and Montes de Málaga"],
        ["Aromas (sweet)", "Raisin, dried fig, date, coffee, caramel"],
        ["Wines", "Sweet and fortified wines, aged or unaged; also dry whites"],
      ],
      sections: [
        {
          heading: "How is sweet Pedro Ximénez made?",
          body: [
            "After the harvest, the bunches are spread out in the sun for several days. The grapes lose water and concentrate their sugar until they are almost raisins. Pressing them gives a very dense must that barely ferments. The wine may then age for years in oak casks, where it darkens and gains complexity.",
          ],
        },
        {
          heading: "How does it differ from Pedro Ximénez from elsewhere?",
          body: [
            "The same grape is grown in Montilla-Moriles, in the province of Córdoba, and is used in Sherry. In Málaga it is labelled under DO Málaga with the appellation's own ageing terms: Noble, Añejo and Trasañejo.",
          ],
        },
        {
          heading: "What do you drink it with?",
          body: [
            "With blue cheese, nuts, dark chocolate, or poured over vanilla ice cream. Serve it cool, not ice-cold, in a small glass.",
          ],
        },
      ],
    },
    {
      slug: "rome",
      kind: "grape",
      name: "Romé",
      summary: "The native red grape that almost disappeared.",
      title: "Romé, Málaga's native red grape",
      metaTitle: "Romé Grape: Málaga's Native Red Variety | Malaka Wine",
      description:
        "Romé is the native red grape of Málaga. Few vines remain, nearly all in the Axarquía, and it is made into light, fruity rosés and reds under DO Sierras de Málaga.",
      intro:
        "Romé is the native red grape of Málaga. It came close to disappearing, and few vines remain today, nearly all of them in the Axarquía. It gives pale, light and fruity wines.",
      facts: [
        ["Type", "Native red grape with little colour"],
        ["Area", "Axarquía"],
        ["Aromas", "Fresh red fruit, flowers, wild herbs"],
        ["Wines", "Rosés, light reds and the occasional white made from red grapes"],
        ["Appellation", "Permitted in DO Sierras de Málaga"],
      ],
      sections: [
        {
          heading: "What are Romé wines like?",
          body: [
            "The skins have little colour, so the grape naturally gives pale rosés and light-coloured reds with a light body and good acidity. They recall strawberry, pomegranate and Mediterranean herbs, and are best served cool.",
          ],
        },
        {
          heading: "Why is it so little known?",
          body: [
            "After phylloxera, the Axarquía was replanted mostly with Moscatel, which paid better for raisins and sweet wine. Romé survived mixed into old vineyards, and only in recent years have a few small wineries begun to make wine from it on its own.",
          ],
        },
        {
          heading: "What do you drink it with?",
          body: ["With rice dishes, grilled vegetables, mild cured meats and oily fish. A red Romé can be served lightly chilled."],
        },
      ],
    },
  ],
};

const GUIDES: Record<Lang, Guide> = { es, en };

export const getGuide = (lang: Lang) => GUIDES[lang];
export const TOPIC_SLUGS = es.topics.map((topic) => topic.slug);
