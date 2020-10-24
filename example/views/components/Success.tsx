import { React } from '../../../deps.ts';

const Success = ({ username }: { username: string }) => {
    return (
        <>
          <div>
              <h1>Success!</h1>
              <p>Welcome to your page, {username}!</p>
          </div>
        </>
    )
}