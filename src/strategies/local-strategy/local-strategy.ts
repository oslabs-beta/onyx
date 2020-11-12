import Strategy from '../../strategy.ts';

/* Create local strategy
 *
 * options provides the field names for where the username and password are found, defaults to username & password
 */
export default class LocalStrategy extends Strategy {
  private _usernameField: string;
  private _passwordField: string;
  private _verify: Function;
  public funcs: any; // add to strategy

  constructor(
    verifyCB: Function,
    options?: { usernameField?: string; passwordField?: string }
  ) {
    super();
    this._usernameField = options?.usernameField || 'username';
    this._passwordField = options?.passwordField || 'password';
    this.name = 'local';
    this._verify = verifyCB;
    this.funcs = {};
  }
  // in passport, only has context and options passed in in authenticate func
  authenticate = async (context: any, options?: any) => {
    // 11.9 *note* *endpoint* 'this' doesn't include the functions added in the authenticate middleware
    // I think might be related to using the arrow function, but when we switch to line 29, there was an error about 'this' being over written
    // 'this' implicitly has type 'any' because it does not have a type annotation.ts(2683)
    // An outer value of 'this' is shadowed by this container.
    // 11.10 *resolution* typescript issue? can't just add new properties to local-strategy since they were not declared, created a new funcs property, initialized as empty object, to store the action functions
    // if (typeof options === 'function') {
    //   callback = options;
    //   options = {};
    // }
    options = options || {};

    console.log('local-strategy authenticate has been invoked');

    // return async (context: any, next: Function) => {

    const body = await context.request.body().value;

    const username: string = body[this._usernameField];
    const password: string = body[this._passwordField];

    console.log(
      `*******in local authenticate with ${username} and ${password} in local-strategy.authenticate`
    );

    console.log('in local-strat, this.funcs is', this.funcs);

    if (!username || !password) {
      context.state.onyx.isFailure = true;
      return this.funcs.fail(
        { message: options.badRequestMessage || 'Missing Credentials' },
        400
      );
    }

    context.state.onyx.user = { username, password };
    const self = this;

    try {
      // await this._verify(context, verified);
      await this._verify(username, password, verified);
    } catch (err) {
      return self.funcs.error(err);
    }

    // // no third-party info for local strat

    async function verified(err: any, user?: any, info?: any) {
      if (err) {
        console.log(
          'err in verified with err in local-strategy authenticate',
          err
        );
        return self.funcs.error(err);
      }
      if (!user) {
        console.log(
          '!user in verified of local-strategy authenticate',
          user,
          info
        );
        return self.funcs.fail(info);
      }
      await self.funcs.success(user, info);
    }
  };
}
