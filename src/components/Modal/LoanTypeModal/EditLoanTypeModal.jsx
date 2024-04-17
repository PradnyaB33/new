import { zodResolver } from "@hookform/resolvers/zod";
import { AttachMoney, Title } from "@mui/icons-material";
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
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

const EditLoanTypeModal = ({ handleClose, open, organisationId, loanId }) => {
  const queryClient = useQueryClient();
  const { cookies } = useContext(UseContext);
  const { handleAlert } = useContext(TestContext);
  const authToken = cookies["aegis"];
  const [error, setError] = useState("");
  console.log(error);
  const EmpLoanMgtSchema = z.object({
    loanName: z.string(),
    loanValue: z.string(),
    rateOfInterest: z.string(),
    maxLoanValue: z.string(),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    resolver: zodResolver(EmpLoanMgtSchema),
  });

  //for  Get Query
  const { data: getLoanTypeById } = useQuery(
    ["loanType", organisationId, loanId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${loanId}/get-loan-type`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data;
    }
  );
  console.log("getLoanTypeById" , getLoanTypeById);
  useEffect(() => {
    if (getLoanTypeById) {
      setValue("loanName", getLoanTypeById.loanName);
      setValue("loanValue", getLoanTypeById.loanValue.toString());
      setValue("maxLoanValue", getLoanTypeById.maxLoanValue.toString());
      setValue("rateOfInterest", getLoanTypeById.rateOfInterest.toString());
    }
  }, [getLoanTypeById, setValue]);

  const EditLoanType = useMutation(
    (data) =>
      axios.put(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/${loanId}/update-loan-type`,
        data,
        {
          headers: {
            Authorization: authToken,
          },
        }
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["loanType"] });
        handleClose();
        handleAlert(true, "success", "Loan type updated successfully.");
      },
      onError: () => {
        setError("An Error occurred while loan type.");
      },
    }
  );

  const onSubmit = async (data) => {
    try {
      await EditLoanType.mutateAsync(data);
    } catch (error) {
      console.error(error);
      setError("An error occurred while creating a new loan type.");
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
            Edit Loan Type
          </h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <AuthInputFiled
                name="loanName"
                icon={Title}
                control={control}
                type="text"
                placeholder="Loan Name"
                label="Loan Name *"
                errors={errors}
                error={errors.loanName}
              />
            </div>
            <div className="space-y-2 ">
              <AuthInputFiled
                name="loanValue"
                icon={AttachMoney}
                control={control}
                type="number"
                placeholder="Minimum Loan Value"
                label="Minimum Loan Value *"
                errors={errors}
                error={errors.loanValue}
              />
               <div className="space-y-2 ">
              <AuthInputFiled
                name="maxLoanValue"
                icon={AttachMoney}
                control={control}
                type="number"
                placeholder="Maximum Loan Value"
                label=" Maximum Loan Value *"
                errors={errors}
                error={errors.maxLoanValue}
              />
            </div>
            <div className="space-y-2 ">
              <AuthInputFiled
                name="rateOfInterest"
                icon={AttachMoney}
                control={control}
                type="number"
                placeholder="Rate Of Interest"
                label="Rate Of Interest "
                errors={errors}
                error={errors.rateOfInterest}
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
          </div>
        </form>
       
      </Box>
    </Modal>
  );
};

export default EditLoanTypeModal;
