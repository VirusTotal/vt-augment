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
const SafeUrl = goog.require('goog.html.SafeUrl');
const SafeStyleSheet = goog.require('goog.html.SafeStyleSheet');
const TrustedResourceUrl = goog.require('goog.html.TrustedResourceUrl');
const {installSafeStyleSheet} = goog.require('goog.style');
const {setInnerHtml} = goog.require('goog.dom.safe');

/**
 * @typedef {{
 *            background: (string|undefined),
 *            mode: (string|undefined),
 *            closingFromOutside: (boolean|undefined),
 *          }}
 */
let Options;

/** @type {string} */
const CSS_STYLESHEET = `
  .vt-augment {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vt-augment.drawer {
    display: none;
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
    display: flex;
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
  @media screen and (max-width: 700px) {
    .vt-augment.drawer {
      width: 100%;
    }
  }
`;

const DRAWER_MODE = 'drawer';
const STANDALONE_MODE = 'standalone';

/** @type {Options} */
const DEFAULT_OPTIONS = {
  'mode': DRAWER_MODE,
  'background': '',
  'closingFromOutside': true,
}

class VTAugment {
  /**
   * @param {!Element} container
   * @param {?Options} options
   */
  constructor(container, options) {
    if (!container) throw new Error('Missing container, a valid dom element is required');
    this.container = container;
    this.options = this.getOptions_(options || {});

    this.createStyleSheet_();

    this.container.classList.add('vt-augment');

    if (this.options['background']) {
      this.container.style.background = this.options['background'];
    }

    if (this.options['mode'] === DRAWER_MODE) {
      this.container.classList.add(DRAWER_MODE);
    }

    if (this.options['closingFromOutside']) {
      document.body.addEventListener('click', e => {
        if (e.target !== this.container) {
          this.closeDrawer();
        }
      });
    }

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

    const safeUrl = this.safeUrl_(url);
    this.clean_();
    this.loading(true);
    this.createIframe_(this.container, safeUrl);

    return this;
  }

  /**
   * @export
   * @param {string} url
   */
  preload(url) {
    return this;
  }

  /**
   * @export
   * @return {!VTAugment}
   */
  openDrawer() {
    if (this.options['mode'] === DRAWER_MODE) {
      const iframe = this.container.querySelector('iframe');
      this.container.setAttribute('opened', '');
      iframe && iframe.removeAttribute('tabindex');
    }
    return this;
  }

  /**
   * @export
   * @return {!VTAugment}
   */
  closeDrawer() {
    if (this.options['mode'] === DRAWER_MODE) {
      const iframe = this.container.querySelector('iframe');
      this.container.removeAttribute('opened');
      if (iframe) {
        iframe.setAttribute('tabindex', '-1');
        iframe.style.display = 'none';
      }
    }
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
      iframe.focus();
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
   * @param {!SafeUrl|undefined} safeUrl
   * @return {void}
   */
  createIframe_(container, safeUrl) {
    const iframeAttrs = {
      'style': {width: '100%', height: '100%', border: '0'},
      'frameborder': 0,
      'tabIndex': "-1",
      'title': "VirusTotal Augment",
    };

    if (this.options['mode'] === STANDALONE_MODE) {
      iframeAttrs['name'] = this.options['mode'];
    }

    if (safeUrl) {
      const temp = document.createElement('div');
      temp.style.display = 'none';

      const sandboxedIframe = SafeHtml.createSandboxIframe(
          safeUrl, undefined, iframeAttrs);

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
   * @param {!MessageEvent} messageEvent
   */
  processMessageEvent_(messageEvent) {
      if (messageEvent.source !==
          this.container.querySelector('iframe')?.contentWindow) {
        // The event originated in an iframe not controlled by this instance.
        return;
      }

      const message = messageEvent.data;

      switch (message) {
        case 'VTAUGMENT:READY':
          this.loading(false);
          break;
        case 'VTAUGMENT:CLOSE':
          this.closeDrawer();
          break;
        case 'VTAUGMENT:CLEAR_CACHE':
          const iframe = /** @type {?HTMLIFrameElement} */ (
              this.container.querySelector('iframe'));
          if (iframe) this.load(iframe.src);
          break;
        default:
      }
  }

  /**
   * @private
   * @param {string} url
   * @return {!SafeUrl}
   */
  safeUrl_(url) {
    const token = url.split('/').pop();
    const vtUrl =
      Const.from('https://www.virustotal.com/ui/widget/html/%{token}');
    const trustedUrl = TrustedResourceUrl.format(vtUrl, {
      'token': token,
    });

    return SafeUrl.fromTrustedResourceUrl(trustedUrl);
  }

  /**
   * @private
   * @param {!Options} userOptions
   * @return {!Options}
   */
  getOptions_(userOptions) {
    let options = {...DEFAULT_OPTIONS};

    if (userOptions) {
      Object.keys(userOptions).map((key) => {
        if (options.hasOwnProperty(key)) {
          options[key] = userOptions[key];
        }
      });
    }

    return options;
  }
}

exports = {VTAugment};
window['VTAugment'] = VTAugment;
