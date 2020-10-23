const sessionController: any = {};

// is the user logged in already
sessionController.checkSession = async (ctx: any, next: any) => {
  console.log('hello from checkSession!  session db not set up yet :(');
  const sid = await ctx.cookies.get('sid');
  console.log(sid);
  // find cookie
  // check if cookie is in session
  // // yes --> entend session --> go to deserialize to grab user-info --> direct user to PROTECTED route
  // // no --> direct user to LOGIN/REGISTER route
};

// log in the user
sessionController.startSession = async (ctx: any, next: any) => {
  // take the user's cookie and add to session database
};

// log out the user
sessionController.endSession = async (ctx: any, next: any) => {
  // take the user's cookie and delete entry in session database
};

export default sessionController;
