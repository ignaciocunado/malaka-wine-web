import type { Dictionary } from "./es";

/** The English text of the site, key for key the same as `es.ts`. */
export const en: Dictionary = {
  meta: {
    home: {
      title: "Málaga Wine Subscription · Spanish Wine Club | Malaka Wine",
      description:
        "A monthly Málaga wine subscription: a box of wines from small family wineries in the Axarquía, Ronda and the Montes de Málaga, chosen to match your taste. Free delivery across mainland Spain.",
      keywords: [
        "Málaga wines",
        "Malaga wine",
        "wine subscription",
        "wine subscription Spain",
        "Spanish wine club",
        "monthly wine box",
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
    notFound: { title: "Page not found | Malaka Wine" },
  },

  nav: {
    home: "Malaka, home",
    howItWorks: "How it works",
    plans: "Plans",
    producers: "Wineries",
    guide: "Málaga wines",
    register: "Register interest",
    switchLabel: "ES",
    switchTitle: "Leer esta página en español",
  },

  footer: {
    legal: "Malaka only sells alcoholic drinks to people aged 18 or over. Please drink responsibly.",
    sample: "The wineries, prices and boxes shown on this site are sample content.",
    made: "Made in Málaga.",
    plans: "Plans",
    register: "Register your interest",
    privacy: "Privacy",
    guide: "Guide to Málaga wines",
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
      title: "Málaga in your glass, every month.",
      body: "A box of wines from the province's best small wineries, chosen to match your taste.",
      cta: "Register your interest",
      plans: "See the plans",
      bottles: "Three bottles of Málaga wine on the tablecloth",
    },
    why: {
      title: "The taste of the land.",
      titleMuted: "Straight from the people who make it.",
      features: [
        {
          title: "Small wineries only",
          body: "Family wineries that make a few thousand bottles a year. Most of them never reach a supermarket shelf.",
        },
        {
          title: "Chosen for you",
          body: "Tell us what you like and we'll pick every box to fit your profile: styles, body and budget.",
        },
        {
          title: "At your door every month",
          body: "Your box ships in the first week of each month. Change plan or cancel whenever you like.",
        },
      ],
    },
    how: {
      eyebrow: "How it works",
      title: "Three steps to your first box.",
      steps: [
        { title: "Tell us what you like", body: "Two minutes on styles, body and budget." },
        { title: "We choose your wines", body: "Bottles picked from the month's new releases across the province." },
        { title: "Open a little piece of Málaga", body: "With tasting notes, food pairings and the story of each winery." },
      ],
      cta: "Register and we'll tell you when we open",
    },
    regions: {
      eyebrow: "From the vineyard to your table",
      title: "Four corners of one province.",
      more: "About this area",
      bottles: (region: string, wines: string) => `Bottles from ${region}: ${wines}`,
    },
    plans: {
      eyebrow: "Plans",
      title: "Choose your Málaga wine box.",
      body: "Free delivery across mainland Spain. Change plan or cancel whenever you like.",
      featured: "Most popular",
      perMonth: "/ month",
      choose: (plan: string) => `Choose ${plan}`,
    },
    producers: {
      eyebrow: "Who makes it",
      title: "This season's wineries.",
    },
    guide: {
      eyebrow: "Guide",
      title: "What wines are made in Málaga?",
      body: "Sweet Moscatel and Pedro Ximénez wines with centuries of history, dry whites from the Axarquía and high-altitude reds from the Serranía de Ronda. We explain them area by area and grape by grape.",
      cta: "Read the guide to Málaga wines",
    },
    faq: {
      title: "Questions? Answers.",
      questions: [
        {
          q: "What is Malaka Wine?",
          a: "Malaka Wine is a Málaga wine subscription: every month you receive a box of two or three bottles from small wineries in the province, chosen to match your taste and sent with tasting notes.",
        },
        {
          q: "Who are the wineries?",
          a: "Family wineries from all over the province of Málaga (Axarquía, Montes de Málaga, Serranía de Ronda, the western coast and the north) that make small batches which are hard to find outside their own village.",
        },
        {
          q: "What kinds of Málaga wine can I get?",
          a: "Dry and sweet whites from Moscatel de Alejandría, traditional sweet Pedro Ximénez, rosés and light reds from the Romé grape, and high-altitude reds from the Serranía de Ronda. Not all Málaga wine is sweet: you choose the styles.",
        },
        {
          q: "How do you choose the wines in my box?",
          a: "Your taste profile sets the styles, body and budget. Each month we match it against our wineries' new releases, and we include tasting notes so you know what you're opening.",
        },
        {
          q: "When does my box arrive?",
          a: "Boxes ship in the first week of each month (or every two months, if you prefer) to any address in mainland Spain.",
        },
        {
          q: "Can I change plan or cancel?",
          a: "Yes. Change plan or cancel whenever you like from your account. There is no minimum term.",
        },
        {
          q: "Is there a minimum age?",
          a: "Yes. We only sell wine to people aged 18 or over, and an adult must receive the delivery.",
        },
      ],
    },
    closing: {
      title: "We open very soon.",
      body: "Leave your email and you'll be among the first to know when the first box ships.",
      cta: "Register your interest",
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
      title: "How often?",
      label: "Delivery frequency",
      options: { MONTHLY: "Every month", BIMONTHLY: "Every 2 months" },
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
      perMonth: "/ month",
      demo: "This is a demo: subscriptions will open very soon.",
      allPlans: "See all plans",
      editAnswers: "Edit my answers",
    },
  },
};
