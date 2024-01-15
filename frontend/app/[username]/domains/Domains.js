"use client";
import Button from "@/components/button";
import React, { useContext, useEffect, useState } from "react";
import Dropdown from "@/components/dropdown";
import { API } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Badge from "@/components/badge";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Toast } from "@/components/alert";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { GetCreatedTime } from "../networks/page";
import { TextField, Tooltip, Typography } from "@mui/material";
import Alerts from "@/components/alerts";
import { NavContext } from "../layout";
import { usePathname } from "next/navigation";
import VpnLockIcon from '@mui/icons-material/VpnLock';
import { options, MapestheDomain } from "./page";

export function Domains({ params }) {
    const navpath = useContext(NavContext);
    const pathname = usePathname();
    useEffect(() => {
        navpath.setNav(pathname);
    }, []);
    const [selectedOption, setSelectedOption] = useState(options[0].value);
    const [domainname, setDomainname] = useState("");
    const queryClient = useQueryClient();
    const networks = useQuery({
        queryKey: ["networks"],
        queryFn: () => API.networks(),
        refetchOnWindowFocus: false,
        retry: 1,
        cacheTime: 50000,
    });

    useEffect(() => {
        // Add an event listener to check the screen width and update the state
        const handleResize = () => {
            const isMobile = window.innerWidth <= 768; // Adjust the screen width threshold as needed
            if (isMobile) {
                setDomainname(""); // Clear the input on mobile view
            }
        };

        // Initial check and event listener
        handleResize();
        window.addEventListener("resize", handleResize);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    //this code is to deploy the container
    const DeployAndRedeploy = useMutation({
        mutationFn: () => {
            return API.deploySpawn();
        },
        onSuccess: () => {
            Toast.success("labs are ready to play");
        },
    });

    const dropdomain = useMutation({
        mutationFn: (body) => API.dropDomain(body),
        onSuccess: (res) => {
            // Invalidate and refetch
            Toast.success(res?.data?.message);
            DeployAndRedeploy.mutate();
            queryClient.invalidateQueries("networks");
        },
        onError: (error) => {
            Toast.error(
                error?.data?.message || error?.data?.detail?.length > 0
                    ? error?.data?.detail[0]?.msg
                    : error?.data?.detail
            );
        },
    });

    const adddomain = useMutation({
        mutationFn: (body) => API.addomain(body),
        onSuccess: (res) => {
            // Invalidate and refetch
            Toast.success(res?.data?.message);
            queryClient.invalidateQueries("networks");
        },
        onError: (error) => {
            Toast.error(error?.data?.message);
        },
    });



    const updatedomain = useMutation({
        mutationFn: (body) => API.updatedomain(body),
        onSuccess: (res) => {
            // Invalidate and refetch
            Toast.success(res?.data?.message);
            DeployAndRedeploy.mutate();
            queryClient.invalidateQueries("networks");
        },
        onError: (error) => {
            Toast.error(error?.data?.message);
        },
    });

    const AddDomain = () => {
        if (selectedOption && domainname) {
            adddomain.mutate({
                domainName: `${domainname}.${selectedOption}`,
            });
            setDomainname("");
        } else {
            Toast.error("Type your domain name");
        }
    };

    const [MaptheDomain, setMaptheDomain] = useState({ status: false, details: null });

    if (networks.isLoading) {
        return (
            <PageCenter>
                <PageLoading />
            </PageCenter>
        );
    } else if (networks.isError) {
        return (
            <PageCenter>
                <h2>{networks.error?.data?.message} 🪪</h2>
            </PageCenter>
        );
    } else {
        let domains = networks.data?.data?.data;
        return (
            <div className="domain-container">
                {/* components for headers */}
                <Breadcrumb>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="24"
                        viewBox="0 0 30 30"
                        fill="none"
                    >
                        <path
                            d="M20.45 11.5H19.3215L19.4573 12.6203C19.5551 13.4273 19.625 14.2075 19.625 15C19.625 15.4534 19.6007 15.9052 19.5598 16.3624C19.3792 16.4643 19.2028 16.5726 19.031 16.6871C19.0875 16.1397 19.125 15.5778 19.125 15C19.125 14.0841 19.0308 13.1953 18.9156 12.3628L18.7961 11.5H17.925H12.075H11.2171L11.0866 12.3479C10.9551 13.2027 10.875 14.0915 10.875 15C10.875 15.9095 10.9553 16.7854 11.0863 17.6498L11.2151 18.5H12.075H17.0724C16.9452 18.662 16.8238 18.8288 16.7085 19H12.6125H11.2855L11.6512 20.2756C12.1979 22.1823 13.0874 23.9427 14.1776 25.5189L14.8556 26.4991C8.59863 26.421 3.5 21.2745 3.5 15C3.5 8.72619 8.55937 3.58331 14.8468 3.501L14.1776 4.46865C13.0861 6.0466 12.1974 7.8195 11.6512 9.72439L11.2855 11H12.6125H17.3875H18.7145L18.3488 9.72439C17.8026 7.8195 16.9139 6.0466 15.8224 4.46865L15.1532 3.50101C21.4061 3.58381 26.5 8.72841 26.5 15C26.5 15.2359 26.4915 15.4698 26.4755 15.7024C26.3141 15.6479 26.1503 15.5983 25.9843 15.5538C25.9945 15.3717 26 15.1871 26 15C26 14.041 25.861 13.121 25.6451 12.2575L25.4558 11.5H24.675H20.45ZM15.1346 26.4991L15.5335 25.9306C15.5826 26.1149 15.6377 26.2967 15.6988 26.4758C15.5117 26.4886 15.3237 26.4965 15.1346 26.4991ZM4.35486 17.7425L4.54422 18.5H5.325H9.55H10.6785L10.5427 17.3797C10.4449 16.5727 10.375 15.7925 10.375 15C10.375 14.2075 10.4449 13.4273 10.5427 12.6203L10.6785 11.5H9.55H5.325H4.54422L4.35486 12.2575C4.13896 13.121 4 14.041 4 15C4 15.959 4.13896 16.879 4.35486 17.7425ZM6.35 19H4.62034L5.48338 20.499C6.79112 22.7703 8.90809 24.5292 11.4245 25.3955L13.849 26.2302L12.6297 23.9745C11.9232 22.6674 11.3857 21.24 10.963 19.7304L10.7585 19H10H6.35ZM10 11H10.7585L10.963 10.2696C11.3857 8.76001 11.9232 7.33263 12.6297 6.02552L13.8403 3.78599L11.4291 4.60288C8.90835 5.45691 6.78975 7.21831 5.48208 9.5033L4.62553 11H6.35H10ZM18.5614 4.60392L16.1415 3.77535L17.3578 6.02552C18.0663 7.3362 18.6126 8.75911 18.9937 10.248L19.1863 11H19.9625H23.65H25.3835L24.5157 9.49937C23.1956 7.21679 21.0914 5.47017 18.5614 4.60392ZM23.5 22.5V19.75H24V22.5V23.5H25H27.75V24H25H24V25V27.75H23.5V25V24H22.5H19.75V23.5H22.5H23.5V22.5Z"
                            strokeWidth="2" />
                    </svg>
                    <Link href={"/" + params?.username + "/domains"}>domains</Link>
                </Breadcrumb>

                <Alerts value="reserve your domain. After successfull domain mapping your lab will automatically redeploy to make changes publicly" />

                {domains.length > 0 ? (
                    <>
                        {MaptheDomain.status && <MapestheDomain labs={domains[0]?.labPeer} details={MaptheDomain.details} setMaptheDomain={setMaptheDomain} updatedomain={updatedomain} />}
                        <div className="domain">
                            {/* <img alt="" src="/Website.png" /> */}
                            <VpnLockIcon className='https-icon' />
                            <span>Reserve your domain</span>
                        </div>
                        <div className="get-domains">
                            {/* < <input
                          type="text"
                          placeholder="Type your Domain name"
                          value={domainname}
                          className="inputBox"
                          onChange={(e) => setDomainname(e.target.value)}
                        /> */}
                            <TextField
                                onChange={(e) => setDomainname(e.target.value)}
                                id="standard-basic"
                                placeholder="Type your Domain name"
                                label="Domain name"
                                variant={window.innerWidth <= 768 ? "outlined" : "standard"} // Change the variant based on screen width
                                className="input-box-size"
                                InputProps={{
                                    disableUnderline: true, // This removes the bottom underline
                                }} defaultValue={domainname.length === 0 ? '' : domainname} />
                            <Dropdown
                                className="drop"
                                options={options}
                                selectedOption={selectedOption}
                                setSelectedOption={setSelectedOption} />
                            <Button value="Get Domain" onClick={AddDomain} disabled={domainname.length === 0}></Button>
                        </div>

                        <div className="domain-add-list">
                            <div className="adjust">
                                <div className="any">
                                    <div className="flex">
                                        <Typography variant="h3">
                                            Add your <b>Domains</b>
                                        </Typography>
                                        <Button
                                            value={`${domains[0].currentDomain} / ${domains[0].maxDomain}`}
                                        ></Button>
                                    </div>
                                    {/* <div className="adjustment">
                          <img alt="" src="/grid2.png" width="30px" height="50px" />
                          <img
                            alt=""
                            src="/alignleft.png"
                            width="30px"
                            height="50px"
                          />
                        </div> */}
                                </div>
                            </div>
                            <hr />

                            {/* card to display in prompt */}
                            <div className="domains-list">
                                {domains[0]?.domainList?.map((a) => (
                                    <div className="dot" key={a.domainName} style={{
                                        border: a.mapstatus ? "1px solid var(--success)" : "1px solid var(--error)"
                                    }}>
                                        <div className="gap">
                                            <div className="domain-name">
                                                <div className="domain-view">
                                                    <div className="domains-title">
                                                        <Link href={`https://${a.domainName}`} target="_blank">
                                                            {a.domainName}
                                                        </Link>
                                                        <Link href={`https://${a.domainName}`} target="_blank">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="11" viewBox="0 0 15 11" fill="none">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M7.37126 0.999399C7.37138 0.811593 7.42437 0.627615 7.52419 0.46853C7.624 0.309444 7.76659 0.181681 7.93564 0.0998694C8.10469 0.0180578 8.29337 -0.0144958 8.48006 0.0059361C8.66675 0.026368 8.84391 0.0989595 8.99126 0.215399L14.3393 4.4484C14.4575 4.54202 14.553 4.66118 14.6187 4.79695C14.6844 4.93271 14.7185 5.08158 14.7185 5.2324C14.7185 5.38322 14.6844 5.53208 14.6187 5.66785C14.553 5.80362 14.4575 5.92278 14.3393 6.0164L8.99226 10.2494C8.84492 10.3661 8.66766 10.439 8.48081 10.4596C8.29396 10.4802 8.10509 10.4477 7.93586 10.3658C7.76664 10.284 7.6239 10.1561 7.52404 9.99683C7.42418 9.83757 7.37123 9.65338 7.37126 9.4654V7.9204C6.61126 7.8774 5.88726 7.9234 5.11726 8.1384C4.12326 8.4174 2.99926 8.9954 1.61126 10.1284C1.45532 10.2576 1.2636 10.3361 1.0618 10.3532C0.860004 10.3704 0.657785 10.3254 0.482264 10.2244C0.295998 10.1172 0.150977 9.95079 0.0703244 9.75161C-0.0103279 9.55242 -0.0219666 9.33197 0.0372642 9.1254C0.452264 7.6254 1.46226 5.9844 2.84526 4.7134C4.06126 3.5964 5.61526 2.7234 7.37126 2.5244V0.999399ZM8.87126 2.0334V3.2334C8.87126 3.43231 8.79225 3.62308 8.65159 3.76373C8.51094 3.90438 8.32018 3.9834 8.12126 3.9834C6.53526 3.9834 5.05526 4.7214 3.86026 5.8184C3.22082 6.40722 1 8.5 2.09364 7.9204C2.97164 7.3684 3.92026 6.9164 4.71326 6.6944C5.96026 6.3444 7.09026 6.3644 8.20326 6.4874C8.38678 6.50758 8.55641 6.59475 8.67967 6.73222C8.80292 6.86968 8.87114 7.04777 8.87126 7.2324V8.4324L12.9133 5.2324L8.87126 2.0334Z" fill="black" />
                                                            </svg>
                                                        </Link>
                                                    </div>
                                                    <div className="domain-status">
                                                        <Tooltip title={a.mapto ? a.mapto : "Not Mapped"} placement="top">
                                                            <Badge value={a.mapto ? a.mapto : "Not Mapped"} color={a.mapstatus ? "success" : "error"} />
                                                        </Tooltip>
                                                        {/* {a.mapstatus &&
                                  <Tooltip title={a.port ? `${a.mapto} mapped port` : a.folder && `${a.mapto} mapped folder`} placement="top">
                                    <Badge value={a.port | a.folder} color={"info"} />
                                  </Tooltip>
                                } */}
                                                    </div>
                                                </div>
                                                <div className="domain-edit-view">
                                                    <div className="domain-edit-center">
                                                        <Tooltip title="map domain" placement="top">
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                onClick={() => setMaptheDomain({ status: true, details: a })}
                                                            >
                                                                <g clipPath="url(#clip0_502_477)">
                                                                    <path d="M14.1866 4.26666L7.8266 10.6266C7.19327 11.26 5.31325 11.5533 4.89325 11.1333C4.47325 10.7133 4.75991 8.83329 5.39325 8.19996L11.7599 1.83331C11.9169 1.66201 12.107 1.52432 12.3187 1.42852C12.5304 1.33272 12.7593 1.28079 12.9917 1.27589C13.2239 1.27101 13.4549 1.31323 13.6704 1.40004C13.8859 1.48685 14.0817 1.61645 14.2457 1.78098C14.4098 1.94551 14.5389 2.14158 14.6251 2.35735C14.7113 2.57313 14.7529 2.80413 14.7474 3.03643C14.7419 3.26873 14.6893 3.49753 14.5929 3.70896C14.4965 3.92039 14.3583 4.11012 14.1866 4.26666Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                    <path d="M7.3335 2.66663H4.00016C3.29292 2.66663 2.61468 2.94757 2.11458 3.44767C1.61449 3.94777 1.3335 4.62605 1.3335 5.33329V12C1.3335 12.7072 1.61449 13.3855 2.11458 13.8856C2.61468 14.3857 3.29292 14.6666 4.00016 14.6666H11.3335C12.8068 14.6666 13.3335 13.4666 13.3335 12V8.66663" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                </g>
                                                                <defs>
                                                                    <clipPath id="clip0_502_477">
                                                                        <rect width="16" height="16" fill="white" />
                                                                    </clipPath>
                                                                </defs>
                                                            </svg>
                                                        </Tooltip>
                                                        <Tooltip title="delete domain" placement="top">
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                width="16"
                                                                height="16"
                                                                viewBox="0 0 16 16"
                                                                fill="none"
                                                                onClick={async () => {
                                                                    dropdomain.mutate({ domainName: `${a.domainName}` });
                                                                }}
                                                            >
                                                                <path d="M6.6665 8V11.3333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M9.3335 8V11.3333" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M2.6665 4.66663H13.3332" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M4 6.66663V12C4 13.1046 4.89543 14 6 14H10C11.1046 14 12 13.1046 12 12V6.66663" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M6 3.33333C6 2.59695 6.59695 2 7.33333 2H8.66667C9.40307 2 10 2.59695 10 3.33333V4.66667H6V3.33333Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </Tooltip>
                                                    </div>

                                                    <span>{GetCreatedTime(a.createdAt)}</span>
                                                </div>
                                            </div>

                                        </div>
                                        {/* <div
                                  className="lottie"
                                  onClick={async () => {
                                    dropdomain.mutate({ domainName: `${a.domainName}` });
                                  }}
                                >
                                  <lord-icon
                                    src="https://cdn.lordicon.com/jmkrnisz.json"
                                    trigger="hover"
                                    style={{ width: 32, height: 32 }}
                                  ></lord-icon>
                                </div> */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>first build the lab</h1>
                        <Link href={`/${params?.username}/labs`}>labs</Link>
                    </>
                )}
            </div>
        );
    }
}
