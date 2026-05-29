import { definePreset } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";

// Aura retinted to our aubergine brand (500 = brand) so PrimeVue matches the `primary` token.
const Aubergine = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#f4eff6",
      100: "#e8e2ee",
      200: "#cdbcd6",
      300: "#ad94bb",
      400: "#7d5a90",
      500: "#3d2645",
      600: "#351f3c",
      700: "#2a1830",
      800: "#221428",
      900: "#1a0f1f",
      950: "#100913",
    },
  },
});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: { port: 8080 },
  modules: ["@nuxt/eslint", "@primevue/nuxt-module"],
  // Atomic structure lives under components/{atoms,molecules,organisms}.
  // pathPrefix off so I use <AppLogo /> instead of <AtomsAppLogo />. Names need to stay unique across dirs.
  components: [{ path: "~/components", pathPrefix: false }],
  // Populated from NUXT_PUBLIC_API_BASE at runtime
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000/api", //  the backend runs on port 3000
    },
  },
  css: ["~/assets/css/main.css", "primeicons/primeicons.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  primevue: {
    options: {
      theme: {
        preset: Aubergine, // Aura base, retinted to the aubergine brand (see preset above).
        options: {
          darkModeSelector: "[data-theme='dark']",
          cssLayer: {
            name: "primevue",
            order: "theme, base, primevue, utilities",
          },
        },
      },
    },
  },
});
