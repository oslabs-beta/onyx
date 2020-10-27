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
class LocalStrategy extends Strategy {
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
  authenticate = async (context: any, options?: any) => {
    const body = await context.request.body().value;

    options = options || {};

    const username: string = body[this._usernameField];
    const password: string = body[this._passwordField];

    if (!username || !password) {
      context.state.onyx.isFailure = true;
      const msg = 'Missing Credentials';
      return failure(msg);
    }

    try {
      this._verify(username, password, verified);
    } catch (error) {
      // return self.error(err);
      throw new Error(error);
    }

    // no third-party info for local strat
    function verified(err: any, user: any, next: Function) {
      if (err) {
        // return self.error(err);  // invoke global error?
        throw new Error(err);
      }
      if (!user) return failure();
      success(user, next);
    }

    // ref: passport/lib/middleware/authenticate.js  allFailed(), skipping the fail and attempt functions
    function failure(msg?: any) {
      context.state.onyx.errorMessage =
        msg || 'The username or password do not match our records.';
      if (options.failureRedirect) {
        return context.response.redirect(options.failureRedirect);
      } else {
        context.statusCode = 401;
      }
    }

    /**
     * Authenticate `user`, with optional `info`.
     *
     * Strategies should call this function to successfully authenticate a
     * user.  `user` should be an object supplied by the application after it
     * has been given an opportunity to verify credentials.  `info` is an
     * optional argument containing additional user information.  This is
     * useful for third-party authentication strategies to pass profile
     * details.
     *
     **/

    // ref: passport/lib/middleware/authenticate.js
    function success(user: any, next: Function) {
      context.state.onyx.successMessage = "You're verified!";

      // if (options.successRedirect) {
      //   return context.response.redirect(options.successRedirect);
      // } else {
      //   context.statusCode = 200;
      // }

      // Assign the object provided by the verify callback to given property
      // might be useful for OAuth where the user is the GitHub user object where we will be saving info to user database?
      if (options.assignProperty) {
        context.state.onyx[options.assignProperty] = user;
        return next();
      }

      // ref: passport/lib/middleware/authenticate.js
      // invoke req.logIn
      context.logIn(user, options, (err: any, next: Function) => {
        if (err) {
          throw new Error(err);
        }
        if (options.successRedirect) {
          context.statusCode = 200;
          return context.response.redirect(options.successRedirect);
        } else context.statusCode = 200;
        // if no options.successRedirect is provided, go to the next middleware(which is another redirecting)?
        return next();
      });
    }
  };
}

// function SessionManager(options, serializeUser) {
//   if (typeof options == 'function') {
//     serializeUser = options;
//     options = undefined;
//   }
//   options = options || {};

//   this._key = options.key || 'passport';
//   this._serializeUser = serializeUser;
// }

// SessionManager.prototype.logIn = function (req, user, cb) {
//   var self = this;
//   this._serializeUser(user, req, function (err, obj) {
//     if (err) {
//       return cb(err);
//     }
//     if (!req._passport.session) {
//       req._passport.session = {};
//     }
//     req._passport.session.user = obj;
//     if (!req.session) {
//       req.session = {};
//     }
//     req.session[self._key] = req._passport.session;
//     cb();
//   });
// };

// SessionManager.prototype.logOut = function (req, cb) {
//   if (req._passport && req._passport.session) {
//     delete req._passport.session.user;
//   }
//   cb && cb();
// };

// // Authenticate request based on the contents of a form submission.

// LocalStrategy.prototype.authenticate = async function(context: any, options?) {
//   const body = await context.body().value;

//   options = options || {};  // options have something to do with badRequestMessage

//   const username: string = body[this._usernameField];  //here it's private property

//   var username = lookup(req.body, this._usernameField) || lookup(req.que ry, this._usernameField);
//   var password = lookup(req.body, this._passwordField) || lookup(req.query, this._passwordField);

//   if (!username || !password) {
//     return callback(null, false, { message: options.badRequestMessage || 'Missing credentials' }, 400)
//   }

//   var self = this;

//   function verified(err: any, user: any, info?: any) {
//     if (err) { return self.error(err); }
//     if (!user) { return self.fail(info); }
//     self.success(user, info);
//   }

//   try {
//     if (self._passReqToCallback) {
//       this._verify(req, username, password, verified);
//     } else {
//       this._verify(username, password, verified);
//     }
//   } catch (ex) {
//     return self.error(ex);
//   }
// };

