/**
 * High-Performance Multi-Domain React Web Synthesizer
 * Generates rich, fully functional, multi-section Vite/React applications
 * with Tailwind CSS and Lucide-react icons tailored to any prompt.
 */

export function synthesizeCodeFromPrompt(rawPrompt, palette = null, blueprint = null) {
  const prompt = (rawPrompt || "").trim();
  const lower = prompt.toLowerCase();

  // Color scheme defaults or from palette
  const primaryColor = palette?.primary || "#6366f1"; // Indigo
  const accentColor = palette?.accent || "#ec4899";  // Pink/Fuchsia

  // Domain detection heuristics
  const isEcom = /shop|store|product|buy|cart|merch|clothing|sneaker|shoes|apparel|jewelry|watch|fashion|order|ecommerce/i.test(lower);
  const isPortfolio = /portfolio|resume|cv|developer|designer|engineer|personal website|freelancer|photographer|artist/i.test(lower);
  const isCrypto = /crypto|bitcoin|btc|eth|solana|wallet|trading|fintech|banking|invest|token|web3|defi|exchange|stock/i.test(lower);
  const isFood = /restaurant|cafe|coffee|food|pizza|burger|sushi|bistro|bakery|dining|menu|chef|recipe|bar/i.test(lower);
  const isFitness = /gym|fitness|workout|trainer|crossfit|yoga|health|wellness|nutrition|muscle|training|diet/i.test(lower);
  const isSaaS = /saas|software|platform|dashboard|ai tool|analytics|automation|cloud|api|devops|crm|b2b/i.test(lower);

  let domain = "saas";
  let title = "Kriti AI Modern Platform";
  let code = "";

  if (isEcom) {
    domain = "ecommerce";
    title = extractBrandName(prompt, ["Store", "Shop", "Apparel", "Luxe", "Merch", "Vault"]) || "Apex Merchandise & Store";
    code = generateEcommerceCode(title, prompt);
  } else if (isCrypto) {
    domain = "crypto";
    title = extractBrandName(prompt, ["Exchange", "Capital", "Pay", "Vault", "FinTech", "Crypto"]) || "Nexus Crypto Exchange";
    code = generateCryptoCode(title, prompt);
  } else if (isFood) {
    domain = "food";
    title = extractBrandName(prompt, ["Bistro", "Cafe", "Kitchen", "Roasters", "Diner", "Cuisine"]) || "Artisan Gourmet Bistro";
    code = generateFoodCode(title, prompt);
  } else if (isFitness) {
    domain = "fitness";
    title = extractBrandName(prompt, ["Fitness", "Gym", "Pulse", "Iron", "Athletics", "Studio"]) || "IronPulse Fitness Studio";
    code = generateFitnessCode(title, prompt);
  } else if (isPortfolio) {
    domain = "portfolio";
    title = extractBrandName(prompt, ["Portfolio", "Dev", "Designs", "Creative", "Studio"]) || "Alex Morgan Portfolio";
    code = generatePortfolioCode(title, prompt);
  } else if (isSaaS) {
    domain = "saas";
    title = extractBrandName(prompt, ["AI", "Cloud", "Scale", "Flow", "Platform", "Hub"]) || "NeuroScale AI Platform";
    code = generateSaaSCode(title, prompt);
  } else {
    // Universal Generator tailored to prompt keywords
    title = extractBrandName(prompt, ["Studio", "Hub", "Platform", "App", "Pro"]) || "Modern Digital Platform";
    code = generateUniversalCode(title, prompt);
  }

  return {
    projectTitle: title,
    explanation: `Custom-tailored interactive ${domain.toUpperCase()} React web application generated for "${prompt}". Features responsive navigation, interactive state management, custom-curated catalog/components, dark glassmorphic styling, and WCAG-compliant Tailwind CSS.`,
    files: {
      "/App.js": {
        code: code.trim(),
      },
    },
    generatedFiles: ["/App.js"],
  };
}

function extractBrandName(prompt, suffixes = ["Studio", "Platform"]) {
  const words = prompt.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 2);
  if (words.length >= 2) {
    const capitalized = words.slice(0, 2).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    return `${capitalized} ${suffixes[0] || ''}`.trim();
  }
  return null;
}

