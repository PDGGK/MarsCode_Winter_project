import { BasePluginType } from '@heimdallr-sdk/types';

interface DomOptions {
    throttleDelayTime?: number;
    sensitiveClasses?: string[];
    sensitiveTags?: string[];
}

interface DomCollectedType {
    doc: Document;
    ev: MouseEvent;
}
declare function domPlugin(options?: DomOptions): BasePluginType;

export { type DomCollectedType, domPlugin as default };
