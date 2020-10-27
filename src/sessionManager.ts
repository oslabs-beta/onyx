//  in passport authenticator: new SessionManager({ key: this._key }, this.serializeUser.bind(this))

export default class SessionManager {
  private _key: string;
  private _serializeUser: Function;

  constructor(serializeUser: Function, options?: any) {
    this._key = options.key || 'sid';
    this._serializeUser = serializeUser;
  }

  logIn = async (context: any, user: any, cb: Function) => {
    // example of serializeUser:
    //        passport.serializeUser(function(user, done) {
    //  *       done(null, user.id);
    //  *     });
    this._serializeUser(user, context, async function (err: any, obj: Object) {
      if (err) {
        return cb(err);
      }
      // check if session for user exists, if not
    });
  };
}

// In this example, only the user ID is serialized to the session, keeping the amount of data stored within the session small. When subsequent requests are received, this ID is used to find the user, which will be restored to req.user.

// passport.serializeUser(function (user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });

// function SessionManager(options, serializeUser) {
//     if (typeof options == 'function') {
//       serializeUser = options;
//       options = undefined;
//     }
//     options = options || {};

//     this._key = options.key || 'passport';
//     this._serializeUser = serializeUser;
//   }

//   SessionManager.prototype.logIn = function(req, user, cb) {
//     var self = this;
//     this._serializeUser(user, req, function(err, obj) {
//       if (err) {
//         return cb(err);
//       }
//       if (!req._passport.session) {
//         req._passport.session = {};
//       }
//       req._passport.session.user = obj;
//       if (!req.session) {
//         req.session = {};
//       }
//       req.session[self._key] = req._passport.session;
//       cb();
//     });
//   }

//   SessionManager.prototype.logOut = function(req, cb) {
//     if (req._passport && req._passport.session) {
//       delete req._passport.session.user;
//     }
//     cb && cb();
//   }

//   module.exports = SessionManager;

/**
 * Registers a function used to serialize user objects into the session.
 *
 * Examples:
 *
 *     passport.serializeUser(function(user, done) {
 *       done(null, user.id);
 *     });
 *
 * @api public
 */
Authenticator.prototype.serializeUser = function (fn, req, done) {
  if (typeof fn === 'function') {
    return this._serializers.push(fn);
  }

  // private implementation that traverses the chain of serializers, attempting
  // to serialize a user
  var user = fn;

  // For backwards compatibility
  if (typeof req === 'function') {
    done = req;
    req = undefined;
  }

  var stack = this._serializers;
  (function pass(i, err, obj) {
    // serializers use 'pass' as an error to skip processing
    if ('pass' === err) {
      err = undefined;
    }
    // an error or serialized object was obtained, done
    if (err || obj || obj === 0) {
      return done(err, obj);
    }

    var layer = stack[i];
    if (!layer) {
      return done(new Error('Failed to serialize user into session'));
    }

    function serialized(e, o) {
      pass(i + 1, e, o);
    }

    try {
      var arity = layer.length;
      if (arity == 3) {
        layer(req, user, serialized);
      } else {
        layer(user, serialized);
      }
    } catch (e) {
      return done(e);
    }
  })(0);
};
