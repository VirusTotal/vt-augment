/**
 * @fileoverview VTAugment is a library to interact with the VirusTotal Augment
 * product.
 */

/**
 * @license
 * The MIT License
 *
 * Copyright (c) 2021 Google, Inc. http://virustotal.com
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

goog.module('vtaugment');

const Const = goog.require('goog.string.Const');
const SafeHtml = goog.require('goog.html.SafeHtml');
const SafeStyleSheet = goog.require('goog.html.SafeStyleSheet');
const TrustedResourceUrl = goog.require('goog.html.TrustedResourceUrl');
const {installSafeStyleSheet} = goog.require('goog.style');
const {setInnerHtml} = goog.require('goog.dom.safe');

/**
 * @typedef {{
 *            background:string,
 *            mode:string,
 *          }}
 */
let Options;

/** @type {string} */
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
    position: absolute;
    z-index: 199;
    top: calc(50% - 50px);
    left: calc(50% - 50px);
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
 * Internal cache to store iframe html content.
 * @private
 */
class Cache {
  constructor() {
    this.store = new Map();
  }

  /**
   * @public
   * @param {string} key
   * @return {!string|undefined}
   */
  get(key) {
    return this.store.get(key);
  }

  /**
   * @public
   * @param {string} key
   * @param {!Object|null|string} value
   * @return {void}
   */
  set(key, value) {
    this.store.set(key, value);
  }

  /**
   * @public
   * @param {string} key
   * @return {boolean}
   */
  remove(key) {
    return this.store.delete(key);
  }

  /**
   * @public
   * @return {void}
   */
  flush() {
    this.store = new Map();
  }
}


