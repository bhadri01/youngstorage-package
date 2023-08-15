import Link from "next/link";

export default function Breadcrumb({ children }) {
  return (
    <div className="breadcrumb">
      <DashIcon />
      <div className="crumb-box">
        {children}
      </div>
    </div>
  );
}

const DashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9017 12.6006H8.4985C7.99914 12.5965 7.51859 12.791 7.16257 13.1411C6.80655 13.4913 6.60421 13.9685 6.6001 14.4679V21.5346C6.60934 22.5741 7.45911 23.4094 8.4985 23.4007H11.9017C12.401 23.4049 12.8816 23.2105 13.2377 22.8603C13.5937 22.5101 13.796 22.0329 13.8001 21.5335V14.4679C13.796 13.9685 13.5937 13.4913 13.2377 13.1411C12.8816 12.791 12.401 12.5965 11.9017 12.6006Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.9017 5.40063H8.4985C7.48001 5.37238 6.63081 6.17381 6.6001 7.19223V8.40903C6.63081 9.42745 7.48001 10.2289 8.4985 10.2006H11.9017C12.9201 10.2289 13.7694 9.42745 13.8001 8.40903V7.19223C13.7694 6.17381 12.9201 5.37238 11.9017 5.40063Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0984 16.2007H21.5004C21.9999 16.2052 22.4808 16.0109 22.837 15.6607C23.1933 15.3105 23.3959 14.8331 23.4 14.3335V7.2679C23.3959 6.76856 23.1936 6.29129 22.8375 5.94112C22.4815 5.59095 22.0009 5.39655 21.5016 5.4007H18.0984C17.599 5.39655 17.1184 5.59095 16.7624 5.94112C16.4064 6.29129 16.204 6.76856 16.2 7.2679V14.3335C16.204 14.8329 16.4064 15.3101 16.7624 15.6603C17.1184 16.0104 17.599 16.2048 18.0984 16.2007Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.0984 23.4008H21.5004C22.5193 23.4297 23.3692 22.6281 23.4 21.6092V20.3924C23.3692 19.374 22.52 18.5726 21.5016 18.6008H18.0984C17.0799 18.5726 16.2307 19.374 16.2 20.3924V21.608C16.23 22.6269 17.0794 23.429 18.0984 23.4008Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
