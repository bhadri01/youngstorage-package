import React from "react";

const Drop = ({
  collections,
  selectedCollect,
  setSelectedCollect,
  ...props
}) => {
  const handleDropdownChange = (event) => {
    setSelectedCollect(event.target.value);
  };

  return (
    <select value={selectedCollect} onChange={handleDropdownChange} {...props}>
      {collections.map((collect, i) => (
        <option key={collect.value + i} value={collect.value}>
          {collect.label}
        </option>
      ))}
    </select>
  );
};

export default Drop;