class VTAugment {
  /**
   * @param {!Element} container
   * @param {?Options} options
   */
  constructor(container, options) {
    this.cache = new Cache();
    this.container = container;
    this.options = options || {};
    this.isSrcdocSupported = !!('srcdoc' in document.createElement('iframe'))
        && SafeHtml.canUseSandboxIframe();

    this.createStyleSheet_();

    this.container.classList.add('vt-augment');

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
      this.processMessageEvent_(/** @type {!MessageEvent} */ (event));
    });
  }

  /**
   * @export
   * @param {string} url
   * @return {!VTAugment}
   */
  load(url) {
    if (!url) return this;

    this.clean_();

    const safeUrl = this.safeUrl_(url);

    // iframe html injection not supported, fallback traditional url load
    if (!this.isSrcdocSupported) {
      this.loading(true);
      this.createIframe_(this.container, safeUrl, undefined);

      return this;
    }

    let html = this.cache.get(url);

    // html not found in cache neither in fetching process, try to preload it
    if (!html) {
      this.loading(true);
      this.createIframe_(this.container, safeUrl, undefined);
      this.getHtmlAjax_(url);

      return this;
    }

    // html is ready for the iframe injection
    if (html !== 'fetching') {
      this.loading(false);
      this.createIframe_(this.container, undefined, html);

      return this;
    }

    // html is still fetching so polling until it is ready
    if (html === 'fetching') {
      this.loading(true);
      const intervalRef = setInterval(() => {
        html = this.cache.get(url);

        if (html && html !== 'fetching') {
          clearInterval(intervalRef);
          this.createIframe_(this.container, undefined, html);
          this.loading(false);
        } else if (html === null) {
          clearInterval(intervalRef);
          this.createIframe_(this.container, safeUrl, undefined);
        }
      }, 200);
    }

    return this;
  }

  /**
   * @export
   * @param {string} url
   */
  preload(url) {
    // Avoid caching if browser doesn't support iframe content injection
    if (!this.isSrcdocSupported) {
      return;
    }

    if (!this.cache.get(url)) {
      this.cache.set(url, 'fetching');
      this.getHtmlAjax_(url);
    }
  }

  /**
   * @export
   * @return {!VTAugment}
   */
  openDrawer() {
    this.container.setAttribute('opened', '');
    return this;
  }

  /**
   * @export
   * @return {!VTAugment}
   */
  closeDrawer() {
    this.container.removeAttribute('opened');
    return this;
  }

  /**
   * @export
   * @param {boolean} active
   * @return {!VTAugment}
   */
  loading(active) {
    const spinner = this.getSpinner_(this.container);
    const iframe = this.container.querySelector('iframe');

    spinner.style.display = active ? 'block' : 'none';

    if (iframe) {
      iframe.style.display = active ? 'none' : 'block';
    }

    return this;
  }

  /**
   * @private
   */
  createStyleSheet_() {
    const styleNode = document.createElement('style');
    const styleSheet = SafeStyleSheet.fromConstant(Const.from(CSS_STYLESHEET));
    installSafeStyleSheet(styleSheet, styleNode);
    document.body.appendChild(styleNode);
  }

  /**
   * @private
   * @param {!Element} container
   * @param {!TrustedResourceUrl|undefined} safeUrl
   * @param {string|undefined} html
   * @return {void}
   */
  createIframe_(container, safeUrl, html) {
    const iframeAttrs = {
      style: {width: '100%', height: '100%', border: '0'},
      frameborder: 0,
    };

    this.clean_();

    const temp = document.createElement('div');
    temp.style.display = 'none';

    if (safeUrl) {
      const iframe = SafeHtml.createIframe(safeUrl, undefined, iframeAttrs);

      setInnerHtml(temp, iframe);
      temp.firstChild.removeAttribute('sandbox');

      container.appendChild(temp.removeChild(temp.firstChild));
    } else {
      const sandboxedIframe = SafeHtml.createSandboxIframe(
          undefined, html, iframeAttrs);

      setInnerHtml(temp, sandboxedIframe);
      temp.firstChild.setAttribute(
          'sandbox', 'allow-scripts allow-same-origin allow-popups');

      container.appendChild(temp.removeChild(temp.firstChild));
    }
  }

  /**
   * @private
   * @return {void}
   */
  clean_() {
    let iframe = /** @type {?HTMLIFrameElement} */ (
        this.container.querySelector('iframe'));
    if (iframe) {
      iframe.parentNode.removeChild(iframe);
    }
  }

  /**
   * @private
   * @param {!Element} container
   * @return {!Element}
   */
  getSpinner_(container) {
    /** @type {?Element} */
    let _spinner = container.querySelector('div.spinner');

    if (!_spinner) {
      _spinner = document.createElement('div');
      _spinner.classList.add('spinner');
      container.appendChild(_spinner);
    }

    return _spinner;
  }

  /**
   * @private
   * @param {string} url
   */
  getHtmlAjax_(url) {
    const xmlhr = new XMLHttpRequest();

    xmlhr.onreadystatechange = () => {
      if (xmlhr.readyState === XMLHttpRequest.DONE) {
        if (xmlhr.status === 200) {
          this.cache.set(url, xmlhr.response);
        } else {
          this.loading(false);
          this.cache.remove(url);
        }
      } else {
        this.loading(false);
      }
    };

    xmlhr.open('GET', url, true);
    xmlhr.send();
  }

  /**
   * @private
   * @param {!MessageEvent} messageEvent
   */
  processMessageEvent_(messageEvent) {
      const message = messageEvent.data;

      switch (message) {
        case 'VTAUGMENT:READY':
          this.loading(false);
          break;
        case 'VTAUGMENT:CLOSE':
          this.closeDrawer();
          break;
        case 'VTAUGMENT:CLEAR_CACHE':
          this.cache.flush();
          break;
        default:
      }
  }

  /**
   * @private
   * @param {string} url
   * @return {!TrustedResourceUrl}
   */
  safeUrl_(url) {
    const token = url.split('/').pop();
    const safeVTUrl =
      Const.from('https://www.virustotal.com/ui/widget/html/%{token}');
    const safeUrl = TrustedResourceUrl.format(safeVTUrl, {
      'token': token,
    });

    return safeUrl;
  }
}

exports = {VTAugment};
window['VTAugment'] = VTAugment;
