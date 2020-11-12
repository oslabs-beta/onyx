import LocalStrategy from './local-strategy.ts';
import { superoak, describe, it, expect, assertEquals, assertNotEquals } from '../../../test_deps.ts';

describe('Local Strategy', () => {

  let strategy = new LocalStrategy(function(){});

  it('should be named local', function() {
    expect(strategy.name).toEqual('local');
  });

  it('error should throw if constructed without a verify callback', function() {
    //const result = await new LocalStrategy();
    expect(strategy['_verify']).toBeDefined();
    // expect(function() {
    //   var s = new LocalStrategy();
    // }).toBeInstanceOf(TypeError, 'LocalStrategy requires a verify callback');
  });

});
  // describe('#initialize', () => {
  //   describe('handling a request', () => {
  //     const onyx = new Onyx();
  //     onyx.initialize();

  //     it('should set user property on authenticator ', async (done: any) => {
  //       expect(onyx['_userProperty']).toEqual('user');
  //       done();
  //     });
  //   });
  // });~