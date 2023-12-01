interface IEnvironment {
	dbName: string;
	dbPassword: string;
	dbHost: string;
	clientOriginUrl: string;
	auth0Audience: string;
	auth0Domain: string;
	port: number;
	secretKey: string;
	applyEncryption: boolean;
	getCurrentEnvironment(): string;
	setEnvironment(env: string): void;
	isProductionEnvironment(): boolean;
	isDevEnvironment(): boolean;
	isTestEnvironment(): boolean;
	isStagingEnvironment(): boolean;
}

export default IEnvironment;
