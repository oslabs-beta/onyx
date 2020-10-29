//  in passport authenticator: new SessionManager({ key: this._key }, this.serializeUser.bind(this))

export default class SessionManager {
  private _key: string;
  private _serializeUser: Function;

  // constructor(serializeUser: Function, options?: any) {
  constructor(serializeUser: Function, options?: any) {
    this._key = 'sid';
    this._serializeUser = serializeUser;
  }

  logIn = async (context: any, user: any, onyx: any, cb: Function) => {
    // cb (err, next)

    // in server, developer will define where the id is located on the user object and pass that as 2nd arg in done
    // onyx.serializeUser(function(user, done) {
    //    done(null, user.id);
    // });

    // this is from passing onyx in as arg2 on server 165
    console.log(onyx.funcs.serializer);

    onyx.funcs.serializer(user, async (err: any, id: any) => {
      if (err) {
        return cb(err);
      }
      if (!context.state.onyx.session) {
        context.state.onyx.session = {};
      }
      console.log('what is id?', id);

      // what's the point of saving it to this when we're just going to redirect user?
      context.state.onyx.session.userID = id;

      // starting session
      context.state.session.set('userIDKey', id);

      const userIDVal = await context.state.session.get('userIDKey');
      console.log('session set for user', userIDVal);

      // testing purpose only, logOut
      // await this.logOut(context);
      // const userIDVal2 = await context.state.session.get('userIDKey');
      // console.log('after logOut, is there session?', userIDVal2);
      cb();
    });
  };

  logOut = async (context: any, cb?: Function) => {
    if (context.state.onyx && context.state.onyx.session) {
      delete context.state.onyx.session.userID;

      const sidCookie = await context.cookies.get('sid');

      // if using Redis Memory for Session Store
      if (context.state.session._session._store._sessionRedisStore) {
        await context.state.session._session._store._sessionRedisStore.del(
          sidCookie
        );
      }
      // else if using Session Memory for Session Store
      else context.state.session._session._store.deleteSession(sidCookie);
    }
    // WHAT IS THIS?????
    // cb && cb();
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
//     cb && cb();  // ???????????
//   }

//   module.exports = SessionManager;
