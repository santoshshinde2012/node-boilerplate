import 'dotenv/config';

export type NodeEnv = 'development' | 'test' | 'staging' | 'production';

export interface AppConfig {
	nodeEnv: NodeEnv;
	isProduction: boolean;
	isTest: boolean;
	port: number;
	logLevel: string;
	encryption: {
		enabled: boolean;
		secretKey: string | undefined;
		salt: string | undefined;
	};
	security: {
		corsOrigins: string[] | '*';
		bodyLimit: string;
		rateLimit: {
			windowMs: number;
			max: number;
		};
		trustProxy: boolean;
	};
	exposeSystemRoutes: boolean;
}

const ALLOWED_NODE_ENVS: readonly NodeEnv[] = [
	'development',
	'test',
	'staging',
	'production',
];

function parseNodeEnv(value: string | undefined): NodeEnv {
	const fallback: NodeEnv = 'development';
	if (!value) return fallback;
	// support legacy "prod" alias used by older docker images
	if (value === 'prod') return 'production';
	return (ALLOWED_NODE_ENVS as readonly string[]).includes(value)
		? (value as NodeEnv)
		: fallback;
}

function parsePort(value: string | undefined, fallback: number): number {
	if (!value) return fallback;
	const port = Number.parseInt(value, 10);
	if (!Number.isFinite(port) || port <= 0 || port > 65535) {
		throw new Error(`Invalid PORT value: ${value}`);
	}
	return port;
}

function parsePositiveInt(
	value: string | undefined,
	fallback: number,
	name: string,
): number {
	if (!value) return fallback;
	const parsed = Number.parseInt(value, 10);
	if (!Number.isFinite(parsed) || parsed < 0) {
		throw new Error(`Invalid ${name} value: ${value}`);
	}
	return parsed;
}

function parseBool(
	value: string | undefined,
	fallback: boolean,
): boolean {
	if (value === undefined) return fallback;
	const v = value.trim().toLowerCase().replace(/;$/, '');
	if (['1', 'true', 'yes', 'on'].includes(v)) return true;
	if (['0', 'false', 'no', 'off', ''].includes(v)) return false;
	return fallback;
}

function parseCorsOrigins(value: string | undefined): string[] | '*' {
	if (!value) return [];
	const trimmed = value.trim();
	if (trimmed === '*') return '*';
	return trimmed
		.split(',')
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function buildConfig(): AppConfig {
	const nodeEnv = parseNodeEnv(process.env.NODE_ENV);
	const isProduction = nodeEnv === 'production';
	const isTest = nodeEnv === 'test';

	const encryptionEnabled = parseBool(process.env.APPLY_ENCRYPTION, false);
	const secretKey = process.env.SECRET_KEY?.trim() || undefined;

	if (encryptionEnabled && !secretKey) {
		throw new Error(
			'APPLY_ENCRYPTION is true but SECRET_KEY is missing. Set SECRET_KEY or disable encryption.',
		);
	}
	if (encryptionEnabled && secretKey && secretKey.length < 16) {
		throw new Error(
			'SECRET_KEY must be at least 16 characters when encryption is enabled.',
		);
	}

	return {
		nodeEnv,
		isProduction,
		isTest,
		port: parsePort(process.env.PORT, 8080),
		logLevel:
			process.env.LOG_LEVEL?.trim() ||
			(isProduction ? 'info' : 'debug'),
		encryption: {
			enabled: encryptionEnabled,
			secretKey,
			salt: process.env.ENCRYPTION_SALT?.trim() || undefined,
		},
		security: {
			corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
			bodyLimit: process.env.BODY_LIMIT?.trim() || '1mb',
			rateLimit: {
				windowMs: parsePositiveInt(
					process.env.RATE_LIMIT_WINDOW_MS,
					60_000,
					'RATE_LIMIT_WINDOW_MS',
				),
				max: parsePositiveInt(
					process.env.RATE_LIMIT_MAX,
					120,
					'RATE_LIMIT_MAX',
				),
			},
			trustProxy: parseBool(process.env.TRUST_PROXY, false),
		},
		exposeSystemRoutes: parseBool(
			process.env.EXPOSE_SYSTEM_ROUTES,
			!isProduction,
		),
	};
}

const config: AppConfig = buildConfig();

export default config;
