const sessionController: any = {};

// is the user logged in already
sessionController.checkSession = async (ctx: any, next: any) => {
  console.log('hello from checkSession!  session db not set up yet :(');
  // find cookie
  const sidCookie = await ctx.cookies.get('sid');
  const user_id = await ctx.state.session.get(sidCookie);

  // check if cookie is in session
  // // yes --> entend sessiondb --> go to deserialize to grab user-info --> direct user to PROTECTED route
  // // no --> direct user to LOGIN/REGISTER route
};

// add session entry for user
sessionController.startSession = async (ctx: any, next: any) => {
  const sidCookie = await ctx.cookies.get('sid');

  await ctx.state.session.set(sidCookie, 'mongoDB_id.$id'); // adding sid-cookie to sessionDB as key, and the user's mongoDB users_id.$id as value
  // take the user's cookie and add to session database
};

// log out the user
sessionController.endSession = async (ctx: any, next: any) => {
  // take the user's cookie and delete entry in session database
};

export default sessionController;
