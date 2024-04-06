import { zodResolver } from "@hookform/resolvers/zod";
import {
  AttachFile,
  Close,
  DateRange,
  Paid,
  PersonOutline,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";

const GoalsModel = ({ handleClose, open, options, id }) => {
  const { handleAlert } = useContext(TestContext);
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

  const authToken = useAuthToken();
  const zodSchema = z.object({
    goal: z.string(),
    description: z.string(),
    measurement: z.string().optional(),
    assignee: z.array(z.object({ value: z.string(), label: z.string() })),
    startDate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    endDate: z.object({
      startDate: z.string(),
      endDate: z.string(),
    }),
    goaltype: z.object({ value: z.string(), label: z.string() }),
    goalStatus: z.string(),
    attachment: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      declaration: undefined,
      message: undefined,
    },
    resolver: zodResolver(zodSchema),
  });

  const queryClient = useQueryClient();

  const performanceSetup = useMutation(
    async (data) => {
      await axios.put(
        `${process.env.REACT_APP_API}/route/performance/createGoal`,
        { goals: data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Performance setup created successfully");
        queryClient.invalidateQueries("orggoals");
        handleClose();
      },
    }
  );

  const performanceEditSetup = useMutation(
    async (data) => {
      await axios.put(
        `${process.env.REACT_APP_API}/route/performance/updateGoal/${id}`,
        { data },
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
    },
    {
      onSuccess: () => {
        handleAlert(true, "success", "Goals updated  successfully");
        queryClient.invalidateQueries("orggoals");
        handleClose();
      },
    }
  );

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

  useEffect(() => {
    if (!isFetching && getGoal) {
      setValue("goal", getGoal?.document?.goal);
      setValue("description", getGoal?.document?.description);
      setValue("measurement", getGoal?.document?.measurement);
      setValue(
        "assignee",
        getGoal?.document?.assignee.map((emp) => ({
          value: emp._id,
          label: `${emp.first_name} ${emp.last_name}`,
          image: emp.user_logo_url,
        })) || []
      );
      setValue("startDate", {
        startDate: getGoal?.document?.startDate,
        endDate: getGoal?.document?.startDate,
      });
      setValue("goalStatus", getGoal?.document?.goalStatus);
      setValue("endDate", {
        startDate: getGoal?.document?.endDate,
        endDate: getGoal?.document?.endDate,
      });
      // Set other fields...
    }
    // eslint-disable-next-line
  }, [isFetching]);

  const onSubmit = async (data) => {
    const goals = {
      goal: data.goal,
      description: data.description,
      measurement: data.measurement,
      assignee: data.assignee.map((emp) => emp.value),
      startDate: data.startDate.startDate,
      endDate: data.endDate.startDate,
      goaltype: data.goaltype.value,
      goalStatus: data.goalStatus,
      attachment: data.attachment,
    };
    console.log(`🚀 ~ goals:`, goals);

    if (id) {
      performanceEditSetup.mutate(goals);
    } else {
      performanceSetup.mutate(goals);
    }
  };

  const { data: employeeData } = useQuery("employee", async () => {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/route/employee/getEmployeeUnderManager`,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    return data.reportees;
  });

  const empoptions = employeeData?.map((emp) => ({
    value: emp._id,
    label: `${emp.first_name} ${emp.last_name}`,
    image: emp.user_logo_url,
  }));

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
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-xl pl-2">
              {id ? "Update goal setting" : "Add goal setting"}
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 max-h-[80vh] overflow-auto "
          >
            <AuthInputFiled
              name="goal"
              icon={TrendingUp}
              control={control}
              type="text"
              placeholder="goal"
              label="Enter goal name"
              errors={errors}
              error={errors.goal}
            />
            <AuthInputFiled
              name="description"
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter description"
              errors={errors}
              error={errors.description}
            />
            <AuthInputFiled
              name="measurement"
              icon={Paid}
              control={control}
              type="texteditor"
              placeholder="100"
              label="Enter measurements name"
              errors={errors}
              error={errors.measurement}
            />
            <AuthInputFiled
              name="assignee"
              icon={PersonOutline}
              control={control}
              type="empselect"
              options={empoptions}
              placeholder="Assignee name"
              label="Select assignee name"
              errors={errors}
              error={errors.assignee}
            />
            {id && (
              <AuthInputFiled
                name="attachment"
                icon={AttachFile}
                control={control}
                type="file"
                placeholder="100"
                label="Add attachments"
                errors={errors}
                error={errors.attachment}
              />
            )}

            <div className="grid grid-cols-2 gap-2">
              <AuthInputFiled
                name="startDate"
                icon={DateRange}
                control={control}
                type="calender"
                options={options}
                placeholder="Assignee name"
                label="Enter start date"
                errors={errors}
                error={errors.startDate}
              />
              <AuthInputFiled
                name="endDate"
                icon={DateRange}
                control={control}
                type="calender"
                placeholder="100"
                label="Enter end date"
                errors={errors}
                error={errors.endDate}
              />
            </div>

            <AuthInputFiled
              name="goaltype"
              icon={PersonOutline}
              control={control}
              type="select"
              options={options}
              placeholder="goal type"
              label="Select goal type"
              errors={errors}
              error={errors.goaltype}
            />
            <AuthInputFiled
              name="goalStatus"
              icon={PersonOutline}
              control={control}
              type="text"
              options={options}
              placeholder="status"
              label="Select status"
              errors={errors}
              error={errors.goalStatus}
            />

            <div className="flex gap-4  mt-4 mr-4 justify-end">
              <Button
                type="button"
                onClick={handleClose}
                color="error"
                variant="outlined"
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {id ? "Update Goal" : "Create Goal"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default GoalsModel;
