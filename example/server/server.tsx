import { Application, send, join, log } from '../deps.ts';
import { Session } from '../deps.ts';

// Server Middlewares
import router from './routes.ts';
import User from './models/userModels.ts';
import userController from './controllers/authController.ts';

// Frontend
import { React, ReactDOMServer } from '../deps.ts';
import App from '../views/App.tsx';
import Inputs from '../views/components/Inputs.tsx';
import Message from '../views/components/Message.tsx';
import Home from '../views/components/Home.tsx';
import MainContainer from '../views/components/MainContainer.tsx';
import NavBar from '../views/components/NavBar.tsx';
import Protected from '../views/components/Protected.tsx';

// Onyx Middlewares
import LocalStrategy from '../../src/strategies/local-strategy.ts';
import Onyx from '../../src/onyx.ts';
import { LogLevelNames } from 'https://deno.land/std@0.74.0/log/levels.ts';

const port: number = Number(Deno.env.get('PORT')) || 4000;
const app: Application = new Application();

// session for Server Memory
const session = new Session({ framework: 'oak' });

// // session from Redis Memory
// const session = new Session({
//   framework: 'oak',
//   store: 'redis',
//   hostname: '127.0.0.1',
//   port: 6379,
// });

// Initialize Session
await session.init();

const onyx = new Onyx();

// saving the LocalStrategy onto onyx._strategies['local'] to be invoked in onyx.authenticate('local')
onyx.use(new LocalStrategy(userController.verifyUser));
// onyx.use(other strategies)

// developer will provide the serializer and deserializer functions that will specify the user id property to save in session db and the _id to query the user db for
onyx.serializeUser(async function (user: any, cb: Function) {
  // developer will specify the user id in the user object  //user  //user.id
  cb(null, user._id.$oid);
});

onyx.deserializeUser(async function (id: string, cb: Function) {
  console.log('deserializing');

  // we'll use the id (from session or onyx?) and go inside the mongoDB to find the user object

  const _id = { $oid: id };

  try {
    const user = await User.findOne({ _id });
    if (!user) {
      // cb(user);
      throw new Error('not in db');
    } else {
      console.log('in deserialization, with found user', user);
      await cb(null, user);
    }
  } catch (error) {
    await cb(error);
  }
});

// Error Notification
app.addEventListener('error', (event) => {
  log.error(JSON.stringify(event.error));
});

// Error Handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response.body = {
      success: false,
      message: 'Internal server error',
    };
    throw error;
  }
});

// Creates the ctx.state.session property & generate SID and set cookies
// session.use returns an async function and also has await next()
app.use(session.use()(session));
// session code has bug where it's not taking the 2nd argument as cookie config options

// onyx.initialize(onyx) returnes a async function
app.use(onyx.initialize(onyx));

// Track response time in headers of responses
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

// adding user obj to response body?
// app.use(async (ctx, next) => {
//   await next();

// });

// router
app.use(async (ctx, next) => {
  log.info('line 121 before');
  await next();
  log.info('line 124 after');
});
app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx, next) => {
  log.info('line 129');
  await next();
});

const browserBundlePath: string = '/browser.js';

const html: string = `<html><head><script type="module" src="${browserBundlePath}"></script><link rel="stylesheet" href="style.css" type="text/css"><style>* { font-family: Helvetica; }</style></head><body><div id="root">${(ReactDOMServer as any).renderToString(
  <App />
)}</div></body></html>`;

// needed to send the browser the Inputs as well otherwise html part will show everything but as soon as js part is received browser will complain "Uncaught ReferenceError: Component is not defined"
const js: string = `import React from "https://dev.jspm.io/react@16.14.0";
  \nimport ReactDOM from "https://dev.jspm.io/react-dom@16.14.0";
  \nconst Message = ${Message};
  \nconst Inputs = ${Inputs};
  \nconst Protected = ${Protected};
  \nconst Home = ${Home};
  \nconst NavBar = ${NavBar};
  \nconst MainContainer = ${MainContainer};
  \nReactDOM.hydrate(React.createElement(${App}), document.getElementById("root"));`;

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const method = ctx.request.method;

  const sidCookie = await ctx.cookies.get('sid');
  const user_id = await ctx.state.session.get('userIDKey');
  console.log(`${filePath}: ${sidCookie} with ${user_id}`);

  if (filePath === '/') {
    ctx.response.type = `text/html`;
    ctx.response.body = html;
  } else if (filePath === browserBundlePath) {
    ctx.response.type = 'application/javascript';
    ctx.response.body = js;
  } else if (filePath === '/style.css') {
    ctx.response.type = 'text/css';
    await send(ctx, filePath, {
      root: join(Deno.cwd(), 'example/views/assets'),
    });
  } else if (method === 'POST' && filePath === '/login') {
    // onyx.authenticate returns function and immediately invoking func
    await onyx.authenticate('local', { message: 'hi' }, (ctx: any) => {
      console.log('usually for error handling');
    })(ctx, onyx); /// passing in onyx

    // check the result of authentication here and create the ctx.response body

    if (!ctx.state.onyx.errorMessage) {
      console.log('in good login response', ctx.state.onyx.errorMessage);
      const user = ctx.state.onyx.user;
      console.log(ctx.response.body);
      ctx.response.body = {
        success: true,
        message: user,
      };
    } else {
      const message = ctx.state.onyx.errorMessage || 'login unsuccessful';
      ctx.response.body = {
        success: false,
        message,
      };
    }
  } else if (method === 'GET' && filePath === '/protected') {
    log.warning(ctx.state.onyx.session);
    if (ctx.state.onyx.session?.user) {
      log.info('session found, proceed to protected');
      const { username } = ctx.state.onyx.session.user;
      ctx.response.body = {
        success: true,
        isAuth: true,
        username,
      };
    } else {
      log.info('session not found, proceed to login');
      ctx.response.body = {
        success: true,
        isAuth: false,
      };
    }
  }
});

// Error handler missing path?
app.use(async (ctx) => {
  // Will throw a 500 on every request.  ??????
  log.error('finally in error handler of the end');
  ctx.throw(500);
});

// import.meta.main determines if the server was opened directly (i.e. through 'deno run' or 'denon start')
// rather than through testing
if (import.meta.main) {
  log.info(`Server is up and running on ${port}`);
  await app.listen({ port });
}

export { app };
// use this command to run example server
// deno run --allow-net --allow-read --allow-write --unstable --allow-plugin --allow-env example/server/server.tsx
