// Line 2 imports Oak functionality
import { Application, send, join, log } from '../../deps.ts';
import router from './routes.ts';
import { config } from '../../deps.ts';
import App from '../views/App.tsx';
import Inputs from '../views/components/Inputs.tsx';
import { React, ReactDOMServer } from '../../deps.ts';

const port: number = Number(Deno.env.get('PORT')) || 4000;
const app: Application = new Application();

const browserBundlePath: string = '/browser.js';

// needed to send the browser the Inputs as well otherwise html part will show everything but as soon as js part is received browser will complain "Uncaught ReferenceError: Component is not defined"
const js: string = `import React from "https://dev.jspm.io/react@16.14.0";
  \nimport ReactDOM from "https://dev.jspm.io/react-dom@16.14.0";
  \nconst Inputs = ${Inputs};
  \nReactDOM.hydrate(React.createElement(${App}), document.getElementById("root"));`;
// hydration is found in referenced Miro article - but further reading is encouraged within the React docs

// (ReactDom as any).hydrate(
//   <App />,
//   // @ts-ignore  //ts not happy about document
//   document.getElementById('root')
// );

// router
app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
  const filePath = ctx.request.url.pathname;
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
