import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Close, Money, Paid } from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "react-query";
import { z } from "zod";
import { TestContext } from "../../../../../State/Function/Main";
import AuthInputFiled from "../../../../../components/InputFileds/AuthInputFiled";
import useAuthToken from "../../../../../hooks/Token/useAuth";
const TDSDeclarationModel = ({
  open,
  handleClose,
  investment,
  isReject,
  empId,
}) => {
  const authToken = useAuthToken();
  // const { getCurrentUser } = UserProfile();
  // const user = getCurrentUser();
  const { handleAlert } = useContext(TestContext);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  const zodSchema = z.object({
    declaration: z
      .string()
      .refine((value) => Number(value) <= Number(investment?.declaration), {
        message: "Value must be less than declaration",
      }),
    messsage: z.string().optional(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      declaration: undefined,
      message: undefined,
    },
    resolver: zodResolver(zodSchema),
  });

  // test
  useEffect(
    () => {
      setValue("declaration", investment?.declaration?.toString());
    },
    // eslint-disable-next-line
    [investment]
  );

  const queryClient = useQueryClient();

  const onSubmit = async (data) => {
    console.log(investment, "submitted");
    const requestData = {
      empId,
      requestData: {
        name: investment.name,
        sectionname: investment.sectionname,
        status: isReject ? "Reject" : "Approved",
        message: data.message,
        amountAccepted: isReject ? 0 : data.declaration,
      },
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/tds/createInvestment/2023-2024`,
        requestData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", `Data uploaded successfully`);
      queryClient.invalidateQueries(["EmpData"]);
      queryClient.invalidateQueries(["AccoutantEmp"]);
      handleClose();
      // queryClient.invalidateQueries({ queryKey: ["incomeHouse"] });
    } catch (error) {
      console.log(error);
    }
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
          className="border-none !z-10 !pt-0 !px-0 !w-[90%] lg:!w-[50%] md:!w-[60%] shadow-md outline-none rounded-md"
        >
          <div className="flex justify-between py-4 items-center  px-4">
            <h1 id="modal-modal-title" className="text-xl pl-2">
              {isReject
                ? "Reject Investments Declaration"
                : "Approve Investments Declaration"}
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 ">
            <div className="space-y-1 mt-1 mb-5 min-w-11">
              <label className={`font-semibold text-gray-500 text-md`}>
                Declaration name
              </label>

              <div
                className={` hover:cursor-not-allowed border-gray-200 border-[.5px]  flex  rounded-md items-center px-2   bg-gray-100 py-1 md:py-[6px]`}
              >
                <Money />
                <h1 className={` border-none  w-full outline-none px-2  `}>
                  {investment?.name}
                </h1>
              </div>
            </div>
            {!isReject && (
              <AuthInputFiled
                name="declaration"
                icon={Paid}
                control={control}
                type="text"
                placeholder="100"
                label="Amount Approved"
                errors={errors}
                error={errors.declaration}
              />
            )}
            <AuthInputFiled
              name="message"
              icon={Category}
              control={control}
              type="textarea"
              placeholder="sec1"
              label="Add message"
              errors={errors}
              error={errors.message}
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
                {isReject ? "Reject Declaration" : "Approve Declaration"}
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default TDSDeclarationModel;
