<h1 align="center">
    <a href="https://github.com/VirusTotal/vt-augment"><img width="300" alt="VT Augment logo" src="https://user-images.githubusercontent.com/4747608/83544509-47b64f00-a4fe-11ea-8c01-1bf27b442f3f.png"></a>
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

# Usage

**VT Augment is bundled using the UMD format (@`dist/vt-augment.min.js`).**

Download the last version found in the `dist` folder and add to your static files.

```html
<!--- "VTAugment" will be attached to the global window object. -->
<script src="vt-augment.min.js"></script>
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

#### Drawer

This is the default mode, VT Augment will be shown in a right side panel.

# API

#### vtaugment(container = null, opts = {})

Creates a new object with a html element and a set of options. An iframe is dynamically created inside the container to host the VT API response.

## Methods

*Methods can be chained and can be called in whatever order.*

| [load](#loadurl-string) | [preload](#preloadurl-string) | [openDrawer](#opendrawer) | [closeDrawer](#closedrawer) | [loading](#loading(active-boolean))
|-----|-----|-----|-----|-----|-----|

#### load(url: string)

Loads the VT API url into the iframe.

```js
vtaugment.load("...")

// Additionally, if the mode is `drawer` can be used along with the method `openDrawer`

vtaugment.load("...").openDrawer()

```

#### preload(url: string)

Load the html and cache it ready to show the content as soon as you call the `load` method. Typically this method is used linked to a `mouseover` event in the link or the surrounded area of the link.

```js
vtaugment.preload("...")

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
    background: '#fff', // Background color for loading states
}
```
