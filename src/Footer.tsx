const brand = {
  chili: "#B83A10",
  chiliFade: "#B83A1015",
  ink: "#1C0F07",
  inkLight: "#1C0F0788",
  cream: "#FEF6EC",
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="py-12 border-t"
      style={{ background: brand.ink, borderColor: brand.chiliFade }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍗</span>
            <div>
              <p
                className="text-xl font-bold text-white"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Novi's Kitchen
              </p>
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                Made with love in every bite.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["#menu", "#gallery", "#donate", "#contact"].map((href) => {
              const label = href.replace("#", "").replace(/^\w/, (c) => c.toUpperCase());
              return (
                <button
                  key={href}
                  onClick={() =>
                    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="text-sm font-medium transition-colors duration-200 hover:text-white"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {label === "Contact" ? "Order Now" : label}
                </button>
              );
            })}
          </nav>

          {/* Legal */}
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            © {year} Novi's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
