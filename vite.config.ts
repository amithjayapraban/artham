import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      base: "/",
      includeAssets: ["logo.png", "logo.svg", "cross.svg", "search.svg"],
      manifest: {
        name: "Artham",
        short_name: "Artham",

        description: "English - Malayalam Dictionary",
        theme_color: "rgb(18,18,19)",
        icons: [
          {
            src: "logo.png",
            sizes: "238x238",
            type: "image/png",
          },
          {
            src: "logo.png",
            sizes: "238x238",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
