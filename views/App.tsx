import { React } from '../deps.ts';

// Typescript demands that we define the typing for each JSX element, 
// so this global interface defines the 'any' typing for whatever elements we may need
declare global {
    namespace JSX {
      interface IntrinsicElements {
        button: any;
        div: any;
        h1: any;
        p: any;
        h2: any;
      }
    }
  }

const App = () => {
  const [count, setCount] = (React as any).useState(0);
  
   return (
       <>
       <button onClick={() => setCount(count + 1)}>Click the 🦕</button>
       <p>{count}</p>
       <p>Hey!</p>
       </>
   ) 
}

export default App;