import {
    SubviewAutoscrollRunner,
    View,
    LovelacePanel
} from '@types';
import { ELEMENT, OPTION } from '@constants';
import { hasUrlParam, getViewsObject } from '@utilities';

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
                    if (pathname) {
                        const view = pathname.replace(/^.*\/(\w+)$/, '$1');
                        const views = window.SubviewAutoscroll.views;
                        if (
                            views[view]?.subview &&
                            document.documentElement.scrollTop > 0 &&
                            !hasUrlParam(OPTION.DISABLE_SCROLL)
                        ) {
                            window.setTimeout(() => {
                                window.scrollTo({top: 0, behavior: 'smooth'});
                            }, 5);
                        }
                    }                    
                }
            });
        });
    }

    public run(lovelacePanel = this.main.querySelector<LovelacePanel>(ELEMENT.HA_PANEL_LOVELACE)) {

        if (!lovelacePanel) {
            return;
        }

        this.lovelacePanel = lovelacePanel;
        this.huiRoot = this.lovelacePanel.shadowRoot.querySelector(ELEMENT.HUI_ROOT).shadowRoot;
        this.views = getViewsObject(this.lovelacePanel.lovelace.config.views);

        if (this.huiViewObserver) {
            this.huiViewObserver.disconnect();
        }

        this.huiViewObserver = new MutationObserver(this.watchHuiView);
        this.huiViewObserver.observe(this.huiRoot.querySelector(ELEMENT.VIEW), {
            childList: true,
        });

    }
}

// Initial Run
Promise.resolve(customElements.whenDefined(ELEMENT.HUI_VIEW))
  .then(() => {
    window.SubviewAutoscroll = new SubviewAutoscroll();
  });