import {
    Config,
    SubviewAutoscrollRunner,
    View,
    LovelacePanel,
    ScrollBehaviourValue,
    PARAM_VALUE
} from '@types';
import {
    ELEMENT,
    PARAM
} from '@constants';
import {
    getDashboardConfig,
    getUrlParam,
    getViewsObject
} from '@utilities';
import { ConsoleInfo } from './console-info';

class SubviewAutoscroll implements SubviewAutoscrollRunner {
    constructor() {

        this.ha = document.querySelector(ELEMENT.HOME_ASSISTANT);
        this.main = this.ha.shadowRoot.querySelector(ELEMENT.HOME_ASSISTANT_MAIN).shadowRoot;

        this.dashboardObserve = new MutationObserver(this.watchDashboards);
        this.dashboardObserve.observe(this.main.querySelector(ELEMENT.PARTIAL_PANEL_RESOLVER), {
            childList: true,
        });

        this.run();
    }

    private ha: Element;
    private main: ShadowRoot;
    private lovelacePanel: LovelacePanel;
    private huiRoot: ShadowRoot;

    private dashboardObserve: MutationObserver;
    private huiViewObserver: MutationObserver;

    public views: Record<string, View>;
    public globalAutoscroll: ScrollBehaviourValue | null;

    public run(lovelacePanel = this.main.querySelector<LovelacePanel>(ELEMENT.HA_PANEL_LOVELACE)) {

        this.globalAutoscroll = null;
        if (this.huiViewObserver) {
            this.huiViewObserver.disconnect();
        }

        if (!lovelacePanel) {
            return;
        }

        this.lovelacePanel = lovelacePanel;

        getDashboardConfig(this.lovelacePanel)
            .then((config: Config) => {
                this.globalAutoscroll = config.autoscroll || null;
                this.views = getViewsObject(config.views);
                this.huiRoot = this.lovelacePanel.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;
                this.huiViewObserver = new MutationObserver(this.watchHuiView);
                this.huiViewObserver.observe(this.huiRoot.querySelector(ELEMENT.VIEW), {
                    childList: true,
                });
                
            })
            .catch((error: Error) => {
                console.warn(error);
            });

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
                    const pathname = window.location.pathname;
                    const param = getUrlParam<ScrollBehaviourValue>(PARAM.AUTOSCROLL);
                    if (
                        pathname &&
                        document.documentElement.scrollTop > 0 &&
                        (
                            !param ||
                            param !== PARAM_VALUE.DISABLED
                        )
                    ) {

                        const view = pathname.replace(/^.*\/(\w+)$/, '$1');
                        const views = window.SubviewAutoscroll.views;
                        const autoscroll = (
                            param ||
                            views[view]?.autoscroll ||
                            window.SubviewAutoscroll.globalAutoscroll
                        );

                        if (autoscroll) {
                            window.setTimeout(() => {
                                if (autoscroll === PARAM_VALUE.SMOOTH) {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: PARAM_VALUE.SMOOTH
                                    });
                                } else {
                                    window.scrollTo({
                                        top: 0
                                    });
                                }                                
                            }, 5);
                        }
                    }                    
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