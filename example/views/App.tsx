import { React } from '../deps.ts';
import MainContainer from './components/MainContainer.tsx';
import NavBar from './components/NavBar.tsx';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      button: any;
      img: any;
      input: any;
      div: any;
      h1: any;
      h3: any;
      p: any;
    }
  }
}

const App = () => {
  const [page, setPage] = (React as any).useState('home');

  return (
    <div className="app">
      <NavBar setPage={setPage} />
      <MainContainer page={page} />
    </div>
  );
};

export default App;
