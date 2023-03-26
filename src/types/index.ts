export enum PARAM_VALUE {
    SMOOTH = 'smooth',
    INSTANT = 'instant',
    DISABLED = 'disabled'
}

export type ScrollBehaviourValue = `${PARAM_VALUE}`;

export interface SubviewAutoscrollRunner {
    run: (lovelace: HTMLElement) => void;
    views: Record<string, View>;
    globalAutoscroll?: ScrollBehaviourValue;
}

export interface View {
    path: string;
    autoscroll?: ScrollBehaviourValue;
}

export interface Config {
    autoscroll?: ScrollBehaviourValue;
    views: View[];
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