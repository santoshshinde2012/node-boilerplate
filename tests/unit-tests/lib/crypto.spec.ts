import 'jest';
import { Environments } from '../../../src/environments/environment.constant';
import Environment from '../../../src/environments/environment';
import Crypto from '../../../src/lib/crypto';

describe('Crypto Lib (Encryption/Decryption)', () => {
    let instance: Environment;
    beforeEach(() => {
        instance = new Environment(Environments.TEST);
    });

    it('Testing for text', () => {
        const data = 'This data is to be encrypted';
        const encrypted = Crypto.encrypt(data, instance.secretKey);
        const decrypted = Crypto.decrypt(encrypted, instance.secretKey);
        expect(decrypted).toEqual(data);
    });

    it('Testing for array', () => {
        const data = ['this', 'is', 'array'];
        const encrypted = Crypto.encrypt(JSON.stringify(data), instance.secretKey);
        const decrypted = Crypto.decrypt(encrypted, instance.secretKey);
        expect(JSON.parse(decrypted)).toEqual(data);
    });

    it('Testing for object', () => {
        const data = {
        key1: 'value1',
        key2: 'value2',
        };
        const encrypted = Crypto.encrypt(JSON.stringify(data), instance.secretKey);
        const decrypted = Crypto.decrypt(encrypted, instance.secretKey);
        expect(JSON.parse(decrypted)).toEqual(data);
    });
});
