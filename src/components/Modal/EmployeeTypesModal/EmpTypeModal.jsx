import { zodResolver } from "@hookform/resolvers/zod";
import { Person } from "@mui/icons-material";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";

const EmpTypeModal = ({ handleClose, open, id, empTypeId }) => {
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];

  const EmpSchema = z.object({
    title: z.string().min(2, { message: "Minimum 2 character " }).max(15),
  });

  const { isLoading, isFetching } = useQuery(
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
      onSuccess: (data) => {
        setValue("title", data?.empType?.title);
      },
      enabled: open && empTypeId !== null && empTypeId !== undefined,
    }
  );

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(EmpSchema),
    defaultValues: {
      title: undefined,
    },
  });

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

        handleAlert(
          true,
          "success",
          "An Employment Type generated succesfully"
        );
      },
      onError: (err) => {
        handleAlert(true, "error", err?.response?.data?.error);
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
        handleAlert(true, "success", "An Employment Type updated succesfully.");
      },
      onError: (err) => {
        console.log(`🚀 ~ err:`, err);
        handleAlert(true, "error", err?.response?.data?.error);
      },
    }
  );

  // useEffect(() => {
  //   if (data?.empType) {
  //     setTitleEmpType(data?.empType?.title || "");
  //   }
  // }, [data]);

  const onSubmit = async (data) => {
    if (empTypeId) {
      await EditEmployeeType.mutateAsync(data);
    } else {
      // Use the AddEmployeeTypes function from React Query
      await AddEmployeeTypes.mutateAsync(data);
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
          <h1 className="text-xl pl-2 font-semibold font-sans">
            {empTypeId ? "Edit Employment Types" : "Create Employment Types"}
          </h1>
        </div>

        <div className="px-5 space-y-4 mt-4">
          {/* <div className="space-y-2 ">
            <FormLabel className="text-md" htmlFor="demo-simple-select-label">
              Add Employment Type
            </FormLabel>
            <FormControl size="small" sx={{ width: "100%" }} variant="outlined">
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
          </div> */}

          {isLoading || isFetching ? (
            <CircularProgress />
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              className="flex   w-full bg-white flex-col h-fit gap-1"
            >
              {/* First Name */}
              <AuthInputFiled
                name="title"
                icon={Person}
                control={control}
                type="text"
                placeholder="Employment Types"
                label="Enter Employment Type *"
                maxLimit={15}
                errors={errors}
                error={errors.title}
              />

              <div className="flex gap-4  mt-4  justify-end">
                <Button onClick={handleClose} color="error" variant="outlined">
                  Cancel
                </Button>
                {empTypeId ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
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
                    variant="contained"
                    type="submit"
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
            </form>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default EmpTypeModal;
