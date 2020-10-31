import { React } from '../../deps.ts';
import Inputs from './Inputs.tsx';
import Main from './Main.tsx';
import Protected from './Protected.tsx';

const MainContainer: any = (props: any) => {
  const { page } = props;

  let curPage: any;

  if (page === 'home') curPage = <Main />;
  if (page === 'protected') curPage = <Protected />;
  if (page === 'entry')
    curPage = (
      <div id="formBox">
        <Inputs />
      </div>
    );

  return <div className="page">{curPage}</div>;
};

export default MainContainer;