// -------------------------------------------------------------
// 1. E-COMMERCE GENERATOR
// -------------------------------------------------------------
function generateEcommerceCode(title, prompt) {
  const isAnime = /anime|manga|otaku|cyberpunk/i.test(prompt);
  const isLuxury = /luxury|watch|jewelry|gold|vip/i.test(prompt);

  const heroBadge = isAnime ? "🎌 Exclusive Anime & Cyberpunk Streetwear Drop" : isLuxury ? "✨ Handcrafted Luxury Timepieces & Accessories" : "🔥 New Season Collection - 30% Off Limited Time";
  const heroHeading = isAnime ? "Elevate Your Style with Iconic Anime Wear" : isLuxury ? "Timeless Elegance & Precision Craftsmanship" : "Premium Gear Designed for Modern Lifestyles";

  return `import React, { useState } from 'react';
import { 
  ShoppingBag, Sparkles, Star, Heart, ArrowRight, Check, X, 
  Menu, Search, Filter, ShieldCheck, Truck, RefreshCw, Zap, Eye
} from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [likedItems, setLikedItems] = useState({});

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'trending', name: 'Trending' },
    { id: 'new', name: 'New Arrivals' },
    { id: 'exclusive', name: 'Limited Drops' }
  ];

  const products = [
    {
      id: 1,
      name: '${isAnime ? "Neon Phantom Cyber Hoodie" : isLuxury ? "Chronograph Royal Sapphire Watch" : "Urban Stealth Performance Jacket"}',
      category: 'trending',
      price: 89.99,
      rating: 4.9,
      reviews: 128,
      tag: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
      description: 'Engineered with heavy-blend organic cotton, water-resistant outer coating, and custom holographic screen-printed graphics.'
    },
    {
      id: 2,
      name: '${isAnime ? "Akira Oversized Graphic Tee" : isLuxury ? "Obsidian Minimalist Automatic Watch" : "AeroLight Core Athletic Runner"}',
      category: 'new',
      price: 44.99,
      rating: 4.8,
      reviews: 94,
      tag: 'New Release',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      description: '240 GSM heavyweight combed cotton with vintage wash and reinforced stitching for daily durability.'
    },
    {
      id: 3,
      name: '${isAnime ? "Shinobi Tactical Cargo Pants" : isLuxury ? "Vintage Gold Tourbillon Edition" : "Apex All-Weather Commuter Backpack"}',
      category: 'exclusive',
      price: 119.00,
      rating: 5.0,
      reviews: 62,
      tag: 'Limited 100 Pcs',
      image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=600&auto=format&fit=crop&q=80',
      description: 'Military-grade ripstop fabric with modular magnetic buckle utility pockets and ergonomic tapered fit.'
    },
    {
      id: 4,
      name: '${isAnime ? "Cyberpunk Holographic Bomber" : isLuxury ? "Titanium Ceramic Diver Timepiece" : "FlexKnit Minimalist Low-Top Sneakers"}',
      category: 'trending',
      price: 149.50,
      rating: 4.9,
      reviews: 210,
      tag: 'Selling Fast',
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=600&auto=format&fit=crop&q=80',
      description: 'Iridescent metallic shell with insulated thermal lining, custom debossed hardware, and ribbed storm cuffs.'
    },
    {
      id: 5,
      name: '${isAnime ? "Mecha Unit-01 Embroidered Cap" : isLuxury ? "Italian Saffiano Leather Cardholder" : "Performance Polarized Shades"}',
      category: 'new',
      price: 34.00,
      rating: 4.7,
      reviews: 45,
      tag: 'Fresh Drop',
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
      description: 'Unstructured low-profile 6-panel silhouette with 3D high-density embroidery and antique brass clasp.'
    },
    {
      id: 6,
      name: '${isAnime ? "Neo-Tokyo Canvas Messenger Bag" : isLuxury ? "Platinum Link Minimalist Bracelet" : "Thermal Hydro Stainless Flask"}',
      category: 'exclusive',
      price: 68.00,
      rating: 4.9,
      reviews: 83,
      tag: 'Member Exclusive',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
      description: 'Waxed water-repellent canvas with padded laptop compartment and quick-release aircraft aluminum buckle.'
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const nextQty = item.qty + delta;
        return nextQty > 0 ? { ...item, qty: nextQty } : item;
      }
      return item;
    }));
  };

  const toggleLike = (id) => {
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-fuchsia-900/60 border-b border-indigo-500/20 py-2 text-center text-xs font-semibold text-indigo-200">
        ⚡ FLASH SALE: Free Global Express Shipping on orders over $75 with code <span className="underline font-bold text-white">FREESHIP</span>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/25">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                ${title}
              </span>
              <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Official Drop
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#catalog" className="hover:text-indigo-400 transition">Collection</a>
            <a href="#featured" className="hover:text-indigo-400 transition">Featured</a>
            <a href="#reviews" className="hover:text-indigo-400 transition">Reviews</a>
            <a href="#faq" className="hover:text-indigo-400 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-slate-200 transition"
              title="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-14 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-6">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>${heroBadge}</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto">
          ${heroHeading} <br />
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Crafted for the Fearless
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-sm sm:text-base mb-8 leading-relaxed">
          Premium aesthetics, ultra-durable textiles, and limited edition releases. Explore our hand-curated catalog with instant cart checkout.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a href="#catalog" className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5">
            Shop The Drop
          </a>
          <button 
            onClick={() => setSelectedProduct(products[0])}
            className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-semibold text-sm transition"
          >
            Quick View Top Pick
          </button>
        </div>

        {/* Perks Banner */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-center gap-3">
            <Truck className="w-5 h-5 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">Free Worldwide Express</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">100% Authentic Guarantee</span>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-fuchsia-400" />
            <span className="text-xs font-semibold text-slate-300">30-Day Hassle-Free Returns</span>
          </div>
        </div>
      </header>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Curated Collection</h2>
            <p className="text-xs text-slate-400 mt-1">Showing {filteredProducts.length} premium products</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={\`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer \${
                  activeCategory === c.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }\`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div 
              key={p.id}
              className="rounded-2xl bg-slate-900/70 border border-slate-800/90 overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-slate-950">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-indigo-950/90 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold">
                  {p.tag}
                </span>

                <button
                  onClick={() => toggleLike(p.id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-slate-950/80 text-slate-300 hover:text-rose-400 transition backdrop-blur-sm"
                  title="Favorite"
                >
                  <Heart className={\`w-4 h-4 \${likedItems[p.id] ? 'fill-rose-500 text-rose-500' : ''}\`} />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-200">{p.rating}</span>
                    <span className="text-slate-500">({p.reviews})</span>
                  </div>
                  <h3 className="font-bold text-base text-white group-hover:text-indigo-400 transition mb-2">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {p.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                  <div className="text-xl font-extrabold text-white">
                    $\${p.price.toFixed(2)}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProduct(p)}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => addToCart(p)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-md shadow-indigo-600/30"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick View Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 relative overflow-hidden shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl overflow-hidden h-72 bg-slate-950">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold">
                    {selectedProduct.tag}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-2 mb-1">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mb-3">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold text-slate-200">{selectedProduct.rating}</span>
                    <span className="text-slate-500">({selectedProduct.reviews} verified reviews)</span>
                  </div>
                  <div className="text-2xl font-extrabold text-indigo-400 mb-3">
                    $\${selectedProduct.price.toFixed(2)}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {selectedProduct.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    setSelectedProduct(null);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">Your Cart ({totalItems})</h3>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6">
                  <ShoppingBag className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-sm font-semibold">Your shopping cart is currently empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                  >
                    Start Exploring
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex gap-3 items-center justify-between">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <div className="text-xs font-semibold text-indigo-400 mt-0.5">$\${(item.price * item.qty).toFixed(2)}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button 
                          onClick={() => updateQty(item.id, -1)}
                          className="w-5 h-5 rounded bg-slate-800 text-white text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs text-slate-200 font-mono">{item.qty}</span>
                        <button 
                          onClick={() => updateQty(item.id, 1)}
                          className="w-5 h-5 rounded bg-slate-800 text-white text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-slate-800 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="font-bold text-white">$\${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Express Shipping</span>
                  <span className="text-emerald-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold border-t border-slate-800 pt-2 text-white">
                  <span>Total Due</span>
                  <span className="text-indigo-400">$\${subtotal.toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => alert("🎉 Checkout simulated successfully! Thank you for testing.")}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Proceed to Secure Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <span className="font-bold text-lg text-white">${title}</span>
            <p className="text-xs text-slate-400 mt-1">Official merchandise & premium curated apparel store.</p>
          </div>
          <p className="text-xs text-slate-500">&copy; 2026 ${title}. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-slate-400">
            <a href="#" className="hover:text-indigo-400">Shipping Policy</a>
            <a href="#" className="hover:text-indigo-400">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}`;
}

