import { reactive, shallowRef, type Component, type Ref, markRaw } from "vue";
import SnackChooseComponent from "../components/snack-choose.vue";

export interface SnackAction {
  id: string;
  content: string;
}

export interface SnackChooseOptions {
  description?: string;
  actions?: SnackAction[];
  default?: string | false;
  timeout?: number;
  textbox?: boolean | string;
}

export interface SnackChooseInstance {
  id: string;
  result: Ref<string | null>;
  showing: Ref<boolean>;
  wait: () => Promise<string | null>;
  destroy: () => void;
  // internal
  component: Component;
  props: any;
}

export interface SnackAppendInstance {
  id: string;
  showing: Ref<boolean>;
  destroy: () => void;
  // internal
  component: Component;
  props: any;
}

export type SnackItemType = SnackChooseInstance | SnackAppendInstance;

export class SnackManager {
  items = reactive<SnackItemType[]>([]);

  choose(options: SnackChooseOptions): SnackChooseInstance {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const result = shallowRef<string | null>(null);
    const showing = shallowRef(true);

    let timeoutId: number | null = null;
    let resolver: (val: string | null) => void = () => {};

    const promise = new Promise<string | null>((resolve) => {
      resolver = resolve;
    });

    const instance: SnackChooseInstance = {
      id,
      result,
      showing,
      wait: () => promise,
      destroy: () => {
        if (timeoutId) clearTimeout(timeoutId);
        showing.value = false;
        setTimeout(() => {
          const idx = this.items.findIndex(i => i.id === id);
          if (idx !== -1) this.items.splice(idx, 1);
        }, 300); // Wait for transition
        resolver(result.value);
      },
      component: markRaw(SnackChooseComponent),
      props: {
        options,
        onResult: (res: string | null) => {
          result.value = res;
          instance.destroy();
        }
      }
    };

    if (options.timeout && options.timeout > 0) {
      timeoutId = window.setTimeout(() => {
        if (options.default !== false) {
          result.value = typeof options.default === 'string' ? options.default : null;
        }
        instance.destroy();
      }, options.timeout);
    }

    this.items.push(instance as any);
    return instance;
  }

  append(component: Component, props: any = {}): SnackAppendInstance {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const showing = shallowRef(true);

    const instance: SnackAppendInstance = {
      id,
      showing,
      destroy: () => {
        showing.value = false;
        setTimeout(() => {
          const idx = this.items.findIndex(i => i.id === id);
          if (idx !== -1) this.items.splice(idx, 1);
        }, 300);
      },
      component: markRaw(component),
      props
    };

    this.items.push(instance as any);
    return instance;
  }
}

export const globalSnackManager = new SnackManager();

export function useSnack(managerRef?: SnackManager) {
  return managerRef || globalSnackManager;
}
