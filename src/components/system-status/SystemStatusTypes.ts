export type INodeJsMemoryUsage = {
	rss: number;
	heapTotal: number;
	heapUsed: number;
	external: number;
};

export type INodeJsCpuUsage = {
	user: number;
	system: number;
};

export type INodeJsCpuInfo = {
	model: string;
	speed: number;
	times: {
		user: number;
		nice: number;
		sys: number;
		idle: number;
		irq: number;
	};
};

export type ISystemMemory = {
	total: number;
	free: number;
	percentFree: number;
};

export type INodeJsNetworkInterfaceBase = {
	address: string;
	netmask: string;
	mac: string;
	internal: boolean;
};

export type INodeJsNetworkInterfaceInfoIPv4 = INodeJsNetworkInterfaceBase & {
	family: 'IPv4';
};

export type INodeJsNetworkInterfaceInfoIPv6 = INodeJsNetworkInterfaceBase & {
	family: 'IPv6';
	scopeid: number;
};

export type INodeJsNetworkInterfaceInfo =
	| INodeJsNetworkInterfaceInfoIPv4
	| INodeJsNetworkInterfaceInfoIPv6;

export type IServerTimeResponse = {
	date: Date;
	utc: Date;
};

export type INodeJsProcessVersions = {
	http_parser: string;
	node: string;
	v8: string;
	ares: string;
	uv: string;
	zlib: string;
	modules: string;
	openssl: string;
};

export type INodeJsProcessEnv = {
	[key: string]: string | undefined;
};

export type IProcessInfoResponse = {
	procCpu: INodeJsCpuUsage;
	memUsage: INodeJsMemoryUsage;
	env: INodeJsProcessEnv;
	pid: number;
	uptime: number;
	applicationVersion: string;
	nodeDependencyVersions: INodeJsProcessVersions;
};

export type IUserInfo = {
	username: string;
	uid: number;
	gid: number;
	shell: string;
	homedir: string;
};

export type IOsInformation = {
	platform: string;
	version: string;
	totalMemory: number;
	uptime: number;
};

export type ISystemInfoResponse = {
	cpus: INodeJsCpuInfo[];
	network: { [index: string]: INodeJsNetworkInterfaceInfo[] };
	os: IOsInformation;
	currentUser: IUserInfo;
};

export type IResourceUsageResponse = {
	processMemory: INodeJsMemoryUsage;
	systemMemory: ISystemMemory;
	processCpu: INodeJsCpuUsage;
	systemCpu: INodeJsCpuInfo[];
};
