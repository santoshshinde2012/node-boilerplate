import 'jest';
import fs from 'fs';
import logger from '../../../src/lib/logger';

describe('Logger Lib', () => {

    beforeEach(() => {
        const logDir = './logs';
        if (fs.existsSync(logDir)) {
            fs.rmSync(logDir, { recursive: true, force: true });
        }
    });

    it('should create a new log directory if one doesn\'t already exist', () => {
        // set up existsSync to meet the `if` condition
       jest.spyOn(fs, 'existsSync').mockImplementation();
       jest.spyOn(fs, 'mkdirSync').mockImplementation();
    
        // call the function that you want to test
        logger.info('app.init error');
    
        // make your assertion
        expect(fs.existsSync).toHaveBeenCalled();
    });
});
