import { React } from '../../deps.ts';

const Message: any = (props: any) => {
  if (props.success) {
    return (
      <>
        <div className="message">Success! Thanks for logging in, pal!</div>
      </>
    );
  } else if (props.success === false) {
    return (
      <>
        <div className="message">Hmmm, doesn't look right. Try again!</div>
      </>
    );
  } else {
    return <></>;
  }
};

export default Message;

// should add in a logout button
