import * as crypto from 'crypto';

export default class Crypto {
	// algorithm - AES 256 GCM Mode
	private static algorithm: crypto.CipherGCMTypes = 'aes-256-gcm';

	// iterations: It must be a number and should be set as high as possible.
	// So, the more is the number of iterations, the more secure the derived key will be,
	// but in that case it takes greater amount of time to complete.
	// number of interation - the value of 2145 is randomly chosen
	private static iterations = 2145;

	// keylen: It is the key of the required byte length and it is of type number.
	// derive encryption key: 32 byte key length
	private static keylen = 32;

	// digest: It is a digest algorithms of string type.
	private static digest = 'sha512';

	// random salt
	private static salt: Buffer = crypto.randomBytes(64);

	public static encrypt(data: string, secretKey: string): string {
		// constant to encrypt the data
		const inputEncoding = 'utf8';
		const outputEncoding = 'base64';

		// random initialization vector
		const iv = crypto.randomBytes(12);

		// The method gives an asynchronous Password-Based Key Derivation
		const key: Buffer = crypto.pbkdf2Sync(
			secretKey,
			Crypto.salt,
			Crypto.iterations,
			Crypto.keylen,
			Crypto.digest,
		);

		// create a Cipher object, with the stated algorithm, key and initialization vector (iv).
		// @algorithm - AES 256 GCM Mode
		// @key
		// @iv
		// @options
		const cipher = crypto.createCipheriv(Crypto.algorithm, key, iv);

		// create a Cipher object, with the stated algorithm, key and initialization vector (iv).
		// @algorithm - AES 256 GCM Mode
		// @key
		// @iv
		// @options
		const enc1 = cipher.update(data, inputEncoding);

		// Return the buffer containing the value of cipher object.
		// @outputEncoding: Output encoding format
		// const enc2 = cipher.final();
		const enc2 = cipher.final();

		// extract the auth tag
		const tag = cipher.getAuthTag();

		// concat the encrypted result with iv and tag
		const encryptedData = Buffer.concat([enc1, enc2, iv, tag]).toString(
			outputEncoding,
		);

		// return the result
		return encryptedData;
	}

	public static decrypt(data: string, secretKey: string): string {
		// constant to decrypt the data
		const inputEncoding = 'base64';
		const outputEncoding = 'utf8';

		// Creates a new Buffer containing the given JavaScript string {str}
		// eslint-disable-next-line no-param-reassign
		const bufferData = Buffer.from(data, inputEncoding);

		// derive key using; 32 byte key length
		const key = crypto.pbkdf2Sync(
			secretKey,
			Crypto.salt,
			Crypto.iterations,
			Crypto.keylen,
			Crypto.digest,
		);

		// extract iv from encrypted data
		const iv = bufferData.subarray(
			bufferData.length - 28,
			bufferData.length - 16,
		);

		// extract tag from encrypted data
		const tag = bufferData.subarray(bufferData.length - 16);

		// extract encrypted text from encrypted data
		const text = bufferData.subarray(0, bufferData.length - 28);

		// AES 256 GCM Mode
		const decipher = crypto.createDecipheriv(Crypto.algorithm, key, iv);

		// set the auth tag
		decipher.setAuthTag(tag);

		// Used to update the cipher with data according to the given encoding format.
		// @data: It is used to update the cipher by new content
		// @inputEncoding: Input encoding format
		// @outputEncoding: Output encoding format
		let str = decipher.update(text, null, outputEncoding);

		// Return the buffer containing the value of cipher object.
		// @outputEncoding: Output encoding format
		str += decipher.final(outputEncoding);

		// parse the string decrypted data
		return str;
	}
}
