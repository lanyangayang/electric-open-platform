/**
 * Pluggable HTTP transport.
 *
 * 包内只提供一种实现（{@link createFetchTransport}，基于标准 `fetch`），
 * 需要走原生网络栈、代理或自建网关时，实现 {@link Transport} 注入即可：
 *
 * ```ts
 * await ElectricOpenPlatform.configure({ ...cfg, transport: myTransport });
 * ```
 *
 * 所有实现只负责「发出去、拿回来、把 HTTP 状态映射成异常」，
 * 解析 JSON 与业务错误码由上层统一处理，保证不同传输实现的行为一致。
 */
import { ElectricOpenPlatformError, TransportCodes } from './errors.js';
export const DEFAULT_TIMEOUT_MS = 20000;
export function parseBody(raw) {
    const trimmed = raw.trim();
    if (trimmed === '')
        return null;
    try {
        return JSON.parse(trimmed);
    }
    catch {
        return raw;
    }
}
/** 非 2xx 统一转成可识别的异常。 */
export function assertHttpOk(status, raw) {
    if (status < 200 || status >= 300) {
        throw new ElectricOpenPlatformError(TransportCodes.HTTP, `服务器返回 HTTP ${status}`, {
            httpStatus: status,
            details: raw,
        });
    }
}
//# sourceMappingURL=transport.js.map