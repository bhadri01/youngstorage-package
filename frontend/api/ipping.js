import { useEffect, useRef } from "react";
import { API } from "./api";

export const IpPing = ({ ipaddress }) => {
  const pingStatus = useRef(null);

  useEffect(() => {
    if (ipaddress) {
      (async () => {
        const data = await API.peerstatus(ipaddress);
      })();
    }
  }, []);
  return pingStatus.current;
};
