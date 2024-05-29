import { encrypt } from '../../../src/lib/crypto';
import { getEncryptedText } from '../../../src/utils';

jest.mock('../../../src/lib/crypto');

describe('getEncryptedText', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return input if encryption is not enabled', () => {
		process.env.APPLY_ENCRYPTION = 'false';
		process.env.SECRET_KEY = 'secret';

		const input = { test: 'data' };
		const encrypted = getEncryptedText(input);

		expect(encrypted).toEqual(input);
		expect(encrypt).not.toHaveBeenCalled();
	});

	it('should return input if secret key is not provided', () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = '';

		const input = { test: 'data' };
		const encrypted = getEncryptedText(input);

		expect(encrypted).toEqual(input);
		expect(encrypt).not.toHaveBeenCalled();
	});

	it('should return encrypted input if encryption is enabled and secret key is provided', () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = 'secret';

		const input = { test: 'data' };
		const output = '{"test":"data"}'; // JSON.stringify(input)
		const encryptedOutput = 'encryptedData';

		(encrypt as jest.Mock).mockReturnValueOnce(encryptedOutput);

		const encrypted = getEncryptedText(input);

		expect(encrypt).toHaveBeenCalledWith(output, 'secret');
		expect(encrypted).toEqual(encryptedOutput);
	});

	it('should return encrypted string if input is already a string', () => {
		process.env.APPLY_ENCRYPTION = 'true';
		process.env.SECRET_KEY = 'secret';

		const input = 'test data';
		const encryptedOutput = 'encryptedData';

		(encrypt as jest.Mock).mockReturnValueOnce(encryptedOutput);

		const encrypted = getEncryptedText(input);

		expect(encrypt).toHaveBeenCalledWith(input, 'secret');
		expect(encrypted).toEqual(encryptedOutput);
	});
});
