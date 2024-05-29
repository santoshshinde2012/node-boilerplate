import 'jest';
import { encrypt, decrypt } from '../../../src/lib/crypto';

describe('Crypto Lib (Encryption/Decryption)', () => {
	let secretKey: string;
	beforeAll(() => {
		secretKey =
			process.env.SECRET_KEY || 'sTJQgn5E8d8jMY15PhARwDrW4my6bLwE';
	});

	it('Testing for text', () => {
		const data = 'This data is to be encrypted';
		const encrypted = encrypt(data, secretKey);
		const decrypted = decrypt(encrypted, secretKey);
		expect(decrypted).toEqual(data);
	});

	it('Testing for array', () => {
		const data = ['this', 'is', 'array'];
		const encrypted = encrypt(JSON.stringify(data), secretKey);
		const decrypted = decrypt(encrypted, secretKey);
		expect(JSON.parse(decrypted)).toEqual(data);
	});

	it('Testing for object', () => {
		const data = {
			key1: 'value1',
			key2: 'value2',
		};
		const encrypted = encrypt(JSON.stringify(data), secretKey);
		const decrypted = decrypt(encrypted, secretKey);
		expect(JSON.parse(decrypted)).toEqual(data);
	});
});
