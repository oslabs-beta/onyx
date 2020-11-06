// mod.test.ts
import { handler } from "./mod.ts";

Deno.test("Checking if the exported 'handler' module has been exported succesfully, or is missing", () => {
  if (!handler) {
    throw Error("missing module");
  }
});