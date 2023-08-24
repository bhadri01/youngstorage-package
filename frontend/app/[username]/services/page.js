"use client";

import React from "react";
import Badge from "@/components/badge";
import Button from "@/components/button";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import Copy from "@/components/copy";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import ToolTips from "@/components/ToolTips";
import "@/styles/userAccount/services.scss";
import { useRouter } from "next/navigation";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 200,
  },
});
function Services({ params }) {
  const router = useRouter();

  const ChangePath = (route) => {
    router.push(route);
  };
  return (
    <div className="serve">
      <Breadcrumb>
        <Link href={params?.username + "/services"}>services</Link>
        <ToolTips name="Network Is A Area There We Can Generate A VPN And The Lab Will Be Connected Automatically In A Single Click And We Can Make It As Seamless" />
      </Breadcrumb>

      <div className="info1">
        <span>
          list of available service are shown here you can utilize these service
          inside your laboratry, some service require authentication and other
          configuraation which can be managed from here
        </span>
      </div>
      <div className="main-container">
        <div className="service-container">
          <div className="service">
            <img alt="" src="/mysql.png" width={100} height={50} />

            <div className="sql">
              <span>mysql server</span>
              <Badge color="btn-success" value="mysql.youngstorage.in"></Badge>
            </div>
          </div>
          <div className="space">
            <span>mysql is the world most popular open source database</span>
          </div>

          <div className="port">
            <span>Port</span>
            <Badge color="btn-error" value="3306"></Badge>
          </div>

          <div className="gloss">
            <span>mysql.youngstorage.in:3306</span>
            <Copy value="click here to copy it and paste it in the under vscode's port to access this sercice" />
          </div>

          <div
            className="value"
            
          >
            <Button onClick={() => ChangePath("services/services")}value="Manage" color="btn-success"></Button>
            <Button value="Learn More" color="btn-info  "></Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;



