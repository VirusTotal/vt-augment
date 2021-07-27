<h1 align="center">
    <a href="https://github.com/VirusTotal/vt-augment"><img width="300" alt="VT Augment logo" src="https://user-images.githubusercontent.com/4747608/83544509-47b64f00-a4fe-11ea-8c01-1bf27b442f3f.png"></a>
</h1>

<h4 align="center">
	Client library that wraps common patterns when interacting with the <a href="https://developers.virustotal.com/v3.0/reference?#widget-overview">VirusTotal Augment widget<a>.
</h4>

<h4 align="center">
	<a href="https://www.virustotal.com/ui/widget/demo/dedicated">Go to demo<a>
</h4>

<br>

# Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)

# Installation
```bash
npm i @virustotal/vt-augment --save
```

# Usage

**VT Augment is bundled using the UMD format (@`dist/vt-augment.min.js`).**

```html
<!--- "VTAugment" will be attached to the global window object. -->
<script src="./node_modules/@virustotal/vt-augment/dist/vt-augment.min.js"></script>
```

## Code
```html
<div id="vt-augment-container"></div>
```

```javascript
const container = document.querySelector('#vt-augment-container');

const vtaugment = new VTAugment(container, options)

vtaugment.load("[url]").openDrawer()
```

## Modes

### Drawer

This is the default mode, VT Augment will be shown in a right side panel when the `openDrawer` method is called.

### Standalone

This mode allows you to integrate the widget as a non-animated div in your page. See [Options](#options).

# API

### vtaugment(container = null, opts = {})

Creates a new object with a html element and a set of options. An iframe is dynamically created inside the container to host the VT API response.

## Methods

*Methods can be chained and can be called in whatever order.*

| [load](#loadurl-string) | [openDrawer](#opendrawer) | [closeDrawer](#closedrawer) | [loading](#loading(active-boolean))
|-----|-----|-----|-----|

#### load(url: string)

Loads the VT API url into the iframe.

```js
vtaugment.load("...")

// Additionally, if the mode is `drawer` can be used along with the method `openDrawer`

vtaugment.load("...").openDrawer()

```

#### openDrawer()

Open a drawer panel from the right side. (Only works in [drawer](#drawer) mode)

```js
vtaugment.openDrawer()

```

#### closeDrawer()

Close the drawer panel. (Only works in [drawer](#drawer) mode)

```js
vtaugment.closeDrawer()

```

#### loading(active: boolean)

The loading state is managed internally by the library but in the case of need the api provides this method to control loading manually. (Active loading hide the content)

```js
vtaugment.loading(true)

```

## Options

```js
{
  // Background color for loading states. Default ''.
  background: '#fff',
  // Force to closing the widget only with the X button. Default true.
  closingFromOutside: true | false,
  // Select the widget mode. Default drawer.
  mode: 'drawer' | 'standalone',
}
```
