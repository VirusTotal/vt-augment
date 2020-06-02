<h1 align="center">
    <a href="https://github.com/VirusTotal/vt-augment"><img width="250px" alt="VT Augment logo" src="https://user-images.githubusercontent.com/4747608/83544509-47b64f00-a4fe-11ea-8c01-1bf27b442f3f.png"></a>
</h1>

<h4 align="center">
	Client library that wraps common patterns when interact with the <a href="https://developers.virustotal.com/v3.0/reference?#widget-overview">VirusTotal Augment product<a>.
</h4>

<h4 align="center">
	<a href="https://virustotal.com/ui/widget/demo/dedicated">Go to demo<a>
</h4>

<br>

# Table of Contents

* [Installation](#installation)
* [Compatibility](#compatibility)
* [Usage](#usage)
* [Api](#api)
* [License](#license)

# Installation

## Npm

```sh
npm i @virustotal/vt-augment
```

## Clone

```sh
git clone https://github.com/VirusTotal/vt-augment
cd vt-augment
npm install
npm start
```

# Compatibility

## Browsers

VT Augment is compatible with all modern browsers and IE11.

# Usage

**VT Augment is bundled using the UMD format (@`dist/bundle/vt-augment.js`), ESM format (@`dist/bundle/vt-augment.esm.js`) alongside es2015 modules (@`dist/index.js`) and typescript definitions.**

## Import

```html
<!--- "vtaugment" will be attached to the global window object. -->
<script src="dist/bundle/vt-augment.js"></script>
```

```javascript
// es2015 modules
import vtaugment from "vtaugment"

// commonjs
var vtaugment = require("vtaugment")
```

## Code
```html
<div id="vt-augment-container"></div>
```

```javascript
const container = document.querySelector('#vt-augment-container');

vtaugment(container, options)
  .url("...")
```

## Modes

#### Drawer

TODO

#### Embedded

TODO

# API

#### vtaugment(container = null, opts = {})

Creates a new object with a html element and a set of options. An iframe is dynamically created inside the container to host the VT API response.

## Methods

*Methods can be chained and can be called in whatever order.*

| [url](#urlurl-string) | [openDrawer](#opendrawer) | [closeDrawer](#closedrawer) | [listen](#listenevent-string-callback-any) | [loading](#loading(active-boolean))
|-----|-----|-----|-----|-----|

#### url(url: string)

Loads the VT API url into the iframe.

```js
vtaugment(container).url("...")

// Additionally, if the mode is `drawer` can be used along with the method `openDrawer`

vtaugment(container).url("...").openDrawer()

```

#### openDrawer()

Open a drawer panel from the right side. (Only works in [drawer](#drawer) mode)

```js
vtaugment(container).openDrawer()

```

#### closeDrawer()

Close the drawer panel. (Only works in [drawer](#drawer) mode)

```js
vtaugment(container).closeDrawer()

```

#### listen(event: string, callback: any)

Not implemented yet.

```js
vtaugment(container).listen("...", callback)

```

#### loading(active: boolean)

The loading state is managed internally by the library but in the case of need the api provides this method to control loading manually. (Active loading hide the content)

```js
vtaugment(container).loading(true)

```

## Options

TODO

# License

TODO
