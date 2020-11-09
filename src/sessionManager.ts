//  in passport authenticator: new SessionManager({ key: this._key }, this.serializeUser.bind(this))

export default class SessionManager {
  private _serializeUser: Function;

  // constructor(serializeUser: Function, options?: any) in passport.js but not sure
  // if need options?
  constructor(serializeUser: Function) {
    this._serializeUser = serializeUser;
  }

  // onyx.authenticate() will invoke this on /login path, but on /register path developer will have to invoke this function using context.state.onyx._sm.logIn ---- would be better if we can add to context.logIn or something similar
  logIn = async (context: any, user: any, onyx: any, cb: Function) => {
    // in server, developer will define where the id is located on the user object and pass that as 2nd arg in done
    // onyx.serializeUser(function(user, done) {
    //    done(null, user.id);
    // });

    // in onyx initialize, fixed so that context.state.onyx is the onyx object created in the server and not a new instance of Onyx.  so now calling for the serializeUser function will be in the instance of onyx that has the funcs property with the serializer and deserializer
    const serializer = await this._serializeUser();
    console.log('what is this._serializer in sessionManager', serializer);

    // onyx.funcs.serializer === async func passed in onyx.serializeUser
    // basically the done function that we see in the serialize & deserialize
    // CHANGE - #7th await
    console.log(
      'in SM before serializer, whats in context.state.onyx',
      context.state.onyx
    );
    await onyx.funcs.serializer(user, async (err: any, id: any) => {
      if (err) {
        return cb(err);
      }
      if (!context.state.onyx.session) {
        context.state.onyx.session = {};
      }

      // saving for developer to use if they want (if no redirect options were provided)
      context.state.onyx.session.user = user; // can we add this to somewhere more accessable?  // REFRACTOR
      context.state.onyx.session.userID = id;

      /// TESTING  --- context.state.user persists between different users
      // console.log('user before', context.state.user);
      // context.state.user = user;
      // console.log('user after', context.state.user);

      // starting session
      // CHANGE # 3 - TESTED - works without await b/c when deserialize,
      // have active session but think better to await to confirm session is active
      // process of setting an active session has been started, it'll complete whether or not you wait for it
      await context.state.session.set('userIDKey', id);

      const userIDVal = await context.state.session.get('userIDKey');
      console.log('session set for user in sessionManager', userIDVal);

      // REFACTOR next-middleware
      cb(); // CHANGE # 1 - TESTED - still works without await b/c last middleware?
      console.log('after the await cb of sessionManager');
    });

    //
  };

  // developer has to invoke this using context.state.onyx._sm.logOut()
  // if we can add to context.logOut?
  logOut = async (context: any, cb?: Function) => {
    if (context.state.onyx && context.state.onyx.session) {
      delete context.state.onyx.session.userID;

      const sidCookie = await context.cookies.get('sid');

      // console.log('in sessionManager, sidCookie', sidCookie);
      // if using Redis Memory for Session Store
      if (context.state.session._session._store._sessionRedisStore) {
        await context.state.session._session._store._sessionRedisStore.del(
          sidCookie
        );
      }
      // else if using Server Memory for Session Store
      else context.state.session._session._store.deleteSession(sidCookie);

      // const userIDVal = await context.state.session.get('userIDKey');
      // console.log('session for user after logout', userIDVal);

      // Redis Memory untested. Server Memory will actually delete the entire entry with the sidCookie key. Should we try figure out how to remove just the UserIDKey property instead?
    }

    // If the callback exists? --> Invoke it
    cb && cb();
  };
}
