import { CustomerOptionType, BasePluginType } from '@heimdallr-sdk/types';

interface CustomerOptions {
    customers?: CustomerOptionType[];
}
declare function customerPlugin(options?: CustomerOptions): BasePluginType;

export { type CustomerOptions, customerPlugin as default };
