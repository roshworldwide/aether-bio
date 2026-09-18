export const THEMES = {
  
  "neuro-lawyer": {
    app_name: "NEURO-LAWYER",
    tagline: "AUTONOMOUS LEGAL DEFENSE",
    id_placeholder: "ENTER CASE ID",
    button_text: "INITIATE DEFENSE",
    colors: {
      primary: "#0f172a",
      secondary: "#fbbf24",
      accent: "#f59e0b",
      text: "#fffbeb",
    },
    physics: { viscosity: 0.8, flow_speed: 0.3 }
  },

  "vitals-ai": {
    app_name: "VITALS-AI",
    tagline: "DIAGNOSTIC ENGINE",
    id_placeholder: "SCAN PATIENT DNA",
    button_text: "ANALYZE VITALS",
    colors: {
      primary: "#ffffff",
      secondary: "#06b6d4",
      accent: "#22d3ee",
      text: "#0f172a",
    },
    physics: { viscosity: 0.6, flow_speed: 0.5 }
  },

  "nexus-gaming": {
    app_name: "ORANGE SLICE",
    tagline: "HYPER-THREADING ACTIVE",
    id_placeholder: "ENTER PLAYER TAG",
    button_text: "JACK IN",
    colors: {
      primary: "#000000",
      secondary: "#ec4899",
      accent: "#d946ef",
      text: "#fdf4ff",
    },
    physics: { viscosity: 0.2, flow_speed: 0.9 }
  }
};

export const DEFAULT_THEME = THEMES["neuro-lawyer"];