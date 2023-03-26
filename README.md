# autoscroll

[![hacs_badge](https://img.shields.io/badge/HACS-Default-41BDF5.svg)](https://github.com/hacs/integration)

Lets you decide which views will have automatic scrolling to the top of the page while navigating in Home Assistant.

> Note: by default, the first time that one goes to a view, the scroll position will be placed automatically on the top, this is the default behaviour and doesn‘t have anything to do with this plugin.

| Autoscroll off | Autoscroll on |
| -------------- | ------------ |
| <img src="https://github.com/elchininet/lovelace-autoscroll/blob/master/images/autoscroll-off.gif?raw=true" width="100%" title="lovelace-autoscroll" /> | <img src="https://github.com/elchininet/lovelace-autoscroll/blob/master/images/autoscroll-on.gif?raw=true" width="100%" title="lovelace-autoscroll" /> |

When one navigates from one view to another in Home Assistant, sometimes the new page keeps the same scroll position from the previous page (specially subviews). This plugin changes this behaviour, it allows one to configure which views or subviews will automatically scroll to the top of the page when they are rendered.

## Installation

**You can install the plugin in two ways, through HACS or Manually:**

### Installation through HACS (recommended)

1. In the `Frontend` section of [HACS](https://hacs.xyz/) hit the `Explore and download repositories` button in the bottom right of the page.

2. Search for `Autoscroll` and install it.

3. If using `yaml` mode or if `HACS` doesn‘t automatically add it, you'll need to add it as a resource. (check [Add the plugin as a resource](#add-the-plugin-as-a-resource) section)

### Manual installation

1. Doanload the latest version of `autoscroll` from [the releases page](https://github.com/elchininet/lovelace-autoscroll/releases) and place the `autoscroll.js` file under your `config/www` folder.

2. [Add the plugin as a resource](#add-the-plugin-as-a-resource)

#### Add the plugin as a resource

> `yaml` mode users may add it to their [configuration.yaml](https://www.home-assistant.io/dashboards/dashboards/#using-yaml-for-the-default-dashboard) file.
Non `yaml` mode, or `storage` mode users can find resources in their sidebar under `"Settings" > "Dashboards" (Click on the three-dots button located on the top right of the page) > "Resources"`

```yaml
resources:
  # To avoid the resource being cached, when you upgrade to a new version, update also the version number parameter at the end of the url
  - url: /hacsfiles/autoscroll/autoscroll.js?v=1.0.0
    type: module
```

### Configuration

You can place the configuration in multiple places, mainly in URL parameters or in the `yaml` configuration of the dashboard.

#### Configuration through URL parameters

| URL parameter          | Description                                                     |
| ---------------------- | --------------------------------------------------------------- |
| `?autoscroll=smooth`   | Scrolls to the top of the view/subview with `smooth` behaviour  |
| `?autoscroll=instant`  | Scrolls to the top of the view/subview with `instant` behaviour |
| `?autoscroll=disabled` | Avoids automatic scrolling overriding any configuration placed in the `yaml` configuration |

#### Configuration through `yaml`

You can place the configuration in the whole dashboard (all the views in that dashboard will have automatic scrolling), or in a specific view/subview (only that view/subview will have automatic scrolling).

> For `yaml` mode users, just go to the `yaml` dashboard file in which you want to add the configuration. For non `yaml` mode users (a.k.a. `storage` mode), go to the specific dashboard, click on the three-dots button located on the top-right of the header, select `Edit dashboard`, click again on the three dots button, and select `Raw configuration editor`.

##### In the whole dashboard

You need to place the configuration at the begining of the `yaml` file:

```yaml
autoscroll: smooth ## <--- here
title: Dashboard title
views:
  ...
```

##### In a specific view/subview

Search in the `yaml` file the section respective to the view/subview (you can recognise the view for its title or its path). Place the configuration in the root of the view (before the `cards`)

```yaml
title: Dashboard title
views:
  ...
  - theme: theme of the view
    title: title of the view
    path: path of the view
    badges: []
    autoscroll: smooth ## <--- here
    cards:
      ...
```

| Config                 | Description                                                     | 
| ---------------------- | --------------------------------------------------------------- |
| `autoscroll: smooth`   | Scrolls to the top of the view/subview with `smooth` behaviour  |
| `autoscroll: instant`  | Scrolls to the top of the view/subview with `instant` behaviour |
| `autoscroll: disabled`\* | Avoids automatic scrolling overriding any configuration placed in the dashboard configuration |

\* This configuration is only taken into account in a specific view/subview