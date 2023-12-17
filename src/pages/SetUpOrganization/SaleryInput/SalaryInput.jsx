import {
  BorderColor,
  Delete,
  Info,
  MoreHoriz,
  PriceChangeOutlined,
  Warning,
} from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Popover,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import SalaryInputFieldsModal from "../../../components/Modal/SalaryInputFields/SalaryInputFieldsModal";
import SkeletonForLeaveTypes from "../LeaveComponents/components/skeleton-for-leavetype";
import Setup from "../Setup";

const SalaryInput = () => {
  const { organisationId } = useParams();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);

  const [open, setOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [salaryInputId, setempTypeId] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // Handle PopOver
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openPop = Boolean(anchorEl) && selectedTemplate !== null;
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const Popid = openPop ? "simple-popover" : undefined;
  const handleOpen = () => {
    setOpen(true);
    setempTypeId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setempTypeId(null);
    setEditModalOpen(false);
  };

  const handleEditModalOpen = (salaryInputId) => {
    setEditModalOpen(true);
    queryClient.invalidateQueries(["shift", salaryInputId]);
    setempTypeId(salaryInputId);
  };

  const handlePopClick = (event, template) => {
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handlePopClose = () => {
    setAnchorEl(null);
    // setSelectedTemplate(null);
  };

  // Delete Query
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
    handleCloseConfirmation();
  };

  // Delete Query
  const deleteMutation = useMutation(
    (id) =>
      axios.delete(`${process.env.REACT_APP_API}/route/salary-template/${id}`, {
        headers: {
          Authorization: authToken,
        },
      }),
    {
      onSuccess: () => {
        // Invalidate and refetch the data after successful deletion
        queryClient.invalidateQueries("salaryTemplates");
        handleAlert(
          true,
          "success",
          "Salary Template Types deleted succesfully"
        );
      },
    }
  );

  // Get Query
  const { data: salaryTemplate, isLoading } = useQuery(
    "salaryTemplates",
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/salary-template-org/${organisationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data;
    }
  );

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%]  h-max shadow-md rounded-sm border  items-center">
            <div className="p-4  border-b-[.5px] flex items-center justify-between  gap-3 w-full border-gray-300">
              <div className="flex items-center  gap-3 ">
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <PriceChangeOutlined className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Salary Input Field selection
                </h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                onClick={handleOpen}
                variant="contained"
              >
                Create salary template
              </Button>
            </div>

            {isLoading ? (
              <SkeletonForLeaveTypes />
            ) : salaryTemplate?.salaryTemplates?.length > 0 ? (
              <div className="overflow-auto   border-[.5px] border-gray-200">
                <table className="min-w-full bg-white px-4  text-left !text-sm font-light">
                  <thead className="bg-gray-200  !font-medium ">
                    <tr className="!font-semibold ">
                      <th scope="col" className="!text-left px-6 py-3 ">
                        SR NO
                      </th>
                      <th className="py-3 ">Template Name</th>
                      <th className="px-6 py-3 ">Template Description</th>
                      <th className="px-6 py-3 ">Employment Type</th>
                      <th className="px-6 py-3 ">Salary Structure</th>
                      <th className="px-6 py-3 ">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryTemplate?.salaryTemplates?.map((item, id) => (
                      <tr
                        className={`
                      ${id % 2 === 0 && "bg-[white]"} 
                      !font-medium border-b`}
                        key={id}
                      >
                        <td className="py-3 px-6">{id + 1}</td>
                        <td className="px-6">{item.name}</td>
                        <td className="px-6">
                          {item.desc.length <= 0 ? "No description" : item.desc}
                        </td>
                        <td className="px-6">{item?.empType?.title}</td>
                        <td className="px-6">
                          <Tooltip title="Click to get Salary structure">
                            <IconButton
                              aria-describedby={Popid}
                              onClick={(event) => handlePopClick(event, item)}
                            >
                              <MoreHoriz className="!text-[19px] text-black" />
                            </IconButton>
                          </Tooltip>
                        </td>
                        <td className="whitespace-nowrap px-6 py-2">
                          <IconButton
                            onClick={() => handleDeleteConfirmation(item._id)}
                          >
                            <Delete className="!text-xl" color="error" />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEditModalOpen(item._id)}
                          >
                            <BorderColor className="!text-xl" color="success" />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="!text-2xl" />
                  <h1 className="text-xl font-semibold">
                    Salary template Not found
                  </h1>
                </article>
                <p>for the organization. Please create a Employement types.</p>
              </section>
            )}
          </article>
        </Setup>
      </section>

      <Popover
        id={Popid}
        open={openPop}
        className="!p-4"
        anchorEl={anchorEl}
        PaperProps={{
          className: "!p-4 rounded-md",
        }}
        onClose={handlePopClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className="overflow-auto">
          <h1 className="pb-4 text-lg">Salary Structure</h1>
          <table className="min-w-full bg-white  text-left !text-sm font-light">
            <thead className="border-b bg-gray-100 border-[.5px] border-gray-300  font-medium dark:border-neutral-500">
              <tr>
                <th scope="col" className="!text-left px-3 py-3 ">
                  Salary Component
                </th>
                <th scope="col" className="p-3 ">
                  Manually input
                </th>
                <th scope="col" className="px-3 ">
                  Calculation
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedTemplate?.salaryStructure.map((row, id) => (
                <tr
                  key={id}
                  className="px-2 !border border-gray-300 !py-4 !space-x-4 gap-4 w-full"
                >
                  <td className="w-[40%] py-4 pl-2">{row.salaryComponent}</td>
                  <td className="w-[40%] !mx-4">
                    {row.manuallyInput ? "yes" : "no"}
                  </td>
                  <td className="w-[40%] px-3">{row.calculation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Popover>

      <SalaryInputFieldsModal
        id={organisationId}
        open={open}
        handleClose={handleClose}
      />
      <SalaryInputFieldsModal
        id={organisationId}
        open={editModalOpen}
        handleClose={handleClose}
        salaryId={salaryInputId}
      />

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> Are you sure to delete the Salary Template?
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this salary template, as this
            action cannot be undone
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseConfirmation}
            variant="outlined"
            color="primary"
            size="small"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleDelete(deleteConfirmation)}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SalaryInput;
