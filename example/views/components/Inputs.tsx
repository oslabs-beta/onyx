import { React } from '../../deps.ts';

const Inputs: any = () => {
  const [username, setUsername] = (React as any).useState('');
  const [password, setPassword] = (React as any).useState('');

  const usernameOnChange = (e: any) => {
    setUsername(e.target.value);
  };

  const passwordOnChange = (e: any) => {
    setPassword(e.target.value);
  };

  const submit = (path: string) => {
    // client-side validation
    if (username.trim() === '' || password.trim() === '') {
      // can't do alert, don't know why
      return;
    }
    console.log(username, password);
    fetch(`/${path}`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-type': 'Application/json',
      },
    })
      .then((data) => data.json())
      .then((data) => {
        if (!data.success) {
          console.log(data.message);
        } else {
          console.log(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="everything">
      <div className="inputs">
        <div className="input-border">
          <input
            className="input-field"
            id="input-username"
            type="text"
            value={username}
            onChange={usernameOnChange}
            placeholder="Username"
          ></input>
        </div>
        <p></p>
        <div className="input-border">
          <input
            className="input-field"
            id="input-password"
            type="password"
            value={password}
            onChange={passwordOnChange}
            placeholder="Password"
          ></input>
        </div>
        <p></p>
      </div>
      <div className="buttonDiv">
        <div
          id="login"
          className="buttons"
          onClick={(evt: any) => {
            submit(evt.target.id);
          }}
        >
          Log in
        </div>
        <div
          id="register"
          className="buttons"
          onClick={(evt: any) => {
            submit(evt.target.id);
          }}
        >
          Sign up
        </div>
      </div>
    </div>
  );
};

export default Inputs;
