import User from '../models/userModels.ts';

const userController: any = {};

userController.createUser = async (ctx: any, next: any) => {
  console.log('hello! in userController.createUser');
  // const cookies = await ctx.cookies.get('onyx');
  // console.log('cookies?', cookies);
  const body = await ctx.request.body();
  if(ctx.request.hasBody) {
    const { username, password } = await body.value;
    // ctx.cookies.set('onyx', 'cookie');
    const _id = await User.insertOne({username, password})
    console.log('id from database is', _id)
    ctx.response.body = {
      id: `id is ${_id}`,
      message: `username is ${username}, password is ${password}`
    }
  } else {
    ctx.response.body = {
      message: 'need input, body is empty'
    }
  }
  // await next();
  // ctx.response.body = {...ctx.response.body,
  //   message3: 'hello from createUser again'
  // }
}

userController.verifyUser = async(ctx: any) => {
//   const user = await User.find();
//   ctx.response.body = user;
  console.log('hello from verify user')
  ctx.response.body = {...ctx.response.body,
  message2: 'in verify user'};
}

export default userController;
