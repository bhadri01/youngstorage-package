"use client";
import { PageCenter, PageLoading } from "@/components/pageLoading";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Signout({ params }) {
  const router = useRouter();
  useEffect(() => {
    (() => {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      router.push("/");
    })();
  }, []);
  return <PageCenter>Signing Out {params?.username}.... 👉🚪</PageCenter>;
}

export default Signout;
