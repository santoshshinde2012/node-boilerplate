import { Application, NextFunction, Request, Response, Router } from 'express';
import * as os from 'os';
import * as process from 'process';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import ApiError from '../../abstractions/ApiError';
import BaseApi from '../BaseApi';
import {
	IServerTimeResponse,
	IResourceUsageResponse,
	IProcessInfoResponse,
	ISystemInfoResponse,
} from './system-status.types';

/**
 * Status controller
 */
export default class SystemStatusController extends BaseApi {
	/**
	 *
	 */
	constructor() {
		super();
	}

	/**
	 *
	 */
	public register(): Router {
		this.router.get('/system', this.getSystemInfo.bind(this));
		this.router.get('/time', this.getServerTime.bind(this));
		this.router.get('/usage', this.getResourceUsage.bind(this));
		this.router.get('/process', this.getProcessInfo.bind(this));
		this.router.get('/error', this.getError.bind(this));
		return this.router;
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
			throw new ApiError(
				ReasonPhrases.BAD_REQUEST,
				StatusCodes.BAD_REQUEST,
			);
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
