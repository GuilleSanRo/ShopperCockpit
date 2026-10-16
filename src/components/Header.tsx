import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 bg-white border-b flex items-center px-6 md:px-10"
      style={{ height: 64, borderColor: "#E4E7F0" }}
    >
      {/* Left: Kantar + PromoCar logos */}
      <div className="flex items-center gap-3 shrink-0">
        <Link to="/" aria-label="Home">
          <img
            src="/kantar-logo.png"
            alt="Kantar"
            className="h-7 md:h-8 w-auto object-contain"
          />
        </Link>
        <img
          src="/promocar-logo.png"
          alt="PromoCar"
          className="h-7 md:h-8 w-auto object-contain"
        />
      </div>

      {/* Center: Shopper Cockpit title */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold tracking-tight text-foreground whitespace-nowrap"
          style={{ fontFamily: "'Inter', system-ui, sans-serif", letterSpacing: "-0.02em" }}
        >
          Shopper Cockpit
        </Link>
      </div>

      {/* Right: navigation */}
      <nav className="ml-auto flex items-center gap-6 md:gap-10 text-xs md:text-sm font-medium tracking-widest uppercase text-foreground">
        <Link
          to="/glossary"
          className="hover:text-[color:var(--accent-blue)] transition-colors"
          activeProps={{ style: { color: "var(--accent-blue)" } }}
        >
          GLOSSARY
        </Link>
        <Link
          to="/other-links"
          className="hover:text-[color:var(--accent-blue)] transition-colors"
          activeProps={{ style: { color: "var(--accent-blue)" } }}
        >
          Other Links
        </Link>
        <div
          className="flex flex-col items-center text-[10px] tracking-wider text-muted-foreground"
          aria-label="Shopper"
        >
          <ShoppingCart className="w-5 h-5" style={{ color: "var(--accent-blue)" }} aria-hidden />
          <span>SHOPPER</span>
        </div>
      </nav>
    </header>
  );
}
