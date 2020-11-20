var n="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var t=function(n,t,e){return n(e={path:t,exports:{},require:function(n,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&e.path)}},e.exports),e.exports}((function(t){!function(n,e){t.exports?t.exports=e():n.lscache=e()}(n,(function(){var n,t,e=6e4,r=v(e),o="",i=!1;function a(){var t="__lscachetest__";if(void 0!==n)return n;try{if(!localStorage)return!1}catch(n){return!1}try{d(t,"__lscachetest__"),h(t),n=!0}catch(t){n=!(!c(t)||!localStorage.length)}return n}function c(n){return n&&("QUOTA_EXCEEDED_ERR"===n.name||"NS_ERROR_DOM_QUOTA_REACHED"===n.name||"QuotaExceededError"===n.name)}function s(){return void 0===t&&(t=null!=window.JSON),t}function u(n){return n+"-cacheexpiration"}function l(){return Math.floor((new Date).getTime()/e)}function f(n){return localStorage.getItem("lscache-"+o+n)}function d(n,t){localStorage.removeItem("lscache-"+o+n),localStorage.setItem("lscache-"+o+n,t)}function h(n){localStorage.removeItem("lscache-"+o+n)}function p(n){for(var t=new RegExp("^lscache-"+(o.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")+"(.*)")),e=localStorage.length-1;e>=0;--e){var r=localStorage.key(e);(r=(r=r&&r.match(t))&&r[1])&&r.indexOf("-cacheexpiration")<0&&n(r,u(r))}}function g(n){var t=u(n);h(n),h(t)}function m(n){var t=u(n),e=f(t);if(e){var r=parseInt(e,10);if(l()>=r)return h(n),h(t),!0}}function y(n,t){i&&"console"in window&&"function"==typeof window.console.warn&&(window.console.warn("lscache - "+n),t&&window.console.warn("lscache - The error was: "+t.message))}function v(n){return Math.floor(864e13/n)}return{set:function(n,t,e){if(!a())return!1;if(!s())return!1;try{t=JSON.stringify(t)}catch(n){return!1}try{d(n,t)}catch(e){if(!c(e))return y("Could not add item with key '"+n+"'",e),!1;var o,i=[];p((function(n,t){var e=f(t);e=e?parseInt(e,10):r,i.push({key:n,size:(f(n)||"").length,expiration:e})})),i.sort((function(n,t){return t.expiration-n.expiration}));for(var m=(t||"").length;i.length&&m>0;)o=i.pop(),y("Cache is full, removing item with key '"+n+"'"),g(o.key),m-=o.size;try{d(n,t)}catch(t){return y("Could not add item with key '"+n+"', perhaps it's too big?",t),!1}}return e?d(u(n),(l()+e).toString(10)):h(u(n)),!0},get:function(n){if(!a())return null;if(m(n))return null;var t=f(n);if(!t||!s())return t;try{return JSON.parse(t)}catch(n){return t}},remove:function(n){a()&&g(n)},supported:function(){return a()},flush:function(){a()&&p((function(n){g(n)}))},flushExpired:function(){a()&&p((function(n){m(n)}))},setBucket:function(n){o=n},resetBucket:function(){o=""},getExpiryMilliseconds:function(){return e},setExpiryMilliseconds:function(n){r=v(e=n)},enableWarnings:function(n){i=n}}}))})),e=function(){function n(n,t){var e,o=this;this._container=n,this._options=t,(e=document.createElement("style")).innerHTML="\n  .vt-augment-4rrgf4 {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n  .vt-augment-4rrgf4.drawer {\n    width: 700px;\n    background: #313d5a;\n    border: 1px solid #e6e6e6;\n    text-align: left;\n    z-index: 102;\n    position: fixed;\n    right: 0;\n    top: 0;\n    height: 100vh;\n    box-shadow: -4px 5px 8px -3px rgba(17, 17, 17, .16);\n    animation: slideToRight-4rrgf4 0.5s 1 forwards;\n    transform: translateX(100vw);\n  }\n  .vt-augment-4rrgf4.drawer[opened] {\n    animation: slideFromRight-4rrgf4 0.2s 1 forwards;\n  }\n  .vt-augment-4rrgf4 > .spinner {\n    border: 8px solid rgba(0, 0, 0, 0.2);\n    border-left-color: white;\n    border-radius: 50%;\n    width: 50px;\n    height: 50px;\n    animation: spin-4rrgf4 1.2s linear infinite;\n  }\n  @keyframes spin-4rrgf4 {\n    to { transform: rotate(360deg); }\n  }\n  @keyframes slideFromRight-4rrgf4 {\n    0% {\n      transform: translateX(100vw);\n    }\n    100% {\n      transform: translateX(0);\n    }\n  }\n  @keyframes slideToRight-4rrgf4 {\n    100% {\n      transform: translateX(100vw);\n      display: none;\n    }\n  }\n",document.body.appendChild(e),r(n),n.classList.add("vt-augment-4rrgf4"),n.classList.add("drawer"),document.body.addEventListener("click",(function(t){t.target!==n&&o.closeDrawer()})),window.addEventListener("message",(function(n){"VTAUGMENT:READY"===n.data&&o.loading(!1)}))}return n.factory=function(t,e){return void 0===t&&(t=null),void 0===e&&(e={}),new n(t,e)},n.prototype.load=function(n){var e=this,o=r(this._container);if(!("srcdoc"in o))return this.loading(!0),o.src=n,this;var i=t.get(n);if(!i)return this.loading(!0),o.src=n,this;if("fetching"!==i)return o.srcdoc=i,this;if("fetching"===i){this.loading(!0);var a=setInterval((function(){(i=t.get(n))&&"fetching"!==i?(clearInterval(a),o.srcdoc=i,e.loading(!1)):null===i&&(clearInterval(a),o.src=n)}),333)}return this},n.prototype.preload=function(n){void 0!==r(this._container).srcdoc&&(t.get(n)||(t.set(n,"fetching",1),function(n){var e=new XMLHttpRequest;e.onreadystatechange=function(){e.readyState===XMLHttpRequest.DONE&&(200===e.status?t.set(n,e.response,60):t.remove(n))},e.open("GET",n,!0),e.send()}(n)))},n.prototype.openDrawer=function(){return this._container.setAttribute("opened",""),this},n.prototype.closeDrawer=function(){return this._container.removeAttribute("opened"),this},n.prototype.listen=function(){return console.error("listen: Not implemented yet"),this},n.prototype.loading=function(n){var t=function(n){var t=n.querySelector("div.spinner");t||((t=document.createElement("div")).classList.add("spinner"),n.appendChild(t));return t}(this._container),e=r(this._container);return t.style.display=n?"block":"none",e.style.display=n?"none":"block",this},n}();function r(n){var t=n.querySelector("iframe");return t||((t=document.createElement("iframe")).style.width="100%",t.style.height="100%",t.setAttribute("frameborder","0"),n.appendChild(t)),t}var o=e.factory;o.default=e.factory;export default o;
//# sourceMappingURL=vt-augment.esm.js.map
