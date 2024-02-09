import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  InputLabel,
  Modal,
  OutlinedInput,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";

const EmpTypeModal = ({ handleClose, open, id, empTypeId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const params = useParams();

  const { data } = useQuery(
    ["empType", empTypeId],
    async () => {
      if (open && empTypeId !== null) {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/employment-types/${empTypeId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        return response.data;
      }
    },
    {
      enabled: open && empTypeId !== null && empTypeId !== undefined,
    }
  );

  const [titleEmpType, setTitleEmpType] = useState("");
  const [error, setError] = useState("");

  const queryClient = useQueryClient();

  const AddEmployeeTypes = useMutation(
    (data) =>
      axios.post(
        `${process.env.REACT_APP_API}/route/employment-types/${id}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),

    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empTypes"] });
        handleClose();
        setTitleEmpType("");
        handleAlert(true, "success", "Employee types generated succesfully");
      },
      onError: () => {
        setError("An error occurred while creating a new employe Type");
      },
    }
  );

  const EditEmployeeType = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/employment-types/${empTypeId}`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["empTypes"] });
        handleClose();
        handleAlert(true, "success", "Employee Types updated succesfully");
      },
      onError: () => {
        setError("An error occurred while creating a neemppTypet");
      },
    }
  );

  useEffect(() => {
    if (data?.empType) {
      setTitleEmpType(data?.empType?.title || "");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        title: titleEmpType,
      };

      if (titleEmpType.length <= 0) {
        setError("Title field is Mandatory");
        return false;
      }

      if (empTypeId) {
        await EditEmployeeType.mutateAsync(data);
      } else {
        // Use the AddEmployeeTypes function from React Query
        await AddEmployeeTypes.mutateAsync(data);
      }
      // Reset form state
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating a neemppTypet");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
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
          <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
            {empTypeId ? "Edit Employment Types" : "Create Employment Types"}
          </h1>
          <IconButton onClick={handleClose}>
            <CloseIcon className="!text-[16px]" />
          </IconButton>
        </div>

        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div>

        <div className="px-5 space-y-4 mt-4">
          <div className="space-y-2 ">
            <FormLabel
              error={error}
              className="text-md"
              htmlFor="demo-simple-select-label"
            >
              Enter Employment Type
            </FormLabel>
            <FormControl
              error={error}
              size="small"
              sx={{ width: "100%" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Add Employment type
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                label="Add Employment types"
                value={titleEmpType}
                onChange={(e) => setTitleEmpType(e.target.value)}
              />
            </FormControl>
            {error && <p className="text-red-500">*{error}</p>}
          </div>

          <div className="flex gap-4  mt-4 justify-end">
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            {empTypeId ? (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={EditEmployeeType.isLoading}
              >
                {EditEmployeeType.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "Apply"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={AddEmployeeTypes.isLoading}
              >
                {AddEmployeeTypes.isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  "submit"
                )}
              </Button>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default EmpTypeModal;
