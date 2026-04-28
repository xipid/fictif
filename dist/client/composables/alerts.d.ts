export interface SnackbarConfig {
    icon?: any;
    message?: string;
    autoCloseInterval?: number;
    buttons?: Record<string, {
        text: string;
        additionalClasses?: string;
        closes?: boolean;
    }>;
}
export declare class Snackbar {
    id: string;
    icon: any;
    message: string;
    autoCloseInterval: number;
    buttons: Record<string, any>;
    _onClose: (reason: string) => void;
    _onClick: (buttonKey: string) => void;
    constructor(config: SnackbarConfig);
    set onClose(handler: (reason: string) => void);
    set onClick(handler: (buttonKey: string) => void);
    close(reason?: string): void;
}
export declare function useAlerts(): {
    snackbars: {
        id: string;
        icon: any;
        message: string;
        autoCloseInterval: number;
        buttons: Record<string, any>;
        _onClose: (reason: string) => void;
        _onClick: (buttonKey: string) => void;
        onClose: (reason: string) => void;
        onClick: (buttonKey: string) => void;
        close: (reason?: string) => void;
    }[];
    fire: (config: SnackbarConfig) => Snackbar;
};
//# sourceMappingURL=alerts.d.ts.map