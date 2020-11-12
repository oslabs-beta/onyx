import Onyx from './onyx.ts';
import Strategy from './strategy.ts';
import { describe, it, expect, assertThrowsAsync } from '../test_deps.ts';

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

      it('Onyx #use should register strategy', async (done: any) => {
        expect(typeof onyx['_strategies']['default']).toEqual('object');

        done();
      });

      it('Onyx #use should throw an error if Strategy is not provided in onyx.use', async (done: any) => {
        assertThrowsAsync(
          (): Promise<any> => {
            return new Promise((): void => {
              onyx.use('default');
            });
          },
          Error,
          'Strategy needs to be provided!'
        );
        done();
      });

      it('Onyx #use should throw an error if input Strategy does not have name', async (done: any) => {
        class namelessStrategy extends Strategy {
          constructor() {
            super();
          }
        }

        assertThrowsAsync(
          (): Promise<any> => {
            return new Promise((): void => {
              onyx.use(new namelessStrategy());
            });
          },
          Error,
          'Authentication strategies must have a name!'
        );
        done();
      });

      it('Onyx #use should register strategy with custom name', async (done: any) => {
        const stratInstance: any = new testStrategy();
        const stratInstance2: any = new testStrategy();
        onyx.use('new name', stratInstance);
        expect(typeof onyx['_strategies']['new name']).toEqual('object');
        // assertObjectMatch(onyx['_strategies']['default'], stratInstance2);
        done();
      });
    });
  });

  describe('#serializeUser', () => {
    describe('missing setup', () => {
      const onyx = new Onyx();
      it('Onyx #serializeUser - missing setup - should throw an Error if no serialize function was registered', (done) => {
        assertThrowsAsync(
          (): Promise<any> => {
            return new Promise((): void => {
              onyx.serializeUser();
            });
          },
          Error,
          'Serialize Function not registered!'
        );
        done();
      });
    });

    describe('with setup', () => {
      const onyx = new Onyx();

      const serializer = async function (user: any, cb: Function) {
        await cb(null, user.id);
      };
      onyx.serializeUser(serializer);

      it('Onyx #serializeUser - should should store the passed in function', async (done) => {
        expect(typeof onyx.funcs.serializer).toEqual('function');
        expect(onyx.funcs.serializer).toBe(serializer);
        done();
      });

      it('Onyx #serializeUser - should returned the stored function when invoked without an argument', async (done) => {
        expect(typeof onyx.serializeUser()).toEqual('function');
        expect(onyx.serializeUser()).toBe(serializer);
        done();
      });
    });
  });

  describe('#deserializeUser', () => {
    describe('missing setup', () => {
      const onyx = new Onyx();
      it('Onyx #deserializeUser - missing setup - should throw an Error if no deserialize function was registered', (done) => {
        assertThrowsAsync(
          (): Promise<any> => {
            return new Promise((): void => {
              onyx.deserializeUser();
            });
          },
          Error,
          'Deserialize Function not registered!'
        );
        done();
      });
    });

    describe('with setup', () => {
      const onyx = new Onyx();

      const serializer = async function (user: any, cb: Function) {
        await cb(null, user.id);
      };

      const deserializer = async function (id: string, cb: Function) {
        const _id = { $oid: id };
        try {
          const user = { username: 'Alice', _id };
          await cb(null, user);
        } catch (error) {
          await cb(error, null);
        }
      };
      onyx.deserializeUser(deserializer);

      it('Onyx #deserializeUser - should should store the passed in function', async (done) => {
        expect(typeof onyx.funcs.deserializer).toEqual('function');
        expect(onyx.funcs.deserializer).toBe(deserializer);
        done();
      });

      it('Onyx #deserializeUser - should returned the stored function when invoked without an argument', async (done) => {
        expect(typeof onyx.deserializeUser()).toEqual('function');
        expect(onyx.deserializeUser()).toBe(deserializer);
        done();
      });
    });
  });

  describe('#initialize', () => {
    class Context {
      public state: any;
      constructor() {
        this.state = {};
      }
    }

    const ctx = new Context();
    const onyx = new Onyx();

    // it('Onyx #initialize should throw error if session not set up', async (done) => {
    //   assertThrowsAsync(
    //     (): Promise<any> => {
    //       return new Promise((): void => {
    //         onyx.initialize()(ctx, () => {});
    //       });
    //     },
    //     Error,
    //     'Must set up Session before Onyx!'
    //   );
    //   done();
    // });

    it('Onyx #initialize should create a new instance of Onyx', async (done) => {
      ctx.state.session = {
        get: (str: string) => undefined,
      };
      onyx.initialize()(ctx, () => {});
      expect(ctx.state.onyx).toBeInstanceOf(Onyx);
      done();
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
});