// -------------------------------------------------------------
// 2. CRYPTO / FINTECH / TRADING GENERATOR
// -------------------------------------------------------------
function generateCryptoCode(title, prompt) {
  return `import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, ArrowUpRight, ShieldCheck, Zap, 
  Wallet, RefreshCw, Layers, CheckCircle2, ChevronRight, Bell, Lock, Globe
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('swap');
  const [fromAmount, setFromAmount] = useState('1.5');
  const [selectedAsset, setSelectedAsset] = useState('ETH');
  const [walletConnected, setWalletConnected] = useState(false);

  const marketAssets = [
    { symbol: 'BTC', name: 'Bitcoin', price: 92450.00, change: 4.82, cap: '$1.82T', volume: '$34.2B' },
    { symbol: 'ETH', name: 'Ethereum', price: 3480.50, change: 6.14, cap: '$418.5B', volume: '$18.7B' },
    { symbol: 'SOL', name: 'Solana', price: 215.20, change: 12.35, cap: '$98.2B', volume: '$9.4B' },
    { symbol: 'AVAX', name: 'Avalanche', price: 42.80, change: -1.45, cap: '$16.8B', volume: '$1.8B' },
  ];

  const rate = selectedAsset === 'ETH' ? 3480.50 : selectedAsset === 'BTC' ? 92450 : 215.20;
  const convertedUsd = (parseFloat(fromAmount || 0) * rate).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/3 w-[600px] h-[500px] bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
      </div>

      {/* Live Crypto Ticker Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 flex items-center gap-8 overflow-x-auto text-xs font-mono">
        <span className="text-cyan-400 font-bold flex items-center gap-1 shrink-0">
          <Zap className="w-3.5 h-3.5" /> LIVE MARKET FEED:
        </span>
        {marketAssets.map(a => (
          <div key={a.symbol} className="flex items-center gap-2 shrink-0">
            <span className="font-bold text-white">{a.symbol}</span>
            <span className="text-slate-300">$\${a.price.toLocaleString()}</span>
            <span className={\`flex items-center text-[11px] \${a.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}\`}>
              {a.change >= 0 ? '+' : ''}{a.change}%
            </span>
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-500/25">
              <TrendingUp className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              ${title}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#markets" className="hover:text-cyan-400 transition">Markets</a>
            <a href="#swap" className="hover:text-cyan-400 transition">Instant Swap</a>
            <a href="#security" className="hover:text-cyan-400 transition">Institutional Security</a>
          </div>

          <button
            onClick={() => setWalletConnected(!walletConnected)}
            className={\`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg \${
              walletConnected 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25'
            }\`}
          >
            <Wallet className="w-4 h-4" />
            <span>{walletConnected ? '0x8F9...e4B (Connected)' : 'Connect Web3 Wallet'}</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" /> Next-Gen Non-Custodial Trading Engine
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Institutional Liquidity. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Zero Slippage Swaps.
            </span>
          </h1>

          <p className="text-slate-400 text-base mb-8 max-w-xl leading-relaxed">
            Trade top digital assets across multiple blockchains with sub-millisecond execution, automated yield farming, and decentralized custody.
          </p>

          <div className="grid grid-cols-3 gap-4 max-w-md">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-bold text-cyan-400">$4.8B+</div>
              <div className="text-[11px] text-slate-400">24h Volume</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-bold text-cyan-400">&lt; 10ms</div>
              <div className="text-[11px] text-slate-400">Order Latency</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xl font-bold text-cyan-400">100%</div>
              <div className="text-[11px] text-slate-400">Proof of Reserves</div>
            </div>
          </div>
        </div>

        {/* Interactive Swap Card Widget */}
        <div id="swap" className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl backdrop-blur-xl shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex gap-2 text-xs font-bold">
                <button 
                  onClick={() => setActiveTab('swap')}
                  className={\`px-3 py-1.5 rounded-lg \${activeTab === 'swap' ? 'bg-cyan-500 text-black' : 'text-slate-400'}\`}
                >
                  Quick Swap
                </button>
                <button 
                  onClick={() => setActiveTab('limit')}
                  className={\`px-3 py-1.5 rounded-lg \${activeTab === 'limit' ? 'bg-cyan-500 text-black' : 'text-slate-400'}\`}
                >
                  Limit Order
                </button>
              </div>
              <RefreshCw className="w-4 h-4 text-slate-500 hover:text-cyan-400 cursor-pointer transition" />
            </div>

            <div className="space-y-3">
              {/* Pay Input */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>You Pay</span>
                  <span>Balance: 8.45 {selectedAsset}</span>
                </div>
                <div className="flex items-center justify-between">
                  <input
                    type="number"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="bg-transparent text-2xl font-bold text-white outline-none w-36"
                  />
                  <select
                    value={selectedAsset}
                    onChange={(e) => setSelectedAsset(e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white text-xs font-bold px-3 py-2 rounded-xl outline-none"
                  >
                    <option value="ETH">ETH</option>
                    <option value="BTC">BTC</option>
                    <option value="SOL">SOL</option>
                  </select>
                </div>
              </div>

              {/* Receive Output */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between text-xs text-slate-400 mb-1">
                  <span>You Receive (Estimated)</span>
                  <span>Fee: 0.05%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-cyan-400">
                    $\${convertedUsd}
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-white">
                    USDC
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex justify-between px-1">
                <span>Guaranteed Rate: 1 {selectedAsset} = $\${rate.toLocaleString()} USDC</span>
                <span className="text-emerald-400">Gas: &lt; $0.40</span>
              </div>

              <button
                onClick={() => alert(\`Swap executed: \${fromAmount} \${selectedAsset} for $\${convertedUsd} USDC!\`)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition hover:opacity-95 mt-2"
              >
                Execute Decentralized Swap
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Market Watch Table */}
      <section id="markets" className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Cryptocurrency Asset Overview</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time quotes with verifiable smart contract liquidity</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="p-4">Asset</th>
                <th className="p-4">Price</th>
                <th className="p-4">24h Change</th>
                <th className="p-4 hidden sm:table-cell">Market Cap</th>
                <th className="p-4 hidden sm:table-cell">24h Volume</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {marketAssets.map(a => (
                <tr key={a.symbol} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono text-[10px]">
                      {a.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div>{a.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{a.symbol}</div>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-white">$\${a.price.toLocaleString()}</td>
                  <td className={\`p-4 font-bold \${a.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}\`}>
                    {a.change >= 0 ? '+' : ''}{a.change}%
                  </td>
                  <td className="p-4 text-slate-400 hidden sm:table-cell">{a.cap}</td>
                  <td className="p-4 text-slate-400 hidden sm:table-cell">{a.volume}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        setSelectedAsset(a.symbol);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500 hover:text-black text-slate-200 text-xs font-semibold transition"
                    >
                      Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <span className="font-bold text-lg text-white">${title}</span>
          <p className="text-xs text-slate-500">&copy; 2026 ${title}. Decentralized & Non-Custodial.</p>
        </div>
      </footer>
    </div>
  );
}`;
}

