import { React } from '../deps.ts';
import Inputs from './components/Inputs.tsx';


// Typescript demands that we define the typing for each JSX element,
// so this global interface defines the 'any' typing for whatever elements we may need
declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: any;
      img: any;
      input: any;
      div: any;
      h1: any;
      p: any;
    }
  }
}

const App = () => {
  return (
  <div className="page">
    <div id="formBox">
      <Inputs />
    </div>
  </div>
  );
};

export default App;
