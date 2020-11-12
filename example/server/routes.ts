import { Router } from '../deps.ts';
import { onyx } from '../deps.ts';
import User from './models/userModels.ts';

const router = new Router();

// 11.10 *todo* separate session-strategy? consolidate all the options?
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
        message: user,
      };
    }
  });

  // option 2: invoke onyx.authenticate - see login route for reference
});

router.post('/login', async (ctx) => {
  await (await onyx.authenticate('local'))(ctx);

  if (await ctx.state.isAuthenticated()) {
    const user = await ctx.state.getUser();
    console.log('userObj from getUser is', user);

    ctx.response.body = {
      success: true,
      message: user,
    };
  } else {
    const message = ctx.state.onyx.errorMessage || 'login unsuccessful';
    ctx.response.body = {
      success: false,
      message,
    };
  }
});

router.get('/logout', async (ctx) => {
  await ctx.state.logOut(ctx);
  console.log('in logout!');
  ctx.response.body = {
    success: true,
    isAuth: false,
  };
});

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
    console.log('session not found, proceed to login');
    ctx.response.body = {
      success: true,
      isAuth: false,
    };
  }
});
export default router;
