import Strategy from '../strategy.ts';

// references
// passport/lib/middleware/authenticate.js
// passport-local/lib/strategy.js

/*     passport.use(new LocalStrategy(
 *       function(username, password, done) {
 *         User.findOne({ username: username, password: password }, function (err, user) {
 *           done(err, user);
 *         }, {options});
 *       }
 *     ));
 */

/* Create local strategy
 *
 * options provides the field names for where the username and password are found, defaults to username & password
 */
export default class LocalStrategy extends Strategy {
  private _usernameField: string;
  private _passwordField: string;
  private _verify: Function;

  constructor(
    verifyCB: Function,
    options?: { usernameField: string; passwordField: string }
  ) {
    super();
    this._usernameField = options?.usernameField || 'username';
    this._passwordField = options?.passwordField || 'password';
    this.name = 'local';
    this._verify = verifyCB;
  }

  // options here are { successRedirect: '/', failureRedirect: '/login', session: true } and others
  authenticate = async (context: any, onyx?: any, options?: any) => {
    const body = await context.request.body().value;

    options = options || {};

    const username: string = body[this._usernameField];
    const password: string = body[this._passwordField];

    console.log(`in local authenticate with ${username} and ${password}`);

    if (!username || !password) {
      context.state.onyx.isFailure = true;
      const msg = 'Missing Credentials';
      return failure(msg);
    }

    context.state.onyx.user = { username, password };

    try {
      await this._verify(context, verified);
    } catch (error) {
      throw new Error(error);
    }

    // no third-party info for local strat
    function verified(err: any, user: any) {
      if (err) {
        console.log('err in verified with err', err);
        throw new Error(err);
      }
      if (!user) return failure();
      success(user);
    }

    // ref: passport/lib/middleware/authenticate.js  allFailed(), skipping the fail and attempt functions
    async function failure(msg?: any) {
      console.log('in failure');
      context.state.onyx.errorMessage =
        msg || 'The username or password do not match our records.';
      if (options.failureRedirect) {
        return context.response.redirect(options.failureRedirect);
      } else {
        console.log('errorMessage', context.state.onyx.errorMessage);
        // context.response.redirect('/fail'); // redirect seems to work
      }
    }

    // ref: passport/lib/middleware/authenticate.js
    function success(user: any) {
      context.state.onyx.successMessage = "You're verified!";

      // Assign the object provided by the verify callback to given property
      // might be useful for OAuth where the user is the GitHub user object where we will be saving info to user database?
      if (options.assignProperty) {
        context.state.onyx[options.assignProperty] = user;
        // return next();
      }

      // ref: passport/lib/middleware/authenticate.js
      context.state.onyx._sm.logIn(
        context,
        user,
        onyx, // ONYX
        // async (err: any, next: Function) => {
        async (err: any, next: Function) => {
          if (err) {
            throw new Error(err);
          }

          if (options.successRedirect) {
            context.statusCode = 200;
            console.log('with successRedirect');
            return context.response.redirect(options.successRedirect);
          } else {
            console.log('without successRedirect');
            context.response.status = 200;
          }
        }
      );
    }
  };
}

// SessionManager.prototype.logOut = function (req, cb) {
//   if (req._passport && req._passport.session) {
//     delete req._passport.session.user;
//   }
//   cb && cb();
// };
