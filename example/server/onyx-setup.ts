import onyx from '../../mod.ts';
import LocalStrategy from '../../src/strategies/local-strategy.ts';
import User from './models/userModels.ts';
import userController from './controllers/authController.ts';

export default () => {
  console.log('onyx-setup has been invoked');
  onyx.serializeUser(async function (user: any, cb: Function) {
    // developer will specify the user id in the user object  //user  //user.id
    // CHANGE - 6th await
    await cb(null, user._id.$oid);
  });

  onyx.deserializeUser(async function (id: string, cb: Function) {
    console.log('cb of onyx.deserializUser in onyx-setup');
    const _id = { $oid: id };

    try {
      const user = await User.findOne({ _id });
      if (!user) {
        throw new Error('not in db');
      } else {
        console.log('in deserialization, with found user', user);
        await cb(null, user);
      }
    } catch (error) {
      await cb(error);
    }
  });

  onyx.use(new LocalStrategy(userController.verifyUser));
};
