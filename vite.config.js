import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json" with { type: "json" };
import pkg from "./package.json" with { type: "json" };

export default defineConfig(({ command }) => ({
  plugins: [crx({
    manifest: {
      ...manifest,
      version: pkg.version,
      ...(command === "serve" && { name: `${manifest.name} - dev` }),
    },
  })],
  server: {
    cors: {
      origin: "*",
    },
  },
  build: {
    outDir: "dist",
  },
}));
