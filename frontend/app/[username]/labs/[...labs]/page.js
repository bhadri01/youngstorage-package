"use client";

import Button from "@/components/button";
import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "@/api/api";
import Link from "next/link";
import { Client } from "paho-mqtt";
import { mqtt, mqttport } from "@/api/config";
import Badge from "@/components/badge";
import Copy from "@/components/copy";
import Breadcrumb from "@/components/Breadcrumb";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { Toast } from "@/components/alert";
import { APIQuery } from "@/api/queryMethod";
import LoadingEffect from "@/components/loadingEffect";

export default function Ubuntu({ params }) {
  const queryClient = useQueryClient();
  const username = params?.username;
  const [terminalMessages, setTerminalMessages] = useState([]);
  const [Terminalstate, setTerminalstate] = useState(true);
  const [containerStop, SetContainerStop] = useState(false);
  const [containerDeploy, setContainerDeploy] = useState(false);
  const host = "(labs💻️youngstorage)$";

  const clientRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const isConnected = useRef(false);

  useEffect(() => {
    var prompt = document.getElementById("prompt");
    if (prompt) {
      prompt.scrollTop = prompt.scrollHeight;
    }
  }, [terminalMessages]);

  useEffect(() => {
    if (username) {
      const clientId = `myclientid_${parseInt(Math.random() * 100, 10)}`;
      // prodution
      const client = new Client(`wss://${mqtt}:${mqttport}/ws`, clientId); // Use wss:// for secure connection
      clientRef.current = client;

      // Set callback functions for connection and message reception
      client.onConnectionLost = onConnectionLost;
      client.onMessageArrived = onMessageArrived;

      // Connect to the MQTT broker
      connect();

      // Callback function for successful connection
      function onConnect() {
        isConnected.current = true;
        setTerminalMessages((a) => [...a, "server pong 🏓", host]);
        // Subscribe to the desired topic
        client.subscribe(`/topic/${username}`);
      }

      // Callback function for connection loss
      function onConnectionLost(responseObject) {
        isConnected.current = false;
        if (responseObject.errorCode !== 0) {
          console.error("MQTT Connection Lost:", responseObject.errorMessage);
          setTerminalMessages((a) => [...a, "server ping..⭕", host]);
          // Attempt reconnection after a 5-second delay
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      }

      // Callback function for incoming messages
      function onMessageArrived(message) {
        let data = JSON.parse(message.payloadString);
        if (data) {
          setTerminalMessages((a) => [...a, data?.message]);
          if (data?.isFinished) {
            setTerminalMessages((a) => [...a, host]);
            setContainerDeploy(false);
          }
          queryClient.invalidateQueries("labsdata");
        }
        // Process the received message as needed
      }

      // Function to handle the initial connection and reconnection
      function connect() {
        if (!isConnected.current) {
          setTerminalMessages((a) => [...a, "Connecting..."]);
          client.connect({
            onSuccess: onConnect,
            onFailure: function (message) {
              isConnected.current = false;
              console.error("MQTT Connection Failed:", message.errorMessage);
              // Attempt reconnection after a 5-second delay
              reconnectTimeoutRef.current = setTimeout(connect, 5000);
            },
          });
        }
      }

      // Clean up the MQTT connection when the component is unmounted
      return () => {
        clearTimeout(reconnectTimeoutRef.current);
        client.disconnect();
      };
    }
  }, []);

  //this code is to deploy the container
  const DeployAndRedeploy = useMutation({
    mutationFn: () => {
      setTerminalstate(true);
      return API.deploySpawn();
    },
    onSuccess: () => {
      Toast.success("Containers are ready to play");
      queryClient.invalidateQueries("labsdata");
      setContainerDeploy(false);
    },
  });

  //this code is to upthe vscode option in web
  const UpVSCode = useMutation({
    mutationFn: () => API.upvscode(),
    onSuccess: (res) => {
      // Invalidate and refetch
      Toast.success("VsCode is now in web");
      queryClient.invalidateQueries("labsdata");
    },
  });

  const handleClick = async (state) => {
    if (state == "stop") {
      SetContainerStop(true);
      const data = await API.stopContainer();
      Toast.success("container stoped currently");
      queryClient.invalidateQueries("labsdata");
      SetContainerStop(false);
    }
  };

  const labsdata = APIQuery("labsdata", () => API.deploy(), 5000);
  const [wgpeerStatus, setwgpeerStatus] = useState(false);

  useEffect(() => {
    if (
      labsdata.data?.data?.data?.length > 0 &&
      labsdata.data.data.data[0].wgipAddress
    ) {
      // If labsdata[0].wgipAddress exists, call API.wgpeer()
      API.peerstatus(labsdata.data.data.data[0].wgipAddress)
        .then((response) => {
          setwgpeerStatus(response.data?.status);
        })
        .catch((error) => {
          // Handle any errors if needed
          setwgpeerStatus(error.data?.status);
          console.error("API.wgpeer() error:", error);
        });
    }
  }, [labsdata.data]);

  if (labsdata.isLoading) {
    return (
      <PageCenter>
        <PageLoading />
      </PageCenter>
    );
  } else if (labsdata.isError) {
    return (
      <PageCenter>
        <h2>{labsdata.error?.data?.detail} 🪪</h2>
      </PageCenter>
    );
  } else {
    let labdata = labsdata.data?.data?.data;

    return (
      <div className="ubuntu-container">
        <Breadcrumb>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="24"
            viewBox="0 0 30 30"
            fill="none"
          >
            <path
              d="M8.75 12.5C8.75 10.7322 8.75 9.84835 9.29918 9.29918C9.84835 8.75 10.7322 8.75 12.5 8.75H17.5C19.2677 8.75 20.1516 8.75 20.7009 9.29918C21.25 9.84835 21.25 10.7322 21.25 12.5V17.5C21.25 19.2677 21.25 20.1516 20.7009 20.7009C20.1516 21.25 19.2677 21.25 17.5 21.25H12.5C10.7322 21.25 9.84835 21.25 9.29918 20.7009C8.75 20.1516 8.75 19.2677 8.75 17.5V12.5Z"
              //stroke="#B4B5B7"
              strokeWidth="2"
            />
            <path
              d="M15.5358 12.5L13.75 15H16.25L14.4642 17.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 15C5 10.286 5 7.92894 6.46446 6.46446C7.92894 5 10.286 5 15 5C19.714 5 22.0711 5 23.5355 6.46446C25 7.92894 25 10.286 25 15C25 19.714 25 22.0711 23.5355 23.5355C22.0711 25 19.714 25 15 25C10.286 25 7.92894 25 6.46446 23.5355C5 22.0711 5 19.714 5 15Z"
              //stroke="#B4B5B7"
              strokeWidth="2"
            />
            <path
              d="M5 15H2.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M27.5 15H25"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M5 11.25H2.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M27.5 11.25H25"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M5 18.75H2.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M27.5 18.75H25"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 25V27.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M15 2.5V5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M11.25 25V27.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M11.25 2.5V5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18.75 25V27.5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M18.75 2.5V5"
              //stroke="#B4B5B7"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <Link href={username + "/labs"}>Labs</Link>
          {params.labs.map((a) => (
            <React.Fragment key={a}>
              {" / "} {a}
            </React.Fragment>
          ))}
        </Breadcrumb>

        <div className="flex">
          <div className="ubuntu">
            <img alt="" src="/pro.png" width="80px" />
            <div className="alter">
              <h1>ubuntu labs</h1>
              <span>LTE 22.04 version with root access</span>
              <div className="button">
                <Badge
                  color={wgpeerStatus ? "success" : "error"}
                  value={wgpeerStatus ? "Running" : "Not Running"}
                ></Badge>
                <Badge
                  color={wgpeerStatus ? "success" : "error"}
                  value={wgpeerStatus ? "online" : "offline"}
                ></Badge>
                <Badge
                  color={labdata[0]?.vsCode ? "info" : "warning"}
                  value={labdata[0]?.vsCode ? "public" : "private"}
                ></Badge>
              </div>
            </div>
          </div>
          <div className="button">
            {wgpeerStatus && (
              <Button
                value="code"
                color="info"
                onClick={() => UpVSCode.mutate()}
              >
                <Terminal />
              </Button>
            )}
            {wgpeerStatus || (
              <Button
                value={containerDeploy ? "deploing" : "deploy"}
                color="success"
                onClick={() => {
                  setContainerDeploy(true);
                  return DeployAndRedeploy.mutate();
                }}
              >
                {containerDeploy ? <LoadingEffect /> : <Retry />}
              </Button>
            )}

            {wgpeerStatus && (
              <Button
                value={containerDeploy ? "Redeploing" : "Redeplay"}
                color="warning"
                onClick={() => DeployAndRedeploy.mutate()}
              >
                {containerDeploy ? <LoadingEffect /> : <Play />}
              </Button>
            )}

            {wgpeerStatus && (
              <Button
                value={containerStop ? "stoping" : "stop"}
                color="error"
                onClick={() => handleClick("stop")}
              >
                {containerStop ? <LoadingEffect /> : <Stop />}
              </Button>
            )}
          </div>
        </div>

        {/* if container deploy na this content will show */}
        {labdata.length > 0 ? (
          <div className="content">
            <div className="left">
              <h3>Read Me</h3>
              <p>
                This server is accessible through Code or SSH. Code is
                accessible under VPN in one click and you do not have to SSH
                into your lab, becuase Code works on your browser without any
                additional setup. Just ensure you are connected to <Link href={`https://www.wireguard.com/`} target="_blank"><b>VPN</b></Link>. <br />
                Code is an embedded VS Code that runs from within this lab and
                let you access your lab effortlessly over web. To keep you
                secure, this password changes during every redeploy. For a more
                convinient development experience, consider installing <Link href={`https://code.visualstudio.com/`} target="_blank"><b>Visual Studio Code </b></Link>
                Desktop and connect via SSH.
              </p>
            </div>
            <div className="right">
              <h3>Lab information</h3>

              <div className="prop">
                <h4>IP Address</h4>
                <span>
                  <b>{labdata[0]?.wgipAddress}</b>
                  <Copy value="VPN IP Address" />
                </span>
              </div>
              <div className="prop">
                <h4>UserName</h4>
                <span>
                  <b>{labdata[0]?.username}</b>
                  <Copy value="Instance Name" />
                </span>
              </div>
              <div className="prop">
                <h4>Password</h4>
                <span>
                  <b>{labdata[0]?.password}</b>
                  <Copy value="Instance Password" />
                </span>
              </div>
              <div className="prop">
                <h4>SSH</h4>
                <span>
                  <b>{`${labdata[0]?.username}@${labdata[0]?.wgipAddress}`}</b>
                  <Copy value="SSH Connnection" />
                </span>
              </div>
              <div className="prop">
                <h4>Code-Server</h4>
                <span>
                  <b>
                    {labdata[0]?.vsCode
                      ? labdata[0]?.vsCode
                      : "please click the code"}
                  </b>
                  <Copy value="Code-Server" />
                </span>
              </div>
              <div className="prop">
                <h4>Password</h4>
                <span>
                  <b>
                    {labdata[0]?.vsPassword
                      ? labdata[0]?.vsPassword
                      : "************"}
                  </b>
                  <Copy value="Code-Server Password" />
                </span>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {/* terminal */}
        <div className="terminal-main-box">
          <div className="terminal-container">
            <h1>Terminal</h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`${Terminalstate && "active"}`}
              onClick={() => setTerminalstate((a) => !a)}
            >
              <path
                d="M12 2C9.34784 2 6.8043 3.05357 4.92893 4.92893C3.05357 6.8043 2 9.34784 2 12C2 13.3132 2.25866 14.6136 2.7612 15.8268C3.26375 17.0401 4.00035 18.1425 4.92893 19.0711C5.85752 19.9997 6.95991 20.7362 8.17317 21.2388C9.38642 21.7413 10.6868 22 12 22C13.3132 22 14.6136 21.7413 15.8268 21.2388C17.0401 20.7362 18.1425 19.9997 19.0711 19.0711C20.9464 17.1957 22 14.6522 22 12C22 9.34784 20.9464 6.8043 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2ZM12 4C14.1217 4 16.1566 4.84285 17.6569 6.34315C19.1571 7.84344 20 9.87827 20 12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12C4 9.87827 4.84285 7.84344 6.34315 6.34315C7.84344 4.84285 9.87827 4 12 4ZM7 10L12 15L17 10L7 10Z"
                fill="black"
              />
            </svg>
          </div>
          <div className={`new ${Terminalstate && "active"}`}>
            <div className="prompt" id="prompt">
              <div>{host}</div>
              {terminalMessages?.map((a, i) => (
                <div className="mqttlogs" key={a + i}>
                  {a}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const Terminal = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="19"
      viewBox="0 0 21 19"
      fill="none"
    >
      <path
        d="M18.3335 16.3333V4.33334H2.3335V16.3333H18.3335ZM18.3335 0.333344C18.8639 0.333344 19.3726 0.544057 19.7477 0.91913C20.1228 1.2942 20.3335 1.80291 20.3335 2.33334V16.3333C20.3335 16.8638 20.1228 17.3725 19.7477 17.7476C19.3726 18.1226 18.8639 18.3333 18.3335 18.3333H2.3335C1.80306 18.3333 1.29436 18.1226 0.919282 17.7476C0.54421 17.3725 0.333496 16.8638 0.333496 16.3333V2.33334C0.333496 1.22334 1.2335 0.333344 2.3335 0.333344H18.3335ZM11.3335 14.3333V12.3333H16.3335V14.3333H11.3335ZM7.9135 10.3333L3.9035 6.33334H6.7335L10.0335 9.63334C10.4235 10.0233 10.4235 10.6633 10.0335 11.0533L6.7535 14.3333H3.9235L7.9135 10.3333Z"
        fill="white"
      />
    </svg>
  );
};

const Retry = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="24"
      viewBox="0 0 19 24"
      fill="none"
    >
      <path
        d="M0.666504 0.333344V23.6667L18.9998 12L0.666504 0.333344Z"
        fill="white"
      />
    </svg>
  );
};
const Play = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
    >
      <path
        d="M12.8335 5H11.3335V10L15.6135 12.54L16.3335 11.33L12.8335 9.25V5ZM12.3335 0C9.94655 0 7.65736 0.948211 5.96953 2.63604C4.28171 4.32387 3.3335 6.61305 3.3335 9H0.333496L4.2935 13.03L8.3335 9H5.3335C5.3335 7.14348 6.07099 5.36301 7.38375 4.05025C8.6965 2.7375 10.477 2 12.3335 2C14.19 2 15.9705 2.7375 17.2832 4.05025C18.596 5.36301 19.3335 7.14348 19.3335 9C19.3335 10.8565 18.596 12.637 17.2832 13.9497C15.9705 15.2625 14.19 16 12.3335 16C10.4035 16 8.6535 15.21 7.3935 13.94L5.9735 15.36C7.6035 17 9.8335 18 12.3335 18C14.7204 18 17.0096 17.0518 18.6975 15.364C20.3853 13.6761 21.3335 11.3869 21.3335 9C21.3335 6.61305 20.3853 4.32387 18.6975 2.63604C17.0096 0.948211 14.7204 0 12.3335 0Z"
        fill="white"
      />
    </svg>
  );
};

const Stop = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
    >
      <path
        d="M5.6035 0L0.333496 5.27V12.73L5.6035 18H13.0635L18.3335 12.73V5.27L13.0635 0M5.7435 4L9.3335 7.59L12.9235 4L14.3335 5.41L10.7435 9L14.3335 12.59L12.9235 14L9.3335 10.41L5.7435 14L4.3335 12.59L7.9235 9L4.3335 5.41"
        fill="white"
      />
    </svg>
  );
};
