import onyx from '../../mod.ts';
import LocalStrategy from '../../src/strategies/local-strategy/local-strategy.ts';
import User from './models/userModels.ts';
import userController from './controllers/authController.ts';

console.log('in onyx-setup');

// user needs to provide the serializer function that will specify what to store in the session db - typically just the user id
onyx.serializeUser(async function (user: any, cb: Function) {
  await cb(null, user._id.$oid);
});

// user needs to provide the deserializer function that will receive what was stored in the session db as the first argument to query the user db for the user object
onyx.deserializeUser(async function (id: string, cb: Function) {
  const _id = { $oid: id };
  try {
    const user = await User.findOne({ _id });
    await cb(null, user);
  } catch (error) {
    await cb(error, null);
  }
});

// onyx.use(new LocalStrategy(userController.verifyUser));

onyx.use(
  new LocalStrategy(async (context: any, done: Function) => {
    const { username, password } = context.state.onyx.user;
    try {
      const user = await User.findOne({ username });
      if (user && password === user.password) await done(null, user);
      else await done(null);
    } catch (error) {
      await done(error);
    }
  })
);
