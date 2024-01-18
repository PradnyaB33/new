import React, { createContext, useState } from "react";
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const UseContext = createContext();

export const UseState = (props) => {
  const [cookies, setCookie, removeCookie] = useCookies(["aegis"]);
  const location = useLocation();
  const [appAlert, setAppAlert] = useState({
    alert: false,
    type: "success",
    msg: "this is success alert",
  });

  const [appLoading, setAppLoading] = useState({
    load: false,
    color: "#fff",
  });

  const [progress, setProgress] = useState(10);

  return (
    <UseContext.Provider
      value={{
        cookies,
        setCookie,
        removeCookie,
        appAlert,
        setAppAlert,
        appLoading,
        setAppLoading,
        progress,
        setProgress,
        location,
      }}
    >
      {props.children}
    </UseContext.Provider>
  );
};

export { UseContext, UseState as default };
