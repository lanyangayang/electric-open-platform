/**
 * Pluggable HTTP transport.
 *
 * The plugin must run unchanged on three very different hosts:
 *
 * | 宿主 | 推荐实现 | 为什么不能用 fetch |
 * | --- | --- | --- |
 * | Capacitor App | {@link createCapacitorTransport} | WebView origin 跨域，平台不返回 CORS 头 |
 * | Cordova App | `cordova.plugins.electricOpenPlatform.request`（原生） | 同上，且要避开 WebView CORS |
 * | 浏览器 / Node / 测试 | {@link createFetchTransport} | 同源或已有代理 |
 *
 * 所有实现只负责「发出去、拿回来、把 HTTP 状态映射成异常」，
 * 解析 JSON 与业务错误码由上层统一处理，保证三种宿主行为一致。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';

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

export const DEFAULT_TIMEOUT_MS = 20_000;

export function parseBody(raw: string): unknown {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    return raw;
  }
}

/** 非 2xx 统一转成可识别的异常。 */
export function assertHttpOk(status: number, raw: string): void {
  if (status < 200 || status >= 300) {
    throw new ElectricOpenPlatformError(TransportCodes.HTTP, `服务器返回 HTTP ${status}`, {
      httpStatus: status,
      details: raw,
    });
  }
}
