"use client";

import React from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import "@/styles/userAccount/home.scss";
import Badge from "@/components/badge";
import { APIQuery } from "@/api/queryMethod";
import { API } from "@/api/api";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { useRouter } from "next/navigation";

function UserAccount({ params }) {
  const router = useRouter()
  const Chnagepath = (path)=>{
    console.log(path)
    router.push(path)
  }
  const network = APIQuery("networks", () => API.networks());
  if (network.isLoading) {
    return (
      <PageCenter>
        <PageLoading />
      </PageCenter>
    );
  } else if (network.isError) {
    return (
      <PageCenter>
        <h2>{network.error?.data?.detail} 🪪</h2>
      </PageCenter>
    );
  } else {
    let networkList = network.data?.data?.data[0];
    return (
      <div className="home-container">
        <Breadcrumb>
          <Link href={`/${params?.username}`}>home</Link>
        </Breadcrumb>

        <div className="home-overview">
          <div className="header">
            <h1>Overview</h1>
          </div>
          <div className="home-container-list">
            <div className="container" onClick={()=>Chnagepath(`${params?.username}/labs`)}>
              <img alt="" src="/Broken.png" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="200"
                viewBox="0 0 78 125"
                fill="none"
              >
                <path
                  d="M77.5 105V19.5C77.5 8.73045 68.7696 0 58 0H13.2292C10.6173 0 8.5 2.11735 8.5 4.72923C8.5 5.87104 8.08691 6.97429 7.33699 7.8353L2.4512 13.4449C-0.757831 17.1294 1.39539 22.9044 6.23325 23.5885L16.9996 25.111C21.9856 25.8161 22.1112 32.9722 17.153 33.8519C15.0398 34.2268 13.5 36.0638 13.5 38.2101V52.9677C13.5 60.1911 17.0407 66.9557 22.9763 71.0722L32.1362 77.4251C39.2229 82.34 41.5982 91.7291 37.7014 99.4228C31.882 110.912 40.231 124.5 53.1103 124.5H58C68.7696 124.5 77.5 115.77 77.5 105Z"
                  fill="#ECECEC"
                  fillOpacity="0.3"
                />
              </svg>
              
              <div className="dashboard">
                <h3>Device</h3>
                <span>
                  {networkList?.currentPeer || "0"} /
                  {networkList?.maxPeer || "3"}
                </span>
              </div>
              <div className="instance">
                <div className="circle"> </div>
                <h1>0{networkList?.currentPeer || "0"}</h1>
              </div>
            </div>

            <div className="container" onClick={()=>Chnagepath(`${params?.username}/domains`)}>
              <img alt="" src="/Broken.png" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="200"
                viewBox="0 0 78 125"
                fill="none"
              >
                <path
                  d="M77.5 105V19.5C77.5 8.73045 68.7696 0 58 0H13.2292C10.6173 0 8.5 2.11735 8.5 4.72923C8.5 5.87104 8.08691 6.97429 7.33699 7.8353L2.4512 13.4449C-0.757831 17.1294 1.39539 22.9044 6.23325 23.5885L16.9996 25.111C21.9856 25.8161 22.1112 32.9722 17.153 33.8519C15.0398 34.2268 13.5 36.0638 13.5 38.2101V52.9677C13.5 60.1911 17.0407 66.9557 22.9763 71.0722L32.1362 77.4251C39.2229 82.34 41.5982 91.7291 37.7014 99.4228C31.882 110.912 40.231 124.5 53.1103 124.5H58C68.7696 124.5 77.5 115.77 77.5 105Z"
                  fill="#ECECEC"
                  fillOpacity="0.3"
                />
              </svg>

              <div className="dashboard">
                <h3>Instance</h3>
                <span>{networkList?.labPeer?.length || "0"} / 1</span>
              </div>
              <div className="instance">
                <div className="circle"> </div>
                <h1>0{networkList?.labPeer?.length || "0"}</h1>
              </div>
            </div>

            <div className="container" onClick={()=>Chnagepath(`${params?.username}/networks`)}>
              <img alt="" src="/Broken.png" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="200"
                viewBox="0 0 78 125"
                fill="none"
              >
                <path
                  d="M77.5 105V19.5C77.5 8.73045 68.7696 0 58 0H13.2292C10.6173 0 8.5 2.11735 8.5 4.72923C8.5 5.87104 8.08691 6.97429 7.33699 7.8353L2.4512 13.4449C-0.757831 17.1294 1.39539 22.9044 6.23325 23.5885L16.9996 25.111C21.9856 25.8161 22.1112 32.9722 17.153 33.8519C15.0398 34.2268 13.5 36.0638 13.5 38.2101V52.9677C13.5 60.1911 17.0407 66.9557 22.9763 71.0722L32.1362 77.4251C39.2229 82.34 41.5982 91.7291 37.7014 99.4228C31.882 110.912 40.231 124.5 53.1103 124.5H58C68.7696 124.5 77.5 115.77 77.5 105Z"
                  fill="#ECECEC"
                  fillOpacity="0.3"
                />
              </svg>
              <div className="dashboard">
                <h3>Domain</h3>
                <span>
                  {networkList?.currentDomain || "0"} /
                  {networkList?.maxDomain || "5"}
                </span>
              </div>
              <div className="instance">
                <div className="circle"> </div>
                <h1>0{networkList?.currentDomain || "0"}</h1>
              </div>
            </div>

            <div className="container" onClick={()=>Chnagepath(`${params?.username}/services`)}>
              {/* <div className="circle"></div> */}
              <img alt="" src="/Broken.png" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="78"
                height="200"
                viewBox="0 0 78 125"
                fill="none"
              >
                <path
                  d="M77.5 105V19.5C77.5 8.73045 68.7696 0 58 0H13.2292C10.6173 0 8.5 2.11735 8.5 4.72923C8.5 5.87104 8.08691 6.97429 7.33699 7.8353L2.4512 13.4449C-0.757831 17.1294 1.39539 22.9044 6.23325 23.5885L16.9996 25.111C21.9856 25.8161 22.1112 32.9722 17.153 33.8519C15.0398 34.2268 13.5 36.0638 13.5 38.2101V52.9677C13.5 60.1911 17.0407 66.9557 22.9763 71.0722L32.1362 77.4251C39.2229 82.34 41.5982 91.7291 37.7014 99.4228C31.882 110.912 40.231 124.5 53.1103 124.5H58C68.7696 124.5 77.5 115.77 77.5 105Z"
                  fill="#ECECEC"
                  fillOpacity="0.3"
                />
              </svg>
              <div className="dashboard">
                <h3>Service</h3>
                <span>1 / 10</span>
              </div>
              <div className="instance">
                <div className="circle"> </div>
                <h1>01</h1>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="activity">
        <h1>Activity</h1>
        <div className="week">
        <span>Day</span>
        <span>Week</span>
        <span>Month</span>
      </div>
      </div> */}
        <div className="whole">
          <div className="logs">
            <h1>logs</h1>
            <div className="view">
              <span>viewall</span>
            </div>
          </div>
          <div className="info">
            <div className="hurry">
              <Badge className="badge" value="Info"></Badge>
            </div>
          </div>
          <div className="con">
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </span>
            <div className="mern">
              <span>1 minute ago</span>
            </div>
          </div>

          <div className="info">
            <div className="hurry">
              <Badge color="success" value="success"></Badge>
            </div>
          </div>
          <div className="con">
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </span>
            <div className="mern">
              <span>1 minute ago</span>
            </div>
          </div>

          <div className="info">
            <div className="hurry">
              <Badge color="warning" value="Warning"></Badge>
            </div>
          </div>
          <div className="con">
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </span>
            <div className="mern">
              <span>1 minute ago</span>
            </div>
          </div>

          <div className="info">
            <div className="hurry">
              <Badge color="error" value="Error"></Badge>
            </div>
          </div>
          <div className="con">
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </span>
            <div className="mern">
              <span>1 minute ago</span>
            </div>
          </div>

          <div className="info">
            <div className="hurry">
              <Badge color="error" value="Error"></Badge>
            </div>
          </div>
          <div className="con">
            <span>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit
            </span>
            <div className="mern">
              <span>1 minute ago</span>
            </div>
          </div>
        </div>

        <div className="display">
          <h1>How to Setup</h1>
          <h1>Instance Deployment Roadmap</h1>

<h2>Step 1: Deploy Ubuntu Instance</h2>
<ol>
    <li>Go to the <Link href="labs.youngstorage.in"><b>labs.youngstorage.in</b></Link> website and log in to your account.</li>
    <li>Navigate to the <Link href={`/${params?.username + "/labs"}`}><b>labs</b></Link> section.</li>
    <li>Find the option to deploy an Ubuntu instance.</li>
    {/* <li>Choose the desired configuration for the instance (CPU, RAM, storage, etc.).</li> */}
    <li>Start the deployment process and wait for the instance to be provisioned.</li>
</ol>

<h2>Step 2: Obtain Instance Details</h2>
<ol>
    <li>Once the instance is deployed, retrieve the IP address of the instance.</li>
    <li>Make sure you have the SSH login credentials (username and password) for the instance.</li>
</ol>

<h2>Step 3: VPN Configuration</h2>
<ol>
    <li>Go to the <Link href={`/${params?.username + "/networks"}`}><b>Networks</b></Link> tab on youngstorage.in.</li>
    <li>Find the VPN configuration section.</li>
    <li>Request a VPN configuration file for your device.</li>
    <li>Before requesting, ensure that you have the WireGuard application installed on your device/system.</li>
</ol>

<h2>Step 4: VPN Peer Configuration</h2>
<ol>
    <li>Once you receive the VPN configuration file, transfer it to your device.</li>
    <li>Install and configure the WireGuard application using the provided configuration file.</li>
    <li>Activate the VPN peer configuration on your device.</li>
    <li>Confirm the VPN connection by checking the latest handshake in the WireGuard application or on the <Link href={`/${params?.username + "/networks"}`}><b>Networks</b></Link> tab of <Link href="labs.youngstorage.in"><b>labs.youngstorage.in</b></Link></li>
</ol>

<h2>Step 5: Connect to Instance via SSH</h2>
<ol>
    <li>Open <Link href={`https://code.visualstudio.com/`}target="_blank"><b>Visual Studio Code </b></Link> (VSCode) on your local system.</li>
    <li>Install the "Remote - SSH" extension in VSCode.</li>
    <li>Use the SSH credentials obtained in Step 2 to connect to the Ubuntu instance.</li>
    <li>Once connected, you can work on the instance seamlessly through VSCode's remote capabilities.</li>
</ol>

<p>Remember to follow best practices for security, such as using strong passwords, keeping your instance and applications up to date, and configuring firewalls properly.</p>

<p>Please note that the instructions provided are based on the information you provided, and the actual steps might vary slightly depending on the interface and features of youngstorage.in. Always refer to their official documentation or support if you encounter any issues during the deployment process.</p>



          {/* <span>
            refer docs for detail setup <b>click here</b>
          </span> */}
        </div>
      </div>
    );
  }
}

export default UserAccount;
