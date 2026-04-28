import { Component, Ref } from 'vue';
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
    component: Component;
    props: any;
}
export interface SnackAppendInstance {
    id: string;
    showing: Ref<boolean>;
    destroy: () => void;
    component: Component;
    props: any;
}
export type SnackItemType = SnackChooseInstance | SnackAppendInstance;
export declare class SnackManager {
    items: import('vue').Reactive<SnackItemType[]>;
    choose(options: SnackChooseOptions): SnackChooseInstance;
    append(component: Component, props?: any): SnackAppendInstance;
}
export declare const globalSnackManager: SnackManager;
export declare function useSnack(managerRef?: SnackManager): SnackManager;
//# sourceMappingURL=snack.d.ts.map