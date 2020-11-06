// assertions.test.ts
import { assert, equal } from "https://deno.land/std/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.76.0/async/delay.ts";

Deno.test('the whole truth', () => {
  assert(1 === 1)
})
Deno.test('and nothing but the truth', () => {
  equal(1, 1)
})

Deno.test("async 1+2 = 3 test", async () => {
  const x = 1 + 2;

  // await some async task
  await delay(100);

  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});