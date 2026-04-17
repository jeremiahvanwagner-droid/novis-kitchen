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

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/p/Novis-Kitchen-100063458352303/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/innoviskitchen"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 0 1 1.772 1.153 4.902 4.902 0 0 1 1.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123s-.012 3.056-.06 4.122c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 0 1-1.153 1.772 4.902 4.902 0 0 1-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06s-3.056-.012-4.122-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 0 1-1.772-1.153 4.902 4.902 0 0 1-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 0 1 1.153-1.772A4.902 4.902 0 0 1 5.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63Zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058ZM12 6.865a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27Zm0 1.802a3.333 3.333 0 1 0 0 6.666 3.333 3.333 0 0 0 0-6.666Zm5.338-3.205a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
              </svg>
            </a>
          </div>

          {/* Legal */}
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            © {year} Novi's Kitchen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
