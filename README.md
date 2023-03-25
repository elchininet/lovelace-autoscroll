# autoscroll

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)

Force automatic scrolling to the top of the page when navigating through subviews in Home Assistant.

| Autoscroll off | Autscroll on |
| -------------- | ------------ |
| <img src="https://github.com/elchininet/lovelace-autoscroll/blob/master/images/autoscroll-off.gif?raw=true" width="100%" title="lovelace-autoscroll" /> | <img src="https://github.com/elchininet/lovelace-autoscroll/blob/master/images/autoscroll-on.gif?raw=true" width="100%" title="lovelace-autoscroll" /> |

When one clicks on the top menu items, the page is automatically scrolled to the top. This is not the case when one navigates to a subview, the scroll is maintained in the same position in which it was in the previous view. This plugin changes this behaviour, every time that one navigates to a subview, if the scroll of the page is not at the top, it scrolls the page until it reaches the top position. 

## Installation

**You can install the plugin in two ways, through HACS or Manually:**

### Installation through HACS (recommended)

1. In the `Frontend` section of [HACS](https://hacs.xyz/) hit the `Explore and download repositories` button in the bottom right.

2. Search for `Autoscroll` and install it.

3. If using `yaml` mode or if `HACS` doesn‘t automatically add it you'll need to add it as a resource. (check [Add the plugin as a resource](#add-the-plugin-as-a-resource) section)

### Manual installation

1. Doanload the latest version of `autoscroll` from [the tags page](https://github.com/elchininet/lovelace-autoscroll/tags) and place it under your `config/www` folder.

2. [Add the plugin as a resource](#add-the-plugin-as-a-resource)

#### Add the plugin as a resource

> `yaml` mode users may add it to their [configuration.yaml](https://www.home-assistant.io/dashboards/dashboards/#using-yaml-for-the-default-dashboard) file.
non `yaml` mode, or `storage` mode users can find resources in their sidebar under `"Settings" > "Dashboards" > "Tree dots on the top right" > "Resources"`

```yaml
resources:
  # To avoid the resource being cached, when update the version, update also the version number parameter at the end of the url
  - url: /hacsfiles/autoscroll/autoscroll.js?v=1.0.0
    type: module
```

Installing this plugin will make that every time that you navigate into a view or a subview, the scroll position goes always to the top.

If you want to disable the automatic scrolling, add `?disable_scroll` as a parameter to the URL of your view/subview.