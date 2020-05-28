import conf from "./config"

export type VTAugmentOptions = {
  [key: string]: any
}

const CSS_SCOPE = '4rrgf4';

const COMMON_CSS = `
  @keyframes spin-${CSS_SCOPE} {
    to { transform: rotate(360deg); }
  }
  .spinner-${CSS_SCOPE} {
    border: 8px solid rgba(0, 0, 0, 0.2);
    border-left-color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin-${CSS_SCOPE} 1.2s linear infinite;
  };
`;

const DRAWER_MODE_STYLESHEET = `
  ${COMMON_CSS}
  .vt-augment-drawer-${CSS_SCOPE} {
    width: 700px;
    background: #313d5a;
    border: 1px solid #e6e6e6;
    text-align: left;
    z-index: 102;
    position: fixed;
    right: 0;
    top: 0;
    height: 100vh;
    box-shadow: -4px 5px 8px -3px rgba(17, 17, 17, .16);
    animation: slideToRight-${CSS_SCOPE} 0.5s 1 forwards;
    transform: translateX(100vw);
  }
  .vt-augment-drawer-${CSS_SCOPE}[opened] {
    display: block;
    animation: slideFromRight-${CSS_SCOPE} 0.2s 1 forwards;
  }
  @keyframes slideFromRight-${CSS_SCOPE} {
    0% {
      transform: translateX(100vw);
    }
    100% {
      transform: translateX(0);
    }
  }
  @keyframes slideToRight-${CSS_SCOPE} {
    100% {
      transform: translateX(100vw);
      display: none;
    }
  }
`

const EMBEDDED_MODE_STYLESHEET = ``; // TODO

export class VTAugment {

    protected constructor(
      public _container: HTMLElement,
      public _options: VTAugmentOptions) {
        console.log('VT AUGMENT', 'constructor', _container, _options);
        createStyleSheet(true);
      }

    static factory(container: HTMLElement = null, options: VTAugmentOptions = {}) { return new VTAugment(container, options) }

    /**
     * Sets the default options.
     *
     * @param options options dict
     */
    defaults(options: VTAugmentOptions) {
      conf.defaults = options
      return this
    }

    url(url: string) {
      this.loading(true);
      const _iframe = getIframe(this._container);

      _iframe.onload = () => {
        this.loading(false);
      };

      _iframe.src = url;
      return this;
    }

    openDrawer() {
      this._container.setAttribute('opened', '');
    }

    closeDrawer() {
      this._container.removeAttribute('opened');
    }

    listen() {
      // TODO
    }

    loading(active: boolean) {
      const _spinner = getSpinner(this._container);
      _spinner.style.display = active ? 'block' : 'none';
    }
}

function createStyleSheet(drawerMode: boolean) {
  const _stylesheet = document.createElement('style');
  _stylesheet.innerHTML = drawerMode ? DRAWER_MODE_STYLESHEET : EMBEDDED_MODE_STYLESHEET;
  document.body.appendChild(_stylesheet);
}

function getIframe(container: HTMLElement) {
  let _iframe: HTMLIFrameElement = container.querySelector('iframe');

  if (!_iframe) {
    _iframe = document.createElement('iframe');
    _iframe.style.width = '100%';
    _iframe.style.height = '100%';
    _iframe.setAttribute('frameborder', '0');
    this._container.appendChild(_iframe);
  }

  return _iframe;
}

function getSpinner(container: HTMLElement) {
  let _spinner: HTMLDivElement = container.querySelector('div.spinner');

  if (!_spinner) {
    _spinner = document.createElement('div');
    _spinner.classList.add(`spinner-${CSS_SCOPE}`);
    this._container.appendChild(_spinner);
  }

  return _spinner;
}
