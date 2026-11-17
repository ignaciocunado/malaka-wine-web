import type { Dictionary } from "./es";

/** The English text of the site, key for key the same as `es.ts`. */
export const en: Dictionary = {
  meta: {
    home: {
      title: "Málaga Wine Subscription · Spanish Wine Club | Malaka Wine",
      description:
        "A Málaga wine subscription: every two months, a box of wines from small family wineries in the Axarquía, Ronda and the Montes de Málaga, chosen to match your taste. Free delivery across mainland Spain.",
      keywords: [
        "Málaga wines",
        "Malaga wine",
        "wine subscription",
        "wine subscription Spain",
        "Spanish wine club",
        "wine box every two months",
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
    guide: "Málaga wines",
    register: "Register interest",
    switchLabel: "ES",
    switchTitle: "Leer esta página en español",
  },

  footer: {
    legal: "Malaka only sells alcoholic drinks to people aged 18 or over. Please drink responsibly.",
    sample: "The wineries, prices and boxes shown on this site are sample content.",
    made: "Made in Málaga.",
    credit: "3D relief: open elevation data from Mapzen Terrain Tiles.",
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
      eyebrow: "The largest Málaga wine community",
      title: "Málaga in your glass, every two months.",
      body: "A community that backs Málaga wines. Get a box of wines from the province's best small wineries, chosen to match your taste.",
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
        { title: "We choose your wines", body: "Bottles picked from the new releases across the province." },
        { title: "Tell us what you thought", body: "A few words on each bottle once you've opened it." },
        { title: "Your next box fits better", body: "We update your profile with every answer, so every box is a closer match." },
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
      title: "Choose your Málaga wine box.",
      body: "Free delivery across mainland Spain. Change plan or cancel whenever you like.",
      featured: "Most popular",
      perShipment: "/ every two months",
      choose: (plan: string) => `Choose ${plan}`,
    },
    faq: {
      title: "Questions? Answers.",
      questions: [
        {
          q: "What is Malaka Wine?",
          a: "Malaka Wine is a Málaga wine subscription: every two months you receive a box of two or three bottles from small wineries in the province, chosen to match your taste and sent with tasting notes.",
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
          a: "Your taste profile sets the styles, body and budget. Each time we match it against our wineries' new releases, and we include tasting notes so you know what you're opening. After each box you can tell us what you thought, and we adjust your profile.",
        },
        {
          q: "When does my box arrive?",
          a: "Boxes ship every two months, in the first week of the month, to any address in mainland Spain.",
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
      box: { title: "Your box", subtitle: "How much and anything we should know." },
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
    frequency: "Every 2 months",
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
      perShipment: "/ every two months",
      demo: "This is a demo: subscriptions will open very soon.",
      allPlans: "See all plans",
      editAnswers: "Edit my answers",
    },
  },
};
