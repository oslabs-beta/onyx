import { React } from '../../../deps.ts';

const Inputs = () => {
    return (
     <>
        <div className="inputs">
            <input id="input" type="text" placeholder="Username"></input>
            <p></p>
            <input id="input" type="password" placeholder="Password"></input>
            <p></p>
        </div>
        <div className="buttons">
            <button id="login">Log in</button>
            <button id="signup">Sign Up</button>
        </div>
    </>
    )
}

export default Inputs;