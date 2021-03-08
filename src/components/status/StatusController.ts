import * as os from 'os';
import * as process from 'process';
import * as logger from 'winston';
import * as version from '../../version';

/**
 * Status controller
 */
export class StatusController {

    public getServerTime(): IServerTimeResponse {
        const now: Date = new Date();
        const utc: Date = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

        return {
            utc: utc,
            date: now,
        };
    }

    public getResourceUsage(): IResourceUsageResponse {
        try {
            const totalMem: number = os.totalmem();
            const memProc: NodeJS.MemoryUsage = process.memoryUsage();
            const freemMem: number = os.freemem();

            const response: IResourceUsageResponse = {
                processMemory: memProc,
                systemMemory: {
                    free: freemMem,
                    total: totalMem,
                    percentFree: Math.round((freemMem / totalMem) * 100),
                },
                processCpu: process.cpuUsage(),
                systemCpu: os.cpus(),
            };

            logger.info(JSON.stringify(response, null, 2));

            return response;
        } catch (err) {
            throw(err);
        }
    }

    public getSystemInfo(): ISystemInfoResponse {
        try {
            const response: ISystemInfoResponse = {
                cpus: os.cpus(),
                network: os.networkInterfaces(),
                os: {
                    platform: process.platform,
                    version: os.release(),
                    totalMemory: os.totalmem(),
                    uptime: os.uptime(),
                },
                currentUser: os.userInfo(),
            };

            logger.info(JSON.stringify(response, null, 2));

            return response;
        } catch (err) {
            throw(err);
        }
    }

    public getProcessInfo(): IProcessInfoResponse {
        try {
            const response: IProcessInfoResponse = {
                procCpu: process.cpuUsage(),
                memUsage: process.memoryUsage(),
                env: process.env,
                pid: process.pid,
                uptime: process.uptime(),
                applicationVersion: process.version,
                nodeDependencyVersions: process.versions,
            };

            logger.info(JSON.stringify(response, null, 2));

            return response;
        } catch (err) {
            throw(err);
        }
    }

    public getVersionInfo(): IVersionInfoResponse {
        try {
            const response: IVersionInfoResponse = {
                build: version.version.buildNumber,
            };

            logger.info(JSON.stringify(response, null, 2));

            return response;
        } catch (err) {
            throw(err);
        }
    }
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

export interface ISystemInfoResponse {
    cpus: INodeJsCpuInfo[];
    network: { [index: string]: INodeJsNetworkInterfaceInfo[] };
    os: IOsInformation;
    currentUser: IUserInfo;
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

export interface IResourceUsageResponse {
    processMemory: INodeJsMemoryUsage;
    systemMemory: ISystemMemory;
    processCpu: INodeJsCpuUsage;
    systemCpu: INodeJsCpuInfo[];
}

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

export interface IVersionInfoResponse {
    build: number;
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
