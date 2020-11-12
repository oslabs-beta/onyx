import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import authenticate from './middleware/authenticate.ts';

export default class Onyx {
  private _sm: any;
  private _strategies: any;
  private _framework: { authenticate: Function };
  public funcs: any;

  constructor() {
    this._strategies = {};
    this.funcs = {};
    this._framework = { authenticate };
    this.init();
  }

  init() {
    this._sm = new SessionManager(this.serializeUser.bind(this));
  }

  // gives developer an option to customize their strategy name
  use(name: string | Strategy, strategy?: Strategy) {
    if (typeof name !== 'string') {
      strategy = name;
      name = strategy.name;
    } else {
      if (!strategy) throw new Error('Strategy needs to be provided!');
    }
    if (!name || typeof name !== 'string') {
      throw new Error('Authentication strategies must have a name!');
    }
    this._strategies[name] = strategy;
    return this;
  }

  // Allows the developer to remove added strategies - not necessary in normal situations
  unuse(name: string) {
    delete this._strategies[name];
    return this;
  }

  /* Options:   *note* *README*
   *   - `successRedirect`  After successful login, redirect to given URL
   *   - `successMessage`   True to store success message in
   *                        req.session.messages, or a string to use as override
   *                        message for success.
   *   - `failureRedirect`  After failed login, redirect to given URL
   *   - `failureMessage`   True to store failure message in
   *                        req.session.messages, or a string to use as override
   *                        message for failure.
   */

  authenticate(
    strategy: string,
    options?: {
      successRedirect?: string;
      failureRedirect?: string;
      successMessage?: string;
      failureMessage?: string;
    },
    callback?: Function
  ) {
    return this._framework.authenticate(this, strategy, options, callback);
  }

  serializeUser(fn: Function) {
    if (typeof fn === 'function') {
      return (this.funcs.serializer = fn);
    }
    return this.funcs.serializer;
  }

  deserializeUser(fn: Function) {
    if (typeof fn === 'function') {
      return (this.funcs.deserializer = fn);
    }
    return this.funcs.deserializer;
  }

  initialize(options?: { userProperty?: 'string' }) {
    return async (context: any, next: Function) => {
      context.state.onyx = new Onyx();

      // Check if Session has been set up for the server
      if (context.state.session === undefined) {
        throw new Error('Must set up Session before Onyx');
      }

      // LogIn - invoke after successful registration
      context.state.logIn = context.state.login = this._sm.logIn;

      // LogOut - invoke to log out user
      context.state.logOut = context.state.logout = this._sm.logOut;

      // isAuthenticated returns true if user is Authenticated
      context.state.isAuthenticated = function () {
        if (context.state.onyx.session !== undefined) return true;
        else return false;
      };

      // isUnauthenticated returns true if user is Not Authenticated
      context.state.isUnauthenticated = function () {
        return !context.state.isAuthenticated();
      };

      // getUser returns the user info from User Database if user is Authenticated, if not it will return undefined
      // this is different from Passport as we any info we store on context.state will persist (passport uses req[this.userProperty])
      context.state.getUser = function () {
        if (!context.state.onyx.session) return;
        return context.state.onyx.session.user;
      };

      const userIDVal = await context.state.session.get('userIDKey');

      if (userIDVal) {
        if (!context.state.onyx.session) context.state.onyx.session = {};
        context.state.onyx.session.userID = userIDVal;

        await this.funcs.deserializer(userIDVal, async function (
          err: any,
          user: any
        ) {
          if (err) throw new Error(err);
          else if (!user) {
            // active session found but userDB query return undefine
            delete context.state.onyx.session;

            // delete session
            const sidCookie = await context.cookies.get('sid');
            // if using Redis for Session Store
            if (context.state.session._session._store._sessionRedisStore) {
              await context.state.session._session._store._sessionRedisStore.del(
                sidCookie
              );
            }
            // else if using Session Memory for Session Store
            else context.state.session._session._store.deleteSession(sidCookie);
          } else {
            if (!context.state.onyx.session) context.state.onyx.session = {};
            context.state.onyx.session.user = user;
          }
        });
      }
      await next();
    };
  }

  // TODO
  authorize(strategy: string, options?: any, callback?: Function) {
    // for linking the 3rd party account to the account of a user that is currently athenticated
  }
}
