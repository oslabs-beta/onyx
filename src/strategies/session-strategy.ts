import Strategy from '../strategy.ts';

export default class SessionStrategy extends Strategy {
  public name: string;
  private _deserializeUser: Function;

  constructor(deserializeUser: Function, options?: any) {
    super();
    this.name = 'session';
    this._deserializeUser = deserializeUser;
  }

  authenticate = async (context: any) => {
    // deserializer
  };
}
