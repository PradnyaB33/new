import { zodResolver } from "@hookform/resolvers/zod";
import { Business, Money } from "@mui/icons-material";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import { Button, Checkbox, FormControlLabel } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { z } from "zod";
import { UseContext } from "../../../State/UseState/UseContext";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../hooks/Token/useAuth";
import Setup from "../../SetUpOrganization/Setup";

const SetupShift = () => {
  const { organisationId: orgId } = useParams();
  const authToken = useAuthToken();
  const [shifts, setShifts] = useState([]);
  const [shiftId, setShiftId] = useState(null);
  const [showAmountField, setShowAmountField] = useState(false);
  const { setAppAlert } = useContext(UseContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log(shiftId);
  }, [shiftId]);

  const handleChange = (value) => {
    console.log("this is the value ", value);

    setShiftId(value ? value.value : null);
    (async () => {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/getSingleshifts/${value.value}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setValue("amount", String(resp.data?.shifts?.allowance));
        console.log("this is shift data", resp.data.shifts);
      } catch (error) {
        console.error(error);
      }
    })();
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await axios.get(
          `${process.env.REACT_APP_API}/route/shifts/${orgId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        const finalShifts = resp.data.shifts.map((item) => ({
          value: item._id,
          label: item.shiftName,
        }));
        setShifts(finalShifts);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [orgId, authToken]);

  const formSchema = z.object({
    amount: z.string().refine((val) => !isNaN(val), {
      message: "Amount must be a number",
    }),
    dualWorkflow: z.boolean(),
    extraAllowance: z
      .string()
      .optional()
      .refine((val) => val === undefined || !isNaN(Number(val)), {
        message: "Extra Allowance must be a number",
      }),
  });
  console.log("some code");

  const { control, formState, handleSubmit, setValue } = useForm({
    defaultValues: {
      amount: "0",
      dualWorkflow: false,
      extraAllowance: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { errors } = formState;

  const onSubmit = async (data) => {
    console.log("shift allowance data", data);
    try {
      if (data.amount === "0") {
        const resp2 = await axios.post(
          `${process.env.REACT_APP_API}/route/shiftApply/postallowance/${orgId}`,
          {
            data: {
              ...data,
              amount: Number(data.amount),
              extraAllowance: data.extraAllowance
                ? Number(data.extraAllowance)
                : undefined,
            },
          },
          { headers: { Authorization: authToken } }
        );
        console.log(resp2);
      } else {
        const resp1 = await axios.post(
          `${process.env.REACT_APP_API}/route/shifts/setAllowance/${orgId}`,
          {
            data: {
              ...data,
              amount: Number(data.amount),
              extraAllowance: data.extraAllowance
                ? Number(data.extraAllowance)
                : undefined,
              shiftId: shiftId,
            },
          },
          { headers: { Authorization: authToken } }
        );

        console.log(resp1);
      }

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
      setValue("dualWorkflow", data.existingAllowance.check);
    }
  }, [data, setValue]);

  return (
    <div>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className=" bg-white  w-full h-max shadow-md rounded-sm border items-center">
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
                <div className="flex justify-between gap-4">
                  <div className="w-full mb-8">
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
                  </div>
                  <div className="w-full">
                    <FormControlLabel
                      className="text-gray-700 font-body"
                      control={
                        <Checkbox
                          checked={showAmountField}
                          onChange={(e) => setShowAmountField(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Enable Allowance Amount"
                    />
                  </div>
                </div>
                {showAmountField && (
                  <div className="flex flex-col gap-2 mt-4 w-[36vw] mb-4">
                    <Select
                      value={
                        shifts.find((shift) => shift.value === shiftId) || null
                      }
                      isClearable
                      className="min-w-60 z-50"
                      aria-errormessage=""
                      placeholder={"Select Shift"}
                      components={{
                        IndicatorSeparator: () => null,
                      }}
                      options={shifts}
                      onChange={handleChange}
                    />
                    <AuthInputFiled
                      className="w-[36vw]"
                      name="amount"
                      icon={Money}
                      control={control}
                      type="number"
                      placeholder="Enter Allowance Amount"
                      label="Enter Amount *"
                      errors={errors}
                      error={errors.amount}
                    />
                  </div>
                )}

                <div className="py-2 mt-6">
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
