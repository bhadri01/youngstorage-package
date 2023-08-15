import React from "react";

const Dropdown = ({ options, selectedOption, setSelectedOption, ...props }) => {
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <select value={selectedOption} onChange={handleDropdownChange} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
