/**
 * 基于 CapacitorHttp 的传输实现。
 *
 * CapacitorHttp 走原生网络栈，不受 WebView 同源策略限制，平台不返回 CORS 头也能通。
 * 与 `@capacitor/core` 的耦合收敛在这个文件里，Cordova 构建不会引入它。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';
import {
  assertHttpOk,
  DEFAULT_TIMEOUT_MS,
  HttpRequest,
  HttpResponse,
  parseBody,
  Transport,
} from './transport.js';

/** 只声明用到的形状，避免本文件强依赖 @capacitor/core 的类型。 */
interface CapacitorHttpLike {
  post(options: {
    url: string;
    headers: Record<string, string>;
    data: string;
    connectTimeout: number;
    readTimeout: number;
    responseType: string;
  }): Promise<{ status: number; data: unknown }>;
}

interface CapacitorLike {
  isNativePlatform(): boolean;
}

export function createCapacitorTransport(core: {
  Capacitor: CapacitorLike;
  CapacitorHttp: CapacitorHttpLike;
}): Transport {
  const { Capacitor, CapacitorHttp } = core;

  return {
    name: 'capacitor-http',
    async postForm(req: HttpRequest): Promise<HttpResponse> {
      if (req.signal?.aborted) {
        throw new ElectricOpenPlatformError(TransportCodes.ABORTED, '请求已取消');
      }
      if (!Capacitor.isNativePlatform()) {
        throw new ElectricOpenPlatformError(
          TransportCodes.NETWORK,
          '当前不是原生平台，CapacitorHttp 不可用；请改用 fetch 传输',
        );
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Accept: 'application/json, text/plain, */*',
        ...req.headers,
      };
      const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;

      const res = await CapacitorHttp.post({
        url: req.url,
        headers,
        data: req.body,
        connectTimeout: timeoutMs,
        readTimeout: timeoutMs,
        responseType: 'text',
      });

      const raw = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      assertHttpOk(res.status, raw);
      return { status: res.status, data: parseBody(raw), raw };
    },
  };
}
