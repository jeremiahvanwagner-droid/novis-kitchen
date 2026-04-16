import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const brand = {
  chili: "#B83A10",
  chiliFade: "#B83A1015",
  amber: "#D4721A",
  cream: "#FEF6EC",
  ink: "#1C0F07",
  inkLight: "#1C0F0788",
};

const navLinks = [
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Donate", href: "#donate" },
  { label: "Order Now", href: "#contact", cta: true },
];

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: brand.cream, borderColor: brand.chiliFade }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="Back to top"
        >
          <span className="text-2xl">🍗</span>
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'Playfair Display', serif", color: brand.ink }}
          >
            Novi's Kitchen
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) =>
            link.cta ? (
              <motion.button
                key={link.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo(link.href)}
                className="px-5 py-2.5 rounded-full text-sm font-bold text-white"
                style={{
                  background: brand.chili,
                  boxShadow: `0 6px 18px ${brand.chili}44`,
                }}
              >
                {link.label}
              </motion.button>
            ) : (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 hover:bg-orange-50"
                style={{ color: brand.ink }}
              >
                {link.label}
              </button>
            )
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg focus:outline-none"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-6 h-0.5 rounded transition-all duration-300"
            style={{
              background: brand.ink,
              transform: open ? "rotate(45deg) translate(3px, 3px)" : undefined,
            }}
          />
          <span
            className="block w-6 h-0.5 rounded transition-all duration-300"
            style={{
              background: brand.ink,
              opacity: open ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-0.5 rounded transition-all duration-300"
            style={{
              background: brand.ink,
              transform: open ? "rotate(-45deg) translate(3px, -3px)" : undefined,
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: brand.chiliFade }}
          >
            <nav className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setOpen(false);
                    scrollTo(link.href);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors duration-200 hover:bg-orange-50"
                  style={link.cta ? { color: brand.chili } : { color: brand.ink }}
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
