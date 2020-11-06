import User from '../models/userModels.ts';

const userController: any = {};

userController.createUser = async (ctx: any, next: any) => {
  console.log('hello! in userController.createUser');
  // const cookies = await ctx.cookies.get('onyx');
  // console.log('cookies?', cookies);
  if(ctx.request.hasBody) {
    const body = await ctx.request.body();
    const { username, password } = await body.value;
    const _id = await User.insertOne({ username, password });
    console.log('id from database is', _id);
    ctx.response.body = {
      id: `id is ${_id}`,
      message: `username is ${username}, password is ${password}`,
    }
  } else {
    ctx.response.body = {
      success: true,
      message: 'need input, body is empty'
    }
  }
  // await next();
  // ctx.response.body = {...ctx.response.body,
  //   message3: 'hello from createUser again'
  // }
};

// userController.verifyUser = async (ctx: any, next: any) => {
userController.verifyUser = async (
  // username: string,
  // password: string,
  context: any,
  done: Function
) => {
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
      console.log('in else');
      await done(null);
    }
  } catch (error) {
    console.log('catch error of db');
    await done(error);
  }
  //   if (user && password === user.password) {
  //     // start session here
  //     // if (await req)

  //     // password match - success && user exists
  //     const id = user._id.$oid;
  //     ctx.response.body = {
  //       success: true,
  //       message: 'Successfully logged in!',
  //       id,
  //     };
  //     await next();
  //   } else if (user) {
  //     // password mismatch - failure
  //     ctx.response.body = {
  //       success: false,
  //       message: 'Password incorrect, dummy!',
  //     };
  //   } else {
  //     ctx.response.body = {
  //       // username mismatch - failure
  //       success: false,
  //       message: 'no such user found',
  //     };
  //   }
  // } else {
  //   // user didn't input anything
  //   ctx.response.body = {
  //     success: false,
  //     message: 'did you send anything in the body?',
  //   };
  // }
};

export default userController;
