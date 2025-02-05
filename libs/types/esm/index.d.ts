type voidFun = () => void;
interface IAnyObject {
    [key: string]: any;
}
type UnknownFunc = (...args: unknown[]) => void;

declare enum StoreKeyType {
    SESSION_ID = "HEIMDALLR_SDK_SESSION_ID",
    USER_ID = "HEIMDALLR_SDK_USER_ID",
    APP = "HEIMDALLR_SDK_APP_ID"
}
declare enum MethodTypes {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
declare enum EventTypes {
    LIFECYCLE = 1,
    ERROR = 2,
    PERFORMANCE = 3,
    API = 4,
    DOM = 5,
    ROUTE = 6,
    CONSOLE = 7,
    RECORD = 8,
    VUE = 9,
    CUSTOMER = 10,
    EXTEND = 11
}
declare enum BrowserErrorTypes {
    CODEERROR = 21,
    RESOURCEERROR = 22,
    UNHANDLEDREJECTION = 23,
    PAGECRASH = 24
}
declare enum BrowserReportType {
    BEACON = 1,
    IMG = 2,
    GET = 3,
    POST = 4
}
declare enum DomTypes {
    CLICK = 51
}
declare enum ConsoleTypes {
    LOG = "log",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    ASSERT = "assert"
}
declare enum HttpTypes {
    XHR = 41,
    FETCH = 42
}
declare enum PerTypes {
    FMP = 31,
    FPS = 32,
    BASIC = 33,
    VITALS = 34,
    RESOURCE = 35
}
declare enum RouteTypes {
    HASH = 61,
    HISTORY = 62
}
declare enum CustomerTypes {
    CUSTOMER = 111
}
type BrowserSubTypes = PageLifeType | BrowserErrorTypes | DomTypes | HttpTypes | ConsoleTypes | PerTypes | RouteTypes | CustomerTypes;
type StoreTypes = 'local' | 'session' | 'cookie' | 'global';
declare enum StoreType {
    LOCAL = "local",
    SESSION = "session",
    COOKIE = "cookie",
    GLOBAL = "global"
}
declare enum PageLifeType {
    LOAD = 11,
    UNLOAD = 12
}
declare enum DeviceType {
    MOBILE = 1,
    PC = 2
}
declare enum PlatformTypes {
    BROWSER = 1,
    WECHAT = 2,
    NODE = 3
}
declare enum BrowserBreadcrumbTypes {
    ROUTE = 11,
    CLICK = 12,
    CONSOLE = 13,
    XHR = 14,
    FETCH = 15,
    UNHANDLEDREJECTION = 16,
    RESOURCE = 17,
    CODE_ERROR = 18,
    CUSTOMER = 19,
    FRAMEWORK = 20,
    LIFECYCLE = 21,
    CRASH = 22
}
declare enum WxBreadcrumbTypes {
    API = 21,
    ROUTE = 22,
    CLICK = 23,
    ERROR = 24,
    LIFECYCLE = 25,
    CUSTOMER = 26
}

declare enum BreadcrumbLevel {
    FATAL = 1,
    ERROR = 2,
    WARN = 3,
    INFO = 4,
    DEBUG = 5
}
type BreadcrumbTypes = WxBreadcrumbTypes | BrowserBreadcrumbTypes | string;
interface BreadcrumbPushData {
    lid: string;
    bt: BreadcrumbTypes;
    msg: string;
    t: number;
    l?: BreadcrumbLevel;
}

interface AppInfoType {
    name: string;
    leader: string;
    desc?: string;
}
interface Dsn {
    host: string;
    init: string;
    report: string;
}
interface ReportDataType<T> {
    lid: string;
    t: number;
    e: EventTypes;
    dat: T;
    b?: BreadcrumbPushData[];
}
interface ReportDataMsgType {
    st: BrowserSubTypes | number | string;
}
interface ClientInfoType {
    p?: PlatformTypes;
    aid?: string;
    sid?: string;
    uid?: string;
    ttl?: string;
    url?: string;
    lan?: string;
    ws?: string;
    ds?: string;
    ua?: string;
}

declare enum SDK {
    NAME = "@heimdallr-sdk"
}
declare const TAG: string;

interface BasePluginType {
    name: string;
    monitor: (notify: (data: any) => void) => void;
    transform?: (collectedData: any) => ReportDataType<any>;
    [key: string]: any;
}

interface BaseOptionsType {
    dsn: Dsn;
    app: AppInfoType;
    debug?: boolean;
    enabled?: boolean;
    plugins?: BasePluginType[];
    maxBreadcrumbs?: number;
}
interface CustomerOptionType {
    name?: string;
    position?: StoreTypes;
}
interface RequestPluginOptionType {
    ignoreUrls?: string[];
    reportResponds?: Boolean;
}

interface LinkMsgDataType {
    href?: string;
}
interface RouteDataMsgType {
    from: string;
    to: string;
}
interface RouteMsgType extends ReportDataMsgType, RouteDataMsgType {
}
interface IAnyMsgType extends ReportDataMsgType {
    [key: string]: any;
}

interface XhrResponse<T> {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: T;
}
interface HttpCommonRes<T = any> {
    code: number;
    data: T;
    msg: string;
}
interface HttpRequest {
    m: MethodTypes | string;
    url: string;
    dat?: IAnyObject;
}
interface HttpResponse {
    sta?: number;
    dat?: IAnyObject | string;
    msg?: string;
}
interface HttpCollectDataType {
    req: HttpRequest;
    res: HttpResponse;
    t: number;
    et?: number;
}
interface HttpCollectType extends ReportDataMsgType, HttpCollectDataType {
}

interface VueInstance {
    [key: string]: any;
    config?: VueConfiguration;
    version: string;
}
interface ViewModel {
    [key: string]: any;
    $root?: Record<string, unknown>;
    $options?: {
        [key: string]: any;
        name?: string;
        props?: IAnyObject;
    };
    $props?: Record<string, unknown>;
}
interface VueConfiguration {
    errorHandler?(err: Error, vm: ViewModel | any, info: string): void;
    warnHandler?(msg: string, vm: ViewModel | any, trace: string): void;
    [key: string]: any;
}
interface VueReportDataType extends ReportDataMsgType {
    name: string;
    msg: string;
    hook: string;
    stk: string;
    lin?: number;
    col?: number;
    fn?: string;
}

interface SourcemapOptionType {
    url: string;
    app_name: string;
    err_code?: string;
    err_msg?: string;
}
interface ResponseType {
    code: number;
    msg: string;
}

interface InterfaceResponseType<T> {
    code: number;
    msg: string;
    data?: T;
}

export { type AppInfoType, type BaseOptionsType, type BasePluginType, BreadcrumbLevel, type BreadcrumbPushData, type BreadcrumbTypes, BrowserBreadcrumbTypes, BrowserErrorTypes, BrowserReportType, type BrowserSubTypes, type ClientInfoType, ConsoleTypes, type CustomerOptionType, CustomerTypes, DeviceType, DomTypes, type Dsn, EventTypes, type HttpCollectDataType, type HttpCollectType, type HttpCommonRes, type HttpRequest, type HttpResponse, HttpTypes, type IAnyMsgType, type IAnyObject, type InterfaceResponseType, type LinkMsgDataType, MethodTypes, PageLifeType, PerTypes, PlatformTypes, type ReportDataMsgType, type ReportDataType, type RequestPluginOptionType, type ResponseType, type RouteDataMsgType, type RouteMsgType, RouteTypes, SDK, type SourcemapOptionType, StoreKeyType, StoreType, type StoreTypes, TAG, type UnknownFunc, type ViewModel, type VueConfiguration, type VueInstance, type VueReportDataType, WxBreadcrumbTypes, type XhrResponse, type voidFun };
