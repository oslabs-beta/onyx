import Strategy from '../strategy.ts';

export default class SessionStrategy extends Strategy {
  public name: string;

  constructor(deserializeUser: Function, options?: any) {
    super();
    this.name = 'session';
  }
}
