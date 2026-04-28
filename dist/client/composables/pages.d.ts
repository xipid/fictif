import { Component } from 'vue';
type PageComponent = Component;
interface PageResolver {
    resolve: (name: string) => Promise<PageComponent>;
    has: (name: string) => boolean;
    list: () => string[];
}
/**
 * Provides access to the Fictif page resolver.
 */
export declare function usePages(): PageResolver;
export {};
//# sourceMappingURL=pages.d.ts.map