import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 bg-white border-b flex items-center px-6 md:px-10"
      style={{ height: 64, borderColor: "#E4E7F0" }}
    >
      <Link
        to="/"
        className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
        style={{ letterSpacing: "-0.02em" }}
      >
        KANTAR
      </Link>
      <nav className="ml-auto flex items-center gap-6 md:gap-10 text-xs md:text-sm font-medium tracking-widest uppercase text-foreground">
        <Link
          to="/read-me"
          className="hover:text-[color:var(--accent-blue)] transition-colors"
          activeProps={{ style: { color: "var(--accent-blue)" } }}
        >
          Read Me
        </Link>
        <Link
          to="/old-links"
          className="hover:text-[color:var(--accent-blue)] transition-colors"
          activeProps={{ style: { color: "var(--accent-blue)" } }}
        >
          Old Links
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
