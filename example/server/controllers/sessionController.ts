const sessionController: any = {};

// is the user logged in already
sessionController.checkSession = async (ctx: any, next: any) => {
  // check if there user_id is stored in the session object for the current user
  const userIDVal = await ctx.state.session.get('userIDKey');
  console.log('user id from session', userIDVal);
  // consider storing the isLoggedIn info in ctx.state or something instead of in the ctx.response.body since we want to redirect user in our middleware
  if (userIDVal) {
    ctx.response.body.id = userIDVal;
    // grab more user info from MongoDb?
    ctx.redirect('/success'); // redirect to successful login page
  } else {
    // no userIDVal found
    ctx.redirect('/'); // redirect to login page
  }
};

// add session entry for user
sessionController.startSession = async (ctx: any, next: any) => {
  // in session-mod.ts, first argument is sessionVariableKey, second argument is sessionVariableValue
  await ctx.state.session.set('userIDKey', ctx.response.body.id);
  // console.log('ctx.state.session after log in', ctx.state.session);
  console.log(
    'ctx.state.session after log in',
    ctx.state.session._session._store
  );
};

// log out the user
sessionController.endSession = async (ctx: any, next: any) => {
  const sidCookie = await ctx.cookies.get('sid');

  // if using Redis for Session Store
  if (ctx.state.session._session._store._sessionRedisStore) {
    await ctx.state.session._session._store._sessionRedisStore.del(sidCookie);
  }
  // else if using Session Memory for Session Store
  else ctx.state.session._session._store.deleteSession(sidCookie);
  // delete ctx.state.session._session._store._sessionMemoryStore[sidCookie];

  // need to add in at the frontend a way log out and we will use this endSession
  console.log('ctx.state.session after log out', ctx.state.session);
};

export default sessionController;
