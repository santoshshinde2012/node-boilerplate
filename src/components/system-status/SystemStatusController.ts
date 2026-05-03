import { NextFunction, Request, Response } from 'express';
import * as os from 'os';
import * as process from 'process';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';
import config from '../../config';
import {
	IServerTimeResponse,
	IResourceUsageResponse,
	IProcessInfoResponse,
	ISystemInfoResponse,
} from './SystemStatusTypes';
import { RouteDefinition } from '../../types/RouteDefinition';

/**
 * Status controller.
 *
 * In production these endpoints can leak environment variables, secrets,
 * network interfaces and OS user info. They are therefore filtered before
 * being returned. To disable them entirely, set EXPOSE_SYSTEM_ROUTES=false.
 */
export default class SystemStatusController extends BaseController {
	public basePath = 'system';

	public routes(): RouteDefinition[] {
		return [
			{
				path: '/info',
				method: 'get',
				handler: this.getSystemInfo.bind(this),
			},
			{
				path: '/time',
				method: 'get',
				handler: this.getServerTime.bind(this),
			},
			{
				path: '/usage',
				method: 'get',
				handler: this.getResourceUsage.bind(this),
			},
			{
				path: '/process',
				method: 'get',
				handler: this.getProcessInfo.bind(this),
			},
			{
				path: '/error',
				method: 'get',
				handler: this.getError.bind(this),
			},
			// HTTP method examples – all reuse getError as a placeholder
			{ path: '/', method: 'post', handler: this.getError.bind(this) },
			{ path: '/', method: 'put', handler: this.getError.bind(this) },
			{ path: '/', method: 'patch', handler: this.getError.bind(this) },
			{ path: '/', method: 'delete', handler: this.getError.bind(this) },
		];
	}

	public getSystemInfo(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const fullResponse: ISystemInfoResponse = {
				cpus: os.cpus(),
				network:
					os.networkInterfaces() as ISystemInfoResponse['network'],
				os: {
					platform: process.platform,
					version: os.release(),
					totalMemory: os.totalmem(),
					uptime: os.uptime(),
				},
				currentUser: os.userInfo(),
			};

			// In production strip network interfaces and user info – they leak
			// internal IPs, MAC addresses, usernames and home directories.
			res.locals.data = config.isProduction
				? {
						os: fullResponse.os,
						cpuCount: fullResponse.cpus.length,
					}
				: fullResponse;

			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	public getError(_req: Request, _res: Response, next: NextFunction): void {
		next(
			new ApiError(
				'Sample error endpoint',
				StatusCodes.BAD_REQUEST,
				'BadRequest',
			),
		);
	}

	public getServerTime(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const now: Date = new Date();
			const utc: Date = new Date(
				now.getTime() + now.getTimezoneOffset() * 60_000,
			);
			const time: IServerTimeResponse = { utc, date: now };
			res.locals.data = time;
			super.send(res);
		} catch (error) {
			next(error);
		}
	}

	public getResourceUsage(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const totalMem: number = os.totalmem();
			const memProc: NodeJS.MemoryUsage = process.memoryUsage();
			const freeMem: number = os.freemem();

			const response: IResourceUsageResponse = {
				processMemory: memProc,
				systemMemory: {
					free: freeMem,
					total: totalMem,
					percentFree: Math.round((freeMem / totalMem) * 100),
				},
				processCpu: process.cpuUsage(),
				systemCpu: os.cpus(),
			};

			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	public getProcessInfo(
		_req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const fullResponse: IProcessInfoResponse = {
				procCpu: process.cpuUsage(),
				memUsage: process.memoryUsage(),
				env: process.env,
				pid: process.pid,
				uptime: process.uptime(),
				applicationVersion: process.version,
				nodeDependencyVersions: process.versions,
			};

			// `process.env` regularly contains secrets (DB URLs, API keys,
			// SECRET_KEY itself) – never expose it outside development.
			res.locals.data = config.isProduction
				? {
						procCpu: fullResponse.procCpu,
						memUsage: fullResponse.memUsage,
						pid: fullResponse.pid,
						uptime: fullResponse.uptime,
						applicationVersion: fullResponse.applicationVersion,
						nodeDependencyVersions:
							fullResponse.nodeDependencyVersions,
					}
				: fullResponse;

			super.send(res);
		} catch (err) {
			next(err);
		}
	}
}
