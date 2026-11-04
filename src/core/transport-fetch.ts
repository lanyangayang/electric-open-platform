/**
 * 基于标准 `fetch` 的传输实现 —— 包内唯一的默认实现。
 *
 * 适用：Node ≥ 18、Electron 主进程、Deno/Bun、以及**同源或已配反向代理**的浏览器。
 *
 * ⚠️ 浏览器里直接请求 `open.snd02.com` 会被同源策略拦截：平台不返回 CORS 头。
 * 浏览器场景请把 `baseUrl` 指向自己的代理/后端中转，或注入一个走原生网络的
 * {@link Transport} 实现（见 README「在任何环境里使用」）。
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

export function createFetchTransport(): Transport {
  return {
    name: 'fetch',
    async postForm(req: HttpRequest): Promise<HttpResponse> {
      if (req.signal?.aborted) {
        throw new ElectricOpenPlatformError(TransportCodes.ABORTED, '请求已取消');
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        Accept: 'application/json, text/plain, */*',
        ...req.headers,
      };
      const timeoutMs = req.timeoutMs ?? DEFAULT_TIMEOUT_MS;

      // AbortController 让超时行为不依赖运行时的具体实现
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const onAbort = () => controller.abort();
      req.signal?.addEventListener('abort', onAbort);

      try {
        const res = await fetch(req.url, {
          method: 'POST',
          headers,
          body: req.body,
          signal: controller.signal,
        });
        const raw = await res.text();
        assertHttpOk(res.status, raw);
        return { status: res.status, data: parseBody(raw), raw };
      } catch (err) {
        if (err instanceof ElectricOpenPlatformError) throw err;
        const aborted = (err as Error)?.name === 'AbortError';
        throw new ElectricOpenPlatformError(
          aborted ? TransportCodes.ABORTED : TransportCodes.NETWORK,
          aborted ? '请求超时或已取消' : `网络请求失败：${(err as Error)?.message ?? err}`,
          { cause: err },
        );
      } finally {
        clearTimeout(timer);
        req.signal?.removeEventListener('abort', onAbort);
      }
    },
  };
}
