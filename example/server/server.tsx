import { Application, send, join, log } from '../deps.ts';
import { Session } from '../deps.ts';

// Server Middlewares
import onyx from '../../mod.ts';
import onyxSetup from './onyx-setup.ts';
import router from './routes.ts';
await onyxSetup();
log.info('hi')
// SSR
import { html, browserBundlePath, js } from './ssrConstants.tsx';

const port: number = Number(Deno.env.get('PORT')) || 4000;
const app: Application = new Application();

// session for Server Memory
const session = new Session({ framework: 'oak' });

// session from Redis Memory
// const session = new Session({
//   framework: 'oak',
//   store: 'redis',
//   hostname: '127.0.0.1',
//   port: 6379,
// });

// Initialize Session
await session.init();

// Error Notification
app.addEventListener('error', (event) => {
  log.error(JSON.stringify(event.error));
});

// Error Handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.response.body = {
      success: false,
      message: 'Internal server error',
    };
    throw error;
  }
});

// Track response time in headers of responses
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get('X-Response-Time');
  console.log(`${ctx.request.method} ${ctx.request.url} - Response Time = ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set('X-Response-Time', `${ms}ms`);
});

// Creates the ctx.state.session property & generate SID and set cookies
// session.use returns an async function and also has await next()
app.use(session.use()(session));
// session code has bug where it's not taking the 2nd argument as cookie config options

// onyx.initialize(onyx) returnes a async function 
app.use(onyx.initialize());

// router
app.use(async (ctx, next) => {
  log.info('incoming request before router, line 83');
  await next();
  log.info('return response, line 85');
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx, next) => {
  log.info('incoming request after router, line 92');
  await next();
});

app.use(async (ctx, next) => {
//  console.log('***************************************',ctx);
  const filePath = ctx.request.url.pathname;
  const method = ctx.request.method;

  const sidCookie = await ctx.cookies.get('sid');
  const user_id = await ctx.state.session.get('userIDKey');
  console.log(`${filePath}: ${sidCookie} with ${user_id}`);

  if (filePath === '/') {
    ctx.response.type = `text/html`;
    ctx.response.body = html;
  } else if (filePath === browserBundlePath) {
    ctx.response.type = 'application/javascript';
    ctx.response.body = js;
  } else if (filePath === '/style.css') {
    ctx.response.type = 'text/css';
    await send(ctx, filePath, {
      root: join(Deno.cwd(), 'example/views/assets'),
    });
  } else if (method === 'GET' && filePath === '/protected') {
    if(!ctx.state.onyx.session) {
      log.warning('Hmm...It appears that your session is UNDEFINED');
    } 
    if (ctx.state.onyx.session !== undefined) {
      log.warning(ctx.state.onyx.session);
    }
//    log.warning(ctx.state.onyx.session);
    if (ctx.state.onyx.session?.user) {
      log.info('session found, proceed to protected');
      const { username } = ctx.state.onyx.session.user;
      ctx.response.body = {
        success: true,
        isAuth: true,
        username,
      };
    } else {
      log.info('session not found, proceed to login');
      ctx.response.body = {
        success: true,
        isAuth: false,
      };
    }
  }
  // else await next();
});

// Error handler missing path?
// coming into here will break the server
// app.use(async (ctx) => {
//   // Will throw a 500 on every request.  ??????
//   log.error('finally in error handler of the end');
//   ctx.throw(500);
// });

// import.meta.main determines if the server was opened directly (i.e. through 'deno run' or 'denon start')
// rather than through testing
if (import.meta.main) {
  log.info(`Server is up and running on ${port}`);
  await app.listen({ port });
}

export { app, onyx };
// use this command to run example server
// deno run --allow-net --allow-read --allow-write --unstable --allow-plugin --allow-env example/server/server.tsx
