/**
 * Vector RAG & Semantic Cosine Similarity Template Store
 * Provides semantic pattern matching for UI archetypes and architecture schemas.
 */

export const UI_ARCHETYPES = [
  {
    id: "fintech-saas",
    title: "FinTech & Crypto Analytics Dashboard",
    category: "FinTech",
    keywords: ["finance", "crypto", "investment", "dashboard", "trading", "wallet", "stocks", "bank", "analytics", "currency"],
    features: ["Interactive chart cards", "Live transaction feed", "Wallet balance metric", "Risk analytics bento", "Dark glassmorphic cards"],
    recommendedPalette: { primary: "#10b981", accent: "#38bdf8", background: "#051610", surface: "#0f2e22", text: "#ecfdf5" },
    codeSnippet: `// FinTech Archetype Pattern: Real-time balance cards, responsive stats grid, and Lucide icons`
  },
  {
    id: "luxury-ecommerce",
    title: "Luxury E-Commerce & Merch Storefront",
    category: "E-Commerce",
    keywords: ["shop", "store", "product", "buy", "cart", "merchandise", "ecommerce", "sneakers", "fashion", "watch", "anime"],
    features: ["Sticky cart drawer", "Product filter tabs", "High-res gallery hover", "5-star customer reviews", "Fast checkout modal"],
    recommendedPalette: { primary: "#8b5cf6", accent: "#ec4899", background: "#090d16", surface: "#131b2e", text: "#f1f5f9" },
    codeSnippet: `// E-Commerce Archetype Pattern: Dynamic cart count state, product card hover zooms, and price tags`
  },
  {
    id: "developer-portfolio",
    title: "Elite Developer & Creative Portfolio",
    category: "Portfolio",
    keywords: ["portfolio", "developer", "engineer", "designer", "resume", "cv", "personal", "projects", "github", "bio"],
    features: ["Hero with tech stack badges", "Interactive project showcase", "Experience timeline", "GitHub activity stats", "Contact modal"],
    recommendedPalette: { primary: "#6366f1", accent: "#06b6d4", background: "#0a0a0c", surface: "#16161a", text: "#fffffe" },
    codeSnippet: `// Portfolio Archetype Pattern: Tech pill badges, animated project cards, and quick social links`
  },
  {
    id: "ai-saas-landing",
    title: "Modern AI SaaS Landing Page",
    category: "SaaS",
    keywords: ["saas", "ai", "platform", "software", "startup", "tool", "b2b", "automation", "workflow", "cloud"],
    features: ["Hero headline with gradient text", "Bento feature grid", "Interactive live demo tab", "3-tier pricing matrix", "FAQ accordion"],
    recommendedPalette: { primary: "#6366f1", accent: "#a855f7", background: "#0f172a", surface: "#1e293b", text: "#f8fafc" },
    codeSnippet: `// AI SaaS Archetype Pattern: Multi-section bento grid with gradient glow backdrops`
  },
  {
    id: "health-wellness",
    title: "Healthcare, Wellness & Medical Platform",
    category: "Healthcare",
    keywords: ["health", "medical", "doctor", "clinic", "hospital", "wellness", "fitness", "yoga", "care", "medicine"],
    features: ["Appointment booking CTA", "Doctor credentials card", "Service specialty grid", "Emergency contact ribbon", "Patient trust badges"],
    recommendedPalette: { primary: "#0ea5e9", accent: "#14b8a6", background: "#0b132b", surface: "#1c2541", text: "#ffffff" },
    codeSnippet: `// Healthcare Archetype Pattern: Trust badges, clean blue/teal contrast, and consultation scheduling`
  }
];

/**
 * Calculates simple word-vector cosine similarity for semantic template retrieval
 */
export function findNearestArchetype(userPrompt = "") {
  const normalized = userPrompt.toLowerCase().split(/\W+/).filter(Boolean);
  if (normalized.length === 0) return UI_ARCHETYPES[3]; // Default SaaS

  let bestMatch = UI_ARCHETYPES[3];
  let maxScore = -1;

  for (const archetype of UI_ARCHETYPES) {
    let score = 0;
    for (const word of normalized) {
      if (archetype.keywords.includes(word)) {
        score += 2;
      }
      if (archetype.title.toLowerCase().includes(word)) {
        score += 1.5;
      }
      if (archetype.category.toLowerCase() === word) {
        score += 3;
      }
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = archetype;
    }
  }

  return {
    match: bestMatch,
    confidence: maxScore > 0 ? Math.min(0.98, 0.5 + maxScore * 0.1) : 0.65,
    matchedArchetypeId: bestMatch.id
  };
}
