import { Close } from "@mui/icons-material";
import { Box, IconButton, Modal } from "@mui/material";
import axios from "axios";
import DOMPurify from "dompurify";
import React from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import useAuthToken from "../../../hooks/Token/useAuth";

const PreviewGoalModal = ({ open, handleClose, id }) => {
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

  const { data: getGoal } = useQuery({
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
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "green",
      borderColor: "green",
      minHeight: "30px",
      height: "30px",
      color: "white",
      width: "100%",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "30px",
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: "5px",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "5px",
    }),
  };

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
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-2xl pl-2">
              {getGoal?.document?.goal}
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <div className=" pb-4 px-4">
            <Select options={options} styles={customStyles} />
            <div className="hover:bg-gray-100 rounded-md py-2">
              <p className="px-2">Description</p>
              <p
                className="preview px-2 "
                dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
              ></p>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default PreviewGoalModal;
