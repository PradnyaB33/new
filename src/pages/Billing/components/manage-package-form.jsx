import { zodResolver } from "@hookform/resolvers/zod";
import { Add, FilterCenterFocusOutlined } from "@mui/icons-material";
import { Box, Button, Fab, Modal } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import MiniPackagesForm from "./add-packages";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
};
const PackageForm = ({ handleClose, open, packages }) => {
  const [mainPackages, setmainPackages] = useState(packages);
  console.log(
    `🚀 ~ file: manage-package-form.jsx:19 ~ mainPackages:`,
    mainPackages
  );
  const [close, setClose] = useState(false);
  const packageSchema = z.object(
    Object.fromEntries(mainPackages?.map((doc) => [doc[0], z.string()]))
  );
  let defaultValues = Object.fromEntries(
    mainPackages?.map((doc) => [doc[0], doc[1]])
  );

  const { control, formState, handleSubmit } = useForm({
    defaultValues,
    resolver: zodResolver(packageSchema),
  });
  const { errors, isDirty } = formState;
  function onSubmit(data) {
    console.log(`🚀 ~ file: manage-package-form.jsx:34 ~ data:`, data);
  }
  return (
    <Modal
      keepMounted={false}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="border-none !z-10 shadow-md outline-none rounded-md gap-2 flex flex-col"
      >
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Manage subscription
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          {mainPackages.map((doc) => {
            return (
              <AuthInputFiled
                name={doc[0]}
                icon={FilterCenterFocusOutlined}
                control={control}
                type="text"
                placeholder={transformString(doc[0])}
                label={`${transformString(doc[0])} *`}
                errors={errors}
                error={errors[doc[0]]}
              />
            );
          })}
          <Fab
            onClick={() => setClose(true)}
            type="button"
            color="primary"
            aria-label="add"
          >
            <Add />
          </Fab>
          <Button variant="contained" disabled={!isDirty} type="submit">
            Submit
          </Button>
        </form>
        <MiniPackagesForm
          open={close}
          handleClose={() => setClose(false)}
          setPackage={setmainPackages}
        />
      </Box>
    </Modal>
  );
};

export default PackageForm;
function transformString(inputString, excludedWords = []) {
  return inputString
    .split(/(?=[A-Z])/)
    .map((word) => {
      console.log(`🚀 ~ file: manage-package-form.jsx:74 ~ word:`, word);
      const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
      return excludedWords.includes(formattedWord) ? "" : formattedWord;
    })
    .join(" ")
    .trim();
}
