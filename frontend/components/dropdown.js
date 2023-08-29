import React from "react";

const Dropdown = ({ options, selectedOption, setSelectedOption, ...props }) => {
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <select value={selectedOption} onChange={handleDropdownChange} {...props}>
      {options.map((option, i) => (
        <option key={option.value + i} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
