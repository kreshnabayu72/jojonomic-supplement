import { Plus, TrashFill } from "react-bootstrap-icons";
const AddOrRemoveButton = ({ item, array, setFunction }) => {
  if (array.indexOf(item) === -1)
    return (
      <button
        className="btn btn-primary"
        onClick={() => {
          setFunction([...array, item]);
        }}
      >
        <Plus />
      </button>
    );
  else {
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
  }
};

export default AddOrRemoveButton;
