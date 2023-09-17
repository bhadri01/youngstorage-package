import { MenuItem, TextField } from "@mui/material";
import React from "react";

const Dropdown = ({ options, selectedOption, setSelectedOption, ...props }) => {
  const handleDropdownChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <TextField
      id="standard-select-currency"
      select
      // label="Select"
      defaultValue={selectedOption}
      // helperText="Please select your currency"
      onChange={handleDropdownChange}
      variant="standard"
      InputProps={{
        disableUnderline: true, // This removes the bottom underline
        style: {
          fontSize: '22px', // Adjust the font size
          // fontWeight: 'bold', // Make the font bolder
        },
      }}
      {...props}
    >
      {options.map((option, index) => (
        <MenuItem key={index} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default Dropdown;


// <select value={selectedOption} onChange={handleDropdownChange} {...props}>
// {options.map((option, i) => (
//   <option key={option.value + i} value={option.value}>
//     {option.label}
//   </option>
// ))}
// </select>