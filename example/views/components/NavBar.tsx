import { React } from '../../deps.ts';

const NavBar: any = (props: any) => {
  const { setPage } = props;

  const checkAuth = () => {
    console.log('submit!');
    fetch(`/protected`, {
      method: 'GET',
      headers: {
        'Content-type': 'Application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (data.isAuth) {
          setPage('protected');
        } else {
          setPage('entry');
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="navBar">
      <button
        className="navBtn"
        onClick={() => {
          setPage('home');
        }}
      >
        <h3 className="navBtnText">Home</h3>
      </button>
      <button
        className="navBtn"
        onClick={() => {
          checkAuth();
        }}
      >
        <h3 className="navBtnText">Protected</h3>
      </button>
    </div>
  );
};

export default NavBar;