// -------------------------------------------------------------
// 3. PORTFOLIO GENERATOR
// -------------------------------------------------------------
function generatePortfolioCode(title, prompt) {
  return `import React, { useState } from 'react';
import { 
  Code2, ExternalLink, Github, Mail, Sparkles, Layers, 
  Terminal, User, CheckCircle2, ArrowRight, Download, Send
} from 'lucide-react';

export default function App() {
  const [filter, setFilter] = useState('all');
  const [contactSent, setContactSent] = useState(false);
  const [contactName, setContactName] = useState('');

  const projects = [
    {
      id: 1,
      title: 'NeuroScale AI Synthesis Engine',
      category: 'ai',
      desc: 'Next.js 15 & PyTorch full-stack web application for automated UI generation and zero-shot intent extraction.',
      tags: ['Next.js', 'React', 'Tailwind', 'Python', 'FastAPI'],
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      stars: '1.2k',
      liveUrl: '#'
    },
    {
      id: 2,
      title: 'Aether Decentralized Swap Matrix',
      category: 'web3',
      desc: 'High-frequency non-custodial crypto trading DEX with sub-10ms latency and interactive charting.',
      tags: ['Solidity', 'Ethers.js', 'TypeScript', 'Prisma'],
      image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80',
      stars: '840',
      liveUrl: '#'
    },
    {
      id: 3,
      title: 'LuxeStore Headless Commerce',
      category: 'frontend',
      desc: 'Ultra-fast headless Shopify React storefront with 99.8 Google Lighthouse performance score.',
      tags: ['React 18', 'GraphQL', 'Tailwind CSS', 'Vite'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      stars: '2.1k',
      liveUrl: '#'
    }
  ];

  const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);

  const handleContact = (e) => {
    e.preventDefault();
    setContactSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono font-bold text-indigo-400 text-sm">
            <Terminal className="w-4 h-4" />
            <span>dev@portfolio:~$</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#projects" className="hover:text-indigo-400 transition">Projects</a>
            <a href="#skills" className="hover:text-indigo-400 transition">Skills</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Contact</a>
          </div>

          <a 
            href="#contact" 
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30"
          >
            Hire Me
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-1 mx-auto mb-6 shadow-xl shadow-indigo-500/20">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
            alt="Avatar" 
            className="w-full h-full object-cover rounded-[22px]" 
          />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 text-white">
          Senior Full-Stack &amp; AI Architect
        </h1>
        <p className="text-slate-400 text-base max-w-2xl mx-auto mb-8 leading-relaxed">
          Crafting scalable cloud architectures, interactive React interfaces, and machine learning pipelines.
        </p>

        <div className="flex justify-center gap-4">
          <a 
            href="#projects" 
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/30"
          >
            Explore Featured Work
          </a>
          <button 
            onClick={() => alert("Resume downloaded!")}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" /> Download CV
          </button>
        </div>
      </header>

      {/* Projects */}
      <section id="projects" className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Projects</h2>
          <div className="flex gap-2 text-xs">
            {['all', 'ai', 'web3', 'frontend'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={\`px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider text-[11px] transition \${
                  filter === cat ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map(p => (
            <div key={p.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/50 transition">
              <div>
                <img src={p.image} alt={p.title} className="w-full h-44 rounded-xl object-cover mb-4" />
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] text-indigo-300 font-mono border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <a href={p.liveUrl} className="flex items-center justify-between text-xs font-bold text-indigo-400 hover:text-indigo-300 pt-3 border-t border-slate-800">
                <span>View Case Study</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-xl mx-auto px-6 py-16 border-t border-slate-800">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Let's Build Something Exceptional</h2>
          <p className="text-xs text-slate-400 mt-1">Available for contract consulting and full-time senior roles.</p>
        </div>

        {contactSent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center text-emerald-300">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
            <p className="text-xs mt-1">Thank you, {contactName || 'there'}. I will get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleContact} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Your Name</label>
              <input 
                required 
                type="text" 
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500" 
                placeholder="Sarah Connor"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Email Address</label>
              <input 
                required 
                type="email" 
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500" 
                placeholder="sarah@company.com"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Project Details</label>
              <textarea 
                required 
                rows="3" 
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-500 resize-none" 
                placeholder="Tell me about your project scope and timeline..."
              />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2">
              <Send className="w-3.5 h-3.5" /> Send Message
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500">
        &copy; 2026 ${title}. Built with React, Tailwind CSS, &amp; Lucide Icons.
      </footer>
    </div>
  );
}`;
}

