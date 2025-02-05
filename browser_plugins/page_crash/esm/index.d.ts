import { BasePluginType } from '@heimdallr-sdk/types';

interface PageCrashPluginOptions {
    pageCrashWorkerUrl?: string;
}
declare function pageCrashPlugin(options?: PageCrashPluginOptions): BasePluginType;

export { type PageCrashPluginOptions, pageCrashPlugin as default };
