import { ErrorMessage } from "@hookform/error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectAllOutlined } from "@mui/icons-material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { z } from "zod";

const Individual = () => {
  const [open, setOpen] = React.useState(false);
  console.log(
    `🚀 ~ file: individual-form.jsx:11 ~ open, setOpen:`,
    open,
    setOpen
  );
  const individualSchema = z.object({
    _id: z.string(),
  });
  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: {
      _id: undefined,
    },
    resolver: zodResolver(individualSchema),
  });
  const { errors } = formState;
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-8 items-start w-full"
      >
        <div className={`space-y-1 w-full `}>
          <label
            htmlFor={"name"}
            className={`${
              errors._id && "text-red-500"
            } font-semibold text-gray-500 text-md`}
          >
            {"label"}
          </label>
          <Controller
            control={control}
            name={"_id"}
            id={"_id"}
            render={({ field }) => (
              <>
                <div
                  className={`flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                >
                  <SelectAllOutlined className="text-gray-700 text-sm" />
                  <Select
                    aria-errormessage=""
                    placeholder={"Select..."}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={` bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={[{ label: "Select...", value: "option one" }]}
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </div>
              </>
            )}
          />
          <div className="h-4 !mb-1">
            <ErrorMessage
              errors={errors}
              name={name}
              render={({ message }) => (
                <p className="text-sm text-red-500">{message}</p>
              )}
            />
          </div>
        </div>
      </form>
      {/* <Modal
        open={open}
        onClose={setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="bg-white p-4 w-[400px] h-[400px]">
          <div className="flex justify-between items-center">
            <h2
              id="modal-modal-title"
              className="text-lg font-semibold text-gray-700"
            >
              Modal title
            </h2>
            <button onClick={setOpen(false)} className="text-red-500">
              Close
            </button>
          </div>
          <p id="modal-modal-description" className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci,
            consequuntur.
          </p>
        </div>
      </Modal> */}
    </>
  );
};

export default Individual;
