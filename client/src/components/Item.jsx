import classNames from "classnames";
import React from 'react'

function Item({ id, onClick, className, active, height, big, level, children }) {

  return (
    <button
      onClick={() => onClick(id,)}
      className={classNames(
        "item",
        className,
        {"active": active},
        {"item--big": big},
        {"item--level": level}
      )}
      style={{height: `${height}px`}}
    >
      {children}
    </button>
  );
}

Item.defaultProps = {
  height: "48",
}

export default Item;


