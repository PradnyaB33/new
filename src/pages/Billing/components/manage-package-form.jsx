import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add,
  DeleteOutline,
  FilterCenterFocusOutlined,
} from "@mui/icons-material";
import { Box, Button, Fab, IconButton, Modal } from "@mui/material";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TestContext } from "../../../State/Function/Main";
import AuthInputFiled from "../../../components/InputFileds/AuthInputFiled";
import useSubscriptionMutation from "../../../hooks/QueryHook/Subscription/mutation";
import MiniPackagesForm from "./add-packages";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  p: 4,
  width: 350,
  height: 450,
  overflow: "auto",
};
const PackageForm = ({ handleClose, open, packages, organisation }) => {
  const { handleAlert } = useContext(TestContext);
  const [mainPackages, setmainPackages] = useState(packages);
  const { updateSubscriptionMutation } = useSubscriptionMutation();

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
  const handleDelete = async (doc) => {
    if (doc[0] === "basicPackageCount") {
      handleAlert(
        true,
        "error",
        "Sorry but we can't remove the basic package we can only update it"
      );
    } else {
      setmainPackages((prev) => {
        return prev.filter((main) => doc[0] !== main[0]);
      });
    }
  };
  const { errors, isDirty } = formState;
  function onSubmit(data) {
    console.log(`🚀 ~ file: manage-package-form.jsx:34 ~ data:`, data);
    updateSubscriptionMutation.mutate({
      subscriptionId: organisation?.subscriptionDetails?.id,
      data,
    });
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
              <div className="flex items-center justify-between">
                <AuthInputFiled
                  name={doc[0]}
                  icon={FilterCenterFocusOutlined}
                  control={control}
                  type="number"
                  placeholder={transformString(doc[0])}
                  label={`${transformString(doc[0])} *`}
                  errors={errors}
                  error={errors[doc[0]]}
                />
                <IconButton
                  onClick={() => {
                    handleDelete(doc);
                  }}
                  className=" h-fit"
                >
                  <DeleteOutline className=" text-red-600" />
                </IconButton>
              </div>
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
          billedPackage={mainPackages}
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
      const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
      return excludedWords.includes(formattedWord) ? "" : formattedWord;
    })
    .join(" ")
    .trim();
}
