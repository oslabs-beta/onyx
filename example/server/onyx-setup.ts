import { log } from '../deps.ts';
import onyx from '../../mod.ts';
import LocalStrategy from '../../src/strategies/local-strategy.ts';
import User from './models/userModels.ts';
import userController from './controllers/authController.ts';

export default () => {
  log.info('onyx-setup has been invoked');
  console.log('onyx-setup has been invoked');

  // developer will provide the serializer and deserializer functions that will specify the user id property to save in session db and the _id to query the user db for
  onyx.serializeUser(async function (user: any, cb: Function) {
    await cb(null, user._id.$oid);
  });

  onyx.deserializeUser(async function (id: string, cb: Function) {
    console.log('cb of onyx.deserializUser in onyx-setup');
    const _id = { $oid: id };

    try {
      const user = await User.findOne({ _id });
      if (!user) {
        // 11.8 *note* throwing error will break server, maybe we should do cb(null)
        throw new Error('not in db');
      } else {
        console.log('in deserialization, with found user', user);
        await cb(null, user);
      }
    } catch (error) {
      await cb(error);
    }
  });

  // onyx.use(new LocalStrategy(userController.verifyUser));
  onyx.use('any');
};

// saving the LocalStrategy onto onyx._strategies['local'] to be invoked in onyx.authenticate('local')
// onyx.use(
//   new LocalStrategy(userController.verifyUser, {
//     usernameField: 'username',
//     passwordField: 'password',
//   })
// );
// onyx.use(other strategies)
