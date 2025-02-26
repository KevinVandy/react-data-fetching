// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel({
    isr: {
      expiration: 60 * 60 * 24, // rebuild every page every day
    },
  }),
});
