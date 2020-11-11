import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
// import SessionStrategy from './strategies/session-strategy.ts';

export default class Onyx {
  private _sm: any;
  private _strategies: any;
  private _userProperty: string;
  public funcs: any;

  constructor() {
    this._strategies = {};
    this._userProperty = 'user';
    this.funcs = {};
    this.init();
  }

  init() {
    this._sm = new SessionManager(this.serializeUser.bind(this));
    // this.use(new SessionStrategy(this.deserializeUser.bind(this))); // not being used
  }

  // 11.7 *options* - giving developer an option to customize their strategy name  *README*
  use(name: string | Strategy, strategy?: Strategy) {
    try {
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
    } catch (err) {
      console.log('hello from catch');
      return err;
    }
  }
  // onyx.authenticate('local')
  // onyx.use('newLocal', new LocalStrategy())

  // 11.7 - allows the developer to remove added strategies - not necessary in normal situations
  unuse(name: string) {
    delete this._strategies[name];
    return this;
  }

  // 11.7 *note* callback function that is passed in is..? customized function to handle success/failure

  /* Options:   *note* *README*
   *   - `session`          Save login state in session, defaults to _true_
   *   - `successRedirect`  After successful login, redirect to given URL
   *   - `successMessage`   True to store success message in
   *                        req.session.messages, or a string to use as override
   *                        message for success.
   *   - `failureRedirect`  After failed login, redirect to given URL
   *   - `failureMessage`   True to store failure message in
   *                        req.session.messages, or a string to use as override
   *                        message for failure.
   *   - `assignProperty`   Assign the object provided by the verify callback to given property
   *
   *
   *     app.get('/protected', function(req, res, next) {
   *       passport.authenticate('local', function(err, user, info, status) {
   *         if (err) { return next(err) }
   *         if (!user) { return res.redirect('/signin') }
   *         res.redirect('/account');
   *       })(req, res, next);
   *     });
   */

  authenticate(
    strategy: string,
    options?: { successRedirect?: string; failureRedirect?: string },
    callback?: Function
  ) {
    if (!strategy) {
      throw new Error('You must provide an authentication strategy as an argment.');
    }
    const currStrat = this._strategies[strategy];
    if (!currStrat) {
      throw new Error(
        "The argued strategy is not a valid strategy. Did you remember to invoke 'onyx.use'?"
      );
    }
    console.log('hello from onyx.authenticate with currStrat', currStrat);
    return currStrat.authenticate(this, options, callback);
  }

  // 11.7 *note* does serializerUser ever take in context?
  // 11.7 *note* if we can't access this function though binding, then make this just a simple storage function
  serializeUser(fn?: any, context?: any) {
    console.log('in serializeUser of onyx');
    if (typeof fn === 'function') {
      return (this.funcs.serializer = fn);
    }
    console.log('serializerUser invoked without function');
    return this.funcs.serializer;
  }

  deserializeUser(fn: Function) {
    console.log('in deserializeUser of onyx.ts');
    if (typeof fn === 'function') {
      return (this.funcs.deserializer = fn);
    }
    console.log('deserializerUser invoked without function');
    return this.funcs.deserializer;
  }

  // when onyx is initialized in server (on each incoming request), will check session db for active session
  // if active session found, invoke deserialization
  initialize(options?: { userProperty?: 'string' }) {
    return async (context: any, next: Function) => {
      // each connection should have it's own instance of Onyx
      // can only add property on context.state which'll persist while server is active,unlike the req obj of express which is unique for ea connection
      context.state.onyx = new Onyx();

      this._userProperty = options?.userProperty || 'user';

      // if we want to accomodate other frameworks, the following needs to be in an 'oak.tsx' file to be imported in as the framework

      // adding the logIn and logOut to context.state for developer to invoke in the register and logout path
      context.state.logOut = context.state.logout = this._sm.logOut;
      context.state.logIn = context.state.login = this._sm.logIn;

      const userIDVal = await context.state.session.get('userIDKey');

      // We won't enter this statement the first time we visit a website, since there isn't an existing session
      if (userIDVal) {
        if (!context.state.onyx.session) context.state.onyx.session = {};
        context.state.onyx.session.userID = userIDVal;

        console.log(
          'session found! userID saved in context.state.onyx.session',
          context.state.onyx.session
        );

        await this.funcs.deserializer(userIDVal, function (err: any, user: any) {
          if (err) throw new Error(err);
          else if (!user) {
            // so active session found but userIDVal does not return an user from userDB
            delete context.state.onyx.session.userID;
            // 11.7 *note* should we also delete the active session?
          } else {
            // user found in userDB, now store the info on onyx.session.user so developer can access it *FOR README*
            if (!context.state.onyx.session) context.state.onyx.session = {};
            context.state.onyx.session.user = user;
          }
        });
        console.log('finishing deserializer in onyx');
      }
      console.log('finishing initialization in onyx');
      await next();
    };
  }

  // TODO
  authorize(strategy: string, options?: any, callback?: Function) {
    // for linking the 3rd party account to the account of a user that is currently athenticated
  }
}
