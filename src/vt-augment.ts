import lscache from 'lscache';

export type VTAugmentOptions = {
  mode?: 'drawer' | 'embedded',
  background?: 'string',
}

export interface HTMLIFrameIE11Compatible extends Omit<HTMLIFrameElement, 'srcdoc'> {
  /* srcdoc property is not present in IE11 */
  srcdoc?: string,
}

const CSS_SCOPE = '4rrgf4';

const CSS_STYLESHEET = `
  .vt-augment-${CSS_SCOPE} {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vt-augment-${CSS_SCOPE}.drawer {
    width: 700px;
    background: white;
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
  .vt-augment-${CSS_SCOPE}.drawer[opened] {
    animation: slideFromRight-${CSS_SCOPE} 0.2s 1 forwards;
  }
  .vt-augment-${CSS_SCOPE} > .spinner {
    border: 8px solid rgba(0, 0, 0, 0.2);
    border-left-color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin-${CSS_SCOPE} 1.2s linear infinite;
  }
  @keyframes spin-${CSS_SCOPE} {
    to { transform: rotate(360deg); }
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
`;

export class VTAugment {

    constructor(
      public _container: HTMLElement,
      public _options: VTAugmentOptions) {
        VTAugment.createStyleSheet();
        VTAugment.getIframe(_container);

        _container.classList.add(`vt-augment-${CSS_SCOPE}`);

        if (_options.background) {
          _container.style.background = _options.background;
        }

        if (!_options.mode || _options.mode === 'drawer') {
          _container.classList.add('drawer');
        }

        document.body.addEventListener('click', e => {
          if (e.target !== _container) {
            this.closeDrawer();
          }
        });

        window.addEventListener('message', (event: any) => {
        if (event.data === 'VTAUGMENT:READY') {
          this.loading(false);
        }

        if (event.data === 'VTAUGMENT:CLOSE') {
          this.closeDrawer();
        }
      });
      }

    static factory(container: HTMLElement = null, options: VTAugmentOptions = {}) { return new VTAugment(container, options) }

    load(url: string) {
      const _iframe: HTMLIFrameIE11Compatible = VTAugment.getIframe(
          this._container);
      // iframe html injection not supported, fallback traditional url load
      if (!('srcdoc' in _iframe)) {
        this.loading(true);
        _iframe.src = url;
        return this;
      }

      let html = lscache.get(url);

      // html not found in cache neither in fetching process, try to preload it
      if (!html) {
        this.loading(true);
        this.preload(url);
      }

      // html is ready for the iframe injection
      if (html !== 'fetching') {
        _iframe.srcdoc = html;
        return this;
      }

      // html is still fetching so polling until it is ready
      if (html === 'fetching') {
        this.loading(true);
        const intervalRef = setInterval(() => {
          html = lscache.get(url);

          if (html && html !== 'fetching') {
            clearInterval(intervalRef);
            _iframe.srcdoc = html;
            this.loading(false);
          } else if (html === null) {
            clearInterval(intervalRef);
            _iframe.src = url;
          }
        }, 200);
      }

      return this;
    }

    preload(url: string) {
      const _iframe: HTMLIFrameIE11Compatible = VTAugment.getIframe(
          this._container);

      // Avoid caching if browser doesn't support iframe content injection
      if (_iframe.srcdoc === undefined) {
        return;
      }

      const html = lscache.get(url);

      if (!html) {
        lscache.set(url, 'fetching', 1);
        VTAugment.getHtmlAjax(url);
      }
    }

    openDrawer() {
      this._container.setAttribute('opened', '');
      return this;
    }

    closeDrawer() {
      this._container.removeAttribute('opened');
      return this;
    }

    listen() {
      console.error('listen: Not implemented yet');
      return this;
    }

    loading(active: boolean) {
      const _spinner = VTAugment.getSpinner(this._container);
      const _iframe = VTAugment.getIframe(this._container);
      _spinner.style.display = active ? 'block' : 'none';
      _iframe.style.display = active ? 'none' : 'block';
      return this;
    }

    private static createStyleSheet() {
      const _stylesheet = document.createElement('style');
      _stylesheet.innerHTML = CSS_STYLESHEET;
      document.body.appendChild(_stylesheet);
    }

    private static getIframe(container: HTMLElement) {
      let _iframe: HTMLIFrameIE11Compatible = container.querySelector('iframe');

      if (!_iframe) {
        _iframe = document.createElement('iframe');
        _iframe.style.width = '100%';
        _iframe.style.height = '100%';
        _iframe.setAttribute('frameborder', '0');
        container.appendChild(_iframe);
      }

      return _iframe;
    }

    private static getSpinner(container: HTMLElement) {
      let _spinner: HTMLElement = container.querySelector('div.spinner');

      if (!_spinner) {
        _spinner = document.createElement('div');
        _spinner.classList.add('spinner');
        container.appendChild(_spinner);
      }

      return _spinner;
    }

    private static getHtmlAjax(url: string) {
      const xmlhr = new XMLHttpRequest();

      xmlhr.onreadystatechange = function () {
        if (xmlhr.readyState === XMLHttpRequest.DONE) {
          if (xmlhr.status === 200) {
            lscache.set(url, xmlhr.response, 60);
          } else {
            lscache.remove(url);
          }
        }
      };

      xmlhr.open("GET", url, true);
      xmlhr.send();
    }
}
