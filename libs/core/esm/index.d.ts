import * as _heimdallr_sdk_types from '@heimdallr-sdk/types';
import { BaseOptionsType, IAnyObject, BasePluginType, BreadcrumbPushData } from '@heimdallr-sdk/types';

declare abstract class Core<O extends BaseOptionsType> {
    private readonly options;
    private context;
    protected appID: string;
    protected readonly taskQueue: Array<IAnyObject>;
    private isReady;
    constructor(options: O);
    initConsole(): void;
    private bindOptions;
    use(plugins: BasePluginType[]): void;
    executeTaskQueue(): void;
    getClientOptions(): O;
    getContext(): {
        app: _heimdallr_sdk_types.AppInfoType;
        uploadUrl: string;
        initUrl: string;
        debug: boolean;
        enabled: boolean;
    };
    abstract isRightEnv(): boolean;
    abstract nextTick(cb: Function, ctx: Object, ...args: any[]): void;
    abstract initAPP(): Promise<string>;
    abstract transform(datas: IAnyObject): IAnyObject;
    abstract report(url: string, datas: IAnyObject, type?: any): void;
}

declare class Breadcrumb<O extends BaseOptionsType> {
    private readonly maxBreadcrumbs;
    private stack;
    constructor(options?: Partial<O>);
    unshift(data: BreadcrumbPushData): BreadcrumbPushData[];
    private pop;
    clear(): void;
    getStack(): BreadcrumbPushData[];
}

export { Breadcrumb, Core };
