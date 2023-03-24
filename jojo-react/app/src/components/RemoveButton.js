import { Plus, TrashFill } from "react-bootstrap-icons";

const RemoveButton = ({ item, array, setFunction }) => {
  return (
    <button
      className="btn btn-danger"
      onClick={() => {
        setFunction(array.filter((eachItem) => eachItem !== item));
      }}
    >
      <TrashFill />
    </button>
  );
};

export default RemoveButton;