// -------------------------------------------------------------
// 4. RESTAURANT / FOOD GENERATOR
// -------------------------------------------------------------
function generateFoodCode(title, prompt) {
  return `import React, { useState } from 'react';
import { 
  Utensils, Sparkles, Clock, MapPin, Phone, Star, 
  Check, Calendar, Users, Coffee, ShoppingBag
} from 'lucide-react';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('specials');
  const [reservationDone, setReservationDone] = useState(false);
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('2026-09-01');

  const menu = [
    {
      id: 1,
      name: 'Truffle Wagyu Ribeye &amp; Smoked Butter',
      category: 'specials',
      price: '$58.00',
      desc: 'Prime A5 Wagyu with wild forest truffle reduction, roasted bone marrow, and micro-herbs.',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      tag: "Chef's Signature"
    },
    {
      id: 2,
      name: 'Artisan Wood-Fired Neapolitan Pizza',
      category: 'mains',
      price: '$24.50',
      desc: 'San Marzano DOP tomatoes, buffalo mozzarella, fresh basil, and extra virgin cold-pressed olive oil.',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      tag: 'Organic'
    },
    {
      id: 3,
      name: 'Wild Atlantic Salmon Tartare',
      category: 'starters',
      price: '$19.00',
      desc: 'Citrus ponzu glaze, avocado mousse, crispy shallots, and toasted nori crackers.',
      image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=600&auto=format&fit=crop&q=80',
      tag: 'Fresh Catch'
    },
    {
      id: 4,
      name: 'Matcha Lava Cake &amp; Tahitian Gelato',
      category: 'desserts',
      price: '$14.00',
      desc: 'Warm molten Uji ceremonial matcha cake paired with Madagascar vanilla bean gelato.',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
      tag: 'Sweet Finish'
    }
  ];

  const filtered = activeCategory === 'all' ? menu : menu.filter(m => m.category === activeCategory);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans antialiased selection:bg-amber-500 selection:text-black">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-stone-950/80 border-b border-stone-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Utensils className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl font-bold tracking-tight text-white">${title}</span>
          </div>

          <div className="hidden md:flex gap-6 text-xs font-semibold text-stone-300">
            <a href="#menu" className="hover:text-amber-400">Our Menu</a>
            <a href="#reserve" className="hover:text-amber-400">Reservations</a>
            <a href="#story" className="hover:text-amber-400">Our Story</a>
          </div>

          <a href="#reserve" className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition">
            Book Table
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="text-amber-400 text-xs uppercase tracking-widest font-bold block mb-3">Michelin Guide Recommended</span>
        <h1 className="font-serif text-5xl sm:text-7xl font-bold tracking-tight mb-6 text-stone-50">
          Culinary Artistry &amp; Sensory Elegance
        </h1>
        <p className="text-stone-400 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
          Farm-to-table organic ingredients, artisanal wine pairings, and an unforgettable dining experience in the heart of the city.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#menu" className="px-7 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20">
            View Tasting Menu
          </a>
          <a href="#reserve" className="px-7 py-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 font-semibold text-xs">
            Reserve Online
          </a>
        </div>
      </header>

      {/* Menu Section */}
      <section id="menu" className="max-w-5xl mx-auto px-6 py-14 border-t border-stone-800">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-bold text-stone-100">Curated Menu</h2>
          <div className="flex gap-2">
            {['specials', 'mains', 'starters', 'desserts'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={\`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition \${
                  activeCategory === cat ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-900 text-stone-400 border border-stone-800'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="p-5 rounded-2xl bg-stone-900/60 border border-stone-800 flex gap-4 items-center">
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-serif font-bold text-base text-stone-100">{item.name}</h3>
                  <span className="font-mono font-bold text-amber-400 text-sm">{item.price}</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed mb-2">{item.desc}</p>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reservation Form */}
      <section id="reserve" className="max-w-xl mx-auto px-6 py-16 border-t border-stone-800">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl font-bold text-stone-100">Table Reservation</h2>
          <p className="text-xs text-stone-400 mt-1">Instant guaranteed table booking with no reservation fees.</p>
        </div>

        {reservationDone ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center text-amber-300">
            <Check className="w-8 h-8 mx-auto mb-2 text-amber-400" />
            <h4 className="font-bold text-sm">Table Reserved!</h4>
            <p className="text-xs mt-1">We look forward to hosting your party of {guests} on {date}. Confirmation SMS dispatched.</p>
          </div>
        ) : (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              setReservationDone(true);
            }} 
            className="p-6 rounded-2xl bg-stone-900 border border-stone-800 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">Party Size</label>
                <select 
                  value={guests} 
                  onChange={e => setGuests(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none"
                >
                  <option value="2">2 Guests (Table for 2)</option>
                  <option value="4">4 Guests (Booth)</option>
                  <option value="6">6+ Guests (Private Room)</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-stone-400 block mb-1">Reservation Date</label>
                <input 
                  type="date" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white outline-none" 
                />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20">
              Confirm Reservation
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 bg-stone-950 px-6 py-8 text-center text-xs text-stone-500">
        &copy; 2026 ${title}. Farm-to-Table Fine Dining.
      </footer>
    </div>
  );
}`;
}

