import {
    Config,
    View,
    LovelacePanel
} from '@types';

export const getDashboardConfig = (lovelacePanel: LovelacePanel): Promise<Config> => {
    let ATTEMPT_COUNT = 0;
    return new Promise((resolve, reject): void => {
        const getConfig = (): void => {
            if (lovelacePanel?.lovelace?.config) {
                resolve(lovelacePanel.lovelace.config);
            } else {
                ATTEMPT_COUNT ++;
                if (ATTEMPT_COUNT === 100) {
                    reject('Cannot get Lovelace configuration');
                } else {
                    window.setTimeout(getConfig, 10);
                }
            }
        };
        getConfig();
    });
};

export const hasUrlParam = (param: string): boolean => {
    const params = new URLSearchParams(window.location.search);
    return params.has(param);
};

export const getUrlParam = <T extends string>(param: string): T => {
    const params = new URLSearchParams(window.location.search);
    return params.get(param) as T;
};

export const getViewsObject = (views: View[]): Record<string, View> => {
    return views.reduce((acc: Record<string, View>, view: View): Record<string, View> => {
        acc[view.path] = view;
        return acc;
    }, {} as Record<string, View>);
};

// Convert a CSS in JS to string
export const getCSSString = (cssInJs: Record<string, string>): string => {
    return Object.entries(cssInJs)
        .map((entry: [string, string]): string => {
            const [decl, value] = entry;
            return `${decl}:${value}`;
        })
        .join(';') + ';';
};