import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/read-me")({
  head: () => ({
    meta: [
      { title: "GLOSSARY — Shopper Cockpit" },
      { name: "description", content: "Glosario de términos y conceptos clave de Shopper y automoción." },
      { property: "og:title", content: "GLOSSARY — Shopper Cockpit" },
      { property: "og:description", content: "Glosario de términos y conceptos clave de Shopper y automoción." },
    ],
  }),
  component: ReadMe,
});

interface GlossaryItem {
  term: string;
  definition: string;
}

const glossaryItems: GlossaryItem[] = [
  {
    term: "MSRP",
    definition: "Precio de venta recomendado por el fabricante, sin descuentos aplicados.",
  },
  {
    term: "Precio de lista",
    definition: "Precio oficial de tarifa de una versión concreta antes de cualquier promoción.",
  },
  {
    term: "Precio promocional",
    definition: "Precio resultante tras aplicar las campañas vigentes comunicadas por la marca.",
  },
  {
    term: "Precio transaccional",
    definition: "Lo que el cliente paga realmente tras negociar en el concesionario.",
  },
  {
    term: "Descuento absoluto",
    definition: "Diferencia en euros entre el precio de lista y el precio promocional.",
  },
  {
    term: "Descuento en %",
    definition: "El mismo descuento expresado sobre el precio de lista. Es la métrica comparable entre marcas y países.",
  },
  {
    term: "DCON",
    definition: "Contribución del concesionario al descuento, calculada a partir de los datos de Shopper y Analyzer.",
  },
  {
    term: "Take rate",
    definition: "Porcentaje de clientes que se acogen realmente a una oferta concreta.",
  },
  {
    term: "OEM",
    definition: "Original Equipment Manufacturer: el fabricante del vehículo, es decir, la marca.",
  },
  {
    term: "Dealer",
    definition: "El concesionario: quien comercializa el vehículo al cliente final.",
  },
  {
    term: "B2C",
    definition: "Business to Consumer: promociones dirigidas al cliente privado o particular.",
  },
  {
    term: "B2B",
    definition: "Business to Business: promociones dirigidas a empresas y pequeñas flotas.",
  },
  {
    term: "PC",
    definition: "Passenger Car: vehículo de pasajeros o turismo, concebido para transportar personas.",
  },
  {
    term: "LCV",
    definition: "Light Commercial Vehicle: vehículo comercial ligero, concebido para transportar mercancías.",
  },
  {
    term: "Trim / versión",
    definition: "Nivel de acabado dentro de un modelo. Define equipamiento y a menudo el descuento aplicable.",
  },
  {
    term: "Promoción",
    definition: "Beneficio concreto para el cliente: descuento, regalo, oferta, financiación o servicio.",
  },
  {
    term: "Campaña",
    definition: "Agrupación de promociones bajo un mismo paraguas comercial, con nombre y vigencia.",
  },
  {
    term: "Promo pack",
    definition: "Conjunto de promociones que se ofrecen empaquetadas de forma conjunta.",
  },
  {
    term: "Compatibilidad",
    definition: "Indica si dos promociones pueden acumularse o son excluyentes entre sí.",
  },
  {
    term: "ICE",
    definition: "Internal Combustion Engine: gasolina y diésel.",
  },
  {
    term: "BEV",
    definition: "Battery Electric Vehicle: 100 % eléctrico de batería.",
  },
  {
    term: "PHEV",
    definition: "Plug-in Hybrid: híbrido enchufable, con batería recargable desde la red.",
  },
  {
    term: "HEV",
    definition: "Híbrido convencional no enchufable, también llamado autorrecargable.",
  },
  {
    term: "MHEV",
    definition: "Mild hybrid: hibridación ligera, habitualmente de 48 voltios.",
  },
  {
    term: "xEV",
    definition: "Cualquier vehículo electrificado: BEV, PHEV, HEV y MHEV.",
  },
  {
    term: "ZEV",
    definition: "Zero Emission Vehicle: sin emisiones por el escape.",
  },
  {
    term: "WLTP",
    definition: "Ciclo europeo de homologación de consumo, emisiones y autonomía.",
  },
  {
    term: "CO₂ g/km",
    definition: "Emisiones homologadas. Determinan la fiscalidad y el acceso a incentivos en muchos mercados.",
  },
  {
    term: "Matriculación",
    definition: "Alta oficial del vehículo. Es la unidad de medida estándar del mercado.",
  },
  {
    term: "Cuota de mercado",
    definition: "Porcentaje que representa una marca o tecnología sobre el total de matriculaciones.",
  },
  {
    term: "Segmento",
    definition: "Agrupación de vehículos parecidos entre sí por tamaño y posicionamiento, normalmente competidores directos.",
  },
  {
    term: "Bodytype",
    definition: "Tipo de carrocería: la forma del vehículo.",
  },
  {
    term: "Fueltype",
    definition: "Tipo de motorización o energía que usa el vehículo.",
  },
  {
    term: "Notch",
    definition: "Berlina con maletero independiente. También saloon o sedán.",
  },
  {
    term: "Hatch",
    definition: "Berlina con portón trasero de 5 puertas. También hatchback.",
  },
  {
    term: "GTC",
    definition: "Berlina con portón trasero de 3 puertas.",
  },
  {
    term: "Station Wagon",
    definition: "Carrocería familiar. También Kombi, Estate, Break, Avant, Touring o Variant.",
  },
  {
    term: "MPV",
    definition: "Monovolumen. También people carrier.",
  },
  {
    term: "Off Road",
    definition: "Todoterreno. La variante con techo de lona se denomina off road soft top.",
  },
  {
    term: "CMF",
    definition: "Country · Model · Fuel: define el ámbito de país, modelo y motorización en LEASER. No es la unidad mínima de análisis; esa es el UID.",
  },
  {
    term: "PCP",
    definition: "Personal Contract Purchase: financiación con una cuota final opcional. Producto clave de LEASER.",
  },
  {
    term: "HP",
    definition: "Hire Purchase: compra a plazos en la que el cliente acaba siendo propietario.",
  },
  {
    term: "PL",
    definition: "Personal Loan: préstamo personal tradicional para la compra del vehículo.",
  },
  {
    term: "LLD",
    definition: "Location Longue Durée u operating lease: alquiler a largo plazo sin opción de compra.",
  },
  {
    term: "LOA",
    definition: "Location avec Option d’Achat: leasing con opción de compra al final del contrato.",
  },
  {
    term: "APR / TAE",
    definition: "Coste total anual de la financiación en porcentaje, incluyendo intereses y comisiones.",
  },
  {
    term: "GFV",
    definition: "Guaranteed Future Value: valor futuro garantizado al final del contrato.",
  },
  {
    term: "WS",
    definition: "Web Scraping: fuente web desde la que se captura la oferta de forma automatizada en LEASER.",
  },
  {
    term: "MS",
    definition: "Mystery shopping: captura manual de la oferta en el punto de venta.",
  },
  {
    term: "NID",
    definition: "No identificado: combinación marca-mercado cuya fuente de captura está pendiente de definir.",
  },
  {
    term: "BOT",
    definition: "Proceso automatizado que captura las ofertas de una marca en un mercado.",
  },
  {
    term: "UID",
    definition: "Identificador único de vehículo. Un valid UID ha superado los controles de calidad del mes.",
  },
  {
    term: "Config",
    definition: "Combinación concreta de vehículo y condiciones financieras. Máximo detalle en LEASER.",
  },
  {
    term: "Renta balón",
    definition: "Cuota final elevada al término de un contrato de financiación.",
  },
  {
    term: "Renting / leasing",
    definition: "Alquiler de larga duración, con servicios incluidos en el caso del renting.",
  },
  {
    term: "Achatarramiento",
    definition: "Entrega y baja de un vehículo antiguo para acceder a una ayuda adicional.",
  },
  {
    term: "Mystery shopping",
    definition: "Visitas encubiertas al punto de venta para capturar precios y condiciones reales.",
  },
  {
    term: "Wallbox",
    definition: "Punto de recarga doméstico o de empresa.",
  },
];

function ReadMe() {
  useEffect(() => trackEvent("read_me_opened", {}), []);
  return (
    <PageShell
      title="GLOSSARY"
      subtitle="Glosario de conceptos y métricas clave utilizados en el sector de automoción y en las herramientas de Shopper."
    >
      <ol className="space-y-4">
        {glossaryItems.map((item, i) => (
          <li
            key={`${item.term}-${i}`}
            className="border p-5 bg-white"
            style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
          >
            <h2 className="text-sm uppercase tracking-widest font-semibold text-foreground">
              {i + 1}. {item.term}
            </h2>
            <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
              {item.definition}
            </p>
          </li>
        ))}
      </ol>
      <div className="mt-8">
        <Link
          to="/"
          className="inline-block px-5 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
        >
          Back to Dashboard
        </Link>
      </div>
    </PageShell>
  );
}
