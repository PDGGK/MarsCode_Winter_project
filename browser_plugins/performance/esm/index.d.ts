import { BasePluginType } from '@heimdallr-sdk/types';

declare enum PerformanceFeat {
    BASIC = "basic",
    RESOURCE = "resource",
    FMP = "fmp",
    FPS = "fps",
    VITALS = "vitals"
}
interface PerformanceOptions {
    performancOff?: PerformanceFeat[];
}

declare function perPlugin(options?: PerformanceOptions): BasePluginType;

export { perPlugin as default };
