export declare type VTAugmentOptions = {
    mode?: 'drawer' | 'embedded';
};
export declare class VTAugment {
    _container: HTMLElement;
    _options: VTAugmentOptions;
    protected constructor(_container: HTMLElement, _options: VTAugmentOptions);
    static factory(container?: HTMLElement, options?: VTAugmentOptions): VTAugment;
    load(url: string): this;
    preload(url: string): void;
    openDrawer(): this;
    closeDrawer(): this;
    listen(): this;
    loading(active: boolean): this;
}
