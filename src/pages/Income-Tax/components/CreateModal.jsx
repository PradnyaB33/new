import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mui/material";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import ReusableModal from "../../../components/Modal/component";
import {
  LetOutArray,
  otherSections,
  SalaryArray,
  section80c,
  section80CCD,
  sectionArray,
  SelfHouseArray,
} from "../data";
import useCreateDeclaration from "../hooks/mutations/useCreateDeclaration";

const CreateModal = ({ open, setOpen }) => {
  // zod schema
  const InvestmentSchema = z.object({
    name: z.object({
      label: z.string(),
      value: z.string(),
    }),
    sectionname: z.object({
      label: z.string(),
      value: z.string(),
    }),
    subsectionname: z.object({
      label: z.string(),
      value: z.string(),
    }),
    declaration: z.string().min(1, { message: "Amount cannot be zero" }),
    proof: z.instanceof(File).optional(),
  });

  // useFormHook
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(InvestmentSchema),
    defaultValues: {
      name: undefined,
      sectionname: undefined,
      declaration: undefined,
      proof: undefined,
    },
  });

  const [sectionType, setSectionType] = React.useState([]);
  const [subSectionType, setSubSectionType] = React.useState([]);

  useEffect(
    () => {
      if (watch("sectionname")?.value === "Salary") {
        setSectionType(SalaryArray);
      }

      if (watch("sectionname")?.value === "House") {
        setSubSectionType([
          {
            label: "(A) Self Occupied Property (Loss)",
            value: "(A) Self Occupied Property (Loss)",
          },
          {
            label: "(B) Let out property",
            value: "(B) Let out property",
          },
          {
            label: "(C) Let out property",
            value: "(C) Let out property",
          },
        ]);
      }

      if (watch("sectionname")?.value === "SectionDeduction") {
        setSubSectionType(
          setSubSectionType([
            {
              label: "80C",
              value: "Section80",
            },
            {
              label: "80 CCD",
              value: "Section 80CCD NPS",
            },
            {
              label: "80D",
              value: "Section80 50000",
            },
          ])
        );
      }

      if (
        watch("subsectionname")?.value === "(A) Self Occupied Property (Loss)"
      ) {
        setSectionType(SelfHouseArray);
      }
      if (watch("subsectionname")?.value === "(C) Let out property") {
        setSectionType(LetOutArray);
      }

      if (watch("subsectionname")?.label === "80C") {
        setSectionType(section80c);
      }
      if (watch("subsectionname")?.label === "80C") {
        setSectionType(section80c);
      }
      if (watch("subsectionname")?.label === "80 CCD") {
        setSectionType(section80CCD);
      }
      if (watch("subsectionname")?.label === "80D") {
        setSectionType(otherSections);
      }

      setValue("name", { label: "", value: "" });
    },
    // eslint-disable-next-line
    [watch("sectionname"), watch("subsectionname")]
  );

  const { createDeclarationMutation } = useCreateDeclaration();

  const onSubmit = (data) => {
    createDeclarationMutation.mutate(data);
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
              name="sectionname"
              control={control}
              type="select"
              placeholder="Select Section Type"
              label="Select Section Type *"
              options={sectionArray}
              errors={errors}
              error={errors.sectionname}
            />

            {(watch("sectionname")?.value === "SectionDeduction" ||
              watch("sectionname")?.value === "House") && (
              <AuthInputFiled
                name="subsectionname"
                control={control}
                type="select"
                placeholder="Select Subsection Type"
                label="Select Subsection Type *"
                options={subSectionType}
                errors={errors}
                error={errors.subsectionname}
              />
            )}

            <AuthInputFiled
              name="name"
              control={control}
              type="select"
              placeholder="Select Investment Type"
              label="Select Investment Type *"
              options={sectionType}
              errors={errors}
              error={errors.name}
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
              type="Typefile"
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
