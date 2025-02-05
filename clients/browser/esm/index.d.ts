import { BaseOptionsType, CustomerOptionType } from '@heimdallr-sdk/types';

interface LifecycleOptions {
    userIdentify?: CustomerOptionType;
}
interface CodeErrorOptions {
    stkLimit?: number;
}
interface BrowserOptionsType extends BaseOptionsType, LifecycleOptions, CodeErrorOptions {
}

declare const init: (options: BrowserOptionsType) => void;

export { init as default };
