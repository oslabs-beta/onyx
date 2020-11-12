export default class SessionManager {
  private _serializeUser: Function;

  constructor(serializeUser: Function) {
    this._serializeUser = serializeUser;
  }

  logIn = async (context: any, user: any, cb: Function) => {
    const serializer = await this._serializeUser();

    await serializer(user, async (err: any, id: any) => {
      if (err) {
        return cb(err);
      }
      if (!context.state.onyx.session) {
        context.state.onyx.session = {};
      }

      context.state.onyx.session.user = user;
      context.state.onyx.session.userID = id;

      await context.state.session.set('userIDKey', id);

      const userIDVal = await context.state.session.get('userIDKey');

      await cb();
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
      // if using Server Memory for Session Store
      else context.state.session._session._store.deleteSession(sidCookie);
    }
    cb && cb();
  };
}
