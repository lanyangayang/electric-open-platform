package com.mantunsci.cordova.electric;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URL;
import java.util.Iterator;

/**
 * 智慧式用电开放平台 Cordova 插件（原生侧）。
 *
 * 为什么要原生发请求：WebView 向 open.snd02.com 发起跨域请求时，
 * 平台不返回 CORS 头，XHR/fetch 会被同源策略拦截。这里用 HttpURLConnection
 * 直接请求，完全绕开同源限制。
 *
 * 动作：
 *   request        POST form-urlencoded → { status, body }
 *   storageGet     → { value }
 *   storageSet
 *   storageRemove
 *
 * 签名、OAuth、错误码映射都在 JS 侧完成，原生只做「收发」，
 * 保证与 Capacitor 版行为完全一致。
 */
public class ElectricOpenPlatformPlugin extends CordovaPlugin {

    private static final String ACTION_REQUEST = "request";
    private static final String ACTION_STORAGE_GET = "storageGet";
    private static final String ACTION_STORAGE_SET = "storageSet";
    private static final String ACTION_STORAGE_REMOVE = "storageRemove";

    private static final int DEFAULT_TIMEOUT_MS = 20000;

    private TokenStorage storage;

    @Override
    protected void pluginInitialize() {
        storage = new TokenStorage(cordova.getContext());
    }

    @Override
    public boolean execute(String action, final JSONObject args, final CallbackContext callback) {
        if (ACTION_REQUEST.equals(action)) {
            // 网络请求必须离开 WebView 线程
            cordova.getThreadPool().execute(() -> handleRequest(args, callback));
            return true;
        }
        if (ACTION_STORAGE_GET.equals(action)) {
            handleStorageGet(args, callback);
            return true;
        }
        if (ACTION_STORAGE_SET.equals(action)) {
            handleStorageSet(args, callback);
            return true;
        }
        if (ACTION_STORAGE_REMOVE.equals(action)) {
            handleStorageRemove(args, callback);
            return true;
        }
        return false;
    }

    // ============================ 网络 ============================

    private void handleRequest(JSONObject args, CallbackContext callback) {
        HttpURLConnection conn = null;
        try {
            final String url = args.optString("url", "");
            final String body = args.optString("body", "");
            final int timeoutMs = args.optInt("timeoutMs", DEFAULT_TIMEOUT_MS);

            if (url.isEmpty()) {
                callback.error("url 不能为空");
                return;
            }

            conn = (HttpURLConnection) new URL(url).openConnection();
            conn.setRequestMethod("POST");
            conn.setConnectTimeout(timeoutMs);
            conn.setReadTimeout(timeoutMs);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            // 平台要求 UTF-8，且必须是 form-urlencoded
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
            conn.setRequestProperty("Accept", "application/json, text/plain, */*");

            JSONObject headers = args.optJSONObject("headers");
            if (headers != null) {
                Iterator<String> keys = headers.keys();
                while (keys.hasNext()) {
                    String k = keys.next();
                    conn.setRequestProperty(k, headers.optString(k));
                }
            }

            byte[] payload = body.getBytes("UTF-8");
            conn.setFixedLengthStreamingMode(payload.length);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(payload);
                os.flush();
            }

            final int status = conn.getResponseCode();
            final InputStream is = (status >= 200 && status < 400)
                    ? conn.getInputStream()
                    : conn.getErrorStream();
            final String text = readAll(is);

            JSONObject result = new JSONObject();
            result.put("status", status);
            result.put("body", text == null ? "" : text);
            callback.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
        } catch (SocketTimeoutException e) {
            callback.error("请求超时：" + e.getMessage());
        } catch (IOException e) {
            callback.error("网络异常：" + e.getMessage());
        } catch (JSONException e) {
            callback.error("响应封装失败：" + e.getMessage());
        } finally {
            if (conn != null) {
                conn.disconnect();
            }
        }
    }

    private static String readAll(InputStream is) throws IOException {
        if (is == null) return "";
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(is, "UTF-8"))) {
            char[] buf = new char[4096];
            int n;
            while ((n = reader.read(buf)) != -1) {
                sb.append(buf, 0, n);
            }
        }
        return sb.toString();
    }

    // ============================ 存储 ============================

    private void handleStorageGet(JSONObject args, CallbackContext callback) {
        try {
            JSONObject result = new JSONObject();
            String value = storage.get(args.optString("key", ""));
            result.put("value", value == null ? JSONObject.NULL : value);
            callback.success(result);
        } catch (JSONException e) {
            callback.error(e.getMessage());
        }
    }

    private void handleStorageSet(JSONObject args, CallbackContext callback) {
        try {
            storage.put(args.optString("key", ""), args.optString("value", ""));
            callback.success();
        } catch (RuntimeException e) {
            callback.error(e.getMessage());
        }
    }

    private void handleStorageRemove(JSONObject args, CallbackContext callback) {
        try {
            storage.remove(args.optString("key", ""));
            callback.success();
        } catch (RuntimeException e) {
            callback.error(e.getMessage());
        }
    }
}
