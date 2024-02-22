import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Close, PriceCheck, Savings } from "@mui/icons-material";
import { Box, Button, IconButton, Modal } from "@mui/material";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../InputFileds/AuthInputFiled";

const TDSDeclarationModel = ({ open, handleClose }) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    p: 4,
  };

  const sectionOption = [
    { label: "section1", value: "option1" },
    { label: "section2", value: "option2" },
    { label: "section3", value: "option3" },
    { label: "section4", value: "option4" },
  ];

  const zodSchema = z.object({
    section: z.string(),
    amount: z.string(),
    maxallowed: z.string(),
    investmenttype: z.string(),
  });

  const {
    handleSubmit,
    control,

    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      section: z.object({
        label: z.string(),
        value: z.string(),
      }),
    },
    resolver: zodResolver(zodSchema),
  });

  const InvestmentTypeOption = useMemo(() => {
    if (watch("section").label === "section1") {
      return [
        { label: "section1", value: "option1" },
        { label: "section2", value: "option2" },
        { label: "section3", value: "option3" },
        { label: "section4", value: "option4" },
      ];
    } else if (watch("section").label === "section2") {
      return [
        { label: "test1", value: "option1" },
        { label: "test2", value: "option2" },
        { label: "test3", value: "option3" },
        { label: "test4", value: "option4" },
      ];
    } else {
      return [
        { label: "third1", value: "option1" },
        { label: "third2", value: "option2" },
        { label: "third3", value: "option3" },
        { label: "third4", value: "option4" },
      ];
    }
    // eslint-disable-next-line
  }, [watch("section").label]);

  function monthsFromAprilToCurrent() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    let diffMonths = currentMonth - 3;

    if (diffMonths < 0) {
      diffMonths += 12;
    }

    return diffMonths;
  }

  const month = monthsFromAprilToCurrent();

  const GrossSalary = (5 * 100) / (300000 - watch("amount"));
  console.log(GrossSalary, month);

  const anualTDS = (500000 - watch("amount")) * GrossSalary * 12;
  const monthlyTDS = (500000 - watch("amount")) * GrossSalary * month;

  const onSubmit = (data) => {};
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
            <h1 id="modal-modal-title" className="text-xl pl-2 font-semibold">
              Create Declaration Investments
            </h1>
            <IconButton onClick={handleClose}>
              <Close className="!text-[16px]" />
            </IconButton>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6">
            <AuthInputFiled
              name="section"
              icon={Category}
              control={control}
              type="select"
              placeholder="sec1"
              label="Select section *"
              errors={errors}
              error={errors.section}
              options={sectionOption}
            />
            <AuthInputFiled
              name="investmenttype"
              icon={Savings}
              control={control}
              type="select"
              options={InvestmentTypeOption}
              placeholder="sec1"
              label="Select Investment Type *"
              maxLimit={15}
              errors={errors}
              error={errors.investmenttype}
            />
            <div className="space-y-1 w-full mb-4 ">
              <h1 className={`font-semibold text-gray-500 text-md`}>
                Maximum amount allowed
              </h1>
              <div
                className={`
                  flex rounded-md px-2 border-gray-200 border-[.5px] bg-[ghostwhite] items-center`}
              >
                <h1 className="flex  rounded-md items-center px-2   bg-[ghostwhite] py-1 md:py-[6px]">
                  500000
                </h1>
              </div>
            </div>
            <AuthInputFiled
              name="amount"
              icon={PriceCheck}
              control={control}
              type="number"
              options={sectionOption}
              placeholder="sec1"
              label="Enter amount to be declared *"
              maxLimit={15}
              errors={errors}
              error={errors.amount}
            />

            {watch("amount") && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {anualTDS >= 0 && (
                  <div className="space-y-1 w-full ">
                    <h1 className={`font-semibold text-gray-500 text-md`}>
                      Annual Tds
                    </h1>
                    <div
                      className={`
                  flex rounded-md px-2 border-gray-200 border-[.5px] bg-[ghostwhite] items-center`}
                    >
                      <h1 className="flex  rounded-md items-center px-2   bg-[ghostwhite] py-1 md:py-[6px]">
                        {anualTDS}
                      </h1>
                    </div>
                  </div>
                )}

                {monthlyTDS >= 0 && (
                  <div className="space-y-1 w-full ">
                    <h1 className={`font-semibold text-gray-500 text-md`}>
                      Monthly Tds
                    </h1>
                    <div
                      className={`
                    flex rounded-md px-2 border-gray-200 border-[.5px] bg-[ghostwhite] items-center`}
                    >
                      <h1 className="flex  rounded-md items-center px-2   bg-[ghostwhite] py-1 md:py-[6px]">
                        {monthlyTDS}
                      </h1>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* <AuthInputFiled
              name="proof"
              icon={Category}
              control={control}
              type="Typefile"
              placeholder="sec1"
              label="Add proof"
              errors={errors}
              error={errors.proof}
            /> */}
            <div className="flex gap-4  mt-4 mr-4 justify-end">
              <Button color="error" variant="outlined">
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Apply
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default TDSDeclarationModel;
