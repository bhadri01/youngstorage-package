"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import "@/styles/userAccount/services.scss";
import Button from "@/components/button";
import { useState } from "react";
import DashBoard from "@/components/DashBoard";
import DataBase from "@/components/DataBase";
import { useQueryClient } from "@tanstack/react-query";
import { PageCenter } from "@/components/pageLoading";
import { APIQuery } from "@/api/queryMethod";
import { API } from "@/api/api";
import { Typography } from "@mui/material";
import StorageIcon from '@mui/icons-material/Storage';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function page({ params }) {
  console.log("params:", params);
  const queryClient = useQueryClient();
  const service = queryClient.getQueryData({ queryKey: ["services"] }).data
    ?.data;
  const [data, Setdata] = useState(false);
  const [dash, Setdash] = useState(true);

  let currentService = service.filter((a) => a.service == params.services[0]);
  const servicesUser = APIQuery(`services${currentService.service}`, () =>
    API.getServices(currentService.service)
  );
  if (!(currentService?.length > 0)) {
    return (
      <PageCenter>
        <h1>hey boss sorry for the inconvenice </h1>
        <Link href={"/" + params?.username + "/services"}>
          back to services
        </Link>
      </PageCenter>
    );
  } else {
    currentService = currentService[0];
    return (
      <div className="database">
        <Breadcrumb>
          {ServiceIcon()}
          <Link href={"/" + params?.username + "/services"}>Services</Link>
          <span style={{ textTransform: "lowercase" }}>
            / {params.services[0]}
          </span>
        </Breadcrumb>
        <div className="db-card">
          <span>
            <img src={`/${currentService.imageurl}`} />
            <Typography variant="body2">
              {currentService.description}
            </Typography>
          </span>
          <div className="route-btn">
            <Button
              className={dash ? "active" : "unactive"}
              onClick={() => {
                Setdash(true);
                Setdata(false);
              }}
              value="DashBoard"
            >
              <DashboardIcon />
            </Button>
            {currentService.service == "adminer" ? "" :
              <Button
                className={data ? "active" : "unactive"}
                onClick={() => {
                  Setdash(false);
                  Setdata(true);
                }}
                value="DataBase"
              >
                <StorageIcon />
              </Button>
            }
          </div>
        </div>
        {dash && (
          <DashBoard
            Setdash={Setdash}
            service={currentService}
            servicesUser={servicesUser}
          />
        )}
        {currentService.service == "adminer" ? "" :
          data && (
            <DataBase
              Setdata={Setdata}
              service={currentService}
              servicesUser={servicesUser}
            />
          )}
      </div>
    );
  }
}
function ServiceIcon() {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="24"
    viewBox="0 0 30 30"
    fill="none"
  >
    <path
      d="M8.75 10H5C3.625 10 2.5 8.875 2.5 7.5V5C2.5 3.625 3.625 2.5 5 2.5H8.75C10.125 2.5 11.25 3.625 11.25 5V7.5C11.25 8.875 10.125 10 8.75 10Z"
      //stroke="#B4B5B7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M26 8.75H21.5C20.675 8.75 20 8.07499 20 7.24999V5.25001C20 4.42501 20.675 3.75 21.5 3.75H26C26.825 3.75 27.5 4.42501 27.5 5.25001V7.24999C27.5 8.07499 26.825 8.75 26 8.75Z"
      //stroke="#B4B5B7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M26 18.125H21.5C20.675 18.125 20 17.45 20 16.625V14.625C20 13.8 20.675 13.125 21.5 13.125H26C26.825 13.125 27.5 13.8 27.5 14.625V16.625C27.5 17.45 26.825 18.125 26 18.125Z"
      //stroke="#B4B5B7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M11.25 6.25H20"
      //stroke="#B4B5B7"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M15.625 6.25V22.5C15.625 23.875 16.75 25 18.125 25H20" />
    <path
      d="M15.625 6.25V22.5C15.625 23.875 16.75 25 18.125 25H20"
      //stroke="#B4B5B7"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M15.625 15.625H20"
      //stroke="#B4B5B7"
      strokeWidth="2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M26 27.5H21.5C20.675 27.5 20 26.825 20 26V24C20 23.175 20.675 22.5 21.5 22.5H26C26.825 22.5 27.5 23.175 27.5 24V26C27.5 26.825 26.825 27.5 26 27.5Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round" />
  </svg>;
}

