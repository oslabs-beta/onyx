// import { superoak } from '../test_deps.ts';  
// import { app } from '../server/server.tsx'
// 
// Deno.test('it should support the Oak framework', async() => {  
//   console.log('hello from test')
//   const request = await superoak(app);
//   await request.get('/').expect('a lot of stuff, do we add in html version of app here?')
// })

import { superoak, describe, it, expect } from '../../test_deps.ts';
import { app } from '../server/server.tsx'

// IIFE 
// ************Uncomment below
// describe('GET request to root url', () => {
//   it('Sends 200 Status and Content Type text/html', async (done: any) => {
//     (await superoak(app)).get('/').end((err, res) => {
//       expect(res.status).toEqual(200);
//       expect(res.type).toEqual('text/html');
//       done();
//     });
//   });
// });

// // https://deno.land/manual/testing

// describe('GET request to hydrate front end', () => {
//   it('Sends 200 Status and Content Type application/javascript', async (done: any) => {
//     (await superoak(app)).get('/browser.js').end((err, res) => {
//       expect(res.status).toEqual(200);
//       expect(res.type).toEqual('application/javascript');
//       done();
//     });
//   });
// });

// describe('GET request to serve css file', () => {
//   it('Sends 200 Status and Content Type text/css', async (done: any) => {
//     (await superoak(app)).get('/style.css').end((err, res) => {
//       expect(res.status).toEqual(200);
//       expect(res.type).toEqual('text/css');
//       done();
//     });
//   });
// });
//**********Un comment above */
  
// NOTES: If one test faill, it will throw an error not reach the done().  It will end the test at that point, even if there are more tests after.

// describe('GET request to root url testing promise', () => {
//   it('Sends 200 Status and Content Type text/html', async (done: any) => {
    
//     const oaktest: any = async () => {
//       (await superoak(app)).get('/').end((err, res) => {
//         expect(res.status).toEqual(200);
//         expect(res.type).toEqual('text/html');
//         done();
//     });
//   }
//   oaktest();
//   });
// });