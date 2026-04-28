import { PageResult, VisitOptions, RouterOptions } from '../types.js';
import { RouteMap, Middleware } from './route-map.js';
declare class ResponseBuilder {
    protected result: Partial<Omit<PageResult, "path">> & {
        path?: string | "==back==";
        redirect?: string;
    };
    component(component: any): this;
    with(props: Record<string, any>): this;
    asPath(path: string): this;
    message(message: string): this;
    error(error: string): this;
    build(): object;
}
/** Builds a standard page response. The PATH will default to the visited path. */
export declare function response(): ResponseBuilder;
/** Builds a standard page response. The PATH will default to the visited path. */
export declare function page(component: string): ResponseBuilder;
/** Builds a response that keeps the user on the same PATH but merges new props. */
export declare function back(): ResponseBuilder;
/** Builds a response that triggers a client-side redirect to a new PATH. */
export declare function redirect(path: string): ResponseBuilder;
export declare let globalRouter: Router<any> | null;
export declare function shouldInterceptLink(link: HTMLAnchorElement, event?: MouseEvent): boolean;
export declare class Router<T = VisitOptions> extends RouteMap<VisitOptions> {
    private state;
    private options;
    private navigationPrevented;
    private navigating;
    constructor(options?: RouterOptions);
    get result(): PageResult;
    get path(): string;
    _popState: (event: PopStateEvent) => void;
    _interceptLink: (event: MouseEvent) => void;
    uninit(): void;
    init(): void;
    preventNavigation(): void;
    visit(path: string, options?: VisitOptions): Promise<void>;
    push(result: PageResult, options?: VisitOptions): Promise<void>;
    private resolve;
}
export declare function useRouter<T = VisitOptions>(options?: RouterOptions | Router<T> | Middleware<VisitOptions> | Middleware<VisitOptions>[]): Router<T>;
export {};
//# sourceMappingURL=router.d.ts.map