import { IAnyObject, StoreTypes, StoreType, XhrResponse, HttpCommonRes, MethodTypes } from '@heimdallr-sdk/types';

declare const formateUrlPath: (host: string, path: string) => string;
declare const getUrlPath: (url: string) => string;
declare const setUrlQuery: (url: string, query?: {}) => string;
declare const getDeepPropByDot: (keyPath: string, obj: Object) => {
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
};
declare const obj2query: (params: IAnyObject) => string;

declare const generateUUID: () => string;
declare const throttle: <T extends (...args: any[]) => void>(fn: T, delay: number) => (...args: Parameters<T>) => void;
declare const replaceOld: (source: IAnyObject, name: string, replacement: (...args: any[]) => any, isForced?: boolean) => void;
declare const formatDecimal: (num: number, decimal: number) => number;
declare const countBytes: (str: string) => number;
declare const splitStringByBytes: (str: string, maxBytes: number) => Array<string>;

declare const getStore: <T>(type: StoreTypes, keyPath: string, needParse?: boolean) => "" | T;
declare const setStore: (type: StoreType, key: string, data: any) => void;
declare const setCookie: (key: string, value: any, days: number) => void;
declare const getCookie: (key: string) => string;
declare const delCookie: (key: string) => void;

declare const beacon: (url: string, data: Record<string, any>) => boolean;
declare const get: (url: string, data: Record<string, any>) => Promise<XhrResponse<HttpCommonRes<any>>>;
declare const post: (url: string, data: Record<string, any> | string) => Promise<XhrResponse<HttpCommonRes<any>>>;
declare const xhr: (method: MethodTypes, url: string, data: any) => Promise<XhrResponse<HttpCommonRes>>;
declare const imgRequest: (url: string, data: Record<string, any>) => void;

export { beacon, countBytes, delCookie, formatDecimal, formateUrlPath, generateUUID, get, getCookie, getDeepPropByDot, getStore, getUrlPath, imgRequest, obj2query, post, replaceOld, setCookie, setStore, setUrlQuery, splitStringByBytes, throttle, xhr };
