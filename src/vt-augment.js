goog.module('virustotal.VTAugment')

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

class VTAugment {
    constructor() {
        console.log('hello');
        console.log(lscache);
      }
}
