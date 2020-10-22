import { React, ReactDom } from '../deps.ts';
import App from './App.tsx';

// Hydrate the app
(ReactDom as any).hydrate(
  <App />,
  // @ts-ignore  //ts not happy about document
  document.getElementById('root')
);
