import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";

const CreateModal = ({ open, setOpen }) => {
  // zod schema
  const InvestmentSchema = z.object({
    name: z.string(),
    sectionname: z.string(),
    status: z.string(),
    declaration: z.string().min(1, { message: "Amount cannot be zero" }),
    proof: z.object().optional(),
  });

  // useFormHook
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InvestmentSchema),
    defaultValues: {
      title: undefined,
      name: undefined,
      sectionname: undefined,
      status: undefined,
      declaration: undefined,
      proof: undefined,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <ReusableModal
        open={open}
        onClose={() => setOpen(false)}
        heading={"Create Investment"}
      >
        <div className="p-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="flex   w-full bg-white flex-col h-fit gap-1"
          >
            <AuthInputFiled
              name="name"
              control={control}
              type="select"
              placeholder="Select Section Type"
              label="Select Section Type *"
              options={[{ label: "Investment 3", value: "Investment 3" }]}
              errors={errors}
              error={errors.name}
            />
            <AuthInputFiled
              name="sectionname"
              control={control}
              type="select"
              placeholder="Select Investment Type"
              label="Select Investment Type *"
              options={[{ label: "Investment 3", value: "Investment 3" }]}
              errors={errors}
              error={errors.sectionname}
            />

            <AuthInputFiled
              name="declaration"
              control={control}
              type="number"
              placeholder="Enter Amount"
              label="Enter Amount *"
              errors={errors}
              error={errors.declaration}
            />

            <AuthInputFiled
              name="proof"
              control={control}
              type="file"
              placeholder="Upload Proof"
              label="Upload Proof "
              errors={errors}
              error={errors.name}
            />

            <div className="flex gap-4 w-full justify-end">
              <Button
                onClick={() => setOpen(false)}
                color="error"
                variant="outlined"
              >
                cancel
              </Button>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </ReusableModal>
    </>
  );
};

export default CreateModal;
