import React, { useContext } from "react";
import axios from "axios";
import useDepartmentState from "../../../hooks/DepartmentHook/useDepartmentState";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
const Step3 = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const data = useDepartmentState();
  const { organisationId } = useParams();
  console.log(organisationId);
  console.log("formData", data);

  // add department

  const addDepartment = async () => {
    const config = {
      headers: {
        "Content-type": "Application/json",
        Authorization: authToken,
      },
    };

    const response = await axios.post(
      `${process.env.REACT_APP_API}/route/department/create/${organisationId}`,
      data,
      config
    );
    console.log(response);
    try {
    } catch (error) {
      console.error(error);
      handleAlert(
        true,
        "error",
        error.response ? error.response.data.message : error.message
      );
    }
  };

  return (
    <>
      <div className="mt-1">
        <div>
          <img
            src="/completed.svg"
            className="rounded-sm shadow-2xl"
            style={{
              height: "450px",
              marginLeft: "30%",
              width: "600px",
              marginBottom: "20px",
            }}
            alt="none"
          />
        </div>
        <div style={{ marginLeft: "50%" }}>
          <button
            onClick={addDepartment}
            type="submit"
            className="px-6 text-center rounded-md py-1 text-md font-semibold text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Step3;
