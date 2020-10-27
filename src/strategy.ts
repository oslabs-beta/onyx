// Creates an instance of a Strategy

class Strategy {
  public name: any;

  constructor() {}
  authenticate(context: any, options?: any) {
    throw new Error('Strategy must be overwritten by a subclass strategy');
  }
}

export default Strategy;
