/**
 * Cordova 全局类型声明。
 *
 * 用法（Angular / Vue / 原生 JS 都可）：
 *   /// <reference path="cordova-plugin-mantunsci-electric/types/electric-open-platform.d.ts" />
 *   或在 tsconfig.json 的 "types" / "include" 中引入本文件。
 *
 * 之后可直接：
 *   await window.ElectricOpenPlatform.configure({ ... });
 *   const boxes = await cordova.plugins.electricOpenPlatform.box.list();
 */
declare namespace ElectricOpenPlatform {

  interface Config {
    appKey: string;
    appSecret: string;
    redirectUri: string;
    baseUrl?: string;
    projectCode?: string;
    timeoutMs?: number;
    tokenRefreshSkewMs?: number;
    username?: string;
    password?: string;
    storage?: 'auto' | 'preferences' | 'cordova' | 'localStorage' | 'memory';
    transport?: {
      readonly name: string;
      postForm(req: {
        url: string;
        body: string;
        headers?: Record<string, string>;
        timeoutMs?: number;
      }): Promise<{ status: number; data: unknown; raw: string }>;
    };
    logger?: (event: { type: string; method?: string; message: string; detail?: unknown; at: string }) => void;
  }

  interface TokenSet {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresAt: number;
  }

  interface LoginResult {
    success: true;
    code: string;
    expiresIn: number;
    expiresAt: number;
  }

  interface Box {
    mac: string;
    projectCode: string;
    equipmentType: number;
    aliasName: string;
    build: string;
    unit: string;
    room: string;
    linkman: string;
    phone: string;
    online: -1 | 0 | 1;
    onlineLastTime?: string;
    protocol: string;
    [key: string]: unknown;
  }

  interface ChannelRealtime {
    mac?: string;
    addr: number;
    title: string;
    oc: boolean;
    online: boolean;
    validity: boolean;
    enableNetCtrl: boolean;
    remoteLock: boolean;
    localLock: boolean;
    lineType: string;
    power: number;
    aV?: number;
    aA?: number;
    aW?: number;
    aT?: number;
    aLd?: number;
    gV?: number;
    gA?: number;
    gW?: number;
    gT?: number;
    gLd?: number;
    [key: string]: unknown;
  }

  interface PagedResult<T> {
    total: number;
    page: number;
    totalPage: number;
    datas: T[];
  }

  interface Error extends globalThis.Error {
    code: string;
    method?: string;
    details?: unknown;
    isTokenExpired: boolean;
    isRetryable: boolean;
    toJSON(): Record<string, unknown>;
  }

  interface Api {
    // ---- 生命周期
    configure(config: Config): Promise<void>;
    login(username: string, password: string): Promise<LoginResult>;
    logout(): Promise<void>;
    getAuthorizeUrl(options?: { state?: string }): string;
    handleRedirect(urlOrCode: string): Promise<TokenSet>;
    refreshToken(): Promise<TokenSet>;
    getAccessToken(): string | null;
    invoke<T = unknown>(method: string, params?: Record<string, unknown>): Promise<T>;
    describe(): Record<string, unknown>;
    diagnostics(): Promise<Record<string, unknown>>;
    storageBackend(): Promise<string>;
    dispose(): void;

    // ---- 业务分组
    project: {
      getInfo(projectCode?: string): Promise<Record<string, unknown>>;
      modifyInfo(fields: Record<string, unknown>): Promise<unknown>;
      dayStats(args: { year: string; month: string; day?: string; projectCode?: string }): Promise<unknown>;
    };

    box: {
      list(args?: {
        projectCode?: string;
        equipmentType?: number;
        build?: string;
        unit?: string;
        room?: string;
      }): Promise<Box[]>;
      listOnline(args?: { projectCode?: string }): Promise<Box[]>;
      get(mac: string, projectCode?: string): Promise<Box>;
      positionTree(projectCode?: string): Promise<unknown[]>;
      properties(args: { mac: string; nodeType?: string; addr?: number; projectCode?: string }): Promise<Record<string, unknown>>;
      modifyProperties(args: { mac: string; params?: Record<string, unknown>; projectCode?: string }): Promise<unknown>;
      modifyInfo(args: Record<string, unknown>): Promise<unknown>;
      setRealtimeRate(args: { mac: string | string[]; enable: boolean; rate: number; projectCode?: string }): Promise<unknown>;
      onlineHistory(args: {
        mac: string;
        startTime: Date | string;
        endTime: Date | string;
        page?: number;
        pageSize?: number;
        projectCode?: string;
      }): Promise<PagedResult<unknown>>;
    };

    channel: {
      realtime(args: { mac: string | string[]; projectCode?: string }): Promise<{ mac: string; channelList: ChannelRealtime[] }[]>;
      realtimeChannels(args: { mac: string | string[]; projectCode?: string }): Promise<ChannelRealtime[]>;
      list(args: { mac?: string; param?: { mac: string; addr: string }[]; projectCode?: string }): Promise<unknown[]>;
      channelsOc(args: { mac: string | string[]; projectCode?: string }): Promise<unknown[]>;
      history(args: { mac: string; date?: string; addr?: number; isReturnTotal?: boolean; page?: number; pageSize?: number; projectCode?: string }): Promise<unknown>;
    };

