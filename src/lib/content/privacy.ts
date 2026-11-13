import { CONTROLLER, SITE_NAME, SITE_URL, type Lang } from "@/lib/site";

/** One block of a section: a paragraph, or a bulleted list when it is an array. */
type Block = string | string[];
export type PrivacySection = { heading: string; body: Block[] };
export type PrivacyPolicy = { title: string; intro: string; updated: string; sections: PrivacySection[] };

const { name, taxId, address, email } = CONTROLLER;
const site = SITE_URL.replace("https://", "");

/**
 * The privacy policy in both languages. It describes what the site does today: the only personal data it asks for
 * is the email address in the "register your interest" form, which is saved in a Google Sheet. Update it (and
 * `PRIVACY_UPDATED` in `src/lib/site.ts`) whenever the site starts collecting anything else, such as analytics,
 * accounts or payments.
 */
const POLICIES: Record<Lang, PrivacyPolicy> = {
  es: {
    title: "Política de privacidad",
    intro: `Esta política explica qué datos personales recoge ${SITE_NAME} en ${site}, para qué los usa y qué derechos tienes, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley Orgánica 3/2018 (LOPDGDD).`,
    updated: "Última actualización:",
    sections: [
      {
        heading: "Quién es el responsable de tus datos",
        body: [[`Responsable: ${name}`, `NIF: ${taxId}`, `Dirección: ${address}`, `Email de contacto: ${email}`]],
      },
      {
        heading: "Qué datos recogemos",
        body: [
          "Cuando te apuntas a la lista de interesados guardamos:",
          [
            "Tu dirección de email.",
            "El idioma en el que has visitado la web y, si elegiste uno, el plan que te interesa.",
            "La fecha y la hora en que te apuntaste y la versión de esta política que aceptaste, como prueba de tu consentimiento.",
          ],
          "No te pedimos ningún otro dato y no creamos perfiles ni tomamos decisiones automatizadas sobre ti.",
        ],
      },
      {
        heading: "Para qué los usamos y con qué base legal",
        body: [
          `Usamos tu email únicamente para avisarte de la apertura de ${SITE_NAME} y enviarte información sobre su lanzamiento.`,
          "La base legal es tu consentimiento (artículo 6.1.a del RGPD y artículo 21 de la Ley 34/2002, LSSI), que das al marcar la casilla del formulario. No estás obligado a darlo y puedes retirarlo en cualquier momento, sin que eso afecte a lo que hayamos hecho antes.",
        ],
      },
      {
        heading: "Cuánto tiempo los conservamos",
        body: [
          "Conservamos tu email hasta que retires tu consentimiento o pidas que lo borremos. En cualquier caso, lo eliminaremos como máximo 12 meses después del lanzamiento o, si el servicio no llegara a abrir, 24 meses después de que te apuntaras.",
        ],
      },
      {
        heading: "Quién más accede a tus datos",
        body: [
          "No vendemos ni cedemos tus datos a terceros. Solo acceden a ellos los proveedores que nos prestan servicio, como encargados del tratamiento:",
          [
            "Google Ireland Limited (Google Sheets y Google Drive), donde se guarda la lista de emails.",
            "Cloudflare, Inc., que aloja la web y, para servirla y protegerla, procesa datos técnicos de la conexión como la dirección IP. La base legal de este tratamiento es nuestro interés legítimo en que la web funcione de forma segura (artículo 6.1.f del RGPD).",
          ],
          "Estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, en particular en Estados Unidos. Esas transferencias se hacen con las garantías que prevé el RGPD: el Marco de Privacidad de Datos UE-EE. UU. y las cláusulas contractuales tipo de la Comisión Europea.",
          "También comunicaremos tus datos a las autoridades cuando una ley nos obligue.",
        ],
      },
      {
        heading: "Tus derechos",
        body: [
          "Puedes ejercer estos derechos en cualquier momento:",
          [
            "Acceder a tus datos y obtener una copia.",
            "Rectificarlos si son incorrectos.",
            "Pedir que los suprimamos.",
            "Pedir que limitemos su tratamiento u oponerte a él.",
            "Recibirlos en un formato estructurado (portabilidad).",
            "Retirar tu consentimiento y dejar de recibir nuestros emails.",
          ],
          `Para ello, escríbenos a ${email} desde la dirección con la que te apuntaste. Te responderemos en el plazo máximo de un mes. Todos los emails que te enviemos indicarán también cómo darte de baja.`,
          "Si crees que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).",
        ],
      },
      {
        heading: "Menores de edad",
        body: [
          `${SITE_NAME} vende bebidas alcohólicas y se dirige solo a mayores de 18 años. No recogemos a sabiendas datos de menores; si descubrimos que lo hemos hecho, los borraremos.`,
        ],
      },
      {
        heading: "Cookies y almacenamiento en tu dispositivo",
        body: [
          "Esta web no usa cookies ni herramientas de analítica o publicidad. Solo guarda en tu navegador un dato técnico que recuerda que has confirmado ser mayor de edad, para no preguntártelo en cada visita. Ese dato no sale de tu dispositivo y es necesario para el funcionamiento de la web.",
        ],
      },
      {
        heading: "Seguridad",
        body: [
          "La web y el formulario funcionan siempre con conexión cifrada (HTTPS), y solo las personas responsables de Malaka Wine tienen acceso a la lista de emails.",
        ],
      },
      {
        heading: "Cambios en esta política",
        body: [
          "Si cambiamos la forma en que tratamos tus datos, actualizaremos esta página y la fecha que aparece al principio. Si el cambio afecta a los datos que ya tenemos, te avisaremos por email.",
        ],
      },
    ],
  },
  en: {
    title: "Privacy policy",
    intro: `This policy explains what personal data ${SITE_NAME} collects on ${site}, what it is used for and what rights you have, under Regulation (EU) 2016/679 (GDPR) and Spain's Organic Law 3/2018 (LOPDGDD).`,
    updated: "Last updated:",
    sections: [
      {
        heading: "Who is responsible for your data",
        body: [[`Data controller: ${name}`, `Tax ID (NIF): ${taxId}`, `Address: ${address}`, `Contact email: ${email}`]],
      },
      {
        heading: "What data we collect",
        body: [
          "When you register your interest we store:",
          [
            "Your email address.",
            "The language you visited the site in and, if you picked one, the plan you are interested in.",
            "The date and time you registered and the version of this policy you agreed to, as a record of your consent.",
          ],
          "We don't ask for anything else, and we don't build profiles or make automated decisions about you.",
        ],
      },
      {
        heading: "What we use it for and on what legal basis",
        body: [
          `We use your email address only to tell you when ${SITE_NAME} opens and to send you information about its launch.`,
          "The legal basis is your consent (Article 6(1)(a) GDPR and Article 21 of Spain's Law 34/2002, LSSI), which you give by ticking the box on the form. You don't have to give it, and you can withdraw it at any time; that doesn't affect anything we did before.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "We keep your email address until you withdraw your consent or ask us to delete it. In any case we will delete it no later than 12 months after the launch or, if the service never opens, 24 months after you registered.",
        ],
      },
      {
        heading: "Who else has access to your data",
        body: [
          "We don't sell your data or share it with third parties. The only others with access are the providers that work for us as data processors:",
          [
            "Google Ireland Limited (Google Sheets and Google Drive), where the list of email addresses is kept.",
            "Cloudflare, Inc., which hosts the site and, to serve and protect it, processes technical connection data such as your IP address. The legal basis for this is our legitimate interest in running the site securely (Article 6(1)(f) GDPR).",
          ],
          "These providers may process data outside the European Economic Area, in particular in the United States. Those transfers are covered by the safeguards the GDPR provides: the EU-US Data Privacy Framework and the European Commission's standard contractual clauses.",
          "We will also disclose your data to the authorities where a law requires it.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You can exercise these rights at any time:",
          [
            "Access your data and get a copy of it.",
            "Have it corrected if it is wrong.",
            "Ask us to erase it.",
            "Ask us to restrict how we use it, or object to our using it.",
            "Receive it in a structured format (portability).",
            "Withdraw your consent and stop receiving our emails.",
          ],
          `To do so, write to ${email} from the address you registered with. We will reply within one month. Every email we send you will also say how to unsubscribe.`,
          "If you think we have not handled your data properly, you can lodge a complaint with the Spanish Data Protection Agency (Agencia Española de Protección de Datos, www.aepd.es).",
        ],
      },
      {
        heading: "Under-18s",
        body: [
          `${SITE_NAME} sells alcoholic drinks and is only for people aged 18 or over. We don't knowingly collect data from minors; if we find that we have, we will delete it.`,
        ],
      },
      {
        heading: "Cookies and storage on your device",
        body: [
          "This site uses no cookies and no analytics or advertising tools. It stores one technical value in your browser to remember that you confirmed you are of legal age, so it doesn't ask on every visit. That value never leaves your device and the site needs it to work.",
        ],
      },
      {
        heading: "Security",
        body: [
          "The site and the form always use an encrypted connection (HTTPS), and only the people who run Malaka Wine have access to the list of email addresses.",
        ],
      },
      {
        heading: "Changes to this policy",
        body: [
          "If we change how we handle your data we will update this page and the date at the top. If the change affects data we already hold, we will tell you by email.",
        ],
      },
    ],
  },
};

export const getPrivacyPolicy = (lang: Lang) => POLICIES[lang];
