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
import axios from "axios";
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
        <h2>{networks.error?.data?.detail} 🪪</h2>
      </PageCenter>
    );
  } else {
    let domains = networks.data?.data?.data;
    return (
      <div className="domain-container">
        {/* components for headers */}
        <Breadcrumb>
          <Link href={params?.username + "/domains"}>domains</Link>
          <ToolTips name="" />
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
                      <span className="domain-name">{a.domainName}</span>
                      {/* <Badge value="Not Mapped" color="btn-error" /> */}
                      <Badge value="Ubuntu" color="ubu-badge"/>
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
                        colors="primary:#121331"
                        style={{ width: 30, height: 30 }}
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