// -------------------------------------------------------------
// 5. FITNESS & GYM GENERATOR
// -------------------------------------------------------------
function generateFitnessCode(title, prompt) {
  return `import React, { useState } from 'react';
import { 
  Zap, Flame, ShieldCheck, Trophy, ArrowRight, Check, 
  Calendar, Activity, User, Dumbbell, Play
} from 'lucide-react';

export default function App() {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(175);
  const [activePlan, setActivePlan] = useState('pro');

  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-rose-600 flex items-center justify-center font-bold text-white">
              <Flame className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">${title}</span>
          </div>

          <div className="hidden md:flex gap-6 text-xs font-semibold text-slate-300">
            <a href="#calculator" className="hover:text-rose-400">BMI Calc</a>
            <a href="#plans" className="hover:text-rose-400">Memberships</a>
            <a href="#trainers" className="hover:text-rose-400">Trainers</a>
          </div>

          <a href="#plans" className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md shadow-rose-600/30">
            Join 7-Day Free Trial
          </a>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-semibold mb-6">
          <Flame className="w-4 h-4 text-rose-400" /> Transform Your Physical Performance
        </div>

        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Unleash Your <br />
          <span className="bg-gradient-to-r from-rose-500 via-amber-400 to-rose-400 bg-clip-text text-transparent">
            Peak Human Potential
          </span>
        </h1>

        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base mb-8 leading-relaxed">
          Elite strength equipment, Olympic lifting platforms, and personalized biometric coaching designed to push your limits.
        </p>

        <div className="flex justify-center gap-4">
          <a href="#plans" className="px-8 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xl shadow-rose-600/30">
            Start Free Membership
          </a>
          <a href="#calculator" className="px-8 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs font-semibold">
            Calculate Biometrics
          </a>
        </div>
      </header>

      {/* Interactive Biometric Calculator */}
      <section id="calculator" className="max-w-2xl mx-auto px-6 py-14">
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Activity className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-white">Live BMI &amp; Health Metric Calculator</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Body Weight: <span className="font-bold text-white">{weight} kg</span></label>
              <input 
                type="range" 
                min="40" 
                max="160" 
                value={weight} 
                onChange={e => setWeight(Number(e.target.value))}
                className="w-full accent-rose-500" 
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Height: <span className="font-bold text-white">{height} cm</span></label>
              <input 
                type="range" 
                min="130" 
                max="220" 
                value={height} 
                onChange={e => setHeight(Number(e.target.value))}
                className="w-full accent-rose-500" 
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Calculated Body Mass Index (BMI)</div>
              <div className="text-3xl font-extrabold text-rose-400 mt-1">{bmi}</div>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Optimal Fitness' : bmi < 30 ? 'Overweight' : 'High Mass'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section id="plans" className="max-w-5xl mx-auto px-6 py-14 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center text-white mb-10">Transparent Membership Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { id: 'starter', name: 'Standard Club', price: '$29', perks: ['Open Gym Access', 'Locker & Sauna Access', 'Mobile App Schedule'] },
            { id: 'pro', name: 'Elite Performance', price: '$59', perks: ['All Club Perks', 'Unlimited HIIT & Yoga Classes', 'Monthly Biometric Scan', 'Recovery Lounge'], popular: true },
            { id: 'vip', name: 'VIP Athlete', price: '$99', perks: ['All Elite Perks', 'Weekly 1-on-1 Personal Trainer', 'Custom Nutrition Plan', '24/7 VIP Access'] }
          ].map(plan => (
            <div 
              key={plan.id} 
              className={\`p-6 rounded-3xl border flex flex-col justify-between \${
                plan.popular ? 'bg-slate-900 border-rose-500 shadow-2xl shadow-rose-500/20' : 'bg-slate-950 border-slate-800'
              }\`}
            >
              <div>
                <h4 className="text-lg font-bold text-white">{plan.name}</h4>
                <div className="text-3xl font-extrabold text-white my-3">{plan.price}<span className="text-xs text-slate-400 font-normal"> /month</span></div>
                <div className="space-y-2 mb-6">
                  {plan.perks.map(p => (
                    <div key={p} className="text-xs text-slate-300 flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-rose-400" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => alert(\`Enrolled in \${plan.name}!\`)}
                className={\`w-full py-3 rounded-xl text-xs font-bold transition \${
                  plan.popular ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-800 text-slate-200'
                }\`}
              >
                Select {plan.name}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500">
        &copy; 2026 ${title}. Built with High Performance Standards.
      </footer>
    </div>
  );
}`;
}

