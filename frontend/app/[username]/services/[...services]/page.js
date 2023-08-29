"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import ToolTips from "@/components/ToolTips";
import Link from "next/link";
import "@/styles/userAccount/services.scss";
import Button from "@/components/button";
import { useState } from "react";
import DashBoard from "@/components/DashBoard";
import DataBase from "@/components/DataBase";
import { useQueryClient } from "@tanstack/react-query";
import { PageCenter } from "@/components/pageLoading";
import Profile from "@/components/Profile";
import { APIQuery } from "@/api/queryMethod";
import { API } from "@/api/api";

export default function page({ params }) {
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
          <svg
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
              strokeLinejoin="round"
            />
            <path
              d="M26 8.75H21.5C20.675 8.75 20 8.07499 20 7.24999V5.25001C20 4.42501 20.675 3.75 21.5 3.75H26C26.825 3.75 27.5 4.42501 27.5 5.25001V7.24999C27.5 8.07499 26.825 8.75 26 8.75Z"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26 18.125H21.5C20.675 18.125 20 17.45 20 16.625V14.625C20 13.8 20.675 13.125 21.5 13.125H26C26.825 13.125 27.5 13.8 27.5 14.625V16.625C27.5 17.45 26.825 18.125 26 18.125Z"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.25 6.25H20"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.625 6.25V22.5C15.625 23.875 16.75 25 18.125 25H20"
            // fill="#FBFBFB"
            />
            <path
              d="M15.625 6.25V22.5C15.625 23.875 16.75 25 18.125 25H20"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M15.625 15.625H20"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M26 27.5H21.5C20.675 27.5 20 26.825 20 26V24C20 23.175 20.675 22.5 21.5 22.5H26C26.825 22.5 27.5 23.175 27.5 24V26C27.5 26.825 26.825 27.5 26 27.5Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Link href={"/" + params?.username + "/services"}>Services</Link>
          <span style={{ textTransform: "lowercase" }}>
            / {params.services[0]}
          </span>
        </Breadcrumb>
        <div className="db-card">
          <span>
            <img src={`/${currentService.imageurl}`} />
            <span>{currentService.description}</span>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-window-dash"
                viewBox="0 0 16 16"
              >
                <path d="M2.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1ZM4 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm2-.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Z" />
                <path d="M0 4a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v4a.5.5 0 0 1-1 0V7H1v5a1 1 0 0 0 1 1h5.5a.5.5 0 0 1 0 1H2a2 2 0 0 1-2-2V4Zm1 2h13V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2Z" />
                <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-5.5 0a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 0-1h-3a.5.5 0 0 0-.5.5Z" />
              </svg>
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-database"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.318 2.687C5.234 2.271 6.536 2 8 2s2.766.27 3.682.687C12.644 3.125 13 3.627 13 4c0 .374-.356.875-1.318 1.313C10.766 5.729 9.464 6 8 6s-2.766-.27-3.682-.687C3.356 4.875 3 4.373 3 4c0-.374.356-.875 1.318-1.313ZM13 5.698V7c0 .374-.356.875-1.318 1.313C10.766 8.729 9.464 9 8 9s-2.766-.27-3.682-.687C3.356 7.875 3 7.373 3 7V5.698c.271.202.58.378.904.525C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 5.698ZM14 4c0-1.007-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1s-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4v9c0 1.007.875 1.755 1.904 2.223C4.978 15.71 6.427 16 8 16s3.022-.289 4.096-.777C13.125 14.755 14 14.007 14 13V4Zm-1 4.698V10c0 .374-.356.875-1.318 1.313C10.766 11.729 9.464 12 8 12s-2.766-.27-3.682-.687C3.356 10.875 3 10.373 3 10V8.698c.271.202.58.378.904.525C4.978 9.71 6.427 10 8 10s3.022-.289 4.096-.777A4.92 4.92 0 0 0 13 8.698Zm0 3V13c0 .374-.356.875-1.318 1.313C10.766 14.729 9.464 15 8 15s-2.766-.27-3.682-.687C3.356 13.875 3 13.373 3 13v-1.302c.271.202.58.378.904.525C4.978 12.71 6.427 13 8 13s3.022-.289 4.096-.777c.324-.147.633-.323.904-.525Z" />
                </svg>
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
