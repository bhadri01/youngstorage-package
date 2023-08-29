"use client";

import Button from "@/components/button";
import React, { useState } from "react";
import Dropdown from "@/components/dropdown";
import { API, Token } from "@/api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Badge from "@/components/badge";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import { Toast } from "@/components/alert";
import "@/styles/userAccount/domains.scss";
import ToolTips from "@/components/ToolTips";
import { PageCenter, PageLoading } from "@/components/pageLoading";

const options = [
  { label: ".youngstorage.in", value: "youngstorage.in" },
  { label: ".youngstorage.tech", value: "youngstorage.tech" },
];

function Domains({ params }) {
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

  const dropdomain = useMutation({
    mutationFn: (body) => API.dropDomain(body),
    onSuccess: (res) => {
      // Invalidate and refetch
      Toast.success(res?.data?.message);
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
              strokeWidth="2"
            />
          </svg>
          <Link href={params?.username + "/domains"}>domains</Link>
        </Breadcrumb>

        {domains.length > 0 ? (
          <>
            <div className="domain">
              <img alt="" src="/Website.png" />
              <span>Reserve your domain</span>
            </div>
            <div className="get-domains">
              <input
                type="text"
                placeholder="Type your Domain name"
                value={domainname}
                onChange={(e) => setDomainname(e.target.value)}
              />
              <Dropdown
                className="drop"
                options={options}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
              />
              <Button value="Get Domain" onClick={AddDomain}></Button>
            </div>

            <div className="domain-add-list">
              <div className="adjust">
                <div className="any">
                  <div className="flex">
                    <h3>
                      Add your <b>Domains</b>
                    </h3>
                    <Button
                      value={`${domains[0].currentDomain} / ${domains[0].maxDomain}`}
                    ></Button>
                  </div>
                  <div className="adjustment">
                    <img alt="" src="/grid2.png" width="30px" height="50px" />
                    <img
                      alt=""
                      src="/alignleft.png"
                      width="30px"
                      height="50px"
                    />
                  </div>
                </div>
              </div>
              <hr />

              {/* card to display in prompt */}
              <div className="domains-list">
                {domains[0]?.domainList?.map((a) => (
                  <div className="dot" key={a.domainName}>
                    <div className="gap">
                      <span className="domain-name"><Link href={`https://${a.domainName}`} target="_blank">{a.domainName}</Link></span>
                      {/* <Badge value="Not Mapped" color="btn-error" /> */}
                      <Badge value="Ubuntu" color="ubu-badge" />
                    </div>
                    <div
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>first build the lab</h1>
            <Link href="/dashboard/labs">labs</Link>
          </>
        )}
      </div>
    );
  }
}

export default Domains;
