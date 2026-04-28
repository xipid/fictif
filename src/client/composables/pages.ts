// src/client/composables/pages.ts

// @ts-ignore
import { pages, nameToId } from "virtual:fictif-pages-data";
import type { Component } from "vue";

type PageComponent = Component;

interface PageResolver {
  resolve: (name: string) => Promise<PageComponent>;
  has: (name: string) => boolean;
  list: () => string[];
}

let resolverInstance: PageResolver | null = null;

function createPageResolver(): PageResolver {
  const isProd = true;

  function getPageId(name: string): string {
    // In dev, names are the keys. In prod, we look up the obfuscated ID.
    return isProd ? (nameToId as Record<string, string>)[name] || name : name;
  }

  async function resolve(name: string | object): Promise<PageComponent> {
    if (typeof name == "object") return name as PageComponent;

    name = name.replaceAll("/", ".");

    const id = getPageId(name);
    const loader = (
      pages as Record<string, () => Promise<{ default: PageComponent }>>
    )[id];

    if (!loader) {
      const available = Object.keys(nameToId);
      console.error(`[Fictif] Page not found: "${name}" with id: "${id}".`);
      throw new Error(`Page not found: ${name}`);
    }

    const module = await loader();
    return module.default;
  }

  function has(name: string): boolean {
    name = name.replaceAll("/", ".");
    const id = getPageId(name);
    return id in pages;
  }

  function list(): string[] {
    return Object.keys(nameToId);
  }

  return { resolve, has, list };
}

/**
 * Provides access to the Fictif page resolver.
 */
export function usePages(): PageResolver {
  if (!resolverInstance) {
    resolverInstance = createPageResolver();
  }
  return resolverInstance;
}
