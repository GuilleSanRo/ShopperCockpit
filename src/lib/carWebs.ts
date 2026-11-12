/**
 * Car websites used by the CAR WEBS page.
 *
 * The page renders these two lists side by side: OVERSEAS on the left and
 * EUROPE on the right. Each entry keeps the country, the display name of the
 * site and the full URL so it can be opened in a new tab or copied as-is.
 *
 * Both lists are kept sorted by country code (A–Z). Entries sharing a country
 * keep their original relative order.
 */
export interface CarWeb {
  id: string;
  /** Short country (or area) code, e.g. "TUN" or "BE". */
  country: string;
  /** Website name shown in the "Website" column. */
  name: string;
  /** Complete URL the website name links to. */
  url: string;
  /** URL shown in the copy/paste column when it differs from the link target. */
  displayUrl?: string;
}

export const OVERSEAS_CAR_WEBS: CarWeb[] = [
  {
    id: "dz-autobip",
    country: "ALG",
    name: "Autobip",
    url: "https://www.autobip.com/fr/",
  },
  {
    id: "ci-koto",
    country: "CIV",
    name: "Koto",
    url: "https://koto.ci/",
  },
  {
    id: "eg-contactcars",
    country: "EGY",
    name: "Contactcars",
    url: "https://www.contactcars.com/en",
  },
  {
    id: "eg-yallamotor",
    country: "EGY",
    name: "YallaMotor",
    url: "https://egypt.yallamotor.com/",
  },
  {
    id: "sa-motory",
    country: "KSA",
    name: "Motory",
    url: "https://ksa.motory.com/en/",
  },
  {
    id: "sa-yallamotor",
    country: "KSA",
    name: "YallaMotor",
    url: "https://ksa.yallamotor.com/",
  },
  {
    id: "mea-drivearabia",
    country: "MEA",
    name: "DriveArabia",
    url: "https://www.drivearabia.com/",
  },
  {
    id: "mea-ccarprice",
    country: "MEA",
    name: "Ccarprice",
    url: "https://www.ccarprice.com/",
  },
  {
    id: "ma-wandaloo",
    country: "MOR",
    name: "Wandaloo",
    url: "https://www.wandaloo.com/",
  },
  {
    id: "saf-cars-co-za",
    country: "SAF",
    name: "Cars.co.za",
    url: "https://www.cars.co.za/",
  },
  {
    id: "tn-automobile",
    country: "TUN",
    name: "Automobile",
    url: "https://www.automobile.tn/fr",
  },
  {
    id: "tn-sifir-fiyatlar",
    country: "TUN",
    name: "Sifir Fiyatlar",
    url: "https://www.sifirfiyatlar.com/en",
  },
  {
    id: "sa-ae-autopediame",
    country: "UAE",
    name: "Autopediame",
    url: "https://www.autopediame.com/uae/en",
  },
  {
    id: "ae-yallamotor",
    country: "UAE",
    name: "YallaMotor",
    url: "https://uae.yallamotor.com/",
  },
];

export const EUROPE_CAR_WEBS: CarWeb[] = [
  {
    id: "be-moniteur-auto",
    country: "BE",
    name: "Moniteur Auto",
    url: "https://www.moniteurautomobile.be/marques-auto/toutes-marques-automobiles.html",
    displayUrl: "https://www.moniteurautomobile.be/accueil.html",
  },
  {
    id: "be-moniteur-vans",
    country: "BE",
    name: "Moniteur Vans",
    url: "https://www.moniteurautomobile.be/marques-utilitaires/toutes-marques-automobiles.html",
    displayUrl: "https://www.moniteurautomobile.be/accueil.html",
  },
  {
    id: "de-autobild",
    country: "DE",
    name: "Autobild",
    url: "https://www.autobild.de/",
  },
  {
    id: "es-km77",
    country: "ES",
    name: "KM77",
    url: "https://www.km77.com/",
  },
  {
    id: "es-motorpasion",
    country: "ES",
    name: "Motorpasion",
    url: "https://www.motorpasion.com/",
  },
  {
    id: "eu-autotras",
    country: "EU",
    name: "Autrotras",
    url: "https://autotras.com/",
  },
  {
    id: "fr-largus",
    country: "FR",
    name: "Argus",
    url: "https://www.largus.fr/",
  },
  {
    id: "it-automoto",
    country: "IT",
    name: "Automoto.it",
    url: "https://www.automoto.it/listino",
  },
  {
    id: "it-roscini-veicoli",
    country: "IT",
    name: "Roscini Veicoli",
    url: "https://www.rosciniveicoli.it/",
  },
  {
    id: "it-koelliker",
    country: "IT",
    name: "KoeKiller",
    url: "https://www.koelliker.it/",
  },
  {
    id: "it-quattroruote",
    country: "IT",
    name: "Quattroroute",
    url: "https://www.quattroruote.it/",
  },
  {
    id: "uk-carvertical",
    country: "UK",
    name: "CarVertical",
    url: "https://www.carvertical.com/es/landing",
  },
];
