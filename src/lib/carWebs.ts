/**
 * Car websites used by the CAR WEBS page.
 *
 * The page renders these two lists side by side: OVERSEAS on the left and
 * EUROPE on the right. Each entry keeps the country, the display name of the
 * site and the full URL so it can be opened in a new tab or copied as-is.
 */
export interface CarWeb {
  id: string;
  /** Country (or area) the website belongs to. */
  country: string;
  /** Website name shown in the "Website" column. */
  name: string;
  /** Complete URL, shown as text so it can also be copied and pasted. */
  url: string;
}

export const OVERSEAS_CAR_WEBS: CarWeb[] = [
  {
    id: "tn-automobile",
    country: "Tunisia",
    name: "Automobile",
    url: "https://www.automobile.tn/fr",
  },
  {
    id: "tn-sifir-fiyatlar",
    country: "Tunisia",
    name: "Sifir Fiyatlar",
    url: "https://www.sifirfiyatlar.com/en",
  },
  {
    id: "dz-autobip",
    country: "Algeria",
    name: "Autobip",
    url: "https://www.autobip.com/fr/",
  },
  {
    id: "eg-contactcars",
    country: "Egypt",
    name: "Contactcars",
    url: "https://www.contactcars.com/en",
  },
  {
    id: "eg-yallamotor",
    country: "Egypt",
    name: "YallaMotor",
    url: "https://egypt.yallamotor.com/",
  },
  {
    id: "ma-wandaloo",
    country: "Morocco",
    name: "Wandaloo",
    url: "https://www.wandaloo.com/",
  },
  {
    id: "ci-koto",
    country: "Côte d'Ivoire",
    name: "Koto",
    url: "https://koto.ci/",
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
    id: "sa-motory",
    country: "KSA",
    name: "Motory",
    url: "https://ksa.motory.com/en/",
  },
  {
    id: "sa-ae-autopediame",
    country: "KSA y UAE",
    name: "Autopediame",
    url: "https://www.autopediame.com/uae/en",
  },
  {
    id: "sa-yallamotor",
    country: "KSA",
    name: "YallaMotor",
    url: "https://ksa.yallamotor.com/",
  },
  {
    id: "ae-yallamotor",
    country: "UAE",
    name: "YallaMotor",
    url: "https://uae.yallamotor.com/",
  },
  {
    id: "saf-cars-co-za",
    country: "SAF",
    name: "Cars.co.za",
    url: "https://www.cars.co.za/",
  },
];

export const EUROPE_CAR_WEBS: CarWeb[] = [
  {
    id: "be-moniteur-automobile",
    country: "Belgium",
    name: "Moniteur Automobile",
    url: "https://www.moniteurautomobile.be/marques-auto/toutes-marques-automobiles.html",
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
    id: "fr-largus",
    country: "FR",
    name: "Argus",
    url: "https://www.largus.fr/",
  },
  {
    id: "de-autobild",
    country: "DE",
    name: "Autobild",
    url: "https://www.autobild.de/",
  },
  {
    id: "uk-carvertical",
    country: "UK",
    name: "CarVertical",
    url: "https://www.carvertical.com/es/landing",
  },
];
