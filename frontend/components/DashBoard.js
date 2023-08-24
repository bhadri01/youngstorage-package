import Link from "next/link";
import React from "react";
import Button from "@/components/button";
import Copy from "@/components/copy";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ToolTips from "@/components/ToolTips";


function DashBoard({ params }) {
  const [showPassword, SetShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    SetShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="left">
          <div className="heading">
            <h3>Create Database</h3>
          </div>
          <div className="db-container">
            <span>Username</span>
            <div className="cpy">
              <h4>my sql Server</h4>
            </div>
          </div>
          <div className="db-container">
            <span>Database Name</span>
            <div className="cpy">
              <h4>badri anish </h4>
              <Copy />
            </div>
          </div>
          <div className="db-container">
            <span>Collection</span>
            <div className="cpy">
              <h4>mysql.labs.youngstorage.in</h4>
              <Copy />
            </div>
          </div>
          <div className="db-container">
            <span>port</span>
            <div className="cpy">
              <h4>3306</h4>
              <Copy className="copy" />
            </div>
          </div>
        </div>
        <div className="right">
          <h3>My Sql Server users(you can add upto 5 users)</h3>
          <div className="small-box">
            <div className="lbl">
              <label>UserName:</label>
              <span>Anish</span>
              <div className="menu">
                <img alt="menu" src="/dots.png" width={18} height={18} />
              </div>
            </div>
            <div className="lbl">
              <label>Password:</label>
              <input type={showPassword ? "text" : "password"} />
              <span onClick={togglePasswordVisibility}>
                <img
                  src={showPassword ? "/shared.png" : "/hide.png"}
                  width={20}
                  height={20}
                />
              </span>
            </div>

            <div className="hr">
              <span>no of database 0 / 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBoard;
