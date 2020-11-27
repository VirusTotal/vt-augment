export declare type VTAugmentOptions = {
    mode?: 'drawer' | 'embedded';
    background?: 'string';
};
export interface HTMLIFrameIE11Compatible extends Omit<HTMLIFrameElement, 'srcdoc'> {
    srcdoc?: string;
}
export declare class VTAugment {
    _container: HTMLElement;
    _options: VTAugmentOptions;
    constructor(_container: HTMLElement, _options: VTAugmentOptions);
    static factory(container?: HTMLElement, options?: VTAugmentOptions): VTAugment;
    load(url: string): this;
    preload(url: string): void;
    openDrawer(): this;
    closeDrawer(): this;
    listen(): this;
    loading(active: boolean): this;
    private static createStyleSheet;
    private static getIframe;
    private static getSpinner;
    private static getHtmlAjax;
}
