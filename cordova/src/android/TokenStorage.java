package com.mantunsci.cordova.electric;

import android.content.Context;
import android.content.SharedPreferences;

/**
 * token 持久化（Android SharedPreferences）。
 *
 * 选择 SharedPreferences 而不是 localStorage：
 *  - 跨 App 重启可靠，不受 WebView 数据清理影响；
 *  - 可随 App 卸载一并清除；
 *  - 需要更高安全级别时可换成 EncryptedSharedPreferences
 *    （androidx.security:security-crypto），接口保持不变。
 *
 * 注意：这里存的是 accessToken / refreshToken，不是 appSecret。
 */
public class TokenStorage {

    private static final String PREFS_NAME = "mantunsci_electric_open_platform";

    private final SharedPreferences prefs;

    public TokenStorage(Context context) {
        this.prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
    }

    public String get(String key) {
        return prefs.getString(key, null);
    }

    public void put(String key, String value) {
        prefs.edit().putString(key, value).apply();
    }

    public void remove(String key) {
        prefs.edit().remove(key).apply();
    }
}
