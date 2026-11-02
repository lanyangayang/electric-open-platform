import { RouterClient } from './router.js';
import { ParamValue } from './sign.js';
import { AlarmRecord, AlarmTypeNumber, Box, BoxChannel, BoxChannels, BoxControlCmd, BoxControlCommand, BoxProperty, BoxRealtime, BoxStat, BoxStatsByMac, BoxStatsByMacAndPeriod, LeakageCheckConfig, MaintenanceRecord, MeterQueryType, OnlineHistoryRecord, PagedResult, PositionNode, ProjectInfo, Scene, ThirdPartyDeviceStatus, ThirdPartyEquipmentType, TimerConfig } from './models.js';
/** Shared helpers so every module treats `projectCode` and limits identically. */
declare class ApiBase {
    protected readonly client: RouterClient;
    constructor(client: RouterClient);
    protected call<T>(method: string, params?: Record<string, ParamValue>, projectCode?: string): Promise<T>;
    /** Normalises a comma list / array into the platform's comma-joined string. */
    protected static list(value: string | string[] | undefined): string | undefined;
}
/** 项目信息：GET_PROJECT_INFO / MODIFY_PROJECT_INFO */
export declare class ProjectApi extends ApiBase {
    getInfo(projectCode?: string): Promise<ProjectInfo>;
    modifyInfo(fields: Partial<ProjectInfo> & {
        projectCode?: string;
    }): Promise<unknown>;
    /** 项目日统计 GET_PROJECT_DAY_STATS */
    dayStats(args: {
        year: string;
        month: string;
        day?: string;
        projectCode?: string;
    }): Promise<unknown>;
}
/** 设备：GET_BOXES / GET_BOX / GET_BOX_POSITION_TREE / MODIFY_BOX_INFO … */
export declare class BoxApi extends ApiBase {
    list(args?: {
        projectCode?: string;
        equipmentType?: number;
        build?: string;
        unit?: string;
        room?: string;
    }): Promise<Box[]>;
    /** Only online (-1 未连接 / 0 离线 / 1 在线). */
    listOnline(args?: {
        projectCode?: string;
    }): Promise<Box[]>;
    get(mac: string, projectCode?: string): Promise<Box>;
    positionTree(projectCode?: string): Promise<PositionNode[]>;
    /**
     * GET_BOX_PROPERTIES — 设备节点属性 (暂仅支持微断/A 系列设备).
     *
     * `nodeType` is **required** by the platform; the documented value for the
     * communication module is `COMM`. `addr` optionally targets one circuit.
     */
    properties(args: {
        mac: string;
        nodeType?: string;
        addr?: number;
        projectCode?: string;
    }): Promise<BoxProperty>;
    modifyProperties(args: {
        mac: string;
        params?: Record<string, ParamValue>;
        projectCode?: string;
    }): Promise<unknown>;
    modifyInfo(args: {
        mac: string;
    } & Partial<Box> & {
        projectCode?: string;
    }): Promise<unknown>;
    /**
     * 调节上报频率 SET_BOX_REALTIME_RATE.
     * `rate` is seconds between uploads — 5..180 for UDP modules, 5..600 for HTTP.
     */
    setRealtimeRate(args: {
        mac: string | string[];
        enable: boolean;
        rate: number;
        projectCode?: string;
    }): Promise<unknown>;
    /**
     * 设备在线轨迹 GET_BOX_ONLINE_HISTORY.
     *
     * Note the platform wants `startTime` / `endTime` here — **not** the
     * `start`/`end` pair used by GET_BOX_ALARM. Format `yyyy-MM-dd HH:mm`;
     * only the last ~6 months are retained.
     */
    onlineHistory(args: {
        mac: string;
        startTime: Date | string;
        endTime: Date | string;
        page?: number;
        pageSize?: number;
        projectCode?: string;
    }): Promise<PagedResult<OnlineHistoryRecord>>;
}
/** 线路/节点：实时状态、有效节点、分合闸控制 */
export declare class ChannelApi extends ApiBase {
    /**
     * GET_BOX_CHANNELS_REALTIME.
     *
     * Accepts 1..20 macs. The platform returns a **different shape** for one mac
     * (flat channel array) than for many (array of `{ mac, channelList }`); this
     * method always normalises to {@link BoxRealtime}[] so UI code never branches.
     */
    realtime(args: {
        mac: string | string[];
        projectCode?: string;
    }): Promise<BoxRealtime[]>;
    /** Flattened convenience: every circuit of every requested device. */
    realtimeChannels(args: {
        mac: string | string[];
        projectCode?: string;
    }): Promise<(BoxRealtime['channelList'][number] & {
        mac: string;
    })[]>;
    /** GET_BOX_CHANNELS — the list of valid circuits (title/oc/updateTime only). */
    list(args: {
        mac?: string;
        param?: {
            mac: string;
            addr: string;
        }[];
        projectCode?: string;
    }): Promise<BoxChannels[]>;
    /** GET_BOX_CHANNELS_OC — 开关状态（比 realtime 轻量）。 */
    channelsOc(args: {
        mac: string | string[];
        projectCode?: string;
    }): Promise<BoxChannels[]>;
    /**
     * 历史节点数据 GET_BOX_CHANNELS_REALTIME_HISTORY.
     *
     * 平台**仅支持按天**查询：参数是 `date`（yyyy-MM-dd，默认当天），
     * 不是开始/结束区间。
     */
    history(args: {
        mac: string;
        /** yyyy-MM-dd，默认为当天 */
        date?: string;
        addr?: number;
        isReturnTotal?: boolean;
        page?: number;
        pageSize?: number;
        projectCode?: string;
    }): Promise<unknown>;
}
/** 控制：PUT_BOX_CONTROL / BATCH_BOX_CONTROL */
export declare class ControlApi extends ApiBase {
    /**
     * Generic control dispatcher.
     *
     * `PUT_BOX_CONTROL` takes `cmd` plus a flat set of `value1..value5` (and, for
     * device/timer commands, dotted keys such as `device.autoid`).
     */
    control<C extends BoxControlCmd>(args: {
        mac: string;
        cmd: C;
        /** Strongly typed per command, e.g. `{ value1: 'open', value2: '1,2' }`. */
        options: BoxControlCommand[C];
        projectCode?: string;
    }): Promise<unknown>;
    /** 合闸/分闸. Addresses are 1-based circuit addresses. */
    switchCircuit(args: {
        mac: string;
        action: 'open' | 'close';
        addr: number | number[];
        /** 异常分闸锁定时不下发 */
        skipWhenAbnormalLock?: boolean;
        projectCode?: string;
    }): Promise<unknown>;
    /** 批量控制 BATCH_BOX_CONTROL */
    batchSwitch(args: {
        /** [{ mac, addr }] or the platform's own payload; passed through. */
        items: {
            mac: string;
            addr: number | string;
        }[];
        action: 'open' | 'close';
        projectCode?: string;
    }): Promise<unknown>;
    /** 改线路名称 / 功率限定 (SWITCHSET) */
    updateCircuit(args: {
        mac: string;
        addr: number;
        title?: string;
        maxPowerW?: number;
        overCurrentThreshold?: number;
        projectCode?: string;
    }): Promise<unknown>;
    /** 远程锁定/解锁一条线路 */
    remoteLock(args: {
        mac: string;
        addr: number;
        locked: boolean;
        projectCode?: string;
    }): Promise<unknown>;
    /** 对异常分闸锁定的线路执行远程解锁 */
    unlockAbnormal(args: {
        mac: string;
        addr: number;
        projectCode?: string;
    }): Promise<unknown>;
    /** 线路/设备显隐标记 */
    setVisibility(args: {
        mac: string;
        addr: number;
        visible: boolean;
        projectCode?: string;
    }): Promise<unknown>;
    /** 是否允许控制标记 */
    setControl(args: {
        mac: string;
        addr: number;
        controllable: boolean;
        projectCode?: string;
    }): Promise<unknown>;
    /** 自动漏电自检 */
    setAutoLeakage(args: {
        mac: string;
        enable: boolean;
        day: number;
        hour: number;
        minute: number;
        projectCode?: string;
    }): Promise<unknown>;
    /** 设备定时配置 GET_CFG_TIMER (autoid = 0 返回全部) */
    getTimers(args: {
        mac: string;
        autoid?: number;
        projectCode?: string;
    }): Promise<TimerConfig[]>;
    /** 漏电自检记录 GET_CFG_LKICHK */
    getLeakageCheck(args: {
        mac: string;
        projectCode?: string;
    }): Promise<LeakageCheckConfig[]>;
}
/** 告警 */
export declare class AlarmApi extends ApiBase {
    /**
     * GET_BOX_ALARM.
     *
     * Platform limits: `start` within the last month, `end - start` <= 48 h, and
     * these windows are **storage time**, not alarm time.
     */
    list(args: {
        /** Omit to query the whole project. */
        mac?: string;
        start: Date | string;
        end: Date | string;
        page?: number;
        pageSize?: number;
        type?: 'W' | 'I';
        includeCalm?: boolean;
        projectCode?: string;
    }): Promise<PagedResult<AlarmRecord>>;
    /** Walks every page of a window (capped by `maxPages`). */
    listAll(args: Parameters<AlarmApi['list']>[0] & {
        maxPages?: number;
    }): Promise<AlarmRecord[]>;
    /** 按告警类型/设备过滤 (client side — the API has no such filter). */
    byType(args: Parameters<AlarmApi['list']>[0] & {
        typeNumbers: AlarmTypeNumber[];
    }): Promise<AlarmRecord[]>;
    /**
     * 告警维护记录 GET_ALARM_MAINTENANCE.
     * `alarmId` 支持单个或数组（平台最多 20 个，逗号分隔）。
     */
    maintenance(args: {
        alarmId: number | string | (number | string)[];
        projectCode?: string;
    }): Promise<unknown>;
    /**
     * 催办/处理告警 ALARM_URGED.
     * 注意 `mac` 是必填项（文档与旧实现不一致处，已按平台实测修正）。
     */
    urged(args: {
        mac: string;
        alarmId: number | string | (number | string)[];
        projectCode?: string;
    }): Promise<unknown>;
    /**
     * 设备维保工单处理历史 GET_BOX_MAINTENANCE_HISTORY.
     * `start`/`end` 必填（yyyy-MM-dd HH:mm）：start 需在最近一个月内，end 不得晚于今天。
     */
    boxMaintenanceHistory(args: {
        mac?: string;
        start: Date | string;
        end: Date | string;
        page?: number;
        pageSize?: number;
        projectCode?: string;
    }): Promise<PagedResult<MaintenanceRecord>>;
}
/**
 * 统计.
 *
 * 方法名是 `GET_BOXES_*`（BOX + ES），**不是** `GET_BOXS_*`。
 * 两者只差一个字母，但平台对错误拼写的回答是「接口名称(X)无效！」，
 * 极易被误判成「接口未开通」。已对真实服务器逐个验证过。
 */
