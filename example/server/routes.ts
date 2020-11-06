import { Router } from '../deps.ts';
import userController from './controllers/authController.ts';
import sessionController from './controllers/sessionController.ts';
// import users from './models/userModels.ts'

const router = new Router();

router.get('/login', (ctx) => {
  ctx.response.body = {
    success: false,
    message: 'temporary failure redirect',
  };
  console.log('in route.get login');
});

router.get('/logout', async (ctx) => {
  // console.log('whats in context?', ctx);
  await ctx.state.logOut(ctx);
  // ctx.response.redirect('/');
  console.log('in logout!');
  ctx.response.body = {
    success: true,
  };
});

// router.post('/login', async (ctx) => {
//   // onyx.authenticate returns function and immediately invoking func
//   await onyx.authenticate('local', { message: 'hi' }, (ctx: any) => {
//     console.log('usually for error handling');
//   })(ctx, onyx); /// passing in onyx

//   // check the result of authentication here and create the ctx.response body

//   if (!ctx.state.onyx.errorMessage) {
//     console.log('in good login response', ctx.state.onyx.errorMessage);
//     const user = ctx.state.onyx.user;
//     console.log(ctx.response.body);
//     ctx.response.body = {
//       success: true,
//       message: user,
//     };
//   } else {
//     const message = ctx.state.onyx.errorMessage || 'login unsuccessful';
//     ctx.response.body = {
//       success: false,
//       message,
//     };
//   }
// });

//   userController.verifyUser,
//   sessionController.startSession
// );

// passport.use(new LocalStrategy(
// (username, password, done) => {
//    if(username === 'test@gmail.com' && password === '1234') {
//        return done(null, {username: 'test@gmail.com'});
//    } else {
//        return done(null, false);
//    }
// }
// ));

router.post(
  '/register',
  userController.createUser,
  sessionController.startSession
);

// router.get('/protected', sessionController.checkSession);

// this works too, more in the callback style of express
// router.post('/login', async(ctx) {
//     console.log('in post login, before awaiting userController')
//     await userController.createUser(ctx);
//     console.log('in post login, after waiting for userController')
// })

export default router;
