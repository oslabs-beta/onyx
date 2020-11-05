import { React } from '../../deps.ts';
import Inputs from './Inputs.tsx';
import Home from './Home.tsx';
import Protected from './Protected.tsx';

const MainContainer: any = (props: any) => {
  const { page, setPage } = props;

  let curPage: any;

  if (page === 'home') curPage = <Home />;
  if (page === 'protected') curPage = <Protected setPage={setPage} />;
  if (page === 'entry')
    curPage = (
      <div id="formBox">
        <Inputs setPage={setPage} />
      </div>
    );

  return <div className="page">{curPage}</div>;
};

export default MainContainer;
