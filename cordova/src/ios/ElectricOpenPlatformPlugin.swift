import Foundation
import WebKit

/**
 * 智慧式用电开放平台 Cordova 插件（iOS 原生侧）。
 *
 * 与 Android 侧动作保持一致：request / storageGet / storageSet / storageRemove。
 * 用 URLSession 发请求，绕开 WKWebView 的同源策略。
 *
 * 说明：本文件按 Cordova iOS（CDVPlugin）约定编写。若你的 iOS 工程
 * 未引入 Cordova，可在纯 Capacitor 工程中忽略此平台。
 */
@objc(ElectricOpenPlatformPlugin)
class ElectricOpenPlatformPlugin: CDVPlugin {

    private let storagePrefix = "mantunsci_eop_"

    // MARK: - 网络

    @objc(request:)
    func request(command: CDVInvokedUrlCommand) {
        guard
            let args = command.arguments.first as? [String: Any],
            let urlString = args["url"] as? String,
            let url = URL(string: urlString)
        else {
            sendError(command, "url 不能为空")
            return
        }

        let body = args["body"] as? String ?? ""
        let headers = args["headers"] as? [String: String] ?? [:]
        let timeoutMs = args["timeoutMs"] as? Int ?? 20000

        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.timeoutInterval = TimeInterval(timeoutMs) / 1000.0
        req.httpBody = body.data(using: .utf8)
        req.setValue(
            "application/x-www-form-urlencoded; charset=utf-8",
            forHTTPHeaderField: "Content-Type"
        )
        req.setValue("application/json, text/plain, */*", forHTTPHeaderField: "Accept")
        for (k, v) in headers {
            req.setValue(v, forHTTPHeaderField: k)
        }

        let task = URLSession.shared.dataTask(with: req) { [weak self] data, response, error in
            guard let self = self else { return }

            if let error = error {
                self.sendError(command, "网络异常：\(error.localizedDescription)")
                return
            }
            guard let http = response as? HTTPURLResponse else {
                self.sendError(command, "未收到有效的 HTTP 响应")
                return
            }

            let text = data.flatMap { String(data: $0, encoding: .utf8) } ?? ""
            let result: [String: Any] = ["status": http.statusCode, "body": text]
            let pluginResult = CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result)
            self.commandDelegate.send(pluginResult, callbackId: command.callbackId)
        }
        task.resume()
    }

    // MARK: - 存储（UserDefaults）

    @objc(storageGet:)
    func storageGet(command: CDVInvokedUrlCommand) {
        let key = (command.arguments.first as? [String: Any])?["key"] as? String ?? ""
        let value = UserDefaults.standard.string(forKey: storagePrefix + key)
        let result: [String: Any] = ["value": value as Any]
        commandDelegate.send(
            CDVPluginResult(status: CDVCommandStatus_OK, messageAs: result),
            callbackId: command.callbackId
        )
    }

    @objc(storageSet:)
    func storageSet(command: CDVInvokedUrlCommand) {
        guard let args = command.arguments.first as? [String: Any],
              let key = args["key"] as? String
        else {
            sendError(command, "key 不能为空")
            return
        }
        UserDefaults.standard.set(args["value"] as? String ?? "", forKey: storagePrefix + key)
        commandDelegate.send(
            CDVPluginResult(status: CDVCommandStatus_OK),
            callbackId: command.callbackId
        )
    }

    @objc(storageRemove:)
    func storageRemove(command: CDVInvokedUrlCommand) {
        let key = (command.arguments.first as? [String: Any])?["key"] as? String ?? ""
        UserDefaults.standard.removeObject(forKey: storagePrefix + key)
        commandDelegate.send(
            CDVPluginResult(status: CDVCommandStatus_OK),
            callbackId: command.callbackId
        )
    }

    // MARK: - 工具

    private func sendError(_ command: CDVInvokedUrlCommand, _ message: String) {
        commandDelegate.send(
            CDVPluginResult(status: CDVCommandStatus_ERROR, messageAs: message),
            callbackId: command.callbackId
        )
    }
}
