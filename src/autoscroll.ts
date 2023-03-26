import {
    Config,
    SubviewAutoscrollRunner,
    View,
    LovelacePanel
} from '@types';
import { ELEMENT, PARAM } from '@constants';
import {
    getDashboardConfig,
    hasUrlParam,
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
    public globalAutoscroll: ScrollBehavior | null;

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
                    if (
                        pathname &&
                        document.documentElement.scrollTop > 0 &&
                        !hasUrlParam(PARAM.DISABLE_AUTOSCROLL)
                    ) {

                        const view = pathname.replace(/^.*\/(\w+)$/, '$1');
                        const views = window.SubviewAutoscroll.views;
                        const autoscroll = (
                            getUrlParam(PARAM.AUTOSCROLL) as ScrollBehavior ||
                            views[view]?.autoscroll ||
                            window.SubviewAutoscroll.globalAutoscroll
                        );

                        if (autoscroll) {
                            window.setTimeout(() => {
                                window.scrollTo({top: 0, behavior: autoscroll});
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