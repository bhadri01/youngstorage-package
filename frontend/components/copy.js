"use client";

import React, { useState } from "react";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 200,
  },
});
function copy(props) {
  const [copy, SetCopied] = useState(false);

  const handleCopyClick = (event) => {
    SetCopied(true);
    setTimeout(() => {
      SetCopied(false);
    }, 1000);
    const container = event.target.parentElement; // Assuming the copy icon is a child of the container element
    const contentToCopy = container.textContent;

    // Create a temporary textarea element to copy the content
    const tempTextArea = document.createElement("textarea");
    tempTextArea.value = contentToCopy;
    document.body.appendChild(tempTextArea);

    // Select and copy the content
    tempTextArea.select();
    document.execCommand("copy");

    // Remove the temporary textarea from the DOM
    document.body.removeChild(tempTextArea);
  };
  return (
    <CustomWidthTooltip title={copy ? "copied" : props.value} placement="top">
      <svg xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 17 17"
        fill="none"
        className="copy"
        onClick={handleCopyClick}
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M12.2398 10.0955C12.2398 11.1304 11.4008 11.9694 10.3658 11.9694H5.68105C4.64611 11.9694 3.80713 11.1304 3.80713 10.0955V5.41066C3.80713 4.37573 4.64611 3.53674 5.68105 3.53674H10.3658C11.4008 3.53674 12.2398 4.37573 12.2398 5.41066V10.0955Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.48877 13.7768H12.1736C13.2085 13.7768 14.0475 12.9377 14.0475 11.9029V7.21802" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </CustomWidthTooltip>
  );
}

export default copy;
