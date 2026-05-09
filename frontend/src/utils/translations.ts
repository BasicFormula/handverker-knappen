import { useLanguageStore } from './languageStore';

type Translations = {
  [key: string]: {
    no: string;
    en: string;
  };
};

// Common translations used across the app
export const translations: Translations = {
  // Navigation
  nav_for_craftsmen: {
    no: 'For Håndverkere',
    en: 'For Craftsmen',
  },
  nav_market: {
    no: 'Oppdragstorg',
    en: 'Marketplace',
  },
  nav_contact: {
    no: 'Kontakt',
    en: 'Contact',
  },
  nav_login: {
    no: 'Logg inn',
    en: 'Log in',
  },
  nav_register: {
    no: 'Registrer deg',
    en: 'Sign up',
  },
  nav_menu: {
    no: 'Meny',
    en: 'Menu',
  },
  nav_my_assignments: {
    no: 'Mine Oppdrag',
    en: 'My Assignments',
  },
  nav_craftsman_dashboard: {
    no: 'Håndverker Dashboard',
    en: 'Craftsman Dashboard',
  },
  nav_admin_dashboard: {
    no: 'Admin Dashboard',
    en: 'Admin Dashboard',
  },
  
  // Footer
  footer_delivered_by: {
    no: 'Levert av Masters AS',
    en: 'Delivered by Masters AS',
  },
  footer_rights: {
    no: 'Alle rettigheter forbeholdt.',
    en: 'All rights reserved.',
  },
  footer_launch: {
    no: 'Lansering',
    en: 'Launch Info',
  },
  footer_terms: {
    no: 'Vilkår for bruk',
    en: 'Terms of Service',
  },
  footer_privacy: {
    no: 'Personvern',
    en: 'Privacy Policy',
  },

  // Landing Page
  hero_title: {
    no: 'Finn rett fagperson',
    en: 'Find the right professional',
  },
  hero_subtitle: {
    no: 'Vi kobler deg med verifiserte og dyktige håndverkere for enhver jobb. Trygt, enkelt og effektivt.',
    en: 'We connect you with verified and skilled craftsmen for any job. Safe, simple, and effective.',
  },
  hero_cta_button: {
    no: 'Be om håndverker',
    en: 'Request Craftsman',
  },
  hero_join_button: {
    no: 'Bli med som håndverker',
    en: 'Join as Craftsman',
  },
  hero_try_here: {
    no: 'Trykk her',
    en: 'Click here',
  },
  how_it_works_title: {
    no: 'Slik fungerer det',
    en: 'How it works',
  },
  how_it_works_subtitle: {
    no: 'Alt skjer i én app.',
    en: 'Everything in one app.',
  },
  step_1_title: {
    no: 'Du beskriver jobben',
    en: 'You describe the job',
  },
  step_1_desc: {
    no: 'Fortell oss hva du trenger hjelp med. Jo flere detaljer, jo bedre.',
    en: 'Tell us what you need help with. The more details, the better.',
  },
  step_2_title: {
    no: 'Vi finner riktige fagfolk',
    en: 'We find the right professionals',
  },
  step_2_desc: {
    no: 'Vi finner kvalifiserte håndverkere i ditt område som passer til oppdraget.',
    en: 'We find qualified craftsmen in your area suitable for the assignment.',
  },
  step_3_title: {
    no: 'De tar kontakt – du velger',
    en: 'They contact you – you choose',
  },
  step_3_desc: {
    no: 'Håndverkerne tar kontakt, og du velger hvem du vil bruke basert på tilbud og profil.',
    en: 'The craftsmen contact you, and you choose who to use based on offers and profile.',
  },
  safety_title: {
    no: 'Trygghet',
    en: 'Safety',
  },
  safety_desc: {
    no: 'Vi har gjort grovjobben med kvalitetssjekk, så du slipper å bekymre deg.',
    en: 'We have done the heavy lifting with quality checks, so you don\'t have to worry.',
  },
  safety_list_title_1: {
    no: 'Alle håndverkere er:',
    en: 'All craftsmen are:',
  },
  safety_item_1: {
    no: 'BankID-verifisert',
    en: 'BankID verified',
  },
  safety_item_2: {
    no: 'Registrerte firma',
    en: 'Registered companies',
  },
  safety_item_3: {
    no: 'Vurdert av kunder',
    en: 'Reviewed by customers',
  },
  safety_list_title_2: {
    no: 'Du slipper:',
    en: 'You avoid:',
  },
  safety_avoid_1: {
    no: 'Svart arbeid',
    en: 'Undeclared work',
  },
  safety_avoid_2: {
    no: 'Falske firma',
    en: 'Fake companies',
  },
  safety_avoid_3: {
    no: 'Useriøse aktører',
    en: 'Unserious actors',
  },
  situations_title: {
    no: 'Når bruker folk oss?',
    en: 'When do people use us?',
  },
  situations_desc: {
    no: 'Når uhellet er ute og du trenger hjelp raskt.',
    en: 'When accidents happen and you need help fast.',
  },
  sit_1: {
    no: 'Strømmen er borte',
    en: 'Power is out',
  },
  sit_2: {
    no: 'Vannet lekker',
    en: 'Water is leaking',
  },
  sit_3: {
    no: 'Sikringen ryker',
    en: 'Fuse blows',
  },
  sit_4: {
    no: 'Vasken er tett',
    en: 'Sink is clogged',
  },
  urgent_title: {
    no: 'Når det haster – vi er der.',
    en: 'When it\'s urgent – we are there.',
  },
  urgent_desc: {
    no: 'Vi har håndverkere klare til å rykke ut på kort varsel.',
    en: 'We have craftsmen ready to move out on short notice.',
  },
  popular_services_title: {
    no: 'Populære tjenester',
    en: 'Popular services',
  },
  popular_services_subtitle: {
    no: 'Vi dekker et bredt spekter av fagfelt.',
    en: 'We cover a wide range of fields.',
  },
  cta_ready_title: {
    no: 'Klar til å sette i gang?',
    en: 'Ready to get started?',
  },
  cta_ready_subtitle: {
    no: 'Få hjelp nå.',
    en: 'Get help now.',
  },
  
  // Services
  service_rørlegger: { no: 'Rørlegger', en: 'Plumber' },
  service_elektriker: { no: 'Elektriker', en: 'Electrician' },
  service_maler: { no: 'Maler', en: 'Painter' },
  service_murer: { no: 'Murer', en: 'Mason' },
  service_sykepleier: { no: 'Sykepleier', en: 'Nurse' },
  service_vaskehjelp: { no: 'Vaskehjelp', en: 'Cleaner' },
  service_pc_hjelp: { no: 'PC-hjelp', en: 'PC Support' },
  service_skadedyrkontroll: { no: 'Skadedyrkontroll', en: 'Pest Control' },
  service_mekaniker: { no: 'Mekaniker', en: 'Mechanic' },
  service_tannlege: { no: 'Tannlege', en: 'Dentist' },
  service_lege: { no: 'Lege', en: 'Doctor' },
  service_snekker: { no: 'Snekker', en: 'Carpenter' },
  service_annet: { no: 'Annet', en: 'Other' },

  // For Craftsmen Page
  fh_hero_badge: {
    no: 'Lanseringstilbud',
    en: 'Launch Offer',
  },
  fh_hero_title: {
    no: 'Fyll ordreboken til',
    en: 'Fill your order book at',
  },
  fh_hero_title_highlight: {
    no: 'halv pris',
    en: 'half price',
  },
  fh_hero_subtitle: {
    no: 'Vi lanserer Norges mest rettferdige anbudstjeneste for håndverkere. Registrer deg nå og få 50% rabatt på alle oppdrag ut 2026.',
    en: 'We are launching Norway\'s fairest tender service for craftsmen. Sign up now and get 50% off all assignments until 2027.',
  },
  fh_btn_register: {
    no: 'Registrer Bedrift Gratis',
    en: 'Register Company Free',
  },
  fh_btn_read_more: {
    no: 'Les mer om tilbudet',
    en: 'Read more about the offer',
  },
  fh_no_binding: {
    no: 'Ingen binding',
    en: 'No binding',
  },
  fh_no_commission: {
    no: 'Ingen provisjon',
    en: 'No commission',
  },
  fh_card_launch_price: {
    no: 'Lanseringspris',
    en: 'Launch Price',
  },
  fh_card_per_customer: {
    no: '/ kunde',
    en: '/ customer',
  },
  fh_card_normal_price: {
    no: 'Normalpris: 100 kr',
    en: 'Regular price: 100 kr',
  },
  fh_card_cta: {
    no: 'Sikre deg tilbudet nå',
    en: 'Secure the offer now',
  },
  fh_features_title: {
    no: 'Hvorfor velge oss?',
    en: 'Why choose us?',
  },
  fh_features_desc: {
    no: 'Vi bygger en plattform på håndverkernes premisser. Vårt mål er å gi deg flere jobber med mindre administrasjon, slik at du sitter igjen med mer på bunnlinjen.',
    en: 'We are building a platform on the craftsmen\'s terms. Our goal is to give you more jobs with less administration, so you are left with more on the bottom line.',
  },
  fh_benefit_1_title: {
    no: 'Vekst uten risiko',
    en: 'Growth without risk',
  },
  fh_benefit_1_desc: {
    no: 'Ingen faste månedlige kostnader eller dyre abonnementer. Du betaler kun en lav pris per oppdrag du faktisk ønsker å svare på.',
    en: 'No fixed monthly costs or expensive subscriptions. You only pay a low price per assignment you actually want to reply to.',
  },
  fh_benefit_2_title: {
    no: 'Direkte kontakt',
    en: 'Direct contact',
  },
  fh_benefit_2_desc: {
    no: 'Ingen mellomledd som spiser av marginene dine. Du kommuniserer, avtaler og fakturerer kunden direkte.',
    en: 'No middlemen eating into your margins. You communicate, agree, and invoice the customer directly.',
  },
  fh_benefit_3_title: {
    no: 'Bygg din merkevare',
    en: 'Build your brand',
  },
  fh_benefit_3_desc: {
    no: 'Få en profesjonell profil som viser frem dine sertifiseringer, tidligere prosjekter og gode kundeanmeldelser.',
    en: 'Get a professional profile showcasing your certifications, past projects, and good customer reviews.',
  },
  fh_offer_title: {
    no: 'Vi investerer i',
    en: 'We invest in',
  },
  fh_offer_title_highlight: {
    no: 'din suksess',
    en: 'your success',
  },
  fh_offer_p1: {
    no: 'Markedet for håndverkertjenester er i endring. Vi mener at dyktige fagfolk fortjener en partner som spiller på lag, ikke en som tar en stor del av kaken.',
    en: 'The market for craftsman services is changing. We believe that skilled professionals deserve a partner who plays on the same team, not one who takes a big piece of the cake.',
  },
  fh_offer_p2: {
    no: 'Derfor starter vi med en prismodell som er enkel, forutsigbar og svært konkurransedyktig. Vi tror at ved å senke terskelen for å finne jobber, vil vi tiltrekke oss de beste håndverkerne – og det tjener alle på.',
    en: 'That\'s why we start with a pricing model that is simple, predictable, and highly competitive. We believe that by lowering the threshold for finding jobs, we will attract the best craftsmen – and everyone benefits from that.',
  },
  fh_offer_valid_until: {
    no: 'Tilbudet gjelder frem til 1. januar',
    en: 'Offer valid until January 1st',
  },
  fh_offer_discount_text: {
    no: 'Rabatt på alle oppdrag',
    en: 'Discount on all assignments',
  },
  fh_price_example_title: {
    no: 'Priseksempel',
    en: 'Price example',
  },
  fh_price_regular: {
    no: 'Vanlig pris per kunde',
    en: 'Regular price per customer',
  },
  fh_price_yours: {
    no: 'Din lanseringspris',
    en: 'Your launch price',
  },
  fh_price_note: {
    no: 'Priser er eks. mva. Du betaler kun når du velger å kontakte kunden.',
    en: 'Prices are ex. VAT. You only pay when you choose to contact the customer.',
  },
  fh_btn_start_saving: {
    no: 'Start Sparing i Dag',
    en: 'Start Saving Today',
  },
  fh_faq_title: {
    no: 'Ofte stilte spørsmål',
    en: 'Frequently Asked Questions',
  },
  fh_faq_1_q: {
    no: 'Er det noen skjulte kostnader?',
    en: 'Are there any hidden costs?',
  },
  fh_faq_1_a: {
    no: 'Nei, overhodet ikke. Det koster ingenting å ha en profil, og ingenting å motta varsler om jobber. Du betaler kun den lave stykkprisen (50 kr under kampanjen) når du aktivt velger å låse opp kontaktinfo for et oppdrag.',
    en: 'No, absolutely not. It costs nothing to have a profile, and nothing to receive job alerts. You only pay the low unit price (50 NOK during the campaign) when you actively choose to unlock contact info for an assignment.',
  },
  fh_faq_2_q: {
    no: 'Hvordan foregår betalingen?',
    en: 'How does the payment work?',
  },
  fh_faq_2_a: {
    no: 'Hos oss betaler du kun en liten sum for å få kontaktinfoen til kunden. Selve jobben priser, utfører og fakturerer du direkte til kunden, akkurat som vanlig. Vi blander oss ikke inn i oppgjøret mellom deg og boligeier.',
    en: 'With us, you only pay a small sum to get the customer\'s contact info. You price, execute, and invoice the job directly to the customer, just as usual. We do not interfere in the settlement between you and the homeowner.',
  },
  fh_faq_3_q: {
    no: 'Hvordan får jeg betalt for jobben?',
    en: 'How do I get paid for the job?',
  },
  fh_faq_3_a: {
    no: 'Du fakturerer kunden direkte på vanlig måte. Vi tar ingen del av oppgjøret mellom deg og kunden.',
    en: 'You invoice the customer directly in the usual way. We take no part of the settlement between you and the customer.',
  },
  
  // Offer List Items
  offer_detail_1: {
    no: '50% rabatt på alle kundekontakter det første året',
    en: '50% discount on all customer contacts the first year',
  },
  offer_detail_2: {
    no: 'Kun 50 kr eks. mva per oppdrag frem til 1. januar 2027',
    en: 'Only 50 NOK ex. VAT per assignment until January 1st, 2027',
  },
  offer_detail_3: {
    no: 'Ingen bindingstid eller skjulte gebyrer',
    en: 'No lock-in period or hidden fees',
  },
  offer_detail_4: {
    no: 'Gratis bedriftsprofil og synlighet',
    en: 'Free company profile and visibility',
  },
  offer_detail_5: {
    no: 'Ingen provisjon av oppdragssummen',
    en: 'No commission on the assignment amount',
  },
};

export const useTranslation = () => {
  const { language } = useLanguageStore();

  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return { t, language };
};
