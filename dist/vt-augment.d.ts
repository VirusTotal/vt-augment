export declare type VTAugmentOptions = {
    [key: string]: any;
};
export declare class VTAugment {
    _container: HTMLElement;
    _options: VTAugmentOptions;
    protected constructor(_container: HTMLElement, _options: VTAugmentOptions);
    static factory(container?: HTMLElement, options?: VTAugmentOptions): VTAugment;
    /**
     * Sets the default options.
     *
     * @param options options dict
     */
    defaults(options: VTAugmentOptions): this;
    url(url: string): this;
    openDrawer(): void;
    closeDrawer(): void;
    listen(): void;
    loading(active: boolean): void;
}
