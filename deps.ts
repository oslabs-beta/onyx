// Standard Library Dependencies
export { join, dirname } from 'https://deno.land/std@0.74.0/path/mod.ts';
export * as log from 'https://deno.land/std@0.74.0/log/mod.ts';

// for creating sid
export { v4 } from 'https://deno.land/std/uuid/mod.ts';

// Third Party Dependencies

// oak
export {
  Application,
  Router,
  send,
} from 'https://deno.land/x/oak@v6.3.1/mod.ts';

// dotenv
export { config } from 'https://deno.land/x/dotenv/mod.ts';

// mongo
export { MongoClient } from 'https://deno.land/x/mongo@v0.12.1/mod.ts';

// deno session
export { Session, SessionData } from 'https://deno.land/x/session@1.1.0/mod.ts';

// react
export { default as React } from 'https://dev.jspm.io/react@16.14.0';
export { default as ReactDOMServer } from 'https://dev.jspm.io/react-dom@16.14.0/server';

// import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts"  // in case we want bcrypt

