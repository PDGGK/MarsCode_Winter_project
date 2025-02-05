import { RequestPluginOptionType, BasePluginType } from '@heimdallr-sdk/types';

declare function fetchPlugin(options?: RequestPluginOptionType): BasePluginType;

export { fetchPlugin as default };
