// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  vite: {
    build: {
      target: ["es2022", "edge89", "firefox89", "chrome89", "safari15"],
    },
  },
  nitro: {
    esbuild: {
      options: {
        // Node.js のバージョンのみ指定すればOK
        target: "es2022",
      },
    },
  },
});
