import { superoak, describe, it, expect } from '../../test_deps.ts';
import { app } from '../server/server.tsx';

describe('GET request to root url', () => {
  it('Sends 200 Status and Content Type text/html', async (done: any) => {
    (await superoak(app)).get('/').end((err, res) => {
      expect(res.status).toEqual(200);
      expect(res.type).toEqual('text/html');
      done();
    });
  });
});

describe('GET request to hydrate front end', () => {
  it('Sends 200 Status and Content Type application/javascript', async (done: any) => {
    (await superoak(app)).get('/browser.js').end((err, res) => {
      expect(res.status).toEqual(200);
      expect(res.type).toEqual('application/javascript');
      done();
    });
  });
});

describe('GET request to serve css file', () => {
  it('Sends 200 Status and Content Type text/css', async (done: any) => {
    (await superoak(app)).get('/style.css').end((err, res) => {
      expect(res.status).toEqual(200);
      expect(res.type).toEqual('text/css');
      done();
    });
  });
});
