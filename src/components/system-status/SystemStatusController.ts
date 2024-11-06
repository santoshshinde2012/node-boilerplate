import { NextFunction, Request, Response } from 'express';
import * as os from 'os';
import * as process from 'process';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseController from '../BaseController';
import {
	IServerTimeResponse,
	IResourceUsageResponse,
	IProcessInfoResponse,
	ISystemInfoResponse,
} from './SystemStatusTypes';
import { RouteDefinition } from '../../types/RouteDefinition';

/**
 * Status controller
 */
export default class SystemStatusController extends BaseController {
	// base path
	public basePath = 'system';

	/**
	 *
	 */
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
			// These are the examples added here to follow if we need to create a different type of HTTP method.
			{ path: '/', method: 'post', handler: this.getError.bind(this) },
			{ path: '/', method: 'put', handler: this.getError.bind(this) },
			{ path: '/', method: 'patch', handler: this.getError.bind(this) },
			{ path: '/', method: 'delete', handler: this.getError.bind(this) },
		];
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getSystemInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
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
			res.locals.data = response;
			// call base class method
			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getError(req: Request, res: Response, next: NextFunction): void {
		try {
			throw new ApiError(null, StatusCodes.BAD_REQUEST);
		} catch (error) {
			// from here error handler will get call
			next(error);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getServerTime(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
		try {
			const now: Date = new Date();
			const utc: Date = new Date(
				now.getTime() + now.getTimezoneOffset() * 60000,
			);
			const time: IServerTimeResponse = {
				utc,
				date: now,
			};
			res.locals.data = time;
			super.send(res);
		} catch (error) {
			next(error);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getResourceUsage(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
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

			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err);
		}
	}

	/**
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getProcessInfo(
		req: Request,
		res: Response,
		next: NextFunction,
	): void {
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
			res.locals.data = response;
			super.send(res);
		} catch (err) {
			next(err);
		}
	}
}
