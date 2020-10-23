
import User from '../models/userModels.ts';

const userController: any = {};

userController.createUser = async (ctx: any, next: any) => {
  console.log('hello! in userController.createUser');
  // const cookies = await ctx.cookies.get('onyx');
  // console.log('cookies?', cookies);
  if(ctx.request.hasBody) {
    const body = await ctx.request.body();
    const { username, password } = await body.value;
    // ctx.cookies.set('onyx', 'cookie');
    const _id = await User.insertOne({username, password})
    console.log('id from database is', _id)
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
}

userController.verifyUser = async (ctx: any, next: any) => {
  if (ctx.request.hasBody) {
    const body = await ctx.request.body();
    const { username, password } = await body.value;
    const user = await User.findOne({ username });
    if (user && password === user.password) {
      // password match - success && user exists
      const id = user._id;
      ctx.response.body = {
        success: true,
        message: 'Successfully logged in!',
        id,
      }
      await next();
    } else if (user) {
      // password mismatch - failure
      ctx.response.body = {
        success: false,
        message: 'Password incorrect, dummy!',
      }
    } else {
      ctx.response.body = {
        // username mismatch - failure
        success: false,
        message: 'no such user found',
      }
    }
  } else {
    // user didn't input anything
    ctx.response.body = {
      success: false,
      message: 'did you send anything in the body?'
    }
  }
}

export default userController;

// const getProduct = ({ params, response }: { params: { id: string }, response: any }) => {
//   //iterate through the products array and check if the current object has an id that matches the destructured id
//   const product: Product | undefined = products.find(p => p.id === params.id)

//   if (product) {
//     response.status = 200
//     response.body = {
//       success: true,
//       data: product
//     }
//   } else {
//     response.status = 404
//     response.body = {
//       success: false,
//       msg: 'No product found'
//     }
//   }
// }