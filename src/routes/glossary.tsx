import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Search, SearchX, X } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/glossary")({
  head: () => ({
    meta: [
      { title: "GLOSSARY — Shopper Cockpit" },
      { name: "description", content: "Glosario de términos y conceptos clave de Shopper y automoción." },
      { property: "og:title", content: "GLOSSARY — Shopper Cockpit" },
      { property: "og:description", content: "Glosario de términos y conceptos clave de Shopper y automoción." },
    ],
  }),
  component: Glossary,
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

const COMBINING_MARKS = /[\u0300-\u036f]/g;
const SUBSCRIPT_DIGITS = /[\u2080-\u2089]/g;

/**
 * Folds a single character to a search-friendly form: lower case, no accents
 * and no subscript digits (so "CO₂" is found when typing "co2").
 */
function normalizeChar(char: string): string {
  return char
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .replace(SUBSCRIPT_DIGITS, (digit) => String(digit.charCodeAt(0) - 0x2080))
    .toLowerCase();
}

/**
 * Normalizes a string while keeping a map from every normalized character back
 * to its original position, so matches can be highlighted on the original text.
 */
function normalizeWithMap(value: string): { text: string; map: number[] } {
  let text = "";
  const map: number[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const normalized = normalizeChar(value[i]);
    for (let j = 0; j < normalized.length; j += 1) map.push(i);
    text += normalized;
  }
  return { text, map };
}

function normalizeText(value: string): string {
  return normalizeWithMap(value).text;
}

const glossaryIndex = glossaryItems.map((item, index) => ({
  item,
  index,
  haystack: `${normalizeText(item.term)} ${normalizeText(item.definition)}`,
}));

function HighlightText({ text, tokens }: { text: string; tokens: string[] }) {
  const parts = useMemo<ReactNode[]>(() => {
    if (tokens.length === 0) return [text];

    const { text: normalized, map } = normalizeWithMap(text);
    const ranges: Array<[number, number]> = [];

    for (const token of tokens) {
      let from = 0;
      while (from <= normalized.length - token.length) {
        const found = normalized.indexOf(token, from);
        if (found === -1) break;
        ranges.push([map[found], map[found + token.length - 1] + 1]);
        from = found + token.length;
      }
    }

    if (ranges.length === 0) return [text];

    ranges.sort((a, b) => a[0] - b[0]);
    const merged: Array<[number, number]> = [];
    for (const [start, end] of ranges) {
      const last = merged[merged.length - 1];
      if (last && start <= last[1]) last[1] = Math.max(last[1], end);
      else merged.push([start, end]);
    }

    const nodes: ReactNode[] = [];
    let cursor = 0;
    merged.forEach(([start, end], i) => {
      if (start > cursor) nodes.push(text.slice(cursor, start));
      nodes.push(
        <mark
          key={`mark-${i}`}
          style={{
            backgroundColor: "rgba(49, 92, 255, 0.16)",
            color: "inherit",
            padding: 0,
            borderRadius: 2,
          }}
        >
          {text.slice(start, end)}
        </mark>,
      );
      cursor = end;
    });
    if (cursor < text.length) nodes.push(text.slice(cursor));
    return nodes;
  }, [text, tokens]);

  return <>{parts}</>;
}

function Glossary() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => trackEvent("glossary_opened", {}), []);

  // Press "/" anywhere on the page to jump into the search box.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const tokens = useMemo(() => {
    const normalized = normalizeText(query).trim();
    return normalized ? normalized.split(/\s+/).filter(Boolean) : [];
  }, [query]);

  const results = useMemo(() => {
    if (tokens.length === 0) return glossaryIndex;
    return glossaryIndex.filter(({ haystack }) =>
      tokens.every((token) => haystack.includes(token)),
    );
  }, [tokens]);

  const isFiltering = tokens.length > 0;

  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <PageShell
      title="GLOSSARY"
      subtitle="Glosario de conceptos y métricas clave utilizados en el sector de automoción y en las herramientas de Shopper."
    >
      <div
        role="search"
        aria-label="Glossary search"
        className="sticky top-16 z-30 -mx-6 mb-6 bg-background/95 px-6 py-3 backdrop-blur md:-mx-10 md:px-10"
      >
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
            aria-hidden
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && query) {
                event.preventDefault();
                clearSearch();
              }
            }}
            placeholder="Search a term or its description…"
            aria-label="Search the glossary by term or description"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            className="w-full border bg-white py-3 pl-10 pr-12 text-sm text-foreground outline-none transition focus:border-[color:var(--accent-blue)] focus:shadow-[0_0_0_3px_rgba(49,92,255,0.15)]"
            style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center">
            {query ? (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[color:var(--secondary)]"
                style={{ color: "var(--text-secondary)" }}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            ) : (
              <kbd
                className="hidden rounded border px-1.5 py-0.5 text-[10px] font-medium sm:inline-block"
                style={{ borderColor: "#E1E4EE", color: "var(--text-secondary)" }}
              >
                /
              </kbd>
            )}
          </div>
        </div>
        <div
          className="mt-2 flex items-center justify-between gap-3 text-xs"
          style={{ color: "var(--text-secondary)" }}
        >
          <span aria-live="polite" aria-atomic="true">
            {isFiltering
              ? `${results.length} of ${glossaryItems.length} terms`
              : `${glossaryItems.length} terms`}
          </span>
          <span className="hidden sm:inline">
            {isFiltering ? "Press Esc to clear" : "Press / to search"}
          </span>
        </div>
      </div>

      {results.length === 0 ? (
        <div
          className="border bg-white p-10 text-center"
          style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
        >
          <SearchX
            className="mx-auto h-8 w-8"
            style={{ color: "var(--text-secondary)" }}
            aria-hidden
          />
          <p className="mt-3 text-sm font-medium">
            No terms match “{query.trim()}”
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Try another word — the search looks in both terms and descriptions.
          </p>
          <button
            type="button"
            onClick={clearSearch}
            className="mt-4 px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--accent-blue)", borderRadius: 4 }}
          >
            Clear search
          </button>
        </div>
      ) : (
        <ol className="space-y-4">
          {results.map(({ item, index }) => (
            <li
              key={`${item.term}-${index}`}
              className="border p-5 bg-white"
              style={{ borderColor: "#E1E4EE", borderRadius: 4 }}
            >
              <h2 className="text-sm uppercase tracking-widest font-semibold text-foreground">
                {index + 1}. <HighlightText text={item.term} tokens={tokens} />
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                <HighlightText text={item.definition} tokens={tokens} />
              </p>
            </li>
          ))}
        </ol>
      )}
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
