// Standard Library Dependencies
export { join, dirname } from 'https://deno.land/std@0.74.0/path/mod.ts';
export * as log from 'https://deno.land/std@0.74.0/log/mod.ts';

// Third Party Dependencies

// onyx
export { default as onyx } from 'https://raw.githubusercontent.com/oslabs-beta/onyx/main/mod.ts';
export { default as LocalStrategy } from 'https://raw.githubusercontent.com/oslabs-beta/onyx/main/src/strategies/local-strategy/local-strategy.ts';

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
export { Session } from 'https://deno.land/x/session@1.1.0/mod.ts';

// react
export { default as React } from 'https://dev.jspm.io/react@16.14.0';
export { default as ReactDOMServer } from 'https://dev.jspm.io/react-dom@16.14.0/server';
