const cookieController: any = {};

cookieController.setCookie = async (ctx: any) => {
  // use a random 
  const id: string = await ctx.response.body.id.$oid;
  ctx.cookies.set('userID', id, { httpOnly: true });
}

export default cookieController;