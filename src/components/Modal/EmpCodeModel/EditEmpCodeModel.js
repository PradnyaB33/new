import { zodResolver } from "@hookform/resolvers/zod";
import { AssignmentInd } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};
 
const EditEmpCodeModel = ({ handleClose, open, organisationId, empCodeId  }) => {
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
 const organizationId=organisationId;
  const EmpCodeSchema = z.object({
    code: z.string(),
  });
 
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: zodResolver(EmpCodeSchema),
  });
 // Fetch the employee code using useQuery
 
 // eslint-disable-next-line no-unused-vars
 const { data } = useQuery(
  
  ["empCode", empCodeId],
  async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/employee-code/${organizationId}/${empCodeId}`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return response.data.data;
  },
  {
    onSuccess: (data) => {
      // Set the fetched code value in the form
      setValue("code", data?.code);
    },
    onError: (error) => {
      handleAlert(true, "error", error.message || "Failed to fetch employee code.");
    },
    enabled: !!empCodeId, // Fetch only if empCodeId is available
  }
);
 

 
  const EditEmployeeCode = useMutation(
    async (data) => {
      try {
        const response = await axios.put(
          `${process.env.REACT_APP_API}/route/update/employee-code/${organisationId}/${empCodeId}`,
          data,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
 
        return response.data;
      } catch (error) {
        throw new Error(
          error.response.data.message || "Failed to update employee code."
        );
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["empCode"]);
        handleClose();
        handleAlert(true, "success", "Employee code updated successfully.");
      },
 
      onError: (error) => {
        console.error("Error:", error.message);
        handleAlert(true, "error", error.message);
      },
    }
  );
 
  // edit the data
  const onSubmit = async (data) => {
    try {
      await EditEmployeeCode.mutateAsync(data);
    } catch (error) {
      console.error(error);
      handleAlert(
        true,
        "error",
        "An Error occurred while  updating employee code."
      );
    }
  };
 
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
      >
        <div className="flex justify-between py-4 items-center  px-4">
          <h1 className="text-xl pl-2 font-semibold font-sans">
            Edit Employee Code
          </h1>
        </div>
 
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <AuthInputFiled
                name="code"
                icon={AssignmentInd}
                control={control}
                type="text"
                placeholder="employee code"
                label="Employee Code *"
                errors={errors}
                error={errors.code}
              />
            </div>
          </div>
 
          <div className="flex gap-4 mt-4 mr-4  mb-4 justify-end ">
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Apply
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};
 
export default EditEmpCodeModel;