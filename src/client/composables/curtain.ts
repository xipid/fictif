import { reactive, Reactive, computed } from "vue";
import { EventEmitter } from "./events.js";

// --- Types & Defaults ---

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

export const defaultsCurtain: CurtainOptions = {
  inspirationalMessages: [
    {
      message: "Synchronizing Celestial Data Streams...",
      background: "/images/bg-1.png",
    },
    {
      message: "Initializing Delta Core Systems...",
      background: "/images/bg-2.png",
    },
    {
      message: "Calibrating Neural Interface...",
      background: "/images/bg-3.png",
    },
  ],
};

// --- Curtain Manager Class ---

export let globalCurtain: CurtainManager | null = null;

interface CurtainState {
  keepers: (() => void)[];
  mode: CurtainMode;
  title: string;
  message: string;
  background: string;
  component: any;
}

export class CurtainManager extends EventEmitter {
  private _state: Reactive<CurtainState>;
  private _isMounted = false;
  private _hasRevealed = false;

  private inspirationalMessages: InspirationalMessage[];

  constructor(options: CurtainOptions = defaultsCurtain) {
    super();

    this.inspirationalMessages = [...defaultsCurtain.inspirationalMessages, ...options.inspirationalMessages];

    this._state = reactive<CurtainState>({
      keepers: [],
      mode: "full",
      title: "",
      message: "",
      background: "",
      component: null,
    });

    this.selectRandomMessage();

    if (!globalCurtain) {
      this.init();
    }
  }

  public get state(): Readonly<CurtainState> {
    return this._state;
  }

  public init(): void {
    globalCurtain = this;
    // If we're already mounted when init is called (unlikely but possible), signal ready
    setTimeout(() => {
      if (this._isMounted) {
        this.signalReady();
      }
    }, 0);
  }

  public setCurtainMounted(mounted: boolean): void {
    const wasMounted = this._isMounted;
    this._isMounted = mounted;
    if (!wasMounted && mounted) {
      this.signalReady();
    }
  }

  private signalReady(): void {
    if (!this._hasRevealed) {
      this.emit("ready");
      this._hasRevealed = true;
    }
  }

  private selectRandomMessage() {
    if (this.inspirationalMessages.length === 0) return;
    const chosen =
      this.inspirationalMessages[
      Math.floor(Math.random() * this.inspirationalMessages.length)
      ];

    this._state.message = chosen.message;
    this._state.background = chosen.background;
  }

  public start(options: StartOptions = {}): (() => void) {
    // If not mounted, we can still queue keepers. The Curtain.vue component
    // will pick them up once it mounts and calls updateStateFromManager.
    const { mode = "full", title, message, background, component } = options;

    const wasVisible = this._state.keepers.length > 0;
    this._state.mode = mode;

    if (mode === "full") {
      if (title) this._state.title = title;
      if (message) this._state.message = message;
      if (!title && !message) {
        this.selectRandomMessage();
      }
      if (background) {
        this._state.background = background;
      }
      if (component) {
        this._state.component = component;
      }
    }

    const clear = () => {
      const index = this._state.keepers.indexOf(clear);
      if (index !== -1) {
        this._state.keepers.splice(index, 1);
        if (this._state.keepers.length === 0) {
          this.emit("hide");
        }
      }
    };

    this._state.keepers.push(clear);

    if (!wasVisible) {
      this.emit("show");
    }

    return clear;
  }

  public append(component: any): void {
    this._state.component = component;
  }

  public show(): (() => void) {
    return this.start({ component: this._state.component });
  }

  public done(): void {
    const wasVisible = this._state.keepers.length > 0;
    this._state.keepers.length = 0;
    if (wasVisible) {
      this.emit("hide");
    }
  }

  /**
   * Internal method for the Curtain component to signal fade completion.
   */
  public _signalFadeIn(): void {
    this.emit("fade-in");
  }

  public _signalFadeOut(): void {
    this.emit("fade-out");
  }

  /**
   * For backwards compatibility or direct state tracking.
   */
  public subscribe(listener: (state: Readonly<CurtainState>) => void): void {
    this.on("state-change", listener);
  }

  public unsubscribe(listener: (state: Readonly<CurtainState>) => void): void {
    this.off("state-change", listener);
  }
}

/**
 * Provides access to the globalCurtain Curtain manager.
 */
export function useCurtain(options?: CurtainOptions): CurtainManager {
  if (!globalCurtain) {
    globalCurtain = new CurtainManager(options);
  }
  return globalCurtain;
}