// -------------------------------------------------------------
// 6. SAAS & CLOUD PLATFORM GENERATOR
// -------------------------------------------------------------
function generateSaaSCode(title, prompt) {
  return `import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Globe, 
  Code2, CheckCircle2, ChevronRight, Star, Menu, X, Sliders, Check
} from 'lucide-react';

export default function App() {
  const [annualBilling, setAnnualBilling] = useState(false);
  const [activeTab, setActiveTab] = useState('workflow');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">${title}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition">Features</a>
            <a href="#pricing" className="hover:text-indigo-400 transition">Pricing</a>
            <a href="#reviews" className="hover:text-indigo-400 transition">Reviews</a>
            <a href="#faq" className="hover:text-indigo-400 transition">FAQ</a>
          </div>

          <button className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30">
            Start 14-Day Trial
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Next-Generation Reactive Cloud Architecture
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
          Supercharge Your Workflow With <br />
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Automated Intelligence
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-base sm:text-lg mb-8 leading-relaxed">
          ${title} automates repetitive engineering, deploys scalable cloud microservices, and tracks real-time business telemetry with zero latency.
        </p>

        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold text-xs shadow-xl shadow-indigo-500/25">
            Launch Your Workspace <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs">
            Interactive Documentation
          </button>
        </div>
      </header>

      {/* Bento Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Engineered for Velocity</h2>
          <p className="text-slate-400 text-sm mt-2">Scale without technical debt.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Zap className="w-6 h-6 text-indigo-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Real-Time Reactive Sync</h3>
            <p className="text-xs text-slate-400">Instant multi-tenant state propagation with sub-millisecond web socket triggers.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-3" />
            <h3 className="font-bold text-white mb-1">SOC-2 Type II Certified</h3>
            <p className="text-xs text-slate-400">Enterprise data encryption at rest and in transit with automated audit trails.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <Layers className="w-6 h-6 text-fuchsia-400 mb-3" />
            <h3 className="font-bold text-white mb-1">Extensible Plugin Ecosystem</h3>
            <p className="text-xs text-slate-400">Connect with GitHub, Slack, Docker, and AWS with 1-click webhook integrations.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-16 border-t border-slate-800 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
        <div className="flex items-center justify-center gap-3 mb-10 text-xs">
          <span className={!annualBilling ? 'text-white font-bold' : 'text-slate-400'}>Monthly</span>
          <button 
            onClick={() => setAnnualBilling(!annualBilling)}
            className="w-12 h-6 rounded-full bg-indigo-600 p-1 transition"
          >
            <div className={\`w-4 h-4 rounded-full bg-white transition \${annualBilling ? 'translate-x-6' : 'translate-x-0'}\`} />
          </button>
          <span className={annualBilling ? 'text-white font-bold' : 'text-slate-400'}>Annual (Save 20%)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            { name: 'Starter', price: annualBilling ? '$15' : '$19', desc: 'For individuals & small experiments' },
            { name: 'Professional', price: annualBilling ? '$39' : '$49', desc: 'For fast-growing product teams', popular: true },
            { name: 'Enterprise', price: annualBilling ? '$79' : '$99', desc: 'Dedicated infra & custom SLAs' }
          ].map(t => (
            <div key={t.name} className={\`p-6 rounded-3xl border \${t.popular ? 'bg-slate-900 border-indigo-500' : 'bg-slate-950 border-slate-800'}\`}>
              <h4 className="font-bold text-white">{t.name}</h4>
              <div className="text-3xl font-extrabold text-white my-3">{t.price}<span className="text-xs text-slate-400 font-normal"> /mo</span></div>
              <p className="text-xs text-slate-400 mb-6">{t.desc}</p>
              <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs">Choose Plan</button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500">
        &copy; 2026 ${title}. All rights reserved.
      </footer>
    </div>
  );
}`;
}

