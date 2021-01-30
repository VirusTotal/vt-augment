/**
 * @license
 *
 * The MIT License
 *
 * Copyright (c) 2020-2021 Google, Inc. http://virustotal.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

goog.provide('vtaugment');

const lscache = require('/node_modules/lscache/lscache');

const CSS_STYLESHEET = `
  .vt-augment {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vt-augment.drawer {
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
    animation: slideToRight 0.5s 1 forwards;
    transform: translateX(100vw);
  }
  .vt-augment.drawer[opened] {
    animation: slideFromRight 0.2s 1 forwards;
  }
  .vt-augment > .spinner {
    border: 8px solid rgba(0, 0, 0, 0.2);
    border-left-color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1.2s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes slideFromRight {
    0% {
      transform: translateX(100vw);
    }
    100% {
      transform: translateX(0);
    }
  }
  @keyframes slideToRight {
    100% {
      transform: translateX(100vw);
      display: none;
    }
  }
`;


/**
 *
 */
class VTAugment {
  constructor(container, options) {
    this.container = container;
    this.options = options;

    this.createStyleSheet();
    this.getIframe(this.container);

    this.container.classList.add(`vt-augment`);

    if (this.options.background) {
      this.container.style.background = this.options.background;
    }

    if (!this.options.mode || this.options.mode === 'drawer') {
      this.container.classList.add('drawer');
    }

    document.body.addEventListener('click', e => {
      if (e.target !== this.container) {
        this.closeDrawer();
      }
    });

    window.addEventListener('message', (event) => {
      if (event.data === 'VTAUGMENT:READY') {
        this.loading(false);
      }

      if (event.data === 'VTAUGMENT:CLOSE') {
        this.closeDrawer();
      }
    });
  }

  load(url) {
    const _iframe = this.getIframe(this.container);
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

  preload(url) {
    const _iframe = this.getIframe(this.container);

    // Avoid caching if browser doesn't support iframe content injection
    if (_iframe.srcdoc === undefined) {
      return;
    }

    const html = lscache.get(url);

    if (!html) {
      lscache.set(url, 'fetching', 1);
      this.getHtmlAjax(url);
    }
  }

  openDrawer() {
    this.container.setAttribute('opened', '');
    return this;
  }

  closeDrawer() {
    this.container.removeAttribute('opened');
    return this;
  }

  listen() {
    console.error('listen: Not implemented yet');
    return this;
  }

  loading(active) {
    const _spinner = this.getSpinner(this.container);
    const _iframe = this.getIframe(this.container);
    _spinner.style.display = active ? 'block' : 'none';
    _iframe.style.display = active ? 'none' : 'block';
    return this;
  }

  createStyleSheet() {
    const _stylesheet = document.createElement('style');
    _stylesheet.innerHTML = CSS_STYLESHEET;
    document.body.appendChild(_stylesheet);
  }

  getIframe(container) {
    let _iframe = container.querySelector('iframe');

    if (!_iframe) {
      _iframe = document.createElement('iframe');
      _iframe.style.width = '100%';
      _iframe.style.height = '100%';
      _iframe.setAttribute('frameborder', '0');
      container.appendChild(_iframe);
    }

    return _iframe;
  }

  getSpinner(container) {
    let _spinner = container.querySelector('div.spinner');

    if (!_spinner) {
      _spinner = document.createElement('div');
      _spinner.classList.add('spinner');
      container.appendChild(_spinner);
    }

    return _spinner;
  }

  getHtmlAjax(url) {
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
