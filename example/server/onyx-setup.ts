import { onyx, LocalStrategy } from '../deps.ts';
import User from './models/userModels.ts';

// Configure the Strategy, constructor takes up to 2 arguments
// 1: optional: options
// 2: required: provide verify function that will receive username, password, and a callback function.  Verify the username/password is correct before invoking the callback function.
onyx.use(
  new LocalStrategy(
    async (username: string, password: string, done: Function) => {
      try {
        const user = await User.findOne({ username });
        if (user && password === user.password) await done(null, user);
        else await done(null);
      } catch (error) {
        await done(error);
      }
    }
  )
);

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