export declare class StatsApi extends ApiBase {
    private period;
    /**
     * 日区间统计 GET_BOXES_DAY_STATS.
     * 不传 `day` 时返回当月每天的数据。
     */
    day(args: {
        mac: string | string[];
        year: string;
        month: string;
        day?: string;
        projectCode?: string;
    }): Promise<BoxStatsByMac | BoxStatsByMacAndPeriod>;
    /** 小时区间统计 GET_BOXES_HOUR_STATS. */
    hour(args: {
        mac: string | string[];
        year: string;
        month: string;
        day: string;
        projectCode?: string;
    }): Promise<BoxStatsByMac>;
    /** 月区间统计 GET_BOXES_MON_STATS. */
    month(args: {
        mac: string | string[];
        year: string;
        projectCode?: string;
    }): Promise<BoxStatsByMac>;
    /** Sum of `electricity` for a day across circuits (addr=0 row is the device total). */
    totalElectricity(stats: BoxStat[]): number;
}
/** 场景/定时 (服务端触发) */
export declare class SceneApi extends ApiBase {
    list(projectCode?: string): Promise<{
        scenes?: Scene[];
    }>;
    execute(args: {
        sceneId: string;
        params?: Record<string, ParamValue>;
        projectCode?: string;
    }): Promise<unknown>;
}
/**
 * 第三方设备（烟感/燃气/水表/温湿度等，即 equipmentType ≠ 1/2 的设备）。
 *
 * 这些设备没有「线路」概念，状态通过 GET_THR_DEVICE_STATUS 按消息类型返回。
 */
