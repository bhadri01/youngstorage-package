"use client";

import React, { useContext, useEffect } from "react";
import Badge from "@/components/badge";
import Button from "@/components/button";
import Copy from "@/components/copy";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import "@/styles/userAccount/services.scss";
import { usePathname, useRouter } from "next/navigation";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { useQueryClient } from "@tanstack/react-query";
import Alerts from "@/components/alerts";
import { NavContext } from "../layout";
import { Avatar, Card, CardActions, CardContent, CardHeader, CardMedia, Chip, IconButton, Typography } from "@mui/material";

function Services({ params }) {
  const navpath = useContext(NavContext);
  const pathname = usePathname();
  useEffect(() => {
    navpath.setNav(pathname);
  }, []);
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
          {ServiceIcon()}
          <Link href={"/" + params?.username + "/services"}>services</Link>
        </Breadcrumb>

        <Alerts
          value="list of available service are shown here you can utilize these service
            inside your laboratry, some service require authentication and other
            configuraation which can be managed from here"
        />
        <div className="main-container">
          {service?.map((serv, i) => (
            <Card className='card-size' key={i}>
              <CardHeader
                avatar={
                  <Avatar alt="Cindy Baker" src={`/${serv.imageurl}`} />
                }

                title={<Typography variant="h5" style={{
                  textTransform: "capitalize", // Replace with your desired text color
                }}> {/* Use variant="h6" for larger title */}
                  {serv.title}
                </Typography>}
                subheader={<Typography variant="subtitle1"> {/* Use variant="subtitle1" for larger subheader */}
                  <Badge color="btn-success" value={serv.host}></Badge>
                </Typography>}
              />
              <CardMedia
                component="img"
                // height="194"
                style={{
                  width: '35%',
                  margin: '0 auto'
                }}
                image={`/${serv.imageurl}`}
                alt="Paella dish"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {serv.header}
                </Typography>
              </CardContent>

              <CardContent>
                <div className="gloss">
                  <span>
                    {serv.host}:{serv.primaryPort}
                  </span>
                  <Copy value="click here to copy it and paste it in the under vscode's port to access this service" />
                </div>
              </CardContent>
              <CardActions className="cardAction">
                <Button size="small" value="Manage"
                  color="success" onClick={() => { ChangePath(`services/${serv.service}`); }} />
                <Link href={serv.learnMore}>
                  <Button value="Learn More" />
                </Link>
              </CardActions>
            </Card>
          ))}
        </div>
      </div >
    );
  }
}

export default Services;
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



// <div className="main-container">
// {service?.map((serv, i) => (
//   <div className="service-container" key={serv._id}>
//     <div className="service">
//       <img alt="" src={`/${serv.imageurl}`} />

//       <div className="sql">
//         <span>{serv.title}</span>
//         <Badge color="btn-success" value={serv.host}></Badge>
//       </div>
//     </div>
//     <div className="space">
//       <span>{serv.header}</span>
//     </div>

//     <div className="port">
//       <IconButton aria-label="Lan Icon">
//         <LanIcon />
//       </IconButton>

//       <span>Port</span>
//       {serv.port?.map((p) => (
//         <Badge key={p} color="btn-error" value={p}></Badge>
//       ))}
//     </div>

//     <div className="gloss">
//       <span>
//         {serv.host}:{serv.primaryPort}
//       </span>
//       <Copy value="click here to copy it and paste it in the under vscode's port to access this service" />
//     </div>

//     <div className="value">

//       <Button
//         onClick={() => { ChangePath(`services/${serv.service}`); }}
//         value="Manage"
//         color="success"
//       ></Button>

//       <Link href={serv.learnMore}>
//         <Button value="Learn More" />
//       </Link>
//     </div>
//   </div>
// ))}
// </div>