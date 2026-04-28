import type { Plugin } from "vite";

export interface PageAutoScanOptions {
  vendor?: boolean;
  packages?: boolean;
  node_modules?: boolean;
}

export type PageNamespaceValue = string | string[];

export interface PageOptions {
  namespaces?: Record<string, PageNamespaceValue>;
  globNamespaces?: string[] | false;
}

export interface FictifOptions {
  pages?: PageOptions | false;
  /**
   * @deprecated Use `pages` instead.
   */
  screens?: PageOptions | false;
}

// Internal, fully resolved options
export type ResolvedFictifOptions = {
  root: string;
  pages:
  | false
  | {
    namespaces: Record<string, PageNamespaceValue>;
    globNamespaces: string[] | false;
  };
};

export interface PageDefinition {
  absolutePath: string;
  logicalName: string;
  obfuscatedId: string;
  namespace: string;
}

export type PageManifest = Map<string, PageDefinition>;

export type FictifPlugin = Plugin & {
  api: {
    getManifest: () => PageManifest;
  };
};
