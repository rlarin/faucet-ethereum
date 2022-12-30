import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconButton = ({ onClickHandler, icon, text, color }) => {
  return (
    <>
      <button onClick={onClickHandler} className={`button ${color} is-light`}>
        <FontAwesomeIcon icon={icon} />
        <span className="m-1">{text}</span>
      </button>
    </>
  );
};

export default IconButton;
