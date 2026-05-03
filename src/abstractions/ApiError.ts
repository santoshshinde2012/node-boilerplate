export type IErrorFields = Record<string, { message: string }>;

export interface IError {
	status: number;
	fields?: IErrorFields;
	message: string;
	name: string;
}

class ApiError extends Error implements IError {
	public status: number;

	public success = false;

	public fields?: IErrorFields;

	constructor(
		msg: string | null | undefined,
		statusCode: number,
		name = 'ApiError',
		fields?: IErrorFields,
	) {
		super(msg ?? '');
		this.message = msg ?? '';
		this.status = statusCode;
		this.name = name;
		this.fields = fields;
		// preserves prototype chain when transpiled to ES5/CJS
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export default ApiError;
