// what properties should the onyx namespace have?
interface Onyx {
  session: object;
}

export default function initialize(onyx: any) {
  return async (context: any, next: any) => {
    context.state.onyx = new Onyx(onyx);

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
