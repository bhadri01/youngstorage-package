"use client";

import React from "react";
import "@/styles/userAccount/networks.scss";
import { useEffect, useState } from "react";
import { API } from "@/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Badge from "@/components/badge";
import Button from "@/components/button";
import Dropdown from "@/components/dropdown";
import Breadcrumb from "@/components/Breadcrumb";
import { APIQuery } from "@/api/queryMethod";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { Toast } from "@/components/alert";
import Alerts from "@/components/alerts";

const options = [
  { label: "Laptop", value: "Laptop" },
  { label: "Desktop", value: "Desktop" },
  { label: "Mobile", value: "Mobile" },
  { label: "Tablet", value: "Tablet" },
  { label: "IOT", value: "IOT" },
];
// import DeviceList from "@/components/DeviceList";

export default function Network({ params }) {
  const [addDevice, SetAdd] = useState(false);
  const [peerAcccess, setPeerAccess] = useState({
    status: false,
    publicKey: "",
    title: "",
  });
  const networks = APIQuery("networks", () => API.networks(), 5000);

  const wgpeerdata = APIQuery("wgperrdata", () => API.getwgpeer(), 5000);

  if (networks.isLoading && wgpeerdata.isLoading) {
    return (
      <PageCenter>
        <PageLoading />
      </PageCenter>
    );
  } else if (networks.isError && wgpeerdata.isError) {
    return (
      <PageCenter>
        <h2>{networks.error?.data?.message} 🪪</h2>
        <h2>{wgpeerdata.error?.data?.message} 🪪</h2>
      </PageCenter>
    );
  } else {
    const handleClick = () => {
      SetAdd(true);
    };
    if (
      networks.data?.data?.data.length &&
      wgpeerdata.data?.data?.data.length
    ) {
      let network = networks.data.data?.data[0];
      let device = [...network?.labPeer].concat(...network?.peerList);
      let wgpeer = wgpeerdata.data?.data?.data;
      return (
        <>
          <div className="net">
            <div className="network-container">
              <div className="network">
                <Breadcrumb>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="28"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <path
                      d="M14.75 11.25V10.25H13.75H12.5C11.6648 10.25 11 9.58522 11 8.75V5C11 4.16478 11.6648 3.5 12.5 3.5H17.5C18.3352 3.5 19 4.16478 19 5V8.75C19 9.58522 18.3352 10.25 17.5 10.25H16.25H15.25V11.25V13.75V14.75H16.25H26.5V15.25H22.5H21.5V16.25V18.75V19.75H22.5H23.75C24.5852 19.75 25.25 20.4148 25.25 21.25V25C25.25 25.8352 24.5852 26.5 23.75 26.5H18.75C17.9148 26.5 17.25 25.8352 17.25 25V21.25C17.25 20.4148 17.9148 19.75 18.75 19.75H20H21V18.75V16.25V15.25H20H10H9V16.25V18.75V19.75H10H11.25C12.0852 19.75 12.75 20.4148 12.75 21.25V25C12.75 25.8352 12.0852 26.5 11.25 26.5H6.25C5.41478 26.5 4.75 25.8352 4.75 25V21.25C4.75 20.4148 5.41478 19.75 6.25 19.75H7.5H8.5V18.75V16.25V15.25H7.5H3.5V14.75H13.75H14.75V13.75V11.25ZM12.5 4H11.5V5V8.75V9.75H12.5H17.5H18.5V8.75V5V4H17.5H12.5ZM6.25 20.25H5.25V21.25V25V26H6.25H11.25H12.25V25V21.25V20.25H11.25H6.25ZM18.75 20.25H17.75V21.25V25V26H18.75H23.75H24.75V25V21.25V20.25H23.75H18.75Z"
                      strokeWidth="1.5"
                    />
                  </svg>
                  <Link href={"/" + params?.username + "/networks"}>
                    Networks
                  </Link>
                </Breadcrumb>
                <Alerts value="Network Is A Area There We Can Generate A VPN And The Lab Will Be Connected Automatically In A Single Click And We Can Make It As Seamless" />
                {network ? (
                  <div className="device">
                    <div className="man">
                      <div className="crumbs">
                        <button
                          className="button"
                          onClick={() => handleClick()}
                        >
                          add device
                        </button>
                        <button className="button1">
                          {device.length} / {network?.maxPeer + 1}
                        </button>
                      </div>

                      <div className="ions">
                        <img alt="" src="/grid2.png" />
                        <img alt="" src="/alignleft.png" />
                      </div>
                    </div>
                    <hr />
                    <div className="devices-list">
                      {device?.map((a, index) => {
                        let current = wgpeer?.filter(
                          (e) => a?.publicKey == e?.peer
                        );
                        let time = current[0]
                          ? current[0]["latest handshake"].split(":")
                          : [];
                        let filltime = "";
                        // this is for the get the time status for peer online and ofline
                        let peerstate = false;
                        if (time.length > 2) {
                          if (time.length == 4) {
                            filltime = `${time[0]} day ago`;
                          } else if (time.length == 3) {
                            filltime = `${time[0]} hours ago`;
                          }
                          peerstate = false;
                        } else if (time.length == 1 && time[0] != "") {
                          filltime = `${time[0]} seconds ago`;
                          peerstate = true;
                        } else if (time.length == 2) {
                          filltime = `${time[0]} minutes ${time[1]} seconds ago`;
                          peerstate = parseInt(time[0]) <= 2;
                          if (parseInt(time[0]) == 2 && parseInt(time[1]) > 2) {
                            peerstate = false;
                          }
                        }
                        return (
                          <div className="device-box" key={a.ipAddress}>
                            <div className="flex">
                              <h3>{a.deviceName}</h3>
                              <Badge
                                value={`${peerstate ? "online" : "offline"}`}
                                color={`${peerstate ? "success" : "error"}`}
                              ></Badge>
                            </div>
                            <div className="lab">
                              <span>{a.deviceType}</span>
                              <h6>{GetCreatedTime(a?.createdAt)}</h6>
                            </div>
                            <div className="must"></div>
                            <div className="address">
                              <span>IP Address</span>
                              <span>{a.ipAddress}</span>
                            </div>
                            <div className="address">
                              <span>endpoint</span>
                              <span>
                                {current[0]?.endpoint
                                  ? current[0]?.endpoint
                                  : "⌛"}
                              </span>
                            </div>
                            <div className="address">
                              <span>latest handshake</span>
                              <span>{filltime ? filltime : "🚫"}</span>
                            </div>
                            <div className="address">
                              <span>transfer</span>
                              <span>
                                {current[0]?.transfer?.received
                                  ? current[0]?.transfer?.received
                                  : "0"}{" "}
                                received ,{" "}
                                {current[0]?.transfer?.sent
                                  ? current[0]?.transfer?.sent
                                  : "0"}{" "}
                                sent
                              </span>
                            </div>
                            {index == 0 ? (
                              ""
                            ) : (
                              <div className="png">
                                <div
                                  onClick={() =>
                                    setPeerAccess((i) => ({
                                      ...i,
                                      status: true,
                                      publicKey: a?.publicKey,
                                      title: "png",
                                    }))
                                  }
                                >
                                  <img
                                    alt=""
                                    src="/qr.png"
                                    width={20}
                                    height={20}
                                  />
                                  <span>scan</span>
                                </div>

                                {/* <div
                                onClick={() =>
                                  setPeerAccess((i) => ({
                                    ...i,
                                    status: true,
                                    publicKey: a?.publicKey,
                                    title: "download",
                                  }))
                                }
                              >
                              </div> */}

                                <div
                                  onClick={() =>
                                    setPeerAccess((i) => ({
                                      ...i,
                                      status: true,
                                      publicKey: a?.publicKey,
                                      title: "conf",
                                    }))
                                  }
                                >
                                  <img
                                    alt=""
                                    src="/information.png"
                                    width={20}
                                    height={20}
                                  />
                                  <span>info</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <h1>first build the lab</h1>
                    <Link href="/dashboard/labs">labs</Link>
                  </>
                )}
              </div>
            </div>
            {addDevice && <Popup setAdd={SetAdd} />}
            {peerAcccess.status && (
              <PeerDataGet {...peerAcccess} setPeerAccess={setPeerAccess} />
            )}
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="net">
            <div className="network-container">
              <div className="network">
                <Breadcrumb>
                  <b> Networks</b>
                </Breadcrumb>
                <>
                  <h1>first build the lab</h1>
                  <Link href="/dashboard/labs">labs</Link>
                </>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
}

const Popup = (props) => {
  const queryClient = useQueryClient();

  const [devicedata, setDevicedata] = useState({
    deviceName: "",
    deviceType: "",
  });

  const addPeer = useMutation({
    mutationFn: (body) => {
      return API.addpeer(body);
    },
    onSuccess: (res) => {
      // Invalidate and refetch
      Toast.success(res?.data?.message);
      queryClient.invalidateQueries("networks");
      props.setAdd(false);
    },
    onError: (error) => {
      Toast.error(error?.data?.message || res?.data?.detail);
    },
  });

  const AddnewDevice = () => {
    if (devicedata.deviceName && selectedOption) {
      addPeer.mutate({
        deviceName: devicedata.deviceName,
        deviceType: selectedOption,
      });
    } else {
      Toast.error("please add the device details");
    }
  };
  const [selectedOption, setSelectedOption] = useState(options[0].value);

  return (
    <div className="pop-container">
      <div className="add-devices-box">
        <div className="pop">
          <span>Add new device to the network</span>
          <img alt="" src="/Close.png" onClick={() => props.setAdd(false)} />
        </div>

        <div className="whole">
          <div className="box">
            <div className="label">
              <label>Device name</label>
              <input
                type="text"
                placeholder="Test Device"
                name="deviceName"
                value={devicedata.deviceName}
                onChange={(e) => {
                  setDevicedata((a) => ({
                    ...a,
                    [e.target.name]: e.target.value,
                  }));
                }}
              />
            </div>
          </div>
          <div className="box">
            <div className="label">
              <label>Device type</label>
              {/* <input
                type="text"
                placeholder="Desktop | Mobile | tab"
                name="deviceType"
                value={devicedata.deviceType}
                onChange={(e) => {
                  <Dropdown className="drop"
                    options={options}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption} />
                  setDevicedata((a) => ({
                    ...a,
                    [e.target.name]: e.target.value,
                  }));
                }}
              /> */}
              <Dropdown
                className="drop"
                options={options}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
            </div>
          </div>
          <div className="button">
            <button className="button3" onClick={() => props.setAdd(false)}>
              cancel
            </button>
            <button className="button4" onClick={AddnewDevice}>
              add device
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PeerDataGet = (props) => {
  const [data, setData] = useState("");
  useEffect(() => {
    (async () => {
      if (props.title == "png") {
        const res = await API.wgpeer(props.publicKey, props.title, {
          responseType: "arraybuffer",
        });
        if (res.status == 200) {
          const blob = new Blob([res.data], { type: "image/png" });
          const url = window.URL.createObjectURL(blob);
          setData(url);
        }
      } else if (props.title == "conf") {
        const res = await API.wgpeer(props.publicKey, props.title);

        if (res.status == 200) {
          const blob = new Blob([res.data], { type: "text/plain" });
          const url = window.URL.createObjectURL(blob);
          setData({ data: res.data.split("\n"), url });
        }
      }
    })();
  }, []);
  return (
    <div className="pop-container">
      <span
        onClick={() => {
          props.setPeerAccess({ status: false, publicKey: "", title: "" });
        }}
        className="timesclose"
      >
        &times;
      </span>
      <div className="qr-conf">
        {props.title == "png" ? (
          <>Scan Qr to connect our vpn using wireguard applicatiion </>
        ) : props.title == "conf" ? (
          <>Configuration file</>
        ) : (
          ""
        )}

        {props.title == "png" && data && <img src={data} />}
        <pre>
          {props.title == "conf" && data && (
            <div className="spray">
              {data?.data?.map((a, i) => (
                <div key={a + i}>{a}</div>
              ))}
              <a href={data?.url} download="wg0.conf">
                <div className="inside-info">
                  <Button value="Download">
                    {" "}
                    <img alt="" src="/download.png" width={20} height={20} />
                  </Button>
                </div>
              </a>
            </div>
          )}
          <span>
            Click The Download Button To Download Your Configurations & <br />
            Import It As Your Convinence
          </span>
        </pre>
      </div>
    </div>
  );
};

export const GetCreatedTime = (time) => {
  // Replace 1691151014 with your Unix timestamp
  const unixTimestamp = parseInt(time);

  // Convert Unix timestamp to milliseconds
  const timestampInMilliseconds = unixTimestamp * 1000;

  // Create Date objects for the given timestamp and the current time
  const givenDate = new Date(timestampInMilliseconds);
  const currentDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDifference = currentDate - givenDate;

  // Define time units in milliseconds
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const month = 30 * day;
  const year = 365 * day;

  // Determine the appropriate time unit and value
  let timeAgo;
  if (timeDifference < minute) {
    timeAgo = `${Math.floor(timeDifference / 1000)} seconds ago`;
  } else if (timeDifference < hour) {
    timeAgo = `${Math.floor(timeDifference / minute)} minutes ago`;
  } else if (timeDifference < day) {
    timeAgo = `${Math.floor(timeDifference / hour)} hours ago`;
  } else if (timeDifference < month) {
    timeAgo = `${Math.floor(timeDifference / day)} days ago`;
  } else if (timeDifference < year) {
    timeAgo = `${Math.floor(timeDifference / month)} months ago`;
  } else {
    timeAgo = `${Math.floor(timeDifference / year)} years ago`;
  }

  return timeAgo;
};
