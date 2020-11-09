import User from '../models/userModels.ts';

const userController: any = {};

userController.createUser = async (ctx: any, next: any) => {
  console.log('hello! in userController.createUser');
  if (ctx.request.hasBody) {
    const body = await ctx.request.body();
    const { username, password } = await body.value;
    const _id = await User.insertOne({ username, password });
    console.log('id from database is', _id);
    ctx.response.body = {
      id: `id is ${_id}`,
      message: `username is ${username}`,
    };
  } else {
    ctx.response.body = {
      success: true,
      message: 'need input, body is empty',
    };
  }
  await next();
};

userController.verifyUser = async (context: any, done: Function) => {
  const { username, password } = context.state.onyx.user;

  try {
    const user = await User.findOne({ username });
    console.log('searching for', username, password, 'in verifyUser');
    console.log('after database, user is', user);
    if (user && password === user.password) {
      console.log('password matched');
      // CHANGE - 5TH await --- TESTED - it's necessary
      await done(null, user);

      // return done(null, user);
    } else {
      await done(null);
    }
  } catch (error) {
    await done(error);
  }
};

export default userController;
