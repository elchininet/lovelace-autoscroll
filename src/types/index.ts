export enum AUTOSCROLL_PARAM_VALUE {
    SMOOTH = 'smooth',
    INSTANT = 'instant',
    DISABLED = 'disabled'
}

export type AutoscrollParamValue = `${AUTOSCROLL_PARAM_VALUE}`;

export interface AutoscrollConfig {
    behavior: AutoscrollParamValue;
    history_keep_scroll?: boolean;
}

export interface SubviewAutoscrollRunner {
    run: (lovelace: HTMLElement) => void;
    autoscroll: () => void;
    views: Record<string, View>;
    dashboardConfig?: AutoscrollConfig;
    popstate: boolean;
}

export interface Config {
    autoscroll?: AutoscrollConfig;
    views: View[];
}

export interface View {
    path: string;
    autoscroll?: AutoscrollConfig;
}

export class LovelacePanel extends HTMLElement {
    lovelace: {
        config: Config;
    }
}

declare global {
    interface Window {
        SubviewAutoscroll: SubviewAutoscrollRunner;
    }
}