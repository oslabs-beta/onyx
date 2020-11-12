import { React } from '../../deps.ts';

const Message: any = (props: any) => {
  if (props.success === false) {
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
