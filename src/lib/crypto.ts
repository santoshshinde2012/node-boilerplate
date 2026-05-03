import * as crypto from 'crypto';

// AES-256-GCM is an AEAD cipher: confidentiality + integrity in one primitive.
const ALGORITHM: crypto.CipherGCMTypes = 'aes-256-gcm';

// PBKDF2 hardening parameters.
// 600_000 iterations matches OWASP 2023 guidance for PBKDF2-HMAC-SHA512.
const ITERATIONS = 600_000;
const KEY_LENGTH = 32;
const DIGEST = 'sha512';

const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const SALT_LENGTH = 16;

function deriveKey(secretKey: string, salt: Buffer): Buffer {
	return crypto.pbkdf2Sync(
		secretKey,
		salt,
		ITERATIONS,
		KEY_LENGTH,
		DIGEST,
	);
}

/**
 * Encrypt a UTF-8 string with AES-256-GCM.
 *
 * Output layout (base64): salt | ciphertext | iv | tag
 *  - random per-message salt is embedded so decrypt() can run on a different
 *    process/host without sharing in-memory state.
 */
function encrypt(data: string, secretKey: string): string {
	if (!secretKey) {
		throw new Error('encrypt: secretKey is required');
	}

	const salt = crypto.randomBytes(SALT_LENGTH);
	const iv = crypto.randomBytes(IV_LENGTH);
	const key = deriveKey(secretKey, salt);

	const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
	const enc1 = cipher.update(data, 'utf8');
	const enc2 = cipher.final();
	const tag = cipher.getAuthTag();

	return Buffer.concat([salt, enc1, enc2, iv, tag]).toString('base64');
}

function decrypt(data: string, secretKey: string): string {
	if (!secretKey) {
		throw new Error('decrypt: secretKey is required');
	}

	const buf = Buffer.from(data, 'base64');
	if (buf.length < SALT_LENGTH + IV_LENGTH + TAG_LENGTH) {
		throw new Error('decrypt: payload too short');
	}

	const salt = buf.subarray(0, SALT_LENGTH);
	const tag = buf.subarray(buf.length - TAG_LENGTH);
	const iv = buf.subarray(
		buf.length - TAG_LENGTH - IV_LENGTH,
		buf.length - TAG_LENGTH,
	);
	const ciphertext = buf.subarray(
		SALT_LENGTH,
		buf.length - TAG_LENGTH - IV_LENGTH,
	);

	const key = deriveKey(secretKey, salt);
	const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
	decipher.setAuthTag(tag);

	let str = decipher.update(ciphertext, undefined, 'utf8');
	str += decipher.final('utf8');
	return str;
}

export { encrypt, decrypt };
