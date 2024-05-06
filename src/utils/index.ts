import Crypto from "../lib/crypto";

function getEncryptedText<T>(input: T): T | string {
    const APPLY_ENCRYPTION = process.env.APPLY_ENCRYPTION === 'true';
    const SECRET_KEY = process.env.SECRET_KEY;

    // Encrypt only if encryption is enabled and secret key is provided
    if (APPLY_ENCRYPTION && SECRET_KEY) {
        // Convert input to JSON string if it's not already a string
        const output = typeof input === 'string' ? input : JSON.stringify(input);
        return Crypto.encrypt(output, SECRET_KEY);
    }

    return input;
}

export {
    getEncryptedText
}