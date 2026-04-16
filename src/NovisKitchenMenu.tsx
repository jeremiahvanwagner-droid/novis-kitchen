/* =============================================================
   NovisKitchenMenu.tsx — Novi's Kitchen (Upgraded v3)

   CHANGES:
   - 4 full-bleed photo slideshows with real food photography:
       1. Chicken Wings table
       2. Seafood Pasta table
       3. Full spread (wings + pasta + salads)
       4. Lemonades & Salads table
   - Real photos on every menu card (replaces animations)
   - Auto-advancing slideshows (4s) with prev/next arrows,
     dot indicators, and clickable thumbnail strip
   - Donation section ($10/$25/$50/$100 + custom checkbox) preserved

   Dependencies: React 19+, framer-motion, lucide-react, Tailwind CSS
   Fonts (add to index.html):
     https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap
   ============================================================= */

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Flame, Heart } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────
type MenuItem = {
  name: string;
  description: string;
  price: string;
  tag?: string;
  image?: string;
  hot?: boolean;
};

type Category = {
  id: string;
  label: string;
  emoji: string;
  items: MenuItem[];
};

type Slide = {
  src: string;
  caption: string;
  sub?: string;
};

type Slideshow = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  slides: Slide[];
};

// ── Brand Palette ─────────────────────────────────────────────
const brand = {
  chili: "#B83A10",
  chiliFade: "#B83A1015",
  amber: "#D4721A",
  amberFade: "#D4721A15",
  cream: "#FEF6EC",
  ink: "#1C0F07",
  inkLight: "#1C0F0788",
  gold: "#E8B44D",
};