// -------------------------------------------------------------
// 7. UNIVERSAL ADAPTIVE GENERATOR
// -------------------------------------------------------------
function generateUniversalCode(title, prompt) {
  return `import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Zap, Star, Menu, X, 
  CheckCircle2, ChevronRight, Layers, Globe, Code2, Heart
} from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const capabilities = [
    { title: "Dynamic Real-Time Experience", desc: "Instantly synthesized components tailored to your direct prompt specifications." },
    { title: "Responsive Multi-Device Layout", desc: "Engineered with mobile-first CSS grid, fluid flex layouts, and adaptive drawers." },
    { title: "Modern Design Aesthetics", desc: "Dark glassmorphism, curated gradients, verified AAA contrast, and micro-interactions." }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background Decorative Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-fuchsia-600/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-fuchsia-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">${title}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition">Features</a>
            <a href="#about" className="hover:text-indigo-400 transition">Overview</a>
            <a href="#contact" className="hover:text-indigo-400 transition">Connect</a>
          </div>

          <button className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30">
            Explore Demo
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" /> Tailored For: "${prompt.slice(0, 50)}..."
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Transforming Digital Ideas Into <br />
          <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            Intuitive Experiences
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-slate-400 text-base mb-8 leading-relaxed">
          Experience world-class digital synthesis featuring stateful interactions, responsive styling, and production-grade React architecture.
        </p>

        <div className="flex justify-center gap-4">
          <button className="flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold text-xs shadow-xl shadow-indigo-500/25">
            Get Started Now <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-semibold text-xs">
            Learn More
          </button>
        </div>
      </header>

      {/* Features Bento */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-14 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Engineered Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((c, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/50 transition">
              <h3 className="font-bold text-white mb-2 text-base">{c.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-8 text-center text-xs text-slate-500">
        &copy; 2026 ${title}. All rights reserved.
      </footer>
    </div>
  );
}`;
}
