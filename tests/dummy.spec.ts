import 'jest';
import * as request from 'supertest';

describe('Dummy Test Cases', () => {
  test('Verify Jest is working', () => {
    expect(true).toBeTruthy();
  });
});

describe('GET /', () => {
  xit('respond with json', (done) => {
    // request(app)
    request('localhost:8000')
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect({ message: 'Hello world!' })
      .expect(200, done);
  });
});