// ── Slideshow Data (real food photography) ────────────────────
const slideshows: Slideshow[] = [
  {
    id: "wings-show",
    title: "Chicken Wings",
    emoji: "🍗",
    tagline: "Crispy, saucy, and made to order — Novi's wings are the real deal.",
    slides: [
      {
        src: "https://insanelygoodrecipes.com/wp-content/uploads/2023/01/Honey-Glazed-Chicken-Wings.jpg",
        caption: "Honey Gold Wings",
        sub: "Golden honey glaze with savory spices — $13/lb",
      },
      {
        src: "https://www.savoryspicerack.com/wp-content/uploads/2022/08/Jamaican-Jerk-Chicken-Wings-SavoryThoughts.jpg",
        caption: "Jerk Sweet Chile Wings",
        sub: "Caribbean jerk spices with sweet chile heat — $12/lb",
      },
      {
        src: "https://peelwithzeal.com/wp-content/uploads/2022/01/lemon-pepper-chicken-wings-featured.jpg",
        caption: "Lemon Pepper Wings",
        sub: "Zesty lemon and cracked black pepper — $11/lb",
      },
      {
        src: "https://theyummybowl.com/wp-content/uploads/2022/08/honey-bbq-wings-air-fryer-1.jpg",
        caption: "Honey BBQ Wings",
        sub: "Sweet and smoky fan favorite — $12/lb",
      },
      {
        src: "https://www.foodiecrush.com/wp-content/uploads/2019/01/Oven-Baked-Chicken-Wings-foodiecrush.com-015.jpg",
        caption: "Wings Platter",
        sub: "Mix and match flavors — order by the pound",
      },
    ],
  },
  {
    id: "pasta-show",
    title: "Seafood Pasta",
    emoji: "🍝",
    tagline: "Fresh seafood, al dente pasta, and sauces that hit every time.",
    slides: [
      {
        src: "https://pinchofyum.com/wp-content/uploads/Shrimp-Scampi-Linguine.jpg",
        caption: "Shrimp Scampi Pasta",
        sub: "Garlic lemon butter sauce, fresh parsley — $16/person",
      },
      {
        src: "https://angiesarap.net/wp-content/uploads/2014/08/Creamy-Seafood-Alfredo-1.jpg",
        caption: "Creamy Seafood Alfredo",
        sub: "Shrimp & calamari in parmesan cream — $17/person",
      },
      {
        src: "https://cookingkart.com/wp-content/uploads/2023/04/Shrimp-Scampi-Linguine-with-White-Wine-Sauce-2.jpg",
        caption: "Seafood Pasta Medley",
        sub: "Shrimp, mussels & calamari in white wine — $18/person",
      },
      {
        src: "https://www.recipetineats.com/tachyon/2020/06/Seafood-pasta_5.jpg",
        caption: "Seafood Marinara",
        sub: "Rich tomato marinara over linguine — $17/person",
      },
    ],
  },
  {
    id: "spread-show",
    title: "The Full Spread",
    emoji: "🍽️",
    tagline: "Wings, pasta, and salads together — catering done right for any occasion.",
    slides: [
      {
        src: "https://www.culinaryhill.com/wp-content/uploads/2022/11/Italian-Feast-Culinary-Hill-1200x800.jpg",
        caption: "Full Catering Spread",
        sub: "Custom orders for events, parties & gatherings",
      },
      {
        src: "https://thegrazingtable.com.au/wp-content/uploads/2022/01/chicken-wing-charcuterie-board-scaled.jpg",
        caption: "Wings & Sides Board",
        sub: "Perfect crowd-pleaser for any party",
      },
      {
        src: "https://www.foodiecrush.com/wp-content/uploads/2019/01/Oven-Baked-Chicken-Wings-foodiecrush.com-015.jpg",
        caption: "Mixed Wing Platter",
        sub: "All your favorites in one spread",
      },
      {
        src: "https://eatwell101.com/wp-content/uploads/2021/05/Avocado-Shrimp-Salad-recipe.jpg",
        caption: "Shrimp Avocado Salad",
        sub: "Fresh greens, shrimp, citrus dressing — $16/person",
      },
      {
        src: "https://www.healthyfitnessmeals.com/wp-content/uploads/2019/07/spicy-shrimp-avocado-salad-1-735x919.jpg",
        caption: "Chicken Salad",
        sub: "Grilled chicken, mixed greens, ranch — $13/person",
      },
    ],
  },
  {
    id: "drinks-show",
    title: "Lemonades & Salads",
    emoji: "🍋",
    tagline: "House-made pitchers of lemonade and crisp salads to complete your meal.",
    slides: [
      {
        src: "https://littlesunnykitchen.com/wp-content/uploads/2020/07/Strawberry-Lemonade-Recipe-4.jpg",
        caption: "Strawberry Lemonade",
        sub: "Fresh strawberry puree, tart lemon — $5",
      },
      {
        src: "https://yumntasty.com/wp-content/uploads/2022/06/Blue-Raspberry-Lemonade.jpg",
        caption: "Blue Raspberry Lemonade",
        sub: "Bold blue raspberry with fresh lemon — $5",
      },
      {
        src: "https://www.acouplecooks.com/wp-content/uploads/2021/05/Pineapple-Lemonade-005.jpg",
        caption: "Pineapple Lemonade",
        sub: "Tropical pineapple meets fresh lemon — $5",
      },
      {
        src: "https://www.easyweeknight.com/wp-content/uploads/2019/07/Shrimp-Salad-2.jpg",
        caption: "Shrimp Salad",
        sub: "Avocado, cucumber, cherry tomatoes — $16/person",
      },
      {
        src: "https://eatwell101.com/wp-content/uploads/2021/05/Avocado-Shrimp-Salad-recipe.jpg",
        caption: "Chef's Salad",
        sub: "Mixed greens, ham, turkey, house vinaigrette — $14/person",
      },
    ],
  },
];

