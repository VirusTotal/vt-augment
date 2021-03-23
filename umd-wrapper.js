//UMD bundling closure code inside.
;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.vtaugment = factory();
  }
}(this, function () {
  %output%
}.bind(this)));
