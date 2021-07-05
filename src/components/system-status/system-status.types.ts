
export interface INodeJsMemoryUsage {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
}

export interface INodeJsCpuUsage {
    user: number;
    system: number;
}

export interface INodeJsCpuInfo {
    model: string;
    speed: number;
    times: {
        user: number;
        nice: number;
        sys: number;
        idle: number;
        irq: number;
    };
}

export interface ISystemMemory {
    total: number;
    free: number;
    percentFree: number;
}

export interface INodeJsNetworkInterfaceBase {
    address: string;
    netmask: string;
    mac: string;
    internal: boolean;
}

export interface INodeJsNetworkInterfaceInfoIPv4 extends INodeJsNetworkInterfaceBase {
    family: 'IPv4';
}

export interface INodeJsNetworkInterfaceInfoIPv6 extends INodeJsNetworkInterfaceBase {
    family: 'IPv6';
    scopeid: number;
}

export type INodeJsNetworkInterfaceInfo = INodeJsNetworkInterfaceInfoIPv4 | INodeJsNetworkInterfaceInfoIPv6;

export interface IServerTimeResponse {
    date: Date;
    utc: Date;
}

export interface INodeJsProcessVersions {
    http_parser: string;
    node: string;
    v8: string;
    ares: string;
    uv: string;
    zlib: string;
    modules: string;
    openssl: string;
}

export interface INodeJsProcessEnv {
    [key: string]: string | undefined;
}

export interface IProcessInfoResponse {
    procCpu: INodeJsCpuUsage;
    memUsage: INodeJsMemoryUsage;
    env: INodeJsProcessEnv;
    pid: number;
    uptime: number;
    applicationVersion: string;
    nodeDependencyVersions: INodeJsProcessVersions;

}

export interface IUserInfo {
    username: string;
    uid: number;
    gid: number;
    shell: string;
    homedir: string;
}

export interface IOsInformation {
    platform: string;
    version: string;
    totalMemory: number;
    uptime: number;
}

export interface ISystemInfoResponse {
    cpus: INodeJsCpuInfo[];
    network: { [index: string]: INodeJsNetworkInterfaceInfo[] };
    os: IOsInformation;
    currentUser: IUserInfo;
}


export interface IResourceUsageResponse {
    processMemory: INodeJsMemoryUsage;
    systemMemory: ISystemMemory;
    processCpu: INodeJsCpuUsage;
    systemCpu: INodeJsCpuInfo[];
}
