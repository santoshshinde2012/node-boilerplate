import { Request, Response, NextFunction } from 'express';

export interface RouteDefinition {
	path: string;
	method: 'get' | 'post' | 'put' | 'patch' | 'delete';
	handler: (req: Request, res: Response, next: NextFunction) => void;
}
