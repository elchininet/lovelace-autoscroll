export interface SubviewAutoscrollRunner {
    run: (lovelace: HTMLElement) => void;
    views: Record<string, View>;
}

export interface View {
    path: string;
    subview?: boolean;
}

export class LovelacePanel extends HTMLElement {
    lovelace: {
        config: {
            views: View[];
        }
    }
}

declare global {
    interface Window {
        SubviewAutoscroll: SubviewAutoscrollRunner;
    }
}