// this will be the starting file for user to use our middleware
// export everything important here

// we want a init() that when called, will create a onyx property on ctx (ctx.state.onyx?)

// TEST-test (A test of a test) mod.ts
export async function handler(req: object) {
  return { statusCode: 200, body: JSON.stringify({ ok: true })};
}