import { v4 } from '../../../deps.ts';

const cookiesController: any = {};

// add sid cookie to the ctx
cookiesController.setCookies = async (ctx: any, next: any) => {
  // generate a random string using v4, set it as sid
  const sid = v4.generate();
  // check to make sure sid doesn't exist in session db
  console.log(sid);
  // ctx.cookies.set('sid', sid, {
  //   httpOnly: true,
  //   maxAge: 6000,
  //   path: '/',
  //   // secure: true, // cannot send secure cookie over unencrypted connection
  // });
};

export default cookiesController;
