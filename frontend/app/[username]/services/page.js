"use client";

import React from "react";
import Badge from "@/components/badge";
import Button from "@/components/button";
import Copy from "@/components/copy";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import ToolTips from "@/components/ToolTips";
import "@/styles/userAccount/services.scss";
import { useRouter } from "next/navigation";
import { APIQuery } from "@/api/queryMethod";
import { API } from "@/api/api";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { useQueryClient } from "@tanstack/react-query";
import { Alert } from "@mui/material";
import Alerts from "@/components/alerts";

function Services({ params }) {
  const router = useRouter();

  const ChangePath = (route) => {
    router.push(route);
  };

  const queryClient = useQueryClient();
  const services = queryClient.getQueryData({ queryKey: ["services"] });

  if (services.isLoading) {
    return (
      <PageCenter>
        <PageLoading />
      </PageCenter>
    );
  } else if (services.isError) {
    return (
      <PageCenter>
        <h2>{services.error?.data?.message} 🪪</h2>
      </PageCenter>
    );
  } else {
    let service = services.data?.data;
    return (
      <div className="serve">
        <Breadcrumb>
          <Link href={"/" + params?.username + "/services"}>services</Link>
        </Breadcrumb>
        <Alerts
          value="list of available service are shown here you can utilize these service
            inside your laboratry, some service require authentication and other
            configuraation which can be managed from here"
        />

        <div className="main-container">
          {service?.map((serv, i) => (
            <div className="service-container" key={serv._id}>
              <div className="service">
                <img alt="" src={`/${serv.imageurl}`} width={100} height={50} />

                <div className="sql">
                  <span>{serv.title}</span>
                  <Badge color="btn-success" value={serv.host}></Badge>
                </div>
              </div>
              <div className="space">
                <span>{serv.description}</span>
              </div>

              <div className="port">
                <span>Port</span>
                {serv.port?.map((p) => (
                  <Badge key={p} color="btn-error" value={p}></Badge>
                ))}
              </div>

              <div className="gloss">
                <span>
                  {serv.host}:{serv.primaryPort}
                </span>
                <Copy value="click here to copy it and paste it in the under vscode's port to access this sercice" />
              </div>

              <div className="value">
                <Button
                  onClick={() => ChangePath(`services/${serv.service}`)}
                  value="Manage"
                  color="btn-success"
                ></Button>
                <Link href={serv.learnMore}>
                  <Button value="Learn More" color="btn-info" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Services;
