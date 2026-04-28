import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    // We use the plugin once; it will handle multiple entries
    dts({
      insertTypesEntry: true,
      cleanVueFileName: false,
    }),
  ],
  build: {
    target: "esnext",
    cssCodeSplit: false,
    outDir: path.resolve(__dirname, "./dist"),
    lib: {
      // Provide an object with names as keys for multiple entries
      entry: {
        "client/index": path.resolve(__dirname, "./src/client/index.ts"),
        "plugin/index": path.resolve(__dirname, "./src/plugin/index.ts"),
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      // Define externals as a function to handle different entries dynamically
      external: (id) => {
        const externalDeps = [
          "vue",
          "virtual:fictif-pages-data",

          "fast-glob",
          "node:path",
          "unplugin-vue-markdown",
          "markdown-it-mathjax3",
          "markdown-it",
        ];
        return externalDeps.includes(id) || /node_modules/.test(id);
      },

      output: {
        exports: "named",
        // This ensures the structure remains dist/client and dist/plugin
        entryFileNames: "[name].js",
        chunkFileNames: "shared/[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
});
