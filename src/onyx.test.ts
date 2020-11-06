import { superoak, describe, it, expect } from '../test_deps.ts';
import { app } from '../example/server/server.tsx';
import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import SessionStrategy from './strategies/session-strategy.ts';
import { assertEquals, assertArrayIncludes } from "https://deno.land/std@0.76.0/testing/asserts.ts";
import Onyx from './onyx.ts';

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


Deno.test("Onyx constructor check", () => {
  const onyx = new Onyx();

//  let strategiesValue = onyx._strategies;
 // unreachable(onyx._strategies);
 // ************to access Private -- you can utilize brackets
  assertEquals(onyx['_strategies'], {});
  assertEquals(onyx['funcs'], {});
})