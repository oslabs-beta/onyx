import { superoak, describe, it, expect } from '../test_deps.ts';
import { app } from '../example/server/server.tsx';
import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import SessionStrategy from './strategies/session-strategy.ts';
import LocalStrategy from './strategies/local-strategy/local-strategy.ts';
import {
  assertEquals,
  assertArrayIncludes,
} from 'https://deno.land/std@0.76.0/testing/asserts.ts';
import Onyx from './onyx.ts';
import userController from '../example/server/controllers/authController.ts';

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