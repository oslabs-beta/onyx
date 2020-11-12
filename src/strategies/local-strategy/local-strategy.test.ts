import LocalStrategy from './local-strategy.ts';
import { describe, it, expect } from '../../../test_deps.ts';

describe('Local Strategy', () => {
  let strategy = new LocalStrategy(function () {});

  it('should be named local', function () {
    expect(strategy.name).toEqual('local');
  });

  it('error should throw if constructed without a verify callback', function () {
    expect(strategy['_verify']).toBeDefined();
  });
});
