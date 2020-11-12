import { Router } from '../deps.ts';
import { onyx } from '../deps.ts';
import User from './models/userModels.ts';

const router = new Router();

router.post('/register', async (ctx) => {
  const body = await ctx.request.body();
  const { username, password } = await body.value;
  const _id = await User.insertOne({ username, password });

  // option 1: construct a user object and invoke ctx.state.logIn
  const user = { username, _id };

  await ctx.state.logIn(ctx, user, async (err: any) => {
    if (err) return ctx.throw(err);
    else {
      ctx.response.body = {
        success: true,
        username,
        isAuth: true,
      };
    }
  });

  // option 2: invoke onyx.authenticate - see login route for reference
});

// invoke onyx.authenticate with the name of the strategy, invoke the result with context
router.post('/login', async (ctx) => {
  await (await onyx.authenticate('local'))(ctx);

  if (await ctx.state.isAuthenticated()) {
    const { username } = await ctx.state.getUser();
    ctx.response.body = {
      success: true,
      username,
      isAuth: true,
    };
  } else {
    const message = ctx.state.onyx.errorMessage || 'login unsuccessful';
    ctx.response.body = {
      success: false,
      message,
      isAuth: false,
    };
  }
});

// invoke ctx.state.logOut in the logout path
router.get('/logout', async (ctx) => {
  await ctx.state.logOut(ctx);
  ctx.response.body = {
    success: true,
    isAuth: false,
  };
});

// isAuthenticated will return true if user if Authenticated
router.get('/protected', async (ctx) => {
  if (await ctx.state.isAuthenticated()) {
    const user = await ctx.state.getUser();
    const { username } = user;
    ctx.response.body = {
      success: true,
      isAuth: true,
      username,
    };
  } else {
    ctx.response.body = {
      success: true,
      isAuth: false,
    };
  }
});
export default router;
