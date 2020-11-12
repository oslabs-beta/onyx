import LocalStrategy from './../strategies/local-strategy/local-strategy.ts';
import { describe, it, expect } from './../../test_deps.ts';

describe('Local Strategy', () => {
  const verifyFunc = () => {
    'verifyFunc';
  };
  const strategy = new LocalStrategy(verifyFunc);

  it('local-strategy should be named local', function () {
    expect(strategy.name).toEqual('local');
  });

  it('local-strategy should store the provided function in this._verify', function () {
    expect(strategy['_verify']).toBe(verifyFunc);
  });

  it('local-strategy - usernameField should default to "username"', function () {
    expect(strategy['_usernameField']).toEqual('username');
  });

  it('local-strategy - passwordField should default to "password"', function () {
    expect(strategy['_passwordField']).toEqual('password');
  });
});
