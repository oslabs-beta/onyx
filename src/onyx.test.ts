import { superoak, describe, it, expect } from '../test_deps.ts';
import { app } from '../example/server/server.tsx';
import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import SessionStrategy from './strategies/session-strategy.ts';
import LocalStrategy from './strategies/local-strategy.ts';
import { assertEquals, assertArrayIncludes } from 'https://deno.land/std@0.76.0/testing/asserts.ts';
import Onyx from './onyx.ts';
import userController from '../example/server/controllers/authController.ts';

// // Simple name and function, compact form, but not configurable
// Deno.test("hello world #1", () => {
//   const x = 1 + 2;
//   assertEquals(x, 3);
// });

// // Fully fledged test definition, longer form, but configurable (see below)
// Deno.test({
//   name: "hello world #2",
//   fn: () => {
//     const x = 1 + 2;
//     assertEquals(x, 3);
//   },
// });

// // Basic Deno Test-test
// Deno.test("hello world", () => {
//   const x = 1 + 2;
//   assertEquals(x, 3);
//   assertArrayIncludes([1, 2, 3, 4, 5, 6], [3], "Expected 3 to be in the array");
// });

// Deno.test('Onyx constructor check', () => {
//   const onyx = new Onyx();
//   //  console.log(onyx.init);
//   console.log(onyx['_sm']);
//   console.log(onyx);
//   console.log(SessionManager);
//   //  let newSessionManager = new SessionManager(this.serializeUser.bind(this))
//   console.log("What's good George?");
//   //  let strategiesValue = onyx._strategies;
//   // unreachable(onyx._strategies);
//   // ************to access Private -- you can utilize brackets
//   assertEquals(onyx['_strategies'], {});
//   assertEquals(onyx['funcs'], {});
//   assertEquals(onyx['_sm'].logIn.constructor.name, 'AsyncFunction');
//   assertEquals(onyx['_sm'].logOut.constructor.name, 'AsyncFunction');
//   // assertEquals(onyx['_strategies'], newSessionManager);
// });

// // for testing purposes
// // replace below userController.verifyUser using a different custom Function
// // bring in the
// Deno.test('*********Onyx methods check', () => {
//   const onyx = new Onyx();
//   const dummyTest = () => {
//     console.log('hi');
//   };
//   onyx.use(
//     new LocalStrategy(dummyTest, {
//       usernameField: 'username',
//       passwordField: 'password',
//     })
//   );
//   console.log(onyx);
//   assertEquals(onyx['_strategies'].local._usernameField, 'username');
//   assertEquals(onyx['_strategies'].local._passwordField, 'password');
// });

// 11.9 starting test
describe('Onyx', () => {
  describe('#use', () => {
    describe('with instance name', () => {
      class testStrategy extends Strategy {
        public name: string;

        constructor() {
          super();
          this.name = 'default';
        }
      }
      const onyx = new Onyx();
      onyx.use(new testStrategy());

      it('should register strategy', async (done: any) => {
        expect(typeof onyx['_strategies']['default']).toEqual('object');

        done();
      });

      // works with return error but not with throw
      it('should throw an error if Strategy is not provided in onyx.use', async (done: any) => {
        const result = await onyx.use('default');
        expect(result).toBeInstanceOf(Error);
        done();
      });
    });
  });

  describe('#unuse', () => {
    class testStrategy extends Strategy {}
    const onyx = new Onyx();
    onyx.use('one', new testStrategy());
    onyx.use('two', new testStrategy());

    expect(typeof onyx['_strategies']['one']).toEqual('object');
    expect(typeof onyx['_strategies']['two']).toEqual('object');

    onyx.unuse('one');

    it('should unregister strategy', async (done: any) => {
      expect(onyx['_strategies']['one']).toBeUndefined();
      expect(typeof onyx['_strategies']['two']).toEqual('object');
      done();
    });
  });

  // NEED TO WORK ON SERIALIZEUSER
  // describe('#serializeUser', () => {
  //   describe('without serializers', () => {
  //     const onyx = new Onyx();

  //   });
  // });
});

// describe('GET request to hydrate front end', () => {
//   it('Sends 200 Status and Content Type application/javascript', async (done: any) => {
//     (await superoak(app)).get('/browser.js').end((err, res) => {
//       expect(res.status).toEqual(200);
//       expect(res.type).toEqual('application/javascript');
//       done();
//     });
//   });
// });
