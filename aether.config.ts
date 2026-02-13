// THE UNIVERSAL PRESETS
export const THEMES = {
  
  // 1. LEGAL (Dark, Gold, Trust)
  "neuro-lawyer": {
    app_name: "NEURO-LAWYER",
    tagline: "AUTONOMOUS LEGAL DEFENSE",
    id_placeholder: "ENTER CASE ID",
    button_text: "INITIATE DEFENSE",
    colors: {
      primary: "#0f172a",   // Deep Navy
      secondary: "#fbbf24", // Gold
      accent: "#f59e0b",    // Amber
      text: "#fffbeb",      // Warm White
    },
    physics: { viscosity: 0.8, flow_speed: 0.3 }
  },

  // 2. MEDICAL (White, Cyan, Sterile)
  "vitals-ai": {
    app_name: "VITALS-AI",
    tagline: "DIAGNOSTIC ENGINE",
    id_placeholder: "SCAN PATIENT DNA",
    button_text: "ANALYZE VITALS",
    colors: {
      primary: "#ffffff",   // Pure White
      secondary: "#06b6d4", // Cyan
      accent: "#22d3ee",    // Bright Blue
      text: "#0f172a",      // Dark Text
    },
    physics: { viscosity: 0.6, flow_speed: 0.5 }
  },

  // 3. CYBER (Black, Neon Pink, Aggressive)
  "nexus-gaming": {
    app_name: "ORANGE SLICE",
    tagline: "HYPER-THREADING ACTIVE",
    id_placeholder: "ENTER PLAYER TAG",
    button_text: "JACK IN",
    colors: {
      primary: "#000000",   // Void Black
      secondary: "#ec4899", // Neon Pink
      accent: "#d946ef",    // Magenta
      text: "#fdf4ff",      // White
    },
    physics: { viscosity: 0.2, flow_speed: 0.9 } // Fast & Thin
  }
};

// Default starting theme
export const DEFAULT_THEME = THEMES["neuro-lawyer"];