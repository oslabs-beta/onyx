// this will be the starting file for user to use our middleware
// export everything important here

import Authenticate from './src/onyx.ts';

const Onyx = new Authenticate();

export default Onyx;

// exports = module.exports = new Passport();

// /**
//  * Expose constructors.
//  */
// exports.Passport =
// exports.Authenticator = Passport;
// exports.Strategy = require('passport-strategy');

// /**
//  * Expose strategies.
//  */
// exports.strategies = {};
// exports.strategies.SessionStrategy = SessionStrategy;
