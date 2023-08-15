"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import ToolTips from "@/components/ToolTips";
// import { useQueryClient } from "@tanstack/react-query";

function Labs({ params }) {
  const router = useRouter();
  // const queryClient = useQueryClient()
  //query data of the labs if exist we can get the data
  // const userlabs = queryClient.getQueriesData({ queryKey: ["userlabs"] })
  const ChangePath = (route) => {
    router.push(route);
  };
  return (
    <>
      <div className="lab-container">
        <Breadcrumb>
          <Link href={params?.username + "/labs"}>labs</Link>{" "}
          <ToolTips name="You Can Access Our Various Labs And Gain Enormous Knowledge On Multiple Domains" />
        </Breadcrumb>

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
