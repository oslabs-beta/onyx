import { superoak, describe, it, expect } from '../test_deps.ts';
import { app } from '../example/server/server.tsx';
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Session } from "https://deno.land/x/session/mod.ts";
import { SessionData } from "https://deno.land/x/session/mod.ts";
import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import SessionStrategy from './strategies/session-strategy.ts';
import LocalStrategy from './strategies/local-strategy.ts'
import { assertEquals, assertArrayIncludes } from "https://deno.land/std@0.76.0/testing/asserts.ts";
import Onyx from './onyx.ts';
import userController from '../example/server/controllers/authController.ts';

// for testing purposes
// replace below userController.verifyUser using a different custom Function
// bring in the

// const router = new Router();
// router.get("/", (ctx) => {
//   ctx.response.body = "Hello Deno!";
// });

// const app: Application = new Application();
// app.use(router.routes());
// app.use(router.allowedMethods());

//   // Configuring Session for the Oak Framework
// const session = new Session({ framework: "oak" })
// await session.init();

// // Adding Session Middleware. Now every context will include a
// // property called session that you can use the get and set
// // functions on
// app.use(session.use()(session));

//   // Creating a Router and using the session
// //  const router = new Router();

//   console.log(session);
//   console.log(SessionData);
//   console.log(router);

//   router.get("/", async (context) => {
//     console.log(context.state);
//     console.log(context.state.session);
//   })


// app.addEventListener("listen", ({ hostname, port, secure }) => {
//   console.log(
//     `Listening on: ${secure ? "https://" : "http://"}${
//       hostname ?? "localhost"
//     }:${port}`
//   );
// });

//   await app.listen({ port: 8000 });

Deno.test("*********Should support SuperOak & a new Session", async () => {
  const request = await superoak(app);
  await request.get("/").expect('<html><head><script type="module" src="/browser.js"></script><link rel="stylesheet" href="style.css" type="text/css"><style>* { font-family: Helvetica; }</style></head><body><div id="root"><div class="app" data-reactroot=""><div class="navBar"><button class="navBtn"><h3 class="navBtnText">Home</h3></button><button class="navBtn"><h3 class="navBtnText">Protected</h3></button></div><div class="page"><div class="home"><h1>Home</h1></div></div></div></div></body></html>');
  console.log('*******************************');
  console.log("hello george");
});

//   onyx.use(
//     new LocalStrategy(dummyTest, {
//       usernameField: 'username',
//       passwordField: 'password',
//     })
//   );
//   console.log(onyx);
//   assertEquals(onyx['_strategies'].local._usernameField, "username");
//   assertEquals(onyx['_strategies'].local._passwordField, "password");

// })