// ── Menu Data ─────────────────────────────────────────────────
const categories: Category[] = [
  {
    id: "wings",
    label: "Chicken Wings",
    emoji: "🍗",
    items: [
      {
        name: "Hot Strawberry Wings",
        description: "Crispy wings tossed in spicy strawberry glaze with a perfect heat kick",
        price: "$12/lb",
        tag: "Signature",
        hot: true,
        image: "https://insanelygoodrecipes.com/wp-content/uploads/2023/01/Honey-Glazed-Chicken-Wings.jpg",
      },
      {
        name: "Jerk Sweet Chile Wings",
        description: "Caribbean jerk spices with sweet chile heat, perfectly balanced",
        price: "$12/lb",
        hot: true,
        image: "https://www.savoryspicerack.com/wp-content/uploads/2022/08/Jamaican-Jerk-Chicken-Wings-SavoryThoughts.jpg",
      },
      {
        name: "Lemon Pepper Wings",
        description: "Zesty lemon and cracked black pepper coating, bright and tangy",
        price: "$11/lb",
        image: "https://peelwithzeal.com/wp-content/uploads/2022/01/lemon-pepper-chicken-wings-featured.jpg",
      },
      {
        name: "Mild Wings",
        description: "Gentle seasoning perfect for those who prefer less heat",
        price: "$10/lb",
        image: "https://www.foodiecrush.com/wp-content/uploads/2019/01/Oven-Baked-Chicken-Wings-foodiecrush.com-015.jpg",
      },
      {
        name: "Honey BBQ Wings",
        description: "Sweet and smoky barbecue glaze with a touch of honey",
        price: "$12/lb",
        tag: "Fan Favorite",
        image: "https://theyummybowl.com/wp-content/uploads/2022/08/honey-bbq-wings-air-fryer-1.jpg",
      },
      {
        name: "Curry Wings",
        description: "Aromatic curry spices with warm, complex flavors",
        price: "$12/lb",
        hot: true,
        image: "https://www.savoryspicerack.com/wp-content/uploads/2022/08/Jamaican-Jerk-Chicken-Wings-SavoryThoughts.jpg",
      },
      {
        name: "Honey Gold Wings",
        description: "Golden honey glaze with savory spices, sweet and irresistible",
        price: "$13/lb",
        tag: "Premium",
        hot: true,
        image: "https://insanelygoodrecipes.com/wp-content/uploads/2023/01/Honey-Glazed-Chicken-Wings.jpg",
      },
    ],
  },
  {
    id: "pasta",
    label: "Seafood Pasta",
    emoji: "🍝",
    items: [
      {
        name: "Seafood Pasta Medley",
        description: "Shrimp, mussels, calamari in a light garlic white wine sauce with fresh herbs",
        price: "$18/person",
        tag: "Signature",
        image: "https://cookingkart.com/wp-content/uploads/2023/04/Shrimp-Scampi-Linguine-with-White-Wine-Sauce-2.jpg",
      },
      {
        name: "Shrimp Scampi Pasta",
        description: "Succulent shrimp, garlic, lemon butter sauce, fresh parsley, al dente pasta",
        price: "$16/person",
        image: "https://pinchofyum.com/wp-content/uploads/Shrimp-Scampi-Linguine.jpg",
      },
      {
        name: "Seafood Marinara",
        description: "Mixed seafood in a rich tomato marinara sauce, served over linguine",
        price: "$17/person",
        image: "https://www.recipetineats.com/tachyon/2020/06/Seafood-pasta_5.jpg",
      },
      {
        name: "Creamy Seafood Alfredo",
        description: "Shrimp and calamari in a luxurious parmesan cream sauce",
        price: "$17/person",
        image: "https://angiesarap.net/wp-content/uploads/2014/08/Creamy-Seafood-Alfredo-1.jpg",
      },
    ],
  },
  {
    id: "salads",
    label: "Novi's Salads",
    emoji: "🥗",
    items: [
      {
        name: "Chef's Salad",
        description: "Mixed greens, ham, turkey, cheese, hard-boiled eggs, cherry tomatoes, house vinaigrette",
        price: "$14/person",
        tag: "Classic",
        image: "https://www.easyweeknight.com/wp-content/uploads/2019/07/Shrimp-Salad-2.jpg",
      },
      {
        name: "Shrimp Salad",
        description: "Crispy greens, succulent shrimp, avocado, cucumber, cherry tomatoes, citrus dressing",
        price: "$16/person",
        tag: "Signature",
        image: "https://eatwell101.com/wp-content/uploads/2021/05/Avocado-Shrimp-Salad-recipe.jpg",
      },
      {
        name: "Chicken Salad",
        description: "Tender grilled chicken, mixed greens, seasonal vegetables, creamy ranch dressing",
        price: "$13/person",
        image: "https://www.healthyfitnessmeals.com/wp-content/uploads/2019/07/spicy-shrimp-avocado-salad-1-735x919.jpg",
      },
    ],
  },
  {
    id: "lemonades",
    label: "Novi's Lemonades",
    emoji: "🍋",
    items: [
      {
        name: "Blue Raspberry Lemonade",
        description: "Refreshing blue raspberry with fresh lemon juice, sparkling water, ice",
        price: "$5",
        tag: "House Made",
        image: "https://yumntasty.com/wp-content/uploads/2022/06/Blue-Raspberry-Lemonade.jpg",
      },
      {
        name: "Strawberry Lemonade",
        description: "Fresh strawberry puree blended with tart lemon, perfectly sweet and refreshing",
        price: "$5",
        image: "https://littlesunnykitchen.com/wp-content/uploads/2020/07/Strawberry-Lemonade-Recipe-4.jpg",
      },
      {
        name: "Pineapple Lemonade",
        description: "Tropical pineapple juice with fresh lemon, a taste of paradise",
        price: "$5",
        image: "https://www.acouplecooks.com/wp-content/uploads/2021/05/Pineapple-Lemonade-005.jpg",
      },
    ],
  },
];

