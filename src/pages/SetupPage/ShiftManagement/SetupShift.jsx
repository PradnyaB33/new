import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Money } from "@mui/icons-material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Button } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../../SetUpOrganization/Setup";

const SetupShift = () => {
  const { organisationId: orgId } = useParams();
  const authToken = useAuthToken();
  const { setAppAlert } = useContext(UseContext);
  const queryClient = useQueryClient();

  const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(Number(val)), {
      message: "Amount must be a number",
    }),
    dualWorkflow: z.boolean(),
  });

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      amount: "",
      dualWorkflow: false,
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("shift allowance data", data);
    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_API}/route/shiftApply/postallowance/${orgId}`,
        { data: { ...data, amount: Number(data.amount) } },
        { headers: { Authorization: authToken } }
      );
      console.log(resp);
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Your request is successful",
      });
      queryClient.invalidateQueries("get-shift-allowance");
    } catch (error) {
      console.log("Operation not completed", error.message);
    }
  };

  const { data } = useQuery("get-shift-allowance", async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/shiftApply/getallowance/${orgId}`,
      {
        headers: { Authorization: authToken },
      }
    );
    return response.data;
  });

  useEffect(() => {
    if (data?.existingAllowance) {
      setValue("amount", data.existingAllowance.amount.toString());
    }
  }, [data, setValue]);

  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3 ">
                <div className="mt-1">
                  <PaidOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Shift Allowance</h1>
                  <p className="text-xs text-gray-600">
                    This setup is used to add the amount for the shift allowance
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} action="">
                <AuthInputFiled
                  name="dualWorkflow"
                  icon={Business}
                  control={control}
                  type="checkbox"
                  placeholder="Dual Workflow"
                  label="Dual Workflow"
                  errors={errors}
                  error={errors.dualWorkflow}
                  descriptionText={
                    "Enabling workflow ensures account approval after manager's approval otherwise added directly as allowance."
                  }
                />
                <AuthInputFiled
                  className="w-[40vw]"
                  name="amount"
                  icon={Money}
                  control={control}
                  type="number"
                  placeholder="Enter Allowance Amount"
                  label="Enter Amount *"
                  errors={errors}
                  error={errors.amount}
                />
                <div className="py-2">
                  <Button
                    className="mt-4"
                    size="small"
                    type="submit"
                    variant="contained"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </article>
        </Setup>
      </section>
    </div>
  );
};

export default SetupShift;
