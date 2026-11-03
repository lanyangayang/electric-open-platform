export interface HttpRequest {
    url: string;
    /** form-urlencoded body. */
    body: string;
    headers?: Record<string, string>;
    timeoutMs?: number;
    signal?: AbortSignal;
}
export interface HttpResponse {
    status: number;
    /** Response body already parsed when it was JSON, otherwise the raw string. */
    data: unknown;
    raw: string;
}
export interface Transport {
    /** 便于诊断：当前实际使用的传输实现名称。 */
    readonly name: string;
    postForm(req: HttpRequest): Promise<HttpResponse>;
}
export declare const DEFAULT_TIMEOUT_MS = 20000;
export declare function parseBody(raw: string): unknown;
/** 非 2xx 统一转成可识别的异常。 */
export declare function assertHttpOk(status: number, raw: string): void;
