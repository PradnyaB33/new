import { zodResolver } from "@hookform/resolvers/zod";
import { ContactMail } from "@mui/icons-material";
import { React } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useEmpQuery from "../../../hooks/Employee-OnBoarding/useEmpQuery";

const Test3 = () => {
  const organisationId = useParams("");
  const { AdditionalListCall } = useEmpQuery(organisationId);
  const addtionalFields = AdditionalListCall();

  const EmployeeSchema = z.object({
    name: z.string(),
    gender: z.string(),
  });

  const { control, formState } = useForm({
    defaultValues: {},
    resolver: zodResolver(EmployeeSchema),
  });

  const { errors } = formState;

  return (
    <div className="w-full mt-4">
      <h1 className="text-2xl mb-4 font-bold">Additional info</h1>

      <form className="w-full flex  flex-1 flex-col">
        <div className="grid grid-cols-2 w-full gap-3">
          {addtionalFields?.inputField.inputDetail?.map((input, id) => (
            <AuthInputFiled
              name={input.label}
              placeholder={input.label}
              label={input.placeholder}
              icon={ContactMail}
              control={control}
              type="text"
              errors={errors}
              error={errors.foundation_date}
            />
          ))}
        </div>
      </form>
    </div>
  );
};

export default Test3;
