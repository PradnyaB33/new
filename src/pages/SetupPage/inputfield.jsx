import InputIcon from "@mui/icons-material/Input";
import { Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";

const Inputfield = () => {
  const { organisationId } = useParams("");
  console.log(organisationId);
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aeigs"];

  const [inputDetail, setinputDetail] = useState([]);

  useEffect(() => {
    const fetchInputFieldData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/inputfield/${organisationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        console.log(response.data.inputField.inputDetail);
        setinputDetail(response.data.inputField.inputDetail);
      } catch (error) {
        console.error("Error fetching input fields:", error);
      }
    };

    fetchInputFieldData();
  }, [authToken, organisationId]);

  const handleInputFieldChange = (field) => {
    const updatedInputField = inputDetail.map((inputField) => {
      if (inputField.label === field.label) {
        // Toggle the isActive property
        return { ...inputField, isActive: !inputField.isActive };
      }
      return inputField;
    });

    setinputDetail(updatedInputField);
  };

  const sendRequestToBackend = async () => {
    try {
      const updatedInputDetails = inputDetail.map((field) => ({
        inputDetailId: field._id, // Assuming you have a unique ID for each input detail
        isActive: field.isActive,
        label: field.label,
      }));

      console.log("updateInputDetail", updatedInputDetails);

      // Send a PUT request to update the input fields
      const response = await axios.put(
        `${process.env.REACT_APP_API}/route/inputfield/update/${organisationId}`,
        { inputDetails: updatedInputDetails },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log("response", response);
      handleAlert(true, "success", response.data.message);
    } catch (error) {
      // Handle errors
      handleAlert("Failed to apply changes", "error");
    }
  };

  return (
    <>
      <section className="bg-gray-50 min-h-screen w-full">
        <Setup>
          <div className="SetupSection bg-white lg:!w-[80%] md:!w-[70%]   shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center  gap-3 w-full border-gray-300">
              <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                <InputIcon className="!text-lg text-white" />
              </div>
              <h1 className="!text-lg italic">
                Add Input Field for organization
              </h1>
            </div>
            {
              <div className="flex flex-col flex-wrap">
                {inputDetail.map((field, _id) => (
                  <div
                    key={_id}
                    className="border-gray-200 flex justify-between py-2 px-6 "
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.isActive}
                          onChange={() => handleInputFieldChange(field)}
                        />
                      }
                      label={field.label}
                    />
                  </div>
                ))}
              </div>
            }
            <div className="w-max px-4 py-2 mt-2">
              <button
                onClick={sendRequestToBackend}
                className=" flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </Setup>
      </section>
    </>
  );
};

export default Inputfield;
