import { superoak, describe, it, expect } from '../test_deps.ts';
import { app } from '../example/server/server.tsx';
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { Session } from 'https://deno.land/x/session/mod.ts';
import { SessionData } from 'https://deno.land/x/session/mod.ts';
import SessionManager from './sessionManager.ts';
import Strategy from './strategy.ts';
import SessionStrategy from './strategies/session-strategy.ts';
import LocalStrategy from './strategies/local-strategy/local-strategy.ts';
import {
  assertEquals,
  assertArrayIncludes,
} from 'https://deno.land/std@0.76.0/testing/asserts.ts';
import Onyx from './onyx.ts';
import userController from '../example/server/controllers/authController.ts';

Deno.test('*********Should support SuperOak & a new Session', async () => {
  const request = await superoak(app);
  await request
    .get('/')
    .expect(
      '<html><head><script type="module" src="/browser.js"></script><link rel="stylesheet" href="style.css" type="text/css"><style>* { font-family: Helvetica; }</style></head><body><div id="root"><div class="app" data-reactroot=""><div class="navBar"><button class="navBtn"><h3 class="navBtnText">Home</h3></button><button class="navBtn"><h3 class="navBtnText">Protected</h3></button></div><div class="page"><div class="home"><h1>Home</h1></div></div></div></div></body></html>'
    );
});
