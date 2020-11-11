import Onyx from './onyx.ts';
import { superoak, describe, it, expect } from '../test_deps.ts';
import Strategy from './strategy.ts';

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

  // describe('#authenticate', () => {
  //   describe('handling a request', () => {
  //     class testStrategy extends Strategy {
  //       // public success: Function;
  //       constructor() {
  //         super();
  //       }
  //       authenticate = async () => {
  //         const user = { id: '1', username: 'TeamOnyx' };
  //         // this.success(user);
  //       };
  //     }
  //     const onyx = new Onyx();
  //     onyx.use('success', new testStrategy());
  //     it('should set user', async (ctx, done: any) => {
  //       expect(ctx.state.onyx.session.user).toEqual('object');
  //       expect(ctx.state.onyx.session.user.id).toEqual('1');
  //       expect(ctx.state.onyx.session.user.username).toEqual('TeamOnyx');
  //       done();
  //     });
  //   });
  // });
});
