import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Controller } from "react-hook-form";

const AuthInputFiled = ({
  label,
  name,
  icon: Icon,
  type,
  errors,
  error,
  control,
  readOnly = false,
  placeholder,
}) => {
  return (
    <div className="space-y-1">
      <label
        htmlFor={name}
        className={`${
          error && "text-red-500"
        } font-semibold text-gray-500 text-md`}
      >
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        id={name}
        render={({ field }) => (
          <>
            <div
              className={`${
                readOnly && "bg-[ghostwhite]"
              } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white py-[6px]`}
            >
              <Icon className="text-gray-700" />
              <input
                type={type}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`${
                  readOnly && "bg-[ghostwhite]"
                } border-none bg-white w-full outline-none px-2`}
                {...field}
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
  );
};

export default AuthInputFiled;
