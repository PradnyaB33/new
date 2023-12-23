import { Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";

const DepartmentList = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { organizationId } = useParams();
  const [departmentList, setDepartmentList] = useState([]);

  console.log(departmentList);

  useEffect(() => {
    const fetchDepartmentList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/department/get/${organizationId}`
        );
        console.log(response);
        setDepartmentList(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchDepartmentList();
    // eslint-disable-next-line
  }, [authToken]);

  return (
    <div>
      departmentList.length == 0 ?(
      <Typography>No departments, please add department.</Typography>) : (
      <table>
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Department Name</th>
            <th>Department Location</th>
            <th>Department Head</th>
            <th>Department Head Delegate</th>
          </tr>
        </thead>
      </table>
      )
    </div>
  );
};

export default DepartmentList;
