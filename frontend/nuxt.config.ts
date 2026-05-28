import Aura from "@primeuix/themes/aura";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  devServer: { port: 8080 },
  modules: ["@nuxt/eslint", "@primevue/nuxt-module"],
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
        preset: Aura, // I went with Aura because it's PrimeVue's default theme. Looks modern and feels like a good fit for the domain.
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