    control: {
      switchCircuit(args: {
        mac: string;
        action: 'open' | 'close';
        addr: number | number[];
        skipWhenAbnormalLock?: boolean;
        projectCode?: string;
      }): Promise<unknown>;
      batchSwitch(args: { items: { mac: string; addr: number | string }[]; action: 'open' | 'close'; projectCode?: string }): Promise<unknown>;
      updateCircuit(args: { mac: string; addr: number; title?: string; maxPowerW?: number; overCurrentThreshold?: number; projectCode?: string }): Promise<unknown>;
      remoteLock(args: { mac: string; addr: number; locked: boolean; projectCode?: string }): Promise<unknown>;
      unlockAbnormal(args: { mac: string; addr: number; projectCode?: string }): Promise<unknown>;
      setVisibility(args: { mac: string; addr: number; visible: boolean; projectCode?: string }): Promise<unknown>;
      setControl(args: { mac: string; addr: number; controllable: boolean; projectCode?: string }): Promise<unknown>;
      setAutoLeakage(args: { mac: string; enable: boolean; day: number; hour: number; minute: number; projectCode?: string }): Promise<unknown>;
      getTimers(args: { mac: string; autoid?: number; projectCode?: string }): Promise<unknown[]>;
      getLeakageCheck(args: { mac: string; projectCode?: string }): Promise<unknown[]>;
      control(args: { mac: string; cmd: string; options: Record<string, unknown>; projectCode?: string }): Promise<unknown>;
    };

    alarm: {
      list(args: {
        mac?: string;
        start: Date | string;
        end: Date | string;
        page?: number;
        pageSize?: number;
        type?: 'W' | 'I';
        includeCalm?: boolean;
        projectCode?: string;
      }): Promise<PagedResult<Record<string, unknown>>>;
      listAll(args: Record<string, unknown>): Promise<Record<string, unknown>[]>;
      byType(args: Record<string, unknown> & { typeNumbers: number[] }): Promise<Record<string, unknown>[]>;
      maintenance(args: { alarmId: number | string | (number | string)[]; projectCode?: string }): Promise<unknown>;
      urged(args: { mac: string; alarmId: number | string | (number | string)[]; projectCode?: string }): Promise<unknown>;
      boxMaintenanceHistory(args: {
        mac?: string;
        start: Date | string;
        end: Date | string;
        page?: number;
        pageSize?: number;
        projectCode?: string;
      }): Promise<PagedResult<Record<string, unknown>>>;
    };

    stats: {
      day(args: { mac: string | string[]; year: string; month: string; day?: string; projectCode?: string }): Promise<Record<string, unknown>>;
      hour(args: { mac: string | string[]; year: string; month: string; day: string; projectCode?: string }): Promise<Record<string, unknown>>;
      month(args: { mac: string | string[]; year: string; projectCode?: string }): Promise<Record<string, unknown>>;
      totalElectricity(rows: { addr?: number; electricity?: number }[]): number;
    };

    scene: {
      list(projectCode?: string): Promise<{ scenes?: unknown[] }>;
      execute(args: { sceneId: string; params?: Record<string, unknown>; projectCode?: string }): Promise<unknown>;
    };

    push: {
      query(pushType: number): Promise<unknown>;
      subscribe(args: Record<string, unknown>): Promise<unknown>;
      unsubscribe(projectCode?: string): Promise<unknown>;
      failedCheck(pushType: number): Promise<unknown>;
      failedReset(pushType: number, pushEnable?: 0 | 1): Promise<unknown>;
    };

    thirdparty: {
      status(args: {
        mac: string;
        equipmentType: number;
        dataType?: number;
        startDate?: string;
        endDate?: string;
        projectCode?: string;
      }): Promise<{ devType: string; msgType: string; data: string; mac: string }[]>;
      statusParsed(args: Record<string, unknown>): Promise<{ devType: string; msgType: string; data: unknown; mac: string }[]>;
      listDevices(args: { equipmentType: number; projectCode?: string }): Promise<Box[]>;
    };

    // ---- 工具
    md5(input: string): string;
    signParams(args: { params: Record<string, string | number | boolean | null | undefined>; appSecret: string }): string;
    formatTimestamp(date?: Date): string;
    ElectricOpenPlatformError: new (code: string, message?: string, options?: Record<string, unknown>) => Error;
    PlatformCodes: Record<string, string>;
    TransportCodes: Record<string, string>;
    AlarmType: Record<string, number>;
    PushType: Record<string, number>;
    EquipmentType: Record<string, number>;
    ThirdPartyEquipmentType: Record<string, number>;
  }
}

declare var ElectricOpenPlatform: ElectricOpenPlatform.Api;

declare namespace cordova {
  namespace plugins {
    const electricOpenPlatform: ElectricOpenPlatform.Api;
  }
}
