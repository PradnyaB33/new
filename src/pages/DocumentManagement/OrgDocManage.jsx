import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";
import ShowDoc from "./components/ShowDoc";

const OrgDocManage = () => {
  const { authToken } = useGetUser();
  const [open, setOpen] = useState("");
  const { data } = useQuery(`getdocsforemp`, async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/org/getdocsforemp`,
      {
        headers: { Authorization: authToken },
      }
    );
    console.log(response.data.documents);
    return response.data.documents;
  });
  useEffect(() => {
    console.log(open);
  }, [open]);

  return (
    <div className="w-full h-full p-5">
      <div className="w-[50%] h-auto pb-4 mt-4 border-2 m-auto rounded-3xl relative">
        {/* Ensure the clickable area is large enough */}

        {open === "" && <ShowDoc data={data} setOpen={setOpen} />}

        {open === "doc" && (
          <>
            <div
              className="cursor-pointer absolute top-2 border-2 rounded-full left-3 p-1"
              onClick={() => setOpen("")}
            >
              <ArrowBackIcon onClick={() => setOpen("")} />
            </div>
            <div
              style={{ borderBottom: "2px solid #E5E7EB" }}
              className="text-3xl font-semibold w-full text-center my-2 pb-2"
            >
              Organization Documents
            </div>
            {data?.map((item, idx) => (
              <div
                key={idx}
                className="w-[500px] h-[60px] px-4 m-auto shadow-md flex gap-4 items-center justify-between"
              >
                <div className="text-lg">{item.title}</div>
                <Button variant="contained" size="small">
                  SHOW doc
                </Button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default OrgDocManage;