const PRESET_AMOUNTS = [10, 25, 50, 100];

// ── Fallback placeholder when an image fails to load ──────────
const FALLBACK =
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80";

// ── PhotoSlideshow ─────────────────────────────────────────────
function PhotoSlideshow({ show }: { show: Slideshow }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const go = useCallback(
    (idx: number) => {
      setDirection(idx > current ? 1 : -1);
      setCurrent(idx);
    },
    [current]
  );

  const next = useCallback(() => {
    const n = (current + 1) % show.slides.length;
    setDirection(1);
    setCurrent(n);
  }, [current, show.slides.length]);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + show.slides.length) % show.slides.length);
  };

  useEffect(() => {
    if (!inView) return;
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [inView, next]);

  const slide = show.slides[current];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
          style={{ background: brand.amberFade }}
        >
          <span className="text-base">{show.emoji}</span>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: brand.amber }}>
            {show.title}
          </span>
        </div>
        <p className="text-base" style={{ color: brand.inkLight }}>{show.tagline}</p>
      </div>

      {/* Main frame */}
      <div
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: "16/9", background: brand.ink }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.img
            key={current}
            src={slide.src}
            alt={slide.caption}
            custom={direction}
            initial={{ opacity: 0, x: direction * 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -80 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
          />
        </AnimatePresence>

        {/* Bottom gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(28,15,7,0.85) 0%, rgba(28,15,7,0.1) 55%, transparent 100%)",
          }}
        />

        {/* Caption */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current + "cap"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="absolute bottom-0 left-0 right-0 p-6 md:p-8"
          >
            <h3
              className="text-white text-2xl md:text-3xl font-bold leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {slide.caption}
            </h3>
            {slide.sub && (
              <p className="text-white/70 text-sm md:text-base">{slide.sub}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Next arrow */}
        <button
          onClick={() => { setDirection(1); next(); }}
          aria-label="Next"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(6px)" }}
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Counter badge */}
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white"
          style={{ background: "rgba(28,15,7,0.55)", backdropFilter: "blur(4px)" }}
        >
          {current + 1} / {show.slides.length}
        </div>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {show.slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === current ? 28 : 10,
              height: 10,
              background: i === current ? brand.chili : brand.chiliFade,
              border: `2px solid ${i === current ? brand.chili : brand.inkLight + "44"}`,
            }}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-3 mt-5 overflow-x-auto pb-1">
        {show.slides.map((s, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-300"
            style={{
              width: 80,
              height: 56,
              outline: i === current ? `3px solid ${brand.chili}` : "3px solid transparent",
              outlineOffset: 2,
              opacity: i === current ? 1 : 0.5,
            }}
          >
            <img
              src={s.src}
              alt={s.caption}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Slideshows Section ────────────────────────────────────────
function SlideshowSection() {
  return (
    <section id="gallery" className="py-24 md:py-36 relative" style={{ background: brand.cream }}>
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: brand.amber }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: brand.ink }}
          >
            See the Food
          </h2>
          <p className="text-lg" style={{ color: brand.inkLight }}>
            A real look at what lands on your table when you order from Novi's Kitchen.
          </p>
        </div>
        <div className="flex flex-col gap-24">
          {slideshows.map((show) => (
            <PhotoSlideshow key={show.id} show={show} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Menu Card ─────────────────────────────────────────────────
function MenuCard({ item }: { item: MenuItem }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5 }}
      className="group rounded-2xl overflow-hidden border-2 bg-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: brand.chiliFade }}
    >
      {item.image && (
        <div className="h-48 overflow-hidden relative bg-gray-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(28,15,7,0.18) 100%)" }}
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {item.hot && (
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                <Flame className="w-5 h-5 flex-shrink-0" style={{ color: brand.amber }} />
              </motion.div>
            )}
            <h3
              className="font-bold leading-tight"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", color: brand.ink }}
            >
              {item.name}
            </h3>
          </div>
          {item.tag && (
            <span
              className="flex-shrink-0 text-xs px-3 py-1 rounded-full font-semibold whitespace-nowrap"
              style={{ background: brand.amberFade, color: brand.amber }}
            >
              {item.tag}
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: brand.inkLight }}>
          {item.description}
        </p>

        <div className="flex items-baseline justify-between pt-4 border-t-2" style={{ borderColor: brand.chiliFade }}>
          <span className="text-lg font-bold" style={{ color: brand.chili }}>{item.price}</span>
          {item.price.includes("/lb") && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: brand.amberFade, color: brand.amber }}>
              per lb
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── Menu Section ──────────────────────────────────────────────
function MenuSection() {
  const [activeTab, setActiveTab] = useState("wings");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const current = categories.find((c) => c.id === activeTab)!;

  return (
    <section id="menu" className="py-28 md:py-40 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: brand.chili }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: brand.amberFade }}>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: brand.amber }}>Menu</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Playfair Display', serif", color: brand.ink }}>
            Novi's Kitchen
          </h2>
          <p className="max-w-2xl mx-auto text-lg leading-relaxed mb-8" style={{ color: brand.inkLight }}>
            Signature chicken wings, fresh seafood pasta, crisp salads, and house-made lemonades.
            Every order made with love and care.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300"
            style={{ background: brand.amber, color: "white", boxShadow: `0 8px 24px ${brand.amber}44` }}
          >
            <Sparkles className="w-4 h-4" />
            Custom Orders Always Welcome
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {categories.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
              onClick={() => setActiveTab(cat.id)}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 border-2"
              style={
                activeTab === cat.id
                  ? { background: brand.chili, color: "white", borderColor: brand.chili, boxShadow: `0 8px 20px ${brand.chili}44` }
                  : { background: "white", color: brand.ink, borderColor: brand.chiliFade }
              }
            >
              <span className="text-lg">{cat.emoji}</span>
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {current.items.map((item) => <MenuCard key={item.name} item={item} />)}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-20"
        >
          <p className="text-base mb-6 font-medium" style={{ color: brand.inkLight }}>
            Have a special request? We love creating custom dishes!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 text-white font-bold rounded-full text-lg transition-all duration-300"
            style={{ background: brand.chili, boxShadow: `0 12px 32px ${brand.chili}55` }}
          >
            Request a Custom Order
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ── Donation Section ──────────────────────────────────────────
function DonationSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selected, setSelected] = useState<number | null>(25);
  const [customValue, setCustomValue] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [donated, setDonated] = useState(false);

  const effectiveAmount = useCustom ? parseFloat(customValue) || 0 : selected ?? 0;

  return (
    <section id="donate" className="py-24 md:py-36 relative overflow-hidden" style={{ background: brand.cream }} ref={ref}>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: brand.amber }} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl pointer-events-none" style={{ background: brand.chili }} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }} className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: brand.amberFade }}>
            <Heart className="w-4 h-4" style={{ color: brand.amber }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: brand.amber }}>Support Novi's Kitchen</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: brand.ink }}>
            Show Your Love
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: brand.inkLight }}>
            Your generosity helps us keep doing what we love — cooking with heart. Every contribution means the world to us.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {donated ? (
            <motion.div key="thanks" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="rounded-3xl p-10 text-center border-2" style={{ background: "white", borderColor: brand.gold }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: brand.amberFade }}>
                <Heart className="w-10 h-10" style={{ color: brand.amber }} />
              </motion.div>
              <h3 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Playfair Display', serif", color: brand.ink }}>Thank You!</h3>
              <p className="text-lg leading-relaxed mb-6" style={{ color: brand.inkLight }}>
                Your donation of <strong style={{ color: brand.chili }}>${effectiveAmount.toFixed(2)}</strong> means so much.
                You're part of the Novi's Kitchen family. 🍗❤️
              </p>
              <button onClick={() => { setDonated(false); setSelected(25); setUseCustom(false); setCustomValue(""); }}
                className="text-sm font-semibold underline" style={{ color: brand.amber }}>
                Make another donation
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="rounded-3xl p-8 md:p-10 border-2" style={{ background: "white", borderColor: brand.chiliFade }}>
              <p className="text-sm font-bold tracking-widest uppercase mb-4 text-center" style={{ color: brand.inkLight }}>Choose an amount</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {PRESET_AMOUNTS.map((amount) => (
                  <motion.button key={amount} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => { setSelected(amount); setUseCustom(false); setCustomValue(""); }}
                    className="py-4 rounded-2xl font-bold text-lg border-2 transition-all duration-200"
                    style={selected === amount && !useCustom
                      ? { background: brand.chili, color: "white", borderColor: brand.chili, boxShadow: `0 8px 20px ${brand.chili}44` }
                      : { background: "white", color: brand.ink, borderColor: brand.chiliFade }}>
                    ${amount}
                  </motion.button>
                ))}
              </div>

              <div className="flex items-center gap-3 mb-4">
                <input type="checkbox" id="custom-toggle" checked={useCustom}
                  onChange={(e) => { if (e.target.checked) { setUseCustom(true); setSelected(null); } else { setUseCustom(false); setSelected(25); } }}
                  className="w-5 h-5 cursor-pointer" style={{ accentColor: brand.amber }} />
                <label htmlFor="custom-toggle" className="text-sm font-semibold cursor-pointer" style={{ color: brand.ink }}>Other amount</label>
              </div>

              <AnimatePresence>
                {useCustom && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }} className="overflow-hidden mb-4">
                    <div className="flex items-center gap-3 rounded-2xl border-2 px-5 py-3" style={{ borderColor: brand.amber }}>
                      <span className="text-2xl font-bold" style={{ color: brand.chili }}>$</span>
                      <input type="number" min="1" step="1" placeholder="Enter amount" value={customValue}
                        onChange={(e) => setCustomValue(e.target.value)}
                        className="flex-1 text-2xl font-bold bg-transparent outline-none" style={{ color: brand.ink }} autoFocus />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {effectiveAmount > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-5">
                  <span className="text-sm font-semibold" style={{ color: brand.inkLight }}>
                    You're donating:{" "}
                    <span className="text-xl font-bold" style={{ color: brand.chili }}>
                      ${effectiveAmount % 1 === 0 ? effectiveAmount : effectiveAmount.toFixed(2)}
                    </span>
                  </span>
                </motion.div>
              )}

              <motion.button
                whileHover={effectiveAmount > 0 ? { scale: 1.03 } : {}}
                whileTap={effectiveAmount > 0 ? { scale: 0.97 } : {}}
                onClick={() => { if (effectiveAmount > 0) setDonated(true); }}
                disabled={effectiveAmount <= 0}
                className="w-full py-5 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all duration-300"
                style={effectiveAmount > 0
                  ? { background: brand.chili, boxShadow: `0 12px 32px ${brand.chili}55` }
                  : { background: brand.inkLight + "66", cursor: "not-allowed" }}>
                <Heart className="w-5 h-5" />
                Donate {effectiveAmount > 0 && `$${effectiveAmount % 1 === 0 ? effectiveAmount : effectiveAmount.toFixed(2)}`}
              </motion.button>
              <p className="text-xs text-center mt-4" style={{ color: brand.inkLight }}>
                Secure payment · 100% goes to Novi's Kitchen
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Contact Section ───────────────────────────────────────────
function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-24 md:py-36 bg-white relative overflow-hidden" ref={ref}>
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: brand.chili }}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{ background: brand.chiliFade }}
          >
            <Sparkles className="w-4 h-4" style={{ color: brand.chili }} />
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: brand.chili }}
            >
              Place an Order
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Playfair Display', serif", color: brand.ink }}
          >
            Let's Get Cooking
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: brand.inkLight }}>
            Ready to order? Reach out directly — Novi's Kitchen takes custom catering
            orders, party platters, and individual meals. We'd love to cook for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="rounded-3xl p-8 md:p-10 border-2 flex flex-col gap-6"
          style={{ background: brand.cream, borderColor: brand.chiliFade }}
        >
          {/* Phone */}
          <a
            href="tel:+15551234567"
            className="flex items-center gap-5 p-5 rounded-2xl bg-white border-2 transition-all duration-200 hover:shadow-lg group"
            style={{ borderColor: brand.chiliFade }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: brand.chiliFade }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: brand.chili }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: brand.inkLight }}>
                Call or Text
              </p>
              <p
                className="text-xl font-bold group-hover:underline"
                style={{ color: brand.ink, fontFamily: "'Playfair Display', serif" }}
              >
                (555) 123-4567
              </p>
              <p className="text-sm" style={{ color: brand.inkLight }}>
                Available Mon – Sat · 10 AM – 7 PM
              </p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:orders@noviskitchen.com"
            className="flex items-center gap-5 p-5 rounded-2xl bg-white border-2 transition-all duration-200 hover:shadow-lg group"
            style={{ borderColor: brand.chiliFade }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: brand.amberFade }}
            >
              <svg
                className="w-6 h-6"
                style={{ color: brand.amber }}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: brand.inkLight }}>
                Email Us
              </p>
              <p
                className="text-xl font-bold group-hover:underline"
                style={{ color: brand.ink, fontFamily: "'Playfair Display', serif" }}
              >
                orders@noviskitchen.com
              </p>
              <p className="text-sm" style={{ color: brand.inkLight }}>
                We reply within 24 hours
              </p>
            </div>
          </a>

          <p className="text-center text-sm font-medium" style={{ color: brand.inkLight }}>
            Serving the local area · Catering available for all occasions
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ── Page Export ───────────────────────────────────────────────
export default function NovisKitchenPage() {
  return (
    <>
      <MenuSection />
      <SlideshowSection />
      <DonationSection />
      <ContactSection />
    </>
  );
}
