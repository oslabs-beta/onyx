import { Router } from '../deps.ts';
import App from '../views/App.tsx';
import userController from './controllers/authController.ts';
import sessionController from './controllers/sessionController.ts';
// import users from './models/userModels.ts'

const router = new Router();

router.get('/login', (ctx) => {
  ctx.response.body = 'do a post request';
  console.log('in login!');
});

router.get('/logout', async (ctx) => {
  // console.log('whats in context?', ctx);
  await ctx.state.logOut(ctx);
  // ctx.logOut();
  // ctx.logout()
  // ctx.logIn()

  console.log('in logout!');
  ctx.response.redirect('/');
});

// router.post('/login', (ctx) => {
//   ctx.state.onyx.authenticate('local', { message: 'hi' }, (ctx: any) => {
//     console.log(ctx);
//   });
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
