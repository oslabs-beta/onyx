import { Context } from 'https://deno.land/x/oak@v6.3.1/context.ts';
import Strategy from '../strategy.ts';
import Onyx from '../onyx.ts';

// what properties should the onyx namespace have?
// interface Onyx {
//   session: object;
//   _onyx: any;
// }

// class Onyx {
//   constructor(onyx: any) {
//     this._onyx = onyx;
//   }

//   // functions that we want to add to context.state.onyx
// }

// export default class test {
//   constructor() {}
//   initialize = () => {
//     return async (context: any, next: any) => {};
//   };
// }

export default function initialize(onyx: any, options?: any) {
  return async (context: any, next: any) => {
    context.state.onyx = new Onyx();

    // if session entry exist, load data from that
    const userIDVal = await context.state.session.get('userIDKey');

    if (userIDVal) {
      const sidCookie = await context.cookies.get('sid');
      context.state.onyx.session =
        context.state.session._session._store._sessionMemoryStore[sidCookie];
    }

    await next();
  };
}

// import { SessionData } from "../mod.ts";

// export default function use(session: any) {
//   return async (context: any, next: any) => {
//     const sid = context.cookies.get('sid');

//     if (sid === undefined) {
//       context.session = new SessionData(session);
//       context.cookies.set('sid', context.session.sessionId);
//     } else if (session._store.sessionExists(sid) === false) {
//       context.session = new SessionData(session);
//       context.cookies.set('sid', context.session.sessionId);
//     } else {
//       context.session = new SessionData(session, sid);
//     }

//     await context.session.init();

//     await next();
//   };
// }

// from failure of local-strategy.ts
// context.state.onyx.isFailure = true;

// req.session.messages = req.session.messages || [];
