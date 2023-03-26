export interface SubviewAutoscrollRunner {
    run: (lovelace: HTMLElement) => void;
    views: Record<string, View>;
    globalAutoscroll?: ScrollBehavior;
}

export interface View {
    path: string;
    autoscroll?: ScrollBehavior;
}

export interface Config {
    autoscroll?: ScrollBehavior;
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