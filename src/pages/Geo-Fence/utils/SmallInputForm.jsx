import { zodResolver } from "@hookform/resolvers/zod";
import { Email, People, Search } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";

const SmallInputForm = () => {
  const formSchema = z.object({
    firstName: z.string().optional(),
    email: z.string().email().optional(),
  });
  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(formSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <form
      className="flex justify-center items-center gap-4 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <AuthInputFiled
        control={control}
        label="First Name"
        placeholder="First Name"
        type="text"
        name="firstName"
        errors={errors}
        error={errors.firstName}
        icon={People}
      />
      <AuthInputFiled
        control={control}
        label="Email"
        placeholder="Email"
        type="email"
        name="email"
        errors={errors}
        error={errors.email}
        icon={Email}
      />
      <Button className="!h-fit" type="submit" variant="contained">
        <Search />
      </Button>
    </form>
  );
};

export default SmallInputForm;
