import { React, ReactDOMServer } from '../deps.ts';
import App from '../views/App.tsx';
import Inputs from '../views/components/Inputs.tsx';
import Message from '../views/components/Message.tsx';
import Home from '../views/components/Home.tsx';
import MainContainer from '../views/components/MainContainer.tsx';
import NavBar from '../views/components/NavBar.tsx';
import Protected from '../views/components/Protected.tsx';

const browserBundlePath: string = '/browser.js';

const html: string = `<html><head><script type="module" src="${browserBundlePath}"></script><link rel="stylesheet" href="style.css" type="text/css"><style>* { font-family: Helvetica; }</style></head><body><div id="root">${(ReactDOMServer as any).renderToString(
  <App />
)}</div></body></html>`;

// needed to send the browser the Inputs as well otherwise html part will show everything but as soon as js part is received browser will complain "Uncaught ReferenceError: Component is not defined"
const js: string = `import React from "https://dev.jspm.io/react@16.14.0";
  \nimport ReactDOM from "https://dev.jspm.io/react-dom@16.14.0";
  \nconst Message = ${Message};
  \nconst Inputs = ${Inputs};
  \nconst Protected = ${Protected};
  \nconst Home = ${Home};
  \nconst NavBar = ${NavBar};
  \nconst MainContainer = ${MainContainer};
  \nReactDOM.hydrate(React.createElement(${App}), document.getElementById("root"));`;

export { browserBundlePath, html, js };
