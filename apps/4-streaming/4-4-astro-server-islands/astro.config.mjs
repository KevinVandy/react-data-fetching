// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
  },
  output: "server",
  adapter: vercel(),
});
