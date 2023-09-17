import { Button as ButtonTag } from "@mui/material";
import { memo } from "react";

const Button = ({
  children,
  color,
  style,
  className,
  onClick,
  value = "alert", // Use a default parameter here
  disabled = false, // Use a default parameter here
}) => {
  return (
    <ButtonTag
      style={style}
      className={`btn ${color && color} ${className}`}
      onClick={onClick}
      variant="contained"
      disabled={disabled}
    >
      {children}
      {value}
    </ButtonTag>
  );
};

export default memo(Button);
