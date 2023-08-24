"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ToolTips from "@/components/ToolTips";
import Link from "next/link";
import "@/styles/userAccount/services.scss";
import Button from "@/components/button";
import Dropdown from "@/components/dropdown";
import Drop from "@/components/drop";

// import Drop from "@/components/drop";
import { useState } from "react";

// import { styled } from "@mui/material/styles";
// import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

// const CustomWidthTooltip = styled(({ className, ...props }) => (
//     <Tooltip {...props} classes={{ popper: className }} />
//   ))({
//     [`& .${tooltipClasses.tooltip}`]: {
//       maxWidth: 200,
//     },
//   });
const options = [
  { label: "Anish", value: "Anish" },
  { label: "bhadri", value: "bhadri" },
  { label: "prithvi", value: "prithvi" },
  { label: "hari", value: "hari" },
  { label: "saiz", value: "saiz" },
];

const collections = [
  { label: "utf8mb4_0900_ai_di", value: "utf8mb4_0900_ai_di" },
  { label: "utf8mb4_0908_ai_di", value: "utf8mb4_0900_ai_di" },
  { label: "utf8mb4_0908_ai_di", value: "utf8mb4_0900_ai_di" },
  { label: "utf8mb4_0908_ai_di", value: "utf8mb4_0900_ai_di" },
];
export default function page({ params }) {
  const [selectedOption, setSelectedOption] = useState(options[0].value);
  const [selectedCollect, setSelectedCollect] = useState(options[0].value);

  const [pop, SetPop] = useState(false);
  const [data, Setdata] = useState(false);

  return (
    <div className="database">
      <div className="db-main-container">
        <div className="left">
          <div className="heading">
            <h3>Create Database</h3>
          </div>
          <div className="db-container">
            <span>Username</span>
            <Dropdown
              className="drop"
              options={options}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
            />
          </div>
          <div className="db-container">
            <span>Database Name</span>
            <div className="db-input">
              <h4>badri anish </h4>
              <input type="text" />
            </div>
          </div>
          <div className="db-container">
            <span>Collection</span>
            <Drop
              className="drop"
              collections={collections}
              selectedCollect={selectedCollect}
              setSelectedCollect={setSelectedCollect}
            />
          </div>
          <div className="create">
            <Button value="Create Database" color="success"></Button>
          </div>
        </div>

        <div className="right ">
          <h3>My Sql Server Database</h3>

          <div>
            <span>No data will be displayed below</span>
          </div>
        </div>
      </div>
      {pop && <PopUp SetPop={SetPop} />}
      {data && <DataBase Setdata={Setdata} />}
    </div>
  );
}

const PopUp = (props) => {
  return (
    <div className="pop">
      <div className="container">
        <div className="head">
          <h4>Add user details</h4>
          <img alt="" src="/Close.png" onClick={() => props.SetPop(false)} />
        </div>

        <div className="box">
          <label>Username</label>
          <input type="text" />

          <label>Password</label>
          <input type="text" />
        </div>

        <div className="box">
          <label>confirmPassword</label>
          <input type="text" />
        </div>

        <div className="pop-btn">
          <Button value="Add user" color="success"></Button>
          <Button value="Cancel" color="error"></Button>
        </div>
      </div>
    </div>
  );
};
