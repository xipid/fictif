import type { Plugin, ResolvedConfig, ViteDevServer } from "vite";
import Markdown from "unplugin-vue-markdown/vite";
// @ts-ignore
import mathjax3 from "markdown-it-mathjax3";

import type {
  FictifOptions,
  FictifPlugin,
  ResolvedFictifOptions,
  PageManifest,
} from "./types.js";
import { buildPageManifest, generateVirtualPagesModule } from "./manifest.js";

const VIRTUAL_PAGES_ID = "virtual:fictif-pages-data";
const RESOLVED_VIRTUAL_PAGES_ID = "\0" + VIRTUAL_PAGES_ID;

function injectInheritAttrsFalse(code: string): string {
  if (!code.includes("<script setup")) return code;

  const defineOptionsRegex = /defineOptions\s*\(\s*{([\s\S]*?)}\s*\)/;

  if (defineOptionsRegex.test(code)) {
    // Already has defineOptions — try merging into it
    return code.replace(defineOptionsRegex, (match, content) => {
      // If it already contains inheritAttrs, leave it alone
      if (/inheritAttrs\s*:/.test(content)) return match;

      // Else, inject inheritAttrs: false
      const newContent = content.trim().endsWith(",")
        ? `${content} inheritAttrs: false`
        : `${content}, inheritAttrs: false`;

      return `defineOptions({${newContent}})`;
    });
  } else {
    // No defineOptions present — inject a new one after <script setup>
    return code.replace(
      /<script setup(.*?)>/,
      `<script setup$1>\ndefineOptions({ inheritAttrs: false });`,
    );
  }
}

export default function fictif(userOptions: FictifOptions = {}): any {
  let config: ResolvedConfig;
  let manifest: PageManifest;
  let options: ResolvedFictifOptions;

  let rebuildTimeout: NodeJS.Timeout | null = null;
  let rebuildInProgress = false;

  function scheduleManifestRebuild(server: ViteDevServer) {
    if (rebuildInProgress) return;
    if (rebuildTimeout) clearTimeout(rebuildTimeout);

    rebuildTimeout = setTimeout(async () => {
      rebuildInProgress = true;
      try {
        manifest = await buildPageManifest(options);

        const module = server.moduleGraph.getModuleById(
          RESOLVED_VIRTUAL_PAGES_ID,
        );
        if (module) {
          server.moduleGraph.invalidateModule(module);
          server.ws.send({ type: "full-reload" });
        }
      } catch (err) {
        console.error("[Fictif] Failed to rebuild manifest:", err);
      } finally {
        rebuildInProgress = false;
      }
    }, 10);
  }

  const fictifPlugin: FictifPlugin = {
    name: "vite-plugin-fictif",
    enforce: "pre",
    api: { getManifest: () => manifest },

    config(config) {
      config.optimizeDeps ??= {};
      config.optimizeDeps.exclude ??= [];
      if (!config.optimizeDeps.exclude.includes(VIRTUAL_PAGES_ID)) {
        config.optimizeDeps.exclude.push(VIRTUAL_PAGES_ID);
      }
    },

    configResolved(_config) {
      config = _config;
      const root = config.root;

      let pagesOptions: ResolvedFictifOptions["pages"];

      const userPages = userOptions.pages ?? userOptions.screens;

      if (userPages === false) {
        pagesOptions = false;
      } else {
        let globNamespaces: string[] | false;
        if (userPages?.globNamespaces === false) {
          globNamespaces = false;
        } else if (Array.isArray(userPages?.globNamespaces)) {
          globNamespaces = userPages.globNamespaces;
        } else {
          globNamespaces = ["./packages"];
        }

        pagesOptions = {
          namespaces: {
            // Priority: pages > pages
            "@": ["./resources/pages/**"],
            docs: "docs/**",
            ...userPages?.namespaces,
          },
          globNamespaces,
        };
      }

      options = { root, pages: pagesOptions };
    },

    configureServer(server) {
      const { watcher } = server;
      const isPageFile = (file: string) =>
        options.pages !== false &&
        (file.endsWith(".vue") || file.endsWith(".md"));

      const onChange = (file: string) => {
        if (isPageFile(file)) {
          // We ideally should check if it's inside one of our watched directories
          // For now, simpler check
          console.log(`[Fictif] Page change detected: ${file}`);
          scheduleManifestRebuild(server);
        }
      };

      watcher.on("add", onChange);
      watcher.on("unlink", onChange);
    },

    buildStart() {
      return buildPageManifest(options).then((m) => {
        manifest = m;
      });
    },

    resolveId(id) {
      if (id === VIRTUAL_PAGES_ID) {
        return RESOLVED_VIRTUAL_PAGES_ID;
      }
    },

    load(id) {
      if (id === RESOLVED_VIRTUAL_PAGES_ID) {
        return generateVirtualPagesModule(manifest);
      }
    },

    transform(code, id) {
      if (id.includes("node_modules") || id.startsWith("\0")) return;
      if (!id.endsWith(".vue") && !id.endsWith(".md")) return;
      if (!code.includes("<script setup")) return;

      // Inject or merge defineOptions({ inheritAttrs: false })
      const transformed = injectInheritAttrsFalse(code);
      return { code: transformed, map: null };
    },
  };

  const markdownPlugin = Markdown({
    markdownItSetup(md: any) {
      md.use(mathjax3);
    },

    // Allows full Vue usage in markdown
    // script setup and scoped styles are supported by default in unplugin-vue-markdown
    wrapperClasses: "prose prose-montserrat dark:prose-invert",
  });

  return [fictifPlugin, markdownPlugin];
}
