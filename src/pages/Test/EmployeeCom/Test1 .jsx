import { zodResolver } from "@hookform/resolvers/zod";
import { ContactEmergency, ContactMail, Person } from "@mui/icons-material";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
const Test1 = () => {
  const EmployeeSchema = z.object({
    name: z.string(),
  });

  const { control, formState } = useForm({
    defaultValues: {},
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;
  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Personal Details</h1>

      <form className="w-full flex  flex-1 flex-col">
        <div className="grid grid-cols-3 w-full gap-3">
          <AuthInputFiled
            name="name"
            icon={Person}
            control={control}
            type="text"
            placeholder="Jhon Doe"
            label="Employee first name *"
            errors={errors}
            error={errors.name}
          />
          <AuthInputFiled
            name="middlename"
            icon={Person}
            control={control}
            type="text"
            placeholder="Organisation Name"
            label="Employee middle name *"
            errors={errors}
            error={errors.name}
          />
          <AuthInputFiled
            name="lastname"
            icon={Person}
            control={control}
            type="text"
            placeholder="Organisation Name"
            label="Employee last name *"
            errors={errors}
            error={errors.name}
          />
        </div>
        <AuthInputFiled
          name="lastname"
          icon={Person}
          control={control}
          type="text"
          placeholder="Organisation Name"
          label="Employee Personal Email *"
          errors={errors}
          error={errors.name}
        />
        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="name"
            icon={Person}
            control={control}
            type="password"
            placeholder="*******"
            label="Password *"
            errors={errors}
            error={errors.name}
          />
          <AuthInputFiled
            name="middlename"
            icon={Person}
            control={control}
            type="password"
            placeholder="*******"
            label="Confirm password *"
            errors={errors}
            error={errors.name}
          />
        </div>
        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="name"
            icon={Person}
            control={control}
            type="textarea"
            placeholder="*******"
            label="Temporary Address *"
            errors={errors}
            error={errors.name}
          />
          <AuthInputFiled
            name="name"
            icon={Person}
            control={control}
            type="textarea"
            placeholder="*******"
            label="Permanant Address *"
            errors={errors}
            error={errors.name}
          />
        </div>
        <div className="grid grid-cols-2 w-full gap-3">
          <AuthInputFiled
            name="name"
            icon={ContactEmergency}
            control={control}
            type="text"
            placeholder="1234567890"
            label="Contact 1 *"
            errors={errors}
            error={errors.name}
          />
          <AuthInputFiled
            name="name"
            icon={ContactMail}
            control={control}
            type="text"
            placeholder="1234567890"
            label="Contact 2 *"
            errors={errors}
            error={errors.name}
          />
        </div>
      </form>
    </div>
  );
};

export default Test1;