//   // FROM UTILS LOOKUP
// //   exports.lookup = function(obj, field) {  // obj = req.body or req.params  // field = this._usernameField
// //     if (!obj) { return null; }
// //     var chain = field.split(']').join('').split('[');
// //     for (var i = 0, len = chain.length; i < len; i++) {
// //       var prop = obj[chain[i]];
// //       if (typeof(prop) === 'undefined') { return null; }
// //       if (typeof(prop) !== 'object') { return prop; }
// //       obj = prop;
// //     }
// //     return null;
// //   };

// /* FROM PASSPORT passport-local/lib/strategy.js

// function Strategy(options, verify) {
//   if (typeof options == 'function') {
//     verify = options;
//     options = {};
//   }
//   if (!verify) { throw new TypeError('LocalStrategy requires a verify callback'); }

//   this._usernameField = options.usernameField || 'username';
//   this._passwordField = options.passwordField || 'password';

//   passport.Strategy.call(this);
//   this.name = 'local';
//   this._verify = verify;
//   this._passReqToCallback = options.passReqToCallback;
// }

// */

// function allFailed() {
//   // there's also a sucessMessage // boolean, if this is true, we want to put the challenge.message into msg
//   if (options.failureMessage) {
//     msg = options.failureMessage;  // if this is a boolean
//     if (typeof msg == 'boolean') {
//       msg = challenge.message || challenge;  // set challenge.message as msgs
//     }
//     if (typeof msg == 'string') {  //
//       req.session.messages = req.session.messages || [];
//       req.session.messages.push(msg);
//     }
//   }
//   if (options.failureRedirect) {
//     return res.redirect(options.failureRedirect);
//   }

//   // When failure handling is not delegated to the application, the default
//   // is to respond with 401 Unauthorized.  Note that the WWW-Authenticate
//   // header will be set according to the strategies in use (see
//   // actions#fail).  If multiple strategies failed, each of their challenges
//   // will be included in the response.
//   var rchallenge = []
//     , rstatus, status;

//   for (var j = 0, len = failures.length; j < len; j++) {
//     failure = failures[j];
//     challenge = failure.challenge;
//     status = failure.status;

//     rstatus = rstatus || status;
//     if (typeof challenge == 'string') {
//       rchallenge.push(challenge);
//     }
//   }

//   res.statusCode = rstatus || 401;
//   if (res.statusCode == 401 && rchallenge.length) {
//     res.setHeader('WWW-Authenticate', rchallenge);
//   }
//   if (options.failWithError) {
//     return next(new AuthenticationError(http.STATUS_CODES[res.statusCode], rstatus));
//   }
//   res.end(http.STATUS_CODES[res.statusCode]);
// }

// // SUCCESS

// // * Strategies should call this function to successfully authenticate a
// // * user.  `user` should be an object supplied by the application after it
// // * has been given an opportunity to verify credentials.  `info` is an
// // * optional argument containing additional user information.  This is
// // * useful for third-party authentication strategies to pass profile
// // * details.
// strategy.success = function(user, info) {
//   if (callback) {
//     return callback(null, user, info);
//   }

//   info = info || {};
//   var msg;

//   if (options.successFlash) {
//     var flash = options.successFlash;
//     if (typeof flash == 'string') {
//       flash = { type: 'success', message: flash };
//     }
//     flash.type = flash.type || 'success';

//     var type = flash.type || info.type || 'success';
//     msg = flash.message || info.message || info;
//     if (typeof msg == 'string') {
//       req.flash(type, msg);
//     }
//   }
//   if (options.successMessage) {
//     msg = options.successMessage;
//     if (typeof msg == 'boolean') {
//       msg = info.message || info;
//     }
//     if (typeof msg == 'string') {
//       req.session.messages = req.session.messages || [];
//       req.session.messages.push(msg);
//     }
//   }
//   if (options.assignProperty) {
//     req[options.assignProperty] = user;
//     return next();
//   }

//   req.logIn(user, options, function(err) {
//     if (err) { return next(err); }

//     function complete() {
//       if (options.successReturnToOrRedirect) {
//         var url = options.successReturnToOrRedirect;
//         if (req.session && req.session.returnTo) {
//           url = req.session.returnTo;
//           delete req.session.returnTo;
//         }
//         return res.redirect(url);
//       }
//       if (options.successRedirect) {
//         return res.redirect(options.successRedirect);
//       }
//       next();
//     }

//     if (options.authInfo !== false) {
//       passport.transformAuthInfo(info, req, function(err, tinfo) {
//         if (err) { return next(err); }
//         req.authInfo = tinfo;
//         complete();
//       });
//     } else {
//       complete();
//     }
//   });
// };
