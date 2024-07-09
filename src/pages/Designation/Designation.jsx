import { Add, Info } from "@mui/icons-material";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import Setup from "../SetUpOrganization/Setup";
import DesignationRow from "./components/desingation-row";
import AddDesignation from "./components/mini-form-add";
import useDesignation from "./hooks/useDesignation";

const Designation = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const [click, setClick] = useState(false);
  console.log(`🚀 ~ file: Designation.jsx:18 ~ click:`, click);
  const { organisationId } = useParams();
  const [designationIdRequired, setDesignationIdRequired] = useState(false);
  const { setAppAlert } = useContext(UseContext);
  const [prefixRequired, setPrefixRequired] = useState(false);
  const [prefixLength, setPrefixLength] = useState(0);
  const [numCharacters, setNumCharacters] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [designationName, setDesignationName] = useState("");
  const [counter, setCounter] = useState(1);
  const queryClient = useQueryClient();
  const [designationId, setDesignationId] = useState("");
  const [enterDesignationId, setEnterDesignationId] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [designationToDelete, setDesignationToDelete] = useState(null);
  const [trackedId, setTrackedId] = useState("");
  const [showUpdateConfirmationDialog, setShowUpdateConfirmationDialog] =
    useState(false);

  const { designation, addDesignationMutation } = useDesignation();
  console.log(`🚀 ~ file: Designation.jsx:43 ~ designation:`, designation);

  const handleClick = (id) => {
    setClick(!click);
    setDesignationId("");
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(1);
    setDesignationName("");
    setEditMode(false);
    setCounter(1);
    setEnterDesignationId(false);

    axios
      .get(`${process.env.REACT_APP_API}/route/designation/create/${id}`)
      .then((response) => {
        console.log(designation);
        setTrackedId(id);
        setDesignationName(response.data.designation.designationName);
        setDesignationId(response.data.designation.designationId);
        setPrefixRequired(response.data.designation.prefixRequired || false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleClickEdit = (id) => {
    setClick(!click);
    setDesignationId("");
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(1);
    setDesignationName("");
    setCounter(1);
    setEditMode(true);
    setEnterDesignationId(false);
    setTrackedId(id);

    axios
      .get(`${process.env.REACT_APP_API}/route/designation/findone/${id}`)
      .then((response) => {
        console.log(id);
        console.log(response);
        setDesignationName(response.data.designation.designationName);
        setDesignationId(response.data.designation.designationId);
        setEnterDesignationId(true);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleAddDesignation = () => {
    setPrefixRequired(false);
    setClick(true);
    if (!designationName) return;

    if (editMode) {
      setShowUpdateConfirmationDialog(true);
    } else {
      generateDesignationIds();

      axios
        .post(`${process.env.REACT_APP_API}/route/designation/create`, data, {
          headers: {
            Authorization: authToken,
          },
        })
        .then((response) => {
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Designation added successfully!",
          });
          console.log("Designation added successfully:", response.data);
          queryClient.invalidateQueries("designations");
          handleClose(); // Close the dialog after adding
        })
        .catch((error) => {
          setAppAlert({
            alert: true,
            type: "error",
            msg: error.response.data.message,
          });
          console.error("Error adding designation:", error);
        });
    }
  };

  const handleUpdateConfirmation = () => {
    setShowUpdateConfirmationDialog(false);

    const patchData = {
      designationName,
      designationId,
    };
    axios
      .patch(
        `${process.env.REACT_APP_API}/route/designation/create/${trackedId}`,
        patchData
      )
      .then((response) => {
        console.log("Designation updated successfully:", response.data);
        setAppAlert({
          alert: true,
          type: "success",
          msg: "Designation updated successfully.",
        });
        queryClient.invalidateQueries("designations");
        handleClick();
        setClick(false);
      })
      .catch((error) => {
        console.error("Error updating designation:", error);
        setAppAlert({
          alert: true,
          type: "error",
          msg: "Error adding designation",
        });
      });
  };

  const handleClose = () => {
    // setDesignationError("");
    setDesignationIdRequired(false);
    setPrefixRequired(false);
    setPrefixLength(0);
    setNumCharacters(1);
    setDesignationName("");
    setClick(false);
    setEditMode(false);
    setDesignationId("");
  };

  const generateDesignationIds = () => {
    if (designationIdRequired) {
      let generatedIds = "";
      for (let i = 0; i < 1; i++) {
        let designationId = "";
        const prefix = getPrefixFromName(designationName, prefixLength);
        designationId += prefix;
        designationId += counter.toString().padStart(numCharacters, "0");
        generatedIds = designationId;
        setDesignationId(generatedIds);
        setCounter((prevCounter) => prevCounter + 1);
      }
    }
  };

  const handleDesignationIdChange = (e) => {
    const input = e.target.value;
    const charactersOnly = input.replace(/\d/g, "");

    if (charactersOnly.length <= numCharacters) {
      setDesignationId(input);
    }
  };

  const handleDeleteDesignation = (id) => {
    setDesignationToDelete(id);
    setShowConfirmationDialog(true);
  };

  const handleConfirmDelete = () => {
    if (designationToDelete) {
      axios
        .delete(
          `${process.env.REACT_APP_API}/route/designation/create/${designationToDelete}`
        )
        .then(() => {
          console.log("Designation deleted successfully.");
          setAppAlert({
            alert: true,
            type: "success",
            msg: "Designation deleted successfully.",
          });
          queryClient.invalidateQueries("designations");
        })
        .catch((error) => {
          console.error("Error deleting designation:", error);
          setAppAlert({
            alert: true,
            type: "error",
            msg: "Error deleting designation",
          });
        })
        .finally(() => {
          setDesignationToDelete(null);
          setShowConfirmationDialog(false);
        });
    }
  };

  const handleCloseConfirmationDialog = () => {
    setShowConfirmationDialog(false);
    setDesignationToDelete(null);
  };

  const getPrefixFromName = (name, length) => {
    return name.substring(0, length);
  };

  const data = {
    designationName,
    designationId,
    organizationId: organisationId,
  };

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4 border-b-[.5px] flex  justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <AssignmentIndOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Designation</h1>
                  <p className="text-xs text-gray-600">
                    Add multiple designation to your organisation.
                  </p>
                </div>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={() => setClick(true)}
                variant="contained"
              >
                <Add />
                Add Designation
              </Button>
            </div>
            {designation?.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                        Sr. No
                      </th>
                      <th scope="col" className="py-3 w-8/12">
                        Designation Name
                      </th>
                      <th scope="col" className="px-6 py-3 w-2/12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {designation?.map((data, id) => (
                      <DesignationRow key={id} {...{ data, id }} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="text-2xl" />
                  <h1 className="text-lg font-semibold">Add Designation</h1>
                </article>
                <p>No designation found. Please add a designation.</p>
              </section>
            )}
            <AddDesignation
              {...{
                open: click,
                handleClose: () => setClick(false),
                addDesignationMutation,
              }}
            />
          </article>
        </Setup>
      </section>
    </>
  );
};

export default Designation;
