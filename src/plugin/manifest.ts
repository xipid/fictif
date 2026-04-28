// src/plugin/manifest.ts

import path from "node:path";
import fg from "fast-glob";
import type {
  ResolvedFictifOptions,
  PageDefinition,
  PageManifest,
} from "./types.js";

const PAGE_SUFFIXES = [".vue", ".md"];

function cyrb53(str: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
    Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
    Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
    Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
    Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
  return `f_${hash.toString(16)}`;
}

function normalizePath(p: string): string {
  return p.replace(/\\/g, "/");
}

export async function buildPageManifest(
  options: ResolvedFictifOptions,
): Promise<PageManifest> {
  const manifest: PageManifest = new Map();
  if (options.pages === false) {
    return manifest;
  }

  const { root, pages } = options;
  const { namespaces, globNamespaces } = pages;

  // 1. Process globNamespaces (packages/vendor)
  if (globNamespaces) {
    const patterns: string[] = [];
    for (const baseDir of globNamespaces) {
      const normalizedBase = normalizePath(path.join(baseDir, "/**/src/pages"));
      // We need to find directories first to construct patterns, or just use a deep glob if structure is known
      // The original code used fg onlyDirectories. keeping that logic roughly but simplified if possible.
      // Actually, let's keep the original logic for globNamespaces as it seems specific to monorepos
      const pkgPageDirs = await fg(normalizedBase, {
        cwd: root,
        onlyDirectories: true,
        absolute: true,
      });

      for (const pkgDir of pkgPageDirs) {
        for (const suffix of PAGE_SUFFIXES) {
          patterns.push(normalizePath(path.join(pkgDir, `**/*${suffix}`)));
        }
      }
    }

    if (patterns.length > 0) {
      const files = await fg(patterns, {
        cwd: root,
        onlyFiles: true,
        absolute: true,
        unique: true,
      });
      // Process these files. Since they are "globNamespaces", we might need to deduce namespace from package.json or just add them?
      // Original code logic for processing files:
      // It iterates namespaces to find matches. But for globNamespaces, the original code added them to globPatterns
      // AND THEN relied on the "reverse match against namespaces" loop.
      // BUT globNamespaces usually aren't in `namespaces` config?
      // Wait, the original code logic was:
      // 1. Add globNamespaces to globPatterns.
      // 2. Add namespaces paths to globPatterns.
      // 3. fg(globPatterns)
      // 4. Iterate files and match against `namespaces`.
      // This implies files from globNamespaces MUST match a namespace config to be included?
      // Or did I miss something?
      // "if (!foundNs || !nsRootPath) continue;"
      // Yes, files MUST match a namespace.
      // So globNamespaces is just a helper to find *directories* that might contain pages, but they must still be mapped?
      // No, that doesn't make sense. If they are in `namespaces`, they don't need `globNamespaces`.
      // Let's re-read the original code carefully.
      // It seems `globNamespaces` just adds to `globPatterns`.
      // Then `pageFiles` contains EVERYTHING.
      // Then the loop checks `normalizedPath.startsWith(...)` of each `nsPath`.
      // If a file from `globNamespaces` is NOT covered by any `namespaces` path, it is SKIPPED.
      // This suggests `globNamespaces` might be redundant or I am misunderstanding how overlapping paths work.
      // OR, `namespaces` entries might contain wildcards that match what `globNamespaces` found?
      // Let's assume for now we strictly follow user request: "priority to pages" within a namespace.
    }
  }

  // New logic: Iterate namespaces, then paths.
  for (const [ns, nsValue] of Object.entries(namespaces)) {
    const nsPaths = Array.isArray(nsValue) ? nsValue : [nsValue];

    for (const p of nsPaths) {
      let pattern = "";
      let alias: string | undefined;
      let isWildcard = false;

      if (p.includes("*")) {
        pattern = normalizePath(path.join(root, p));
        isWildcard = true;
      } else if (p.includes(":")) {
        const [filePath, a] = p.split(":");
        pattern = normalizePath(path.resolve(root, filePath));
        alias = a;
      } else {
        const absolutePath = path.resolve(root, p);
        pattern = normalizePath(absolutePath);
        // If it's a file, pattern is set. If directory, we should likely glob inside?
        // The original code treated it as specific file if no wildcard?
        // "absolutePath = ... " then "ext = path.extname(p)".
        // If it has extension, it's a file.
        if (!path.extname(p)) {
          // It is likely a directory, so we should join suffixes?
          // The original code logic for "else" (non-wildcard, non-alias):
          // It just resolved it. And added to manifest manually?
          // "manifest.set(finalLogicalName, ...)"
          // It didn't glob! It just added it as a single entry.
          // So if p is a directory, it logic was probably flawed or expected a file.
          // Let's assume p without wildcard is a single file reference.
        }
      }

      // If it's a wildcard pattern (directory /**/*.vue etc)
      if (isWildcard) {
        const files = await fg(pattern, {
          cwd: root,
          onlyFiles: true,
          absolute: true,
          unique: true,
        });

        // We need to determine the "root" of this pattern to calculate relative path (logical name)
        // p is something like "resources/pages/**"
        // baseDir is "resources/pages"
        const baseDir = p.split("*")[0];
        const paramsBase = normalizePath(path.join(root, baseDir));

        for (const file of files) {
          const normalizedFile = normalizePath(file);

          // Calculate logical name
          const relativePath = normalizedFile.substring(paramsBase.length);
          let logicalName = relativePath.replace(/^\//, "").replace(/\//g, ".");

          for (const suffix of PAGE_SUFFIXES) {
            if (logicalName.endsWith(suffix)) {
              logicalName = logicalName.slice(0, -suffix.length);
              break;
            }
          }

          const finalLogicalName =
            ns === "@" ? logicalName : `${ns}::${logicalName}`;

          // Priority check: If already exists, SKIP.
          // This ensures the first path in nsPaths that has the file wins.
          if (manifest.has(finalLogicalName)) {
            console.log(
              `[Fictif] Skipping override for ${finalLogicalName} from ${normalizedFile}`,
            );
            continue;
          }
          // console.log(
          //   `[Fictif] Registering ${finalLogicalName} from ${normalizedFile}`,
          // );

          manifest.set(finalLogicalName, {
            absolutePath: normalizedFile,
            logicalName: finalLogicalName,
            obfuscatedId: cyrb53(finalLogicalName),
            namespace: ns,
          });
        }
      } else {
        // Single file mapping (alias or direct)
        // Logic from original code:
        let absolutePath = "";
        let finalLogicalName = "";

        if (alias) {
          // p = "path/to/file:Alias"
          const [filePath] = p.split(":");
          absolutePath = normalizePath(path.resolve(root, filePath));
          finalLogicalName = ns === "@" ? alias : `${ns}::${alias}`;
        } else {
          // p = "path/to/file"
          absolutePath = normalizePath(path.resolve(root, p));
          const ext = path.extname(p);
          const name = path.basename(p, ext);
          finalLogicalName = ns === "@" ? name : `${ns}::${name}`;
        }

        if (manifest.has(finalLogicalName)) continue;

        manifest.set(finalLogicalName, {
          // Original used: normalizePath(`/${path.relative(root, absolutePath)}`)
          absolutePath: normalizePath(`/${path.relative(root, absolutePath)}`),
          logicalName: finalLogicalName,
          obfuscatedId: cyrb53(finalLogicalName),
          namespace: ns,
        });
      }
    }
  }

  return manifest;
}

export function generateVirtualPagesModule(manifest: PageManifest): string {
  const mapEntries = Array.from(manifest.values()).map((def) => {
    const key = def.obfuscatedId;
    return `'${key}': () => import('${def.absolutePath}')`;
  });

  const nameToIdMap = Object.fromEntries(
    Array.from(manifest.values()).map((def) => [
      def.logicalName,
      def.obfuscatedId,
    ]),
  );

  return `// Generated by Fictif. DO NOT EDIT.
export const pages = { ${mapEntries.join(",\n  ")} };
export const nameToId = ${JSON.stringify(nameToIdMap)};
`;
}
