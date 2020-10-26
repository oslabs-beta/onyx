// Line 2 imports Oak functionality
import { Application, send, join, log } from '../../deps.ts';
import { Session } from '../../deps.ts';
import { React, ReactDOMServer } from '../../deps.ts';
import router from './routes.ts';
import App from '../views/App.tsx';
import Inputs from '../views/components/Inputs.tsx';

const port: number = Number(Deno.env.get('PORT')) || 4000;
const app: Application = new Application();

// session
// const session = new Session({ framework: 'oak' });

const session = new Session({
  framework: 'oak',
  store: 'redis',
  hostname: '127.0.0.1',
  port: 6379,
});

await session.init();
app.use(session.use()(session)); // session code has bug where it's not taking the 2nd argument as cookie config options

const browserBundlePath: string = '/browser.js';

// needed to send the browser the Inputs as well otherwise html part will show everything but as soon as js part is received browser will complain "Uncaught ReferenceError: Component is not defined"
const js: string = `import React from "https://dev.jspm.io/react@16.14.0";
  \nimport ReactDOM from "https://dev.jspm.io/react-dom@16.14.0";
  \nconst Inputs = ${Inputs};
  \nReactDOM.hydrate(React.createElement(${App}), document.getElementById("root"));`;
// hydration is found in referenced Miro article - but further reading is encouraged within the React docs

const html: string = `<html><head><script type="module" src="${browserBundlePath}"></script><link rel="stylesheet" href="style.css" type="text/css"><style>* { font-family: Helvetica; }</style></head><body><div id="root">${(ReactDOMServer as any).renderToString(
  <App />
)}</div></body></html>`;

// router
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
  const sidCookie = await ctx.cookies.get('sid');
  const user_id = await ctx.state.session.get(sidCookie); // this is returning undefined even after log in with redis

  const user_id2 = await ctx.state.session._session._store._sessionRedisStore.get(
    sidCookie
  ); // this is returning an object with key 'userIDKey'
  const user_id3 = JSON.parse(user_id2).userIDKey;

  const user_id4 = JSON.parse(
    await ctx.state.session._session._store._sessionRedisStore.get(sidCookie)
  ).userIDKey;

  const user_id5 = await ctx.state.session.get('userIDKey');
  console.log(
    `${filePath}: ${sidCookie} with ${user_id} or ${user_id2} or ${user_id3} or ${user_id4} or ${user_id5}`
  );
  // 1e9c7684-0a3b-4bb7-84c5-bf30560916d2 with undefined or {"userIDKey":"5f90c2bf007eea950017b09d"} or 5f90c2bf007eea950017b09d or 5f90c2bf007eea950017b09d or 5f90c2bf007eea950017b09d

  if (filePath === '/') {
    // await sessionController.checkSession(ctx);
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
  }
});

// handle requests for static files
// app.use(async (ctx) => {
//   const filePath = ctx.request.url.pathname;
//   // if (filePath === '/') {
//   //   await send(ctx, filePath, {
//   //     root: Deno.cwd(),
//   //     index: 'views/index.html',
//   //   });
//   // } else {
//   // if (filePath === 'assets/style.css'){
//   //   await send(ctx, filePath, {
//   //     root: join(Deno.cwd(), 'views/assets'),
//   //   });
//   // }
// });

// Error handler for wrong paths
app.addEventListener('error', (evt) => {
  // Will log the thrown error to the console.
  console.log(evt.error);
  log.error(JSON.stringify(evt.error));
});

// Error handler for middleware issues(?)
app.use((ctx) => {
  // Will throw a 500 on every request.
  ctx.throw(500);
});

// import.meta.main determines if the server was opened directly (i.e. through 'deno run' or 'denon start')
// rather than through testing
if (import.meta.main) {
  log.info(`Server is up and running on ${port}`);
  await app.listen({ port });
}

export { app };
// use this command to run server
// deno run --allow-net --allow-read --allow-write --unstable --allow-plugin --allow-env server/server.ts
