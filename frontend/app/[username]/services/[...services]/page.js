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
import { set } from "react-hook-form";
import DashBoard from "@/components/DashBoard";
import DataBase from "@/components/DataBase";

export default function page({ params }) {
  const [pop, SetPop] = useState(false);
  const [data, Setdata] = useState(false);
  const [dash, Setdash] = useState(true);

  return (
    <div className="database">
      <Breadcrumb>
        <Link href={params?.username + "/services"}>Services</Link>
        <ToolTips name="Network Is A Area There We Can Generate A VPN And The Lab Will Be Connected Automatically In A Single Click And We Can Make It As Seamless" />
      </Breadcrumb>

      <div className="db-card">
        <span>
          list of available service are shown here you can utilize these service
          inside your laboratry, some service require authentication and other
          configuraation which can be managed from here list of available
          service are shown here you can utilize these service inside your
          laboratry, some service require authentication and other
          configuraation which can be managed from here list of available
          service are shown here you can utilize these service inside your
          laboratry, some service require authentication and other
          configuraation which can be managed from here
        </span>
        <div className="db-btn">
          <Button
            onClick={() => SetPop(true)}
            value="Add User"
            color="warning"
          ></Button>
          <Button value="Manage Database"></Button>
        </div>
        <div className="route-btn">
          <Button
            onClick={() => {
              Setdash(true);
              Setdata(false);
            }}
            value="DashBoard"
            color="terminal"
          ></Button>
          <Button onClick={() => {
              Setdash(false);
              Setdata(true);
            }} value="DataBase"></Button>
        </div>
      </div>
      {pop && <PopUp SetPop={SetPop} />}
      {data && <DataBase Setdata={Setdata} />}
      {dash && <DashBoard Setdash={Setdash} />}
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
