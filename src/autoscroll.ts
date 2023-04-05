import {
    Config,
    AutoscrollConfig,
    SubviewAutoscrollRunner,
    View,
    LovelacePanel,
    AutoscrollParamValue,
    AUTOSCROLL_PARAM_VALUE
} from '@types';
import {
    ELEMENT,
    PARAM,
    SCROLL_DELAY
} from '@constants';
import {
    getDashboardConfig,
    hasUrlParam,
    getUrlParam,
    getViewsObject
} from '@utilities';
import { ConsoleInfo } from './console-info';

class SubviewAutoscroll implements SubviewAutoscrollRunner {
    constructor() {

        this.popstate = false;
        this.ha = document.querySelector(ELEMENT.HOME_ASSISTANT);
        this.main = this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN).shadowRoot;

        this.dashboardObserve = new MutationObserver(this.watchDashboards);
        this.dashboardObserve.observe(this.main.querySelector(ELEMENT.PARTIAL_PANEL_RESOLVER), {
            childList: true,
        });

        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                const currentState = window.history.state;
                const currentPathName = window.location.pathname; 
                const scrollTop = this.lovelaceView.scrollTop;     
                const newState = currentState
                    ? { ...currentState, scrollTop }
                    : { scrollTop };
                history.replaceState(newState, '', currentPathName);
                return target.apply(thisArg, argArray);
            },
          });

        window.addEventListener('popstate', (): void => {
            this.popstate = true;
        });

        this.run();
    }

    private ha: Element;
    private main: ShadowRoot;
    private lovelacePanel: LovelacePanel;
    private huiRoot: ShadowRoot;
    private lovelaceView: HTMLElement;

    private dashboardObserve: MutationObserver;
    private huiViewObserver: MutationObserver;

    public views: Record<string, View>;
    public dashboardConfig: AutoscrollConfig | null;
    public popstate: boolean;

    public run(lovelacePanel = this.main.querySelector<LovelacePanel>(ELEMENT.HA_PANEL_LOVELACE)) {

        this.dashboardConfig = null;

        if (this.huiViewObserver) {
            this.huiViewObserver.disconnect();
        }

        if (!lovelacePanel) {
            return;
        }

        this.lovelacePanel = lovelacePanel;

        getDashboardConfig(this.lovelacePanel)
            .then((config: Config) => {
                this.dashboardConfig = config.autoscroll || null;
                this.views = getViewsObject(config.views);
                this.huiRoot = this.lovelacePanel.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;
                this.huiViewObserver = new MutationObserver(this.watchHuiView);
                this.lovelaceView = this.huiRoot.querySelector(ELEMENT.VIEW);
                this.huiViewObserver.observe(this.lovelaceView, {
                    childList: true,
                });
            })
            .catch((error: Error) => {
                console.warn(error);
            });

    }

    public autoscroll() {
        const pathname = window.location.pathname;
        const autoscrollParam = getUrlParam<AutoscrollParamValue>(PARAM.AUTOSCROLL);
        if (
            pathname &&
            (
                !autoscrollParam ||
                autoscrollParam !== AUTOSCROLL_PARAM_VALUE.DISABLED
            )
        ) {

            const historyKeepScrollParam = hasUrlParam(PARAM.HISTORY_KEEP_SCROLL);
            const view = pathname.replace(/^.*\/(\w+)$/, '$1');
            const views = this.views;

            const behavior = (
                autoscrollParam ||
                views[view]?.autoscroll?.behavior ||
                this?.dashboardConfig?.behavior
            );

            if (
                behavior &&
                behavior !== AUTOSCROLL_PARAM_VALUE.DISABLED
            ) {
                const history_keep_scroll = (
                    historyKeepScrollParam ||
                    views[view]?.autoscroll?.history_keep_scroll ||
                    this?.dashboardConfig?.history_keep_scroll
                );

                if (window.SubviewAutoscroll.popstate) {

                    if (
                        history_keep_scroll &&
                        window.history.state?.scrollTop &&
                        window.history.state.scrollTop !== document.documentElement.scrollTop
                    ) {
                        this.lovelaceView.scrollTo({
                            top: window.history.state.scrollTop
                        });
                    }

                } else {
                    window.setTimeout(() => {
                        if (behavior === AUTOSCROLL_PARAM_VALUE.SMOOTH) {
                            this.lovelaceView.scrollTo({
                                top: 0,
                                behavior: AUTOSCROLL_PARAM_VALUE.SMOOTH
                            });
                        } else {
                            this.lovelaceView.scrollTo({
                                top: 0
                            });
                        }                                
                    }, SCROLL_DELAY);
                }
            }
            this.popstate = false;
        }  
    }

    protected watchDashboards(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === ELEMENT.HA_PANEL_LOVELACE) {
                    window.SubviewAutoscroll.run(node as LovelacePanel);
                }
            });
        });
    }

    protected watchHuiView(mutations: MutationRecord[]) {
        mutations.forEach(({ addedNodes }): void => {
            addedNodes.forEach((node: Element): void => {
                if (node.localName === ELEMENT.HUI_VIEW) {
                    window.SubviewAutoscroll.autoscroll();              
                }
            });
        });
    }
}

const info = new ConsoleInfo();
info.log();

// Initial Run
Promise.resolve(customElements.whenDefined(ELEMENT.HUI_VIEW))
  .then(() => {
    window.SubviewAutoscroll = new SubviewAutoscroll();
  });