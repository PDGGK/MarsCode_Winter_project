import { VueInstance, BasePluginType } from '@heimdallr-sdk/types';

interface VueOptions {
    vue?: VueInstance;
}

declare function vuePlugin(options?: VueOptions): BasePluginType;

export { vuePlugin as default };
