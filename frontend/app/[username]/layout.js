"use client";
import React, { useRef, useState } from "react";
import "@/styles/userAccount/layout.scss";
import Navbar from "@/components/navbar";
import { usePathname, redirect } from "next/navigation";
import { API } from "@/api/api";
import { APIQuery } from "@/api/queryMethod";
import { PageLoading, PageCenter } from "@/components/pageLoading";

function UserAccountLayout({ children, params }) {
  const pathname = usePathname();
  const loading = useRef(true)
  const users = APIQuery("userAccount", () => API.user(params?.username));

  if (users.isLoading) {
    return (
      <PageCenter>
        <PageLoading />
      </PageCenter>
    );
  } else if (users.isError) {
    redirect("/auth/signin");
  } else {
    loading.current = false
    return (
      <>
        {
          loading.current ? "" : <div className="userAccount-container">
            <div className="userAccount-menu">
              <Navbar username={params?.username} pathname={pathname} />
            </div>
            <div className="userAccount-content">
              <header></header>
              <section>{children}</section>
              {/* <footer>
            <span>
              &copy; 2023 by <b>youngstorage.in</b>
            </span>
            <i>V02.1.1</i>
          </footer> */}
            </div>
          </div>
        }
      </>
    );
  }
}

export default UserAccountLayout;
