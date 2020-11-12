import Strategy from '../../strategy.ts';

/* Create local strategy
 *
 * options provides the field names for where the username and password are found, defaults to 'username' & 'password'
 */
export default class LocalStrategy extends Strategy {
  private _usernameField: string;
  private _passwordField: string;
  private _verify: Function;
  public funcs: any;

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

  authenticate = async (context: any, options?: any) => {
    options = options || {};

    const body = await context.request.body().value;

    const username: string = body[this._usernameField];
    const password: string = body[this._passwordField];

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
      await this._verify(username, password, verified);
    } catch (err) {
      return self.funcs.error(err);
    }

    async function verified(err: any, user?: any, info?: any) {
      if (err) {
        return self.funcs.error(err);
      }
      if (!user) {
        return self.funcs.fail(info);
      }
      await self.funcs.success(user, info);
    }
  };
}
