import { Router } from '../deps.ts';
import userController from './controllers/authController.ts';
import sessionController from './controllers/sessionController.ts';
// import users from './models/userModels.ts'
import User from './models/userModels.ts';
import onyx from '../../mod.ts';

const router = new Router();

// 11.10 *todo* separate session-strategy? consolidate all the options?

// 11.10 *note* register -> login works!
router.post('/register', async (ctx) => {
  if (ctx.request.hasBody) {
    const body = await ctx.request.body();
    const { username, password } = await body.value;
    const _id = await User.insertOne({ username, password });
    console.log('id from database is', _id);
    const user = { username, _id };

    // 11.8 *note* need to invoke login with args
    await ctx.state.logIn(ctx, user, onyx, async (err: any) => {
      if (err) return ctx.throw(err);
      else {
        ctx.response.body = {
          success: true,
          message: user,
        };
      }
    });
  } else {
    ctx.response.body = {
      success: true,
      message: 'need input, body is empty',
    };
  }
});

// Passport  req.login(user, options?, function)
// req.login(user, function(err) {
//   if (err) { return next(err); }
//   return res.redirect('/users/' + req.user.username);
// });

router.get('/login', async (ctx) => {
  ctx.response.body = {
    success: false,
    message: 'temporary failure redirect',
  };
  console.log('in route.get login');
});

router.get('/logout', async (ctx) => {
  await ctx.state.logOut(ctx);
  console.log('in logout!');
  ctx.response.body = {
    success: true,
    isAuth: false,
  };
});

router.post('/login', async (ctx, next) => {
  await (await onyx.authenticate('local'))(ctx);

  console.log('in callback func of /login');
  if (await ctx.state.isAuthenticated()) {
    console.log('in good login response');
    const user = ctx.state.onyx.user;
    ctx.response.body = {
      success: true,
      message: user,
    };
  } else {
    console.log('in bad login response');
    const message = ctx.state.onyx.errorMessage || 'login unsuccessful';
    ctx.response.body = {
      success: false,
      message,
    };
  }
});

// router.get('/protected', sessionController.checkSession);

export default router;
