import { Router } from '../deps.ts';
import userController from './controllers/authController.ts';
import sessionController from './controllers/sessionController.ts';
// import users from './models/userModels.ts'
import onyx from '../../mod.ts';

const router = new Router();

// console.log('onyx in routes is', onyx);
router.post('/register', userController.createUser, async (ctx) => {
  await ctx.state.login();
});

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

  // await (
  //   await onyx.authenticate(
  //     'local',
  //     {},
  //     async (err: any, user: any, info: any, status: string) => {
  //       if (err) {
  //       }
  //       if (!user) {
  //         const message = ctx.state.onyx.errorMessage || 'login unsuccessful';
  //         ctx.response.body = {
  //           success: false,
  //           message,
  //         };
  //       }
  //       // now have access to user object from userDB, info (success message, failure message), status
  //       else {
  //         ctx.response.body = {
  //           sucess: true,
  //           isAuth: true,
  //           message: user,
  //         };
  //       }
  //     }
  //   )
  // )(ctx);

  // EXAMPLE FROM PASSPORT
  /*     router.get('/login', async(ctx, next) {
   *       onyx.authenticate('local', function(err, user, info, status) {
   *         if (err) { return next(err) }
   *         if (!user) { return res.redirect('/signin') }
   *          user.name user--
   *         res.redirect('/account');
   *       })(req, res, next);
   *        //
   *     }, );
   */

  console.log('in callback func of /login');
  if (!ctx.state.onyx.errorMessage) {
    console.log('in good login response', ctx.state.onyx.errorMessage);
    const user = ctx.state.onyx.user;
    console.log(ctx.response.body);
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

// router.get('/protected', sessionController.checkSession);

console.log('in routes.ts');
export default router;
