import { React } from '../../deps.ts';

const Protected: any = () => {
  const logout = () => {
    console.log('logout');
    fetch('/logout', {
      method: 'GET',
      headers: {
        'Content-type': 'Application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data.isAuth) {
          // direct to '/'
        }
      });
  };
  return (
    <div className="protected">
      <h1>Protected Page</h1>

      <div
        id="logout"
        className="buttons"
        onClick={() => {
          logout();
        }}
      >
        Log out
      </div>
    </div>
  );
};

export default Protected;
