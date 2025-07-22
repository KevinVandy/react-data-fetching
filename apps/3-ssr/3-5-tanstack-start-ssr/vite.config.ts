import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
// import viteReact from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 3335,
  },
  plugins: [
    tsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    // viteReact(),
    tanstackStart(),
  ],
});
