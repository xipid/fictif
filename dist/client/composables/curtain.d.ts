import { EventEmitter } from './events.js';
export interface InspirationalMessage {
    message: string;
    background: string;
}
export type CurtainMode = "full" | "light";
export interface CurtainOptions {
    inspirationalMessages: InspirationalMessage[];
}
export interface StartOptions {
    mode?: CurtainMode;
    title?: string;
    message?: string;
    background?: string;
    component?: any;
}
export declare const defaultsCurtain: CurtainOptions;
export declare let globalCurtain: CurtainManager | null;
interface CurtainState {
    keepers: (() => void)[];
    mode: CurtainMode;
    title: string;
    message: string;
    background: string;
    component: any;
}
export declare class CurtainManager extends EventEmitter {
    private _state;
    private _isMounted;
    private _hasRevealed;
    private inspirationalMessages;
    constructor(options?: CurtainOptions);
    get state(): Readonly<CurtainState>;
    init(): void;
    setCurtainMounted(mounted: boolean): void;
    private signalReady;
    private selectRandomMessage;
    start(options?: StartOptions): (() => void);
    append(component: any): void;
    show(): (() => void);
    done(): void;
    /**
     * Internal method for the Curtain component to signal fade completion.
     */
    _signalFadeIn(): void;
    _signalFadeOut(): void;
    /**
     * For backwards compatibility or direct state tracking.
     */
    subscribe(listener: (state: Readonly<CurtainState>) => void): void;
    unsubscribe(listener: (state: Readonly<CurtainState>) => void): void;
}
/**
 * Provides access to the globalCurtain Curtain manager.
 */
export declare function useCurtain(options?: CurtainOptions): CurtainManager;
export {};
//# sourceMappingURL=curtain.d.ts.map