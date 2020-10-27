import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';

export default class Onyx {
  private _sm: any;
  private _strategies: any;
  // an object with the strategy.name as the key and the strategy as value, ie 'local' and LocalStrategy

  constructor() {}

  init() {
    this._sm = new SessionManager(
      this.serializeUser.bind(this) /*, { key: this._key } */
    );
  }

  // app.post('/login', passport.authenticate('local', {failureRedirect:'/login', successRedirect: '/dashboard'}))
  // *     passport.use(new TwitterStrategy(...));  // strategy.name = 'twitter'
  // *     passport.use(new GitHubStrategy(...))
  // *     passport.use('api', new http.BasicStrategy(...)); 'basic'  'api'

  // onyx.authenticate('local', )

  use(strategy: Strategy) {
    const name = strategy.name;
    if (!name) {
      throw new Error('Authentication strategies must have a name!');
    }

    this._strategies[name] = strategy;
    return this;
  }

  authenticate() {}

  serializeUser() {}

  deserializeUser() {}
}

// Authenticator.prototype.init = function () {
//   this.framework(require('./framework/connect')());
//   this.use(new SessionStrategy(this.deserializeUser.bind(this)));
//   this._sm = new SessionManager(
//     { key: this._key },
//     this.serializeUser.bind(this)
//   );
// };

// passport.serializeUser(function(user, done) {
//   done(null, user.username);
// });

// passport.deserializeUser((username, done) => {
//   done(null, {username: username});
// });
