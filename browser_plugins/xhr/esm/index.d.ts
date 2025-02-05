import { RequestPluginOptionType, BasePluginType } from '@heimdallr-sdk/types';

declare function XHRPlugin(options?: RequestPluginOptionType): BasePluginType;

export { XHRPlugin as default };