export declare class ThirdPartyDeviceApi extends ApiBase {
    /**
     * 获取第三方设备状态 GET_THR_DEVICE_STATUS.
     *
     * @param args.equipmentType 必填，且必须是**第三方**设备类型
     *   （4/5/6/7/10/11/12/13/14/16/29/39/42/45）。传 1 或 2 会被平台以
     *   「设备类型无效！」拒绝——微断请用 {@link ChannelApi.realtime}。
     * @param args.dataType 仅智能水表(16)必填：0 实时抄表 / 1 时间范围
     * @param args.startDate / endDate `dataType=1` 时必填，格式 yyyy-MM-dd
     */
    status(args: {
        mac: string;
        equipmentType: ThirdPartyEquipmentType | number;
        dataType?: MeterQueryType | number;
        startDate?: string;
        endDate?: string;
        projectCode?: string;
    }): Promise<ThirdPartyDeviceStatus[]>;
    /**
     * 同上，但把每条记录的 `data` JSON 字符串解析成对象，
     * 便于直接绑定到 UI（解析失败时保留原始字符串）。
     */
    statusParsed(args: Parameters<ThirdPartyDeviceApi['status']>[0]): Promise<(Omit<ThirdPartyDeviceStatus, 'data'> & {
        data: unknown;
    })[]>;
    /** 列出项目中某类型的第三方设备（从 GET_BOXES 过滤）。 */
    listDevices(args: {
        equipmentType: ThirdPartyEquipmentType | number;
        projectCode?: string;
    }): Promise<Box[]>;
}
/**
 * 解析第三方设备 status 的 `data` 字段。
 * 该字段是 JSON 字符串；个别设备会返回纯数字（如 `"0"`），此时原样返回。
 */
export declare function parseThirdPartyData(raw: unknown): unknown;
export type { BoxRealtime, BoxChannel };
