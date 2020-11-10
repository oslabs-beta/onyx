import Onyx from './onyx.ts';
import { superoak, describe, it, expect } from '../test_deps.ts';

describe('Onyx', () => {
  describe('#initialize', () => {
    describe('handling a request', () => {
      const onyx = new Onyx();
      onyx.initialize();

      it('should set user property on authenticator ', async (done: any) => {
        expect(onyx['_userProperty']).toEqual('user');
        done();
      });
    });
  });
});
