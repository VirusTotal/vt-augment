import { VTAugment } from '../src/vt-augment';

const URL_TEST = 'https://google.com/';

beforeEach(() => {
  document.body.innerHTML =
    '<div id="container"></div>';
});

describe('Test VT Augment API methods', function () {
  it('VT Augment can find dom elememt ann create the iframe', async function () {
    const container = <HTMLElement>document.querySelector('#container');
    const vta = new VTAugment(container, {});
    expect(document.querySelector('iframe') instanceof HTMLIFrameElement).toBeTruthy();
  });

  it('VT Augment opens and closes the drawer', async function () {
    const container = <HTMLElement>document.querySelector('#container');
    const vta = new VTAugment(container, {});

    expect(container.getAttribute('opened')).toBeNull();
    vta.openDrawer();
    expect(container.getAttribute('opened') === '').toBeTruthy();
    vta.closeDrawer();
    expect(container.getAttribute('opened')).toBeNull();
  });

  it('VT activate spinner when loading', async function () {
    const container = <HTMLElement>document.querySelector('#container');
    const vta = new VTAugment(container, {});

    expect(<HTMLElement>container.querySelector('div.spinner')).toBeNull();
    vta.loading(true);
    let spinner = <HTMLElement>container.querySelector('div.spinner');
    expect(spinner.style.display === 'block').toBeTruthy();

    vta.loading(false);
    spinner = <HTMLElement>container.querySelector('div.spinner');
    expect(spinner.style.display === 'none').toBeTruthy();
  });

  it('VT Agument preload calling ajax', async function () {});

  it('VT Augment preload found cache and does not call ajax', async function () {});

  it('Vt Augment loads html in browsers without srcdoc support', async function () {});

  it('Vt Augment loads alredy cached html', async function () {});

  it('Vt Augment loads fetching html', async function () {});
});

describe('Test VT internal function', function () {
  it('createStyleSheet append styles', async function () {});

  it('getIframe append creates an iframe element', async function () {});

  it('getSpinner creates an spinner element', async function () {});

  it('getHtmlAjax call to one url and cache its response', async function () {});
});
