import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "@mui/icons-material";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useTrainingHook from "../../../hooks/QueryHook/Training/hook";
import useTrainingMutation from "../../../hooks/QueryHook/Training/mutation";

const MiniForm = () => {
  const { mutate } = useTrainingMutation();
  const smallSchema = z.object({
    name: z.string(),
  });
  const { handleSubmit, formState, control, watch } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(smallSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
    mutate(data.name);
  };

  const { data, isLoading, error } = useTrainingHook(watch("name"));
  console.log(
    `🚀 ~ file: mini-form.jsx:28 ~  data, isLoading, error :`,
    data,
    isLoading,
    error
  );

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-8 items-start w-full"
      >
        <AuthInputFiled
          name="name"
          type="rounded-text-field"
          placeholder="Search"
          className="w-full !rounded-full items-center"
          control={control}
          error={errors.name}
          errors={errors}
        />
        <Button
          type="submit"
          size="large"
          className="!h-[40px] !w-[40px]"
          variant="contained"
        >
          <Search />
        </Button>
      </form>
    </div>
  );
};

export default MiniForm;
