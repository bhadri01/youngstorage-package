"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import Alerts from "@/components/alerts";

// import { useQueryClient } from "@tanstack/react-query";

function Labs({ params }) {
  const router = useRouter();
  const ChangePath = (route) => {
    router.push(route);
  };
  return (
    <>
      <div className="lab-container">
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
          <Link href={"/" + params?.username + "/labs"}>labs</Link>{" "}
        </Breadcrumb>
        <Alerts value="You Can Access Our Various Labs And Gain Enormous Knowledge On Multiple Domains" />

        <div className="lab-box">
          <div className="labs" onClick={() => ChangePath("labs/ubuntu")}>
            <img src="/ubuntu.png" />
            <button>Dashboard</button>
          </div>
          <div className="labs">
            <img src="/parrotos.png" />
            <button>Dashboard</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Labs;
