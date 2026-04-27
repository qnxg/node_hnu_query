import { defineConfig } from "tsup"

export default defineConfig([
  {
    format: ["esm", "cjs"],
    entry: ["src/index.ts"],
    outDir: "dist",
    target: "es2020",
    dts: {
      resolve: true,
      entry: "src/index.ts",
    },
    minify: true,
    sourcemap: false,
    clean: true,
  },
])
