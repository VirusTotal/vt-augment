import lscache from 'lscache';
var CSS_SCOPE = '4rrgf4';
var CSS_STYLESHEET = "\n  .vt-augment-" + CSS_SCOPE + " {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  .vt-augment-" + CSS_SCOPE + ".drawer {\n    width: 700px;\n    background: white;\n    border: 1px solid #e6e6e6;\n    text-align: left;\n    z-index: 102;\n    position: fixed;\n    right: 0;\n    top: 0;\n    height: 100vh;\n    box-shadow: -4px 5px 8px -3px rgba(17, 17, 17, .16);\n    animation: slideToRight-" + CSS_SCOPE + " 0.5s 1 forwards;\n    transform: translateX(100vw);\n  }\n  .vt-augment-" + CSS_SCOPE + ".drawer[opened] {\n    animation: slideFromRight-" + CSS_SCOPE + " 0.2s 1 forwards;\n  }\n  .vt-augment-" + CSS_SCOPE + " > .spinner {\n    border: 8px solid rgba(0, 0, 0, 0.2);\n    border-left-color: white;\n    border-radius: 50%;\n    width: 50px;\n    height: 50px;\n    animation: spin-" + CSS_SCOPE + " 1.2s linear infinite;\n  }\n  @keyframes spin-" + CSS_SCOPE + " {\n    to { transform: rotate(360deg); }\n  }\n  @keyframes slideFromRight-" + CSS_SCOPE + " {\n    0% {\n      transform: translateX(100vw);\n    }\n    100% {\n      transform: translateX(0);\n    }\n  }\n  @keyframes slideToRight-" + CSS_SCOPE + " {\n    100% {\n      transform: translateX(100vw);\n      display: none;\n    }\n  }\n";
var VTAugment = /** @class */ (function () {
    function VTAugment(_container, _options) {
        var _this = this;
        this._container = _container;
        this._options = _options;
        VTAugment.createStyleSheet();
        VTAugment.getIframe(_container);
        _container.classList.add("vt-augment-" + CSS_SCOPE);
        if (_options.background) {
            _container.style.background = _options.background;
        }
        if (!_options.mode || _options.mode === 'drawer') {
            _container.classList.add('drawer');
        }
        document.body.addEventListener('click', function (e) {
            if (e.target !== _container) {
                _this.closeDrawer();
            }
        });
        window.addEventListener('message', function (event) {
            if (event.data === 'VTAUGMENT:READY') {
                _this.loading(false);
            }
        });
    }
    VTAugment.factory = function (container, options) {
        if (container === void 0) { container = null; }
        if (options === void 0) { options = {}; }
        return new VTAugment(container, options);
    };
    VTAugment.prototype.load = function (url) {
        var _this = this;
        var _iframe = VTAugment.getIframe(this._container);
        // iframe html injection not supported, fallback traditional url load
        if (!('srcdoc' in _iframe)) {
            this.loading(true);
            _iframe.src = url;
            return this;
        }
        var html = lscache.get(url);
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
            var intervalRef_1 = setInterval(function () {
                html = lscache.get(url);
                if (html && html !== 'fetching') {
                    clearInterval(intervalRef_1);
                    _iframe.srcdoc = html;
                    _this.loading(false);
                }
                else if (html === null) {
                    clearInterval(intervalRef_1);
                    _iframe.src = url;
                }
            }, 200);
        }
        return this;
    };
    VTAugment.prototype.preload = function (url) {
        var _iframe = VTAugment.getIframe(this._container);
        // Avoid caching if browser doesn't support iframe content injection
        if (_iframe.srcdoc === undefined) {
            return;
        }
        var html = lscache.get(url);
        if (!html) {
            lscache.set(url, 'fetching', 1);
            VTAugment.getHtmlAjax(url);
        }
    };
    VTAugment.prototype.openDrawer = function () {
        this._container.setAttribute('opened', '');
        return this;
    };
    VTAugment.prototype.closeDrawer = function () {
        this._container.removeAttribute('opened');
        return this;
    };
    VTAugment.prototype.listen = function () {
        console.error('listen: Not implemented yet');
        return this;
    };
    VTAugment.prototype.loading = function (active) {
        var _spinner = VTAugment.getSpinner(this._container);
        var _iframe = VTAugment.getIframe(this._container);
        _spinner.style.display = active ? 'block' : 'none';
        _iframe.style.display = active ? 'none' : 'block';
        return this;
    };
    VTAugment.createStyleSheet = function () {
        var _stylesheet = document.createElement('style');
        _stylesheet.innerHTML = CSS_STYLESHEET;
        document.body.appendChild(_stylesheet);
    };
    VTAugment.getIframe = function (container) {
        var _iframe = container.querySelector('iframe');
        if (!_iframe) {
            _iframe = document.createElement('iframe');
            _iframe.style.width = '100%';
            _iframe.style.height = '100%';
            _iframe.setAttribute('frameborder', '0');
            container.appendChild(_iframe);
        }
        return _iframe;
    };
    VTAugment.getSpinner = function (container) {
        var _spinner = container.querySelector('div.spinner');
        if (!_spinner) {
            _spinner = document.createElement('div');
            _spinner.classList.add('spinner');
            container.appendChild(_spinner);
        }
        return _spinner;
    };
    VTAugment.getHtmlAjax = function (url) {
        var xmlhr = new XMLHttpRequest();
        xmlhr.onreadystatechange = function () {
            if (xmlhr.readyState === XMLHttpRequest.DONE) {
                if (xmlhr.status === 200) {
                    lscache.set(url, xmlhr.response, 60);
                }
                else {
                    lscache.remove(url);
                }
            }
        };
        xmlhr.open("GET", url, true);
        xmlhr.send();
    };
    return VTAugment;
}());
export { VTAugment };
//# sourceMappingURL=vt-augment.js.map