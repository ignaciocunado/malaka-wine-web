import type { Dictionary } from "./es";

/** The English text of the site, key for key the same as `es.ts`. */
export const en: Dictionary = {
  meta: {
    home: {
      title: "Málaga Wine Subscription · Spanish Wine Club | Malaka Wine",
      description:
        "The largest Málaga wine community: three boxes a year of wines from small wineries in the Axarquía, Ronda and the Montes de Málaga, chosen to match your taste.",
      keywords: [
        "Málaga wines",
        "Malaga wine",
        "wine subscription",
        "wine subscription Spain",
        "annual wine subscription",
        "Spanish wine club",
        "wine box subscription",
        "buy Málaga wine online",
        "Moscatel wine Málaga",
        "Ronda wines",
        "Axarquía wines",
        "Málaga wine gift",
      ],
    },
    interest: {
      title: "Register Your Interest | Malaka Wine",
      description:
        "Leave your email and we'll let you know when Malaka Wine opens: a subscription of wines from small wineries in Málaga.",
    },
    privacy: {
      title: "Privacy Policy | Malaka Wine",
      description:
        "What personal data Malaka Wine collects when you register your interest, what it is used for and how to exercise your rights.",
    },
    about: {
      title: "About Us: Antonio Cuñado Bernal | Malaka Wine",
      description:
        "Malaka Wine's founder, Antonio Cuñado Bernal, has spent 20+ years in Málaga tourism, from the Caminito del Rey to the Gran Senda, and knows its small producers.",
    },
    notFound: { title: "Page not found | Malaka Wine" },
  },

  nav: {
    home: "Malaka Wine, home",
    howItWorks: "How it works",
    plans: "Plans",
    guide: "Málaga wines",
    about: "About us",
    register: "Register interest",
    switchLabel: "ES",
    switchTitle: "Leer esta página en español",
    otherLanguage: "Español",
    label: "Main",
    menu: "Menu",
  },

  footer: {
    legal: "Malaka only sells alcoholic drinks to people aged 18 or over. Please drink responsibly.",
    made: "Made in Málaga.",
    credit: "3D relief: open elevation data from Mapzen Terrain Tiles.",
    plans: "Plans",
    register: "Register your interest",
    about: "About us",
    privacy: "Privacy",
    linkedin: "LinkedIn",
    email: (address: string) => `Email us at ${address}`,
    otherLanguage: "Español",
  },

  ageGate: {
    title: "Are you 18 or over?",
    body: "Malaka sells alcoholic drinks and can only show you the site if you are of legal drinking age.",
    yes: "Yes, I'm 18 or over",
    no: "No, I'm under 18",
    deniedTitle: "Sorry",
    deniedBody: "Malaka only sells alcoholic drinks to people aged 18 or over, so you can't enter the site.",
    back: "Go back",
  },

  notFound: {
    eyebrow: "Error 404",
    title: "We can't find this page.",
    body: "The link may be wrong, or the page may no longer exist.",
    cta: "Back to the homepage",
  },

  home: {
    hero: {
      eyebrow: "Málaga wine subscription",
      title: "Málaga wines, your way.",
      body: "The largest Málaga wine community. Three boxes a year of wines from the province's best small wineries, chosen to match your taste.",
      cta: "Register your interest",
      plans: "See the plans",
      scroll: "Scroll to walk down to the lagar",
      scene:
        "A 3D model of Málaga at dusk seen from a vineyard in the Montes: rows of vines either side of a track that leads down to a lit lagar, with Gibralfaro, the cathedral, the bay and Sierra de Mijas beyond.",
    },
    how: {
      eyebrow: "How it works",
      title: "Every box teaches us your taste.",
      body: "It starts with a two-minute taste test. After each box you tell us what you thought, and the next one gets closer.",
      steps: [
        { title: "Tell us what you like", body: "Two minutes on styles, body and budget." },
        { title: "We choose your wines", body: "Bottles picked from the latest releases across the province." },
        { title: "Tell us what you thought", body: "A few words on each bottle once you've opened it." },
        { title: "Your next box fits better", body: "We update your profile with every answer, so each box is a closer match." },
      ],
      cta: "Register and we'll tell you when we open",
      scene: "Inside the lagar: a 3D model of a solera cellar, with whitewashed arches, lanterns and barrels stacked three high.",
    },
    profile: {
      title: "Your taste profile, box by box.",
      body: "The taste test gives us a wide range to pick from. Every answer narrows it, so the bottles we send sit closer to what you like.",
      stages: [
        { title: "After the taste test", body: "We know the styles you asked for, so we start wide." },
        { title: "After your first box", body: "What you thought of each bottle moves the range and tightens it." },
        { title: "After a few boxes", body: "We pick from a narrow band that is yours alone." },
      ],
      note: "An illustration of the idea, not a real profile.",
    },
    plans: {
      eyebrow: "Plans",
      title: "Choose your annual Málaga wine plan.",
      body: "Three boxes a year, one every four months. Your plan renews every year, and you can cancel the renewal whenever you like.",
      featured: "Most popular",
      period: "/ every 4 months",
      billing: (total: string) => `${total} a year, in a single payment`,
      choose: (plan: string) => `Choose ${plan}`,
    },
    faq: {
      title: "Questions? Answers.",
      questions: [
        {
          q: "What is Malaka Wine?",
          a: [
            "Malaka Wine sets out to transform the way people discover and enjoy Málaga wine, turning exclusive products from small producers into personalised experiences. The goal is to create an \"intelligent\" gourmet club: a way of combining tradition with new artificial intelligence technology, so that every customer receives only the wines they like.",
            "With it we want to build the largest community of Málaga wine lovers and help Málaga's producers make a living from their passion without having to leave their land. In this way we help keep people in the countryside, fight climate change, and make our province a more sustainable place.",
            "The project combines gastronomy, technology, exclusivity and territory in a subscription model designed to start with a small, controlled validation in Málaga.",
            "The subscriber receives three boxes a year at home, one every four months, each with two or three bottles from wineries in the province, the vast majority of them small businesses, chosen to match your taste and sent with tasting notes.",
          ],
        },
        {
          q: "Which wineries do we mean?",
          a: [
            "Malaka Wine covers wineries across the whole province of Málaga, many of them family-run. These wineries make small batches that are hard to find on the market.",
            "The province has more than 300 wines, of which only about thirty can be found on the market with any ease, made by around 53 wineries. Of these, 46 are registered in the Málaga and Sierras de Málaga designations of origin (spread across about 24 municipalities), and the rest are wines without a Designation of Origin (DO): small or niche projects, or wineries not entered in the DO register.",
          ],
        },
        {
          q: "What kinds of Málaga wine can I receive?",
          a: [
            "Those made in the province, above all the ones within the Málaga or Sierras de Málaga Protected Designation of Origin (PDO), which number over a hundred.",
            "The **Málaga PDO** dates from 1933 and is one of the oldest in Spain. It has traditionally specialised in **sweet, liqueur and fortified wines** made mainly from Pedro Ximénez and Moscatel de Alejandría grapes. Other complementary white varieties exist too, such as Doradilla and Lairén, as well as Romé, a very rare native variety that adds colour and structure. Its production area covers 67 municipalities spread over five geographical areas: Axarquía, Montes de Málaga, Norte, Manilva and Serranía de Ronda.",
            "The **Sierras de Málaga PDO**, for its part, was created in 2001 to protect **still wines** (whites, rosés and dry reds, plus some sweet reds) that are neither fortified nor traditional sweet wines. Its production area extends across the whole province of Málaga, divided into seven geographical units (Axarquía, Costa Occidental, Manilva, Montes de Málaga, Norte de Málaga, Serranía de Ronda and Sierra de las Nieves). A range of grape varieties are used here to make wine, such as:",
            {
              list: [
                "**White varieties.** Local grapes are used (Pedro Ximénez, Moscatel de Alejandría, Moscatel Morisco, Doradilla, Lairén, Vijariego Blanco, Montúa, Perruno and Pardina). Spanish and international varieties are also grown, such as Chardonnay, Sauvignon Blanc, Verdejo, Viognier, Riesling, Gewürztraminer, Macabeo, Colombard, Garnacha Blanca, Malvasía Aromática and Vermentino.",
                "**Red varieties.** The native Romé grape stands out, along with varieties historically recovered in the area such as Melonera or Tintilla de Rota. The most widespread varieties for aged reds (especially in the Serranía de Ronda) are Syrah, Cabernet Sauvignon, Merlot, Petit Verdot, Tempranillo, Garnacha, Cabernet Franc, Pinot Noir, Graciano, Malbec, Monastrell, Jaén Tinto and Blauer Limberger.",
              ],
            },
            "As you can see, not all Málaga wine is sweet. But that's not all. We will also include wines from producers who are not yet within the PDO because they don't yet meet all the requirements a designation of origin demands, which takes nothing away from their quality, variety or finesse (sparkling wines, vermouths, and so on). In our project you choose the wine you like best after a \"virtual tasting\", and our \"digital sommelier\" will start to make recommendations. The more you drink and the longer you are part of the Club, the better we will know your tastes and the better we can meet your interests.",
          ],
        },
        {
          q: "How are the wines in my box chosen?",
          a: [
            "Your taste profile sets the styles, body and budget. For each box we match it against our wineries' new releases and include tasting notes so you know what you're opening. After each box you can tell us what you thought, and we adjust your profile.",
          ],
        },
        {
          q: "When does my box arrive?",
          a: [
            "You get three boxes a year. They ship in the first week, every four months, to any address in mainland Spain.",
          ],
        },
        {
          q: "What other benefits do I get from being part of the Club?",
          a: [
            "Besides the subscription, the Club includes cross-selling of products, limited editions, and exclusive experiences and events for members, such as tastings or winery visits.",
          ],
        },
        {
          q: "How do I pay?",
          a: [
            "In a single payment a year that covers all three boxes. Each plan shows the price per box and the total for the year.",
          ],
        },
        {
          q: "Can I change plan or cancel?",
          a: [
            "Yes. Your plan renews every year, and you can cancel the renewal whenever you like from your account. The boxes you've already paid for keep arriving until the year is up. If you change plan, the new one starts at your next renewal.",
          ],
        },
        {
          q: "Is there a minimum age to subscribe?",
          a: [
            "Yes. We only sell wine to people aged 18 or over, and an adult must receive the delivery.",
          ],
        },
      ],
    },
  },

  interest: {
    eyebrow: "Coming soon",
    title: "Register your interest.",
    body: "Malaka Wine isn't open yet. Leave your email and we'll write to you when you can order your first box.",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    consent: "I'm 18 or over and I agree to Malaka Wine emailing me about its launch, as set out in the ",
    consentLink: "privacy policy",
    consentEnd: ".",
    submit: "Register",
    sending: "Sending…",
    note: "We'll only write to you about the launch. You can be removed at any time.",
    errors: {
      email: "Enter a valid email address.",
      consent: "Tick the box to register.",
      send: "We couldn't register you. Please try again in a moment.",
    },
    success: {
      title: "You're on the list.",
      body: "We'll write to you as soon as we open. Until then, get to know the province's wines.",
      guide: "Read the guide to Málaga wines",
      home: "Back to the homepage",
    },
  },

  about: {
    eyebrow: "About us",
    title: "We know the people who make the wine.",
    intro:
      "Malaka Wine was started by Antonio Cuñado Bernal, who has worked in tourism in Málaga for more than twenty years and knows small producers all over the province.",
    founder: {
      role: "Founder",
      body: [
        "Antonio has been in charge of projects such as the Caminito del Rey, the Gran Senda de Málaga, the Senda Litoral, Málaga Destino and Málaga No Caduca.",
        "Between them, these projects cover the province from end to end. Along the way Antonio has got to know winemakers and small producers in every part of it.",
      ],
      linkedIn: "Antonio on LinkedIn",
    },
    projects: {
      title: "Some of Antonio's projects",
      items: [
        ["Caminito del Rey", "The walkway through the Desfiladero de los Gaitanes gorge, reopened in 2015."],
        ["Gran Senda de Málaga", "The GR 249 long-distance trail, which loops around the province."],
        ["Senda Litoral", "The project to walk the province's whole coastline, from Nerja to Manilva."],
        ["Málaga Destino", "Discounts for shopping at local shops and businesses across the province."],
        ["Málaga No Caduca", "The province's initiative against food waste."],
      ],
    },
    why: {
      title: "Why Malaka Wine",
      body: [
        "Many of Málaga's wineries make very good wine in batches so small that it hardly leaves the village, let alone reaches the shops. We want to bring those wines to your door, and help the people who make them earn a living without leaving their land.",
        "Because we know the people behind them, we can choose bottles you wouldn't find on your own and tell you where each one comes from.",
      ],
    },
    name: {
      title: "Where the name comes from",
      inscription: "Malaka, written in the Phoenician alphabet",
      caption: "It reads from right to left: mem, lamedh, kaph and aleph.",
      body: [
        "Phoenicians from Tyre founded the city around the 8th century BC and named it Malaka. To the Romans it was Malaca and in Arabic Mālaqa, which gave us Málaga. We took the oldest.",
        // m‑l‑k is written with non-breaking hyphens (U+2011) so the root never splits across lines.
        "Phoenician wrote only the consonants, so Malaka takes just four letters. Nobody knows for certain what it meant; the most widely accepted explanation links it to the Semitic root m‑l‑k, “to reign”.",
        "Centuries later the city minted coins with the same name in Neo-Punic letters, a later form of the same alphabet.",
      ],
    },
    cta: {
      title: "Want to try these wines?",
      body: "Malaka Wine opens soon. Leave your email and we'll let you know when you can order your first box.",
      button: "Register your interest",
    },
  },

  taste: {
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
      value: "Every 4 months, 3 boxes a year",
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
  },
};
