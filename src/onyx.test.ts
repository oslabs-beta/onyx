import { superoak, describe, it, expect } from '../test_deps.ts';
import { app } from '../example/server/server.tsx';
import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import SessionStrategy from './strategies/session-strategy.ts';
import LocalStrategy from './strategies/local-strategy.ts'
import { assertEquals, assertArrayIncludes } from "https://deno.land/std@0.76.0/testing/asserts.ts";
import Onyx from './onyx.ts';
import userController from '../example/server/controllers/authController.ts';

// // Simple name and function, compact form, but not configurable
// Deno.test("hello world #1", () => {
//   const x = 1 + 2;
//   assertEquals(x, 3);
// });

// // Fully fledged test definition, longer form, but configurable (see below)
// Deno.test({
//   name: "hello world #2",
//   fn: () => {
//     const x = 1 + 2;
//     assertEquals(x, 3);
//   },
// });

// // Basic Deno Test-test
// Deno.test("hello world", () => {
//   const x = 1 + 2;
//   assertEquals(x, 3);
//   assertArrayIncludes([1, 2, 3, 4, 5, 6], [3], "Expected 3 to be in the array");
// });


// ****** Uncomment below 

// Deno.test("Onyx constructor check", () => {
//   const onyx = new Onyx();
// //  console.log(onyx.init);
//   console.log(onyx['_sm']);
//   console.log(onyx);
//   console.log(SessionManager);
// //  let newSessionManager = new SessionManager(this.serializeUser.bind(this))
//   console.log("What's good George?");
// //  let strategiesValue = onyx._strategies;
//  // unreachable(onyx._strategies);
//  // ************to access Private -- you can utilize brackets
//   assertEquals(onyx['_strategies'], {});
//   assertEquals(onyx['funcs'], {});
//   assertEquals(onyx['_sm'].logIn.constructor.name, "AsyncFunction");
//   assertEquals(onyx['_sm'].logOut.constructor.name, "AsyncFunction");
//   // assertEquals(onyx['_strategies'], newSessionManager);
// })

// // for testing purposes
// // replace below userController.verifyUser using a different custom Function
// // bring in the 
// Deno.test("*********Onyx methods check", () => {
//   const onyx = new Onyx();
//   const dummyTest = () => {
//     console.log('hi');
//   }
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

// ****** Uncomment above
