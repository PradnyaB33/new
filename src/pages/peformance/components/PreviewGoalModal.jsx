import { Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  Modal,
} from "@mui/material";
import axios from "axios";
import { format } from "date-fns";
import DOMPurify from "dompurify";
import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import useAuthToken from "../../../hooks/Token/useAuth";

const PreviewGoalModal = ({ open, handleClose, id }) => {
  // const { handleAlert } = useContext(TestContext);
  const authToken = useAuthToken();

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    // Other options...
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    overflow: "scroll",
    maxHeigh: "80vh",
    p: 4,
  };

  const { data: getGoal, isFetching } = useQuery({
    queryKey: "getGoal",
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/route/performance/getGoalDetails/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return data;
    },
    enabled: !!id,
  });

  const sanitizedDescription = DOMPurify.sanitize(
    getGoal?.document?.description
  );
  const sanitizedMeasurment = DOMPurify.sanitize(
    getGoal?.document?.measurement
  );

  //   const zodSchema = z.object({
  //     goal: z.string(),
  //     description: z.string(),
  //     measurement: z.string().optional(),
  //     assignee: z.array(z.object({ value: z.string(), label: z.string() })),
  //     startDate: z.object({
  //       startDate: z.string(),
  //       endDate: z.string(),
  //     }),
  //     endDate: z.object({
  //       startDate: z.string(),
  //       endDate: z.string(),
  //     }),
  //     goaltype: z.object({ value: z.string(), label: z.string() }),
  //     goalStatus: z.string(),
  //     attachment: z.string().optional(),
  //   });

  //   const {
  //     handleSubmit,
  //     control,
  //     formState: { errors },
  //   } = useForm({
  //     defaultValues: {
  //       declaration: undefined,
  //       message: undefined,
  //     },
  //     resolver: zodResolver(zodSchema),
  //   });

  //   const queryClient = useQueryClient();
  //   const performanceSetup = useMutation(
  //     async (data) => {
  //       await axios.post(
  //         `${process.env.REACT_APP_API}/route/performance/createGoal`,
  //         { goals: data },
  //         {
  //           headers: {
  //             Authorization: authToken,
  //           },
  //         }
  //       );
  //     },
  //     {
  //       onSuccess: () => {
  //         handleAlert(true, "success", "Performance setup created successfully");
  //         queryClient.invalidateQueries("orggoals");
  //         handleClose();
  //       },
  //     }
  //   );

  //   const onSubmit = async (data) => {
  //     const goals = {
  //       goal: data.goal,
  //       description: data.description,
  //       measurement: data.measurement,
  //       assignee: data.assignee.map((emp) => emp.value),
  //       startDate: data.startDate.startDate,
  //       endDate: data.endDate.startDate,
  //       goaltype: data.goaltype.value,
  //       goalStatus: data.goalStatus,
  //       attachment: data.attachment,
  //     };

  //     performanceSetup.mutate(goals);
  //   };

  //   const { data: employeeData } = useQuery("employee", async () => {
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_API}/route/employee/getEmployeeUnderManager`,
  //       {
  //         headers: {
  //           Authorization: authToken,
  //         },
  //       }
  //     );
  //     return data.reportees;
  //   });

  //   const empoptions = employeeData?.map((emp) => ({
  //     value: emp._id,
  //     label: `${emp.first_name} ${emp.last_name}`,
  //     image: emp.user_logo_url,
  //   }));
  // const customStyles = {
  //   control: (provided) => ({
  //     ...provided,
  //     backgroundColor: "green",
  //     borderColor: "green",
  //     minHeight: "30px",
  //     height: "30px",
  //     color: "white",
  //     width: "100%",
  //   }),
  //   singleValue: (provided) => ({
  //     ...provided,
  //     color: "white",
  //   }),
  //   indicatorsContainer: (provided) => ({
  //     ...provided,
  //     height: "30px",
  //   }),
  //   clearIndicator: (provided) => ({
  //     ...provided,
  //     padding: "5px",
  //   }),
  //   dropdownIndicator: (provided) => ({
  //     ...provided,
  //     padding: "5px",
  //   }),
  // };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[70%] md:!w-[70%] shadow-md outline-none rounded-md"
        >
          {isFetching ? (
            <CircularProgress />
          ) : (
            <>
              <div className="flex justify-between py-4 items-center  px-4">
                <h1 id="modal-modal-title" className="text-2xl pl-2">
                  {getGoal?.document?.goal}
                </h1>
                <IconButton onClick={handleClose}>
                  <Close className="!text-[16px]" />
                </IconButton>
              </div>

              <div className="space-y-4 pb-4 px-4">
                <div className="flex gap-2 items-center">
                  <div
                    className={`bg-green-500 flex rounded-md px-2 border-gray-200 border-[.5px]  items-center`}
                  >
                    <Select
                      aria-errormessage=""
                      placeholder={getGoal?.document?.goalStatus ?? "Status"}
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          borderWidth: "0px",
                          boxShadow: "none",
                          backgroundColor: "rgb(34 197 94)",
                          color: "white",
                        }),
                        placeholder: (styles) => ({
                          ...styles,
                          color: "white", // replace with your color
                        }),
                        singleValue: (styles) => ({
                          ...styles,
                          color: "white",
                        }),
                      }}
                      className={` !bg-green-500  w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                      options={options}
                      value={getGoal?.document?.goalStatus}
                      // onChange={(value) => {
                      //   updateField(name, value);
                      //   field.onChange(value);
                      // }}
                    />
                  </div>

                  <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                    Start Date: -{" "}
                    {getGoal?.document?.startDate &&
                      format(new Date(getGoal?.document?.startDate), "PP")}
                  </div>
                  <div className=" p-2 bg-gray-50 border-gray-200 border rounded-md">
                    End Date : -{" "}
                    {getGoal?.document?.endDate &&
                      format(new Date(getGoal?.document?.endDate), "PP")}
                  </div>
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Description</p>
                  <p
                    className="preview px-2 "
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  ></p>
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Measurments</p>
                  <p
                    className="preview px-2 "
                    dangerouslySetInnerHTML={{
                      __html: sanitizedMeasurment
                        ? sanitizedMeasurment
                        : "No data",
                    }}
                  ></p>
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Attachments</p>
                  <p className="px-2">No data</p>
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Assigned to</p>
                  <p className="px-2">No data</p>
                </div>
                <div className="hover:bg-gray-100 rounded-md ">
                  <p className="px-2">Reporter to</p>
                  <p className="px-2 mt-2 flex items-center gap-2">
                    <Avatar sx={{ width: 35, height: 35 }} /> Test user
                  </p>
                </div>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PreviewGoalModal;
