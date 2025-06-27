import React from "react";

const ListGroup = (props) => {
  const { items, selectedTag, onTagSelect } = props;
  return (
    <ul className="list-group">
      {items.map((item) => (
        <li
          key={item._id}
          className={
            item === selectedTag ? "list-group-item active" : "list-group-item"
          }
          onClick={() => onTagSelect(item)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
};

ListGroup.defaultProps = {
  textProperty: "name",
  valueProperty: "_id",
};

export default ListGroup;
