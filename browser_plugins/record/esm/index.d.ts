import { BasePluginType } from '@heimdallr-sdk/types';
import { recordOptions } from 'rrweb/typings/types';
import { eventWithTime } from '@rrweb/types';

declare function recordPlugin(options?: recordOptions<eventWithTime>): BasePluginType;

export { recordPlugin as default };
