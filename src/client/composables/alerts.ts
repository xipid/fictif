// src/client/composables/useAlerts.ts

import { reactive } from "vue";

export interface SnackbarConfig {
  icon?: any;
  message?: string;
  autoCloseInterval?: number;
  buttons?: Record<
    string,
    {
      text: string;
      additionalClasses?: string;
      closes?: boolean;
    }
  >;
}

const state = reactive({
  snackbars: [] as Snackbar[],
});

export class Snackbar {
  id: string;
  icon: any;
  message: string;
  autoCloseInterval: number;
  buttons: Record<string, any>;

  _onClose: (reason: string) => void;
  _onClick: (buttonKey: string) => void;

  constructor(config: SnackbarConfig) {
    this.id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    this.icon = config.icon || null;
    this.message = config.message || "";
    this.autoCloseInterval = config.autoCloseInterval || 0;
    this.buttons = config.buttons || {};

    this._onClose = () => { };
    this._onClick = () => { };

    // Expose public methods/properties
    this.close = this.close.bind(this);
  }

  set onClose(handler: (reason: string) => void) {
    if (typeof handler === "function") {
      this._onClose = handler;
    }
  }

  set onClick(handler: (buttonKey: string) => void) {
    if (typeof handler === "function") {
      this._onClick = handler;
    }
  }

  close(reason: string = "manual") {
    const index = state.snackbars.findIndex((s) => s.id === this.id);
    if (index > -1) {
      state.snackbars.splice(index, 1);
      this._onClose(reason);
    }
  }
}

export function useAlerts() {
  const fire = (config: SnackbarConfig) => {
    const newSnackbar = new Snackbar(config);
    state.snackbars.push(newSnackbar);
    return newSnackbar;
  };

  return {
    snackbars: state.snackbars,
    fire,
  };
}
