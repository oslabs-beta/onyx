// Line 2 imports Oak functionality
import { Application, send, join, log } from '../deps.ts'
import router from './routes.ts'
import { config } from '../deps.ts'
import App from '../views/App.tsx'
import { React, ReactDOMServer } from '../deps.ts'

const port = Deno.env.get("PORT") || 3000;
const app = new Application();

const browserBundlePath = "/browser.js";

const js =
  `import React from "https://dev.jspm.io/react@16.14.0";
  \nimport ReactDOM from "https://dev.jspm.io/react-dom@16.14.0";
  \nReactDOM.hydrate(React.createElement(${App}), document.getElementById("root"));`;
  // hydration is found in referenced Miro article - but further reading is encouraged within the React docs

const html =
  `<html><head><script type="module" src="${browserBundlePath}"></script><style>* { font-family: Helvetica; }</style></head><body><div id="root">${(ReactDOMServer as any).renderToString(<App />)}</div></body></html>`;

app.use((ctx) => {
  const filePath = ctx.request.url.pathname;
  if (filePath === '/') {
    ctx.response.type = `text/html`;
    ctx.response.body = html;
  } else if (filePath === browserBundlePath) {
    ctx.response.type = 'application/javascript';
    ctx.response.body = js;
  }
});

// router
app.use(router.routes());
app.use(router.allowedMethods());

// handle requests for static files
// app.use(async (ctx) => {
//   const filePath = ctx.request.url.pathname;
//   if (filePath === '/') {
//     await send(ctx, filePath, {
//       root: Deno.cwd(),
//       index: 'views/index.html',
//     });
//   } else {
//     await send(ctx, filePath, {
//       root: join(Deno.cwd(), 'views/assets'),
//     });
//   }
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

console.log(`Server is up and running on ${port}`);
log.info(`Server is up and running on ${port}`); 
await app.listen({ port: +port });

// use this command to run server
// deno run --allow-net --allow-read --allow-write --unstable --allow-plugin --allow-env server/server.ts




/* from https://dev.to/craigmorten/writing-a-react-ssr-app-in-deno-2m7 
import {
  opine,
  React,
  ReactDOMServer,
} from "./deps.ts";

import App from "./app.tsx";

const app = opine();
*/

/*
const js =
  `import React from "https://dev.jspm.io/react@16.14.0";
  \nimport ReactDOM from "https://dev.jspm.io/react-dom@16.14.0";
  \nconst App = ${App};
  \nReactDOM.hydrate(React.createElement(App), document.body);`;

const html =
  `<html><head><script type="module" src="${browserBundlePath}"></script><style>* { font-family: Helvetica; }</style></head><body>${
    (ReactDOMServer as any).renderToString(<App />)
  }</body></html>`;

// after browser receives the html, it'll see the <script src='browserBundlePath'> 
  and send request for that which is the js! so "/browser.js" is just the path name we're listening for on the server side
// js is the two imports and the App with HYDRATION!


app.use(browserBundlePath, (req, res, next) => {
  res.type("application/javascript").send(js);
});

app.use("/", (req, res, next) => {
  res.type("text/html").send(html);
});

app.listen({ port: 3000 });

console.log("React SSR App listening on port 3000");

*/