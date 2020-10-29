//  in passport authenticator: new SessionManager({ key: this._key }, this.serializeUser.bind(this))

export default class SessionManager {
  private _key: string;
  private _serializeUser: Function;
  // private _funcs: any;

  constructor(serializeUser: Function, options?: any) {
    // constructor(funcs: object, options?: any) {
    this._key = 'sid';
    this._serializeUser = serializeUser;
    // this._funcs = funcs;
  }

  // onyx.authenticate() will invoke this on /login path, but on /register path developer will have to invoke this function using context.state.onyx._sm.logIn ---- would be better if we can add to context.logIn or something similar
  logIn = async (context: any, user: any, onyx: any, cb: Function) => {
    // in server, developer will define where the id is located on the user object and pass that as 2nd arg in done
    // onyx.serializeUser(function(user, done) {
    //    done(null, user.id);
    // });

    // in onyx initialize, fixed so that context.state.onyx is the onyx object created in the server and not a new instance of Onyx.  so now calling for the serializeUser function will be in the instance of onyx that has the funcs property with the serializer and deserializer
    const serializer = await this._serializeUser();
    console.log(serializer);

    // console.log('funcs are', this._funcs);  // funcs are undefine

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

      cb();
    });
  };

  // developer has to invoke this using context.state.onyx._sm.logOut()
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
      // else if using Server Memory for Session Store
      else context.state.session._session._store.deleteSession(sidCookie);

      // Redis Memory untested. Server Memory will actually delete the entire entry with the sidCookie key. Should we try figure out how to remove just the UserIDKey property instead?
    }

    // If the callback exists? --> Invoke it
    cb && cb();
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
