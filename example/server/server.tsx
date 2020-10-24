// Line 2 imports Oak functionality
import { Application, send, join, log } from '../../deps.ts';
import { Session, SessionData } from '../../deps.ts';
import { React, ReactDOMServer } from '../../deps.ts';
import router from './routes.ts';
import App from '../views/App.tsx';
import Inputs from '../views/components/Inputs.tsx';
import sessionController from './controllers/sessionController.ts';

const port: number = Number(Deno.env.get('PORT')) || 4000;
const app: Application = new Application();

// session
const session = new Session({ framework: 'oak' });
await session.init();
app.use(
  session.use()(session, {
    path: '/w35235',
    httpOnly: false,
    secure: false, // not accessable via JS
    // maxAge: 6000, //
  })
); // seems to be setting the sid cookie no matter what

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
  const user_id = await ctx.state.session.get(sidCookie);
  console.log(`${filePath}: ${sidCookie} with ${user_id}`);
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
