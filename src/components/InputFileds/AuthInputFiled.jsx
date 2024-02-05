import { ErrorMessage } from "@hookform/error-message";
import { CircularProgress } from "@mui/material";
import { default as React } from "react";
import { Controller } from "react-hook-form";
import PlacesAutocomplete from "react-places-autocomplete";
import Select from "react-select";
// import Autocomplete from "react-google-autocomplete";

const AuthInputFiled = ({
  label,
  name,
  icon: Icon,
  type,
  errors,
  error,
  control,
  maxLimit,
  readOnly = false,
  placeholder,
  options,
  disabled,
}) => {
  if (type === "select") {
    return (
      <>
        <div className="space-y-1 w-full ">
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
                  } flex rounded-md px-2 border-gray-200 border-[.5px] bg-white items-center`}
                >
                  <Icon className="text-gray-700" />
                  <Select
                    aria-errormessage=""
                    placeholder={placeholder}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                      }),
                    }}
                    className={`${
                      readOnly && "bg-[ghostwhite]"
                    } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={options}
                    // {...field}
                    onChange={(value) => {
                      console.log(
                        `🚀 ~ file: AuthInputFiled.jsx:64 ~ value:`,
                        value
                      );
                      field.onChange(value.value);
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
      </>
    );
  }
  if (type === "not-select") {
    return (
      <div className="space-y-1 w-full relative">
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
                <PlacesAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  onSelect={(address) => field.onChange(address)}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => {
                    return (
                      <>
                        <textarea
                          value={field.value}
                          rows={2}
                          {...getInputProps({
                            placeholder: "Search Places ...",
                            className: `location-search-input ${
                              readOnly && "bg-[ghostwhite]"
                            } border-none bg-white w-full outline-none px-2`,
                          })}
                          type=""
                        />
                        <div
                          className={`autocomplete-dropdown-container absolute w-full top-[6rem] bg-white z-40 !border-0  ${
                            suggestions.length !== 0 &&
                            "bg-[ghostwhite] !border-2 shadow-lg"
                          }`}
                        >
                          {loading && <CircularProgress />}
                          {suggestions.map((suggestion, i) => {
                            const className = suggestion.active
                              ? "suggestion-item--active"
                              : "suggestion-item";
                            // inline style for demonstration purpose
                            const style = suggestion.active
                              ? {
                                  backgroundColor: "#fafafa",
                                  cursor: "pointer",
                                  padding: "4px",
                                }
                              : {
                                  backgroundColor: "#ffffff",
                                  cursor: "pointer",
                                  padding: "4px",
                                };
                            return (
                              <div
                                key={i}
                                {...getSuggestionItemProps(suggestion, {
                                  className,
                                  style,
                                })}
                              >
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    );
                  }}
                </PlacesAutocomplete>
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
  }

  if (type === "checkbox") {
    return (
      <div className="space-y-1 w-full ">
        <Controller
          control={control}
          name={name}
          id={name}
          render={({ field }) => (
            <div
              className={`${
                readOnly && "bg-[ghostwhite]"
              } flex rounded-md px-2 bg-white py-[6px] gap-2`}
            >
              <Icon className="text-gray-700" />
              <input
                checked={field.value}
                type={type}
                readOnly={readOnly}
                id={name}
                placeholder={placeholder}
                className={`${
                  readOnly && "bg-[ghostwhite]"
                } border-none bg-white outline-none px-2`}
                {...field}
                disabled={disabled}
                formNoValidate
              />
              <label
                htmlFor={name}
                className={`${
                  error && "text-red-500"
                } font-semibold text-gray-500 text-md`}
              >
                {label}
              </label>
            </div>
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
  }

  if (type === "textarea") {
    return (
      <div className="space-y-1 ">
        <label
          htmlFor={name}
          className={`${
            error && "text-red-500"
          } font-semibold text-gray-500 text-sm md:text-md`}
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
                } flex rounded-md items-center px-2 border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
              >
                <textarea
                  type={type}
                  rows={3}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className={`${
                    readOnly && "bg-[ghostwhite]"
                  } border-none bg-white w-full outline-none px-2`}
                  {...field}
                  formNoValidate
                />
              </div>
            </>
          )}
        />
        <div className="h-4 w-[200px]  !z-50   !mb-1">
          <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => (
              <p className="text-sm mb-4 relative !bg-white  text-red-500">
                {message}
              </p>
            )}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1 ">
      <label
        htmlFor={name}
        className={`${
          error && "text-red-500"
        } font-semibold text-gray-500 text-sm md:text-md`}
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
              } flex rounded-md items-center px-2  border-gray-200 border-[.5px] bg-white py-1 md:py-[6px]`}
            >
              {Icon && (
                <Icon className="text-gray-700 md:text-lg !text-[1em]" />
              )}
              <input
                type={type}
                maxLength={maxLimit && maxLimit}
                readOnly={readOnly}
                placeholder={placeholder}
                className={`${
                  readOnly && "bg-[ghostwhite]"
                } border-none bg-white w-full outline-none px-2  `}
                {...field}
                formNoValidate
              />
            </div>
          </>
        )}
      />
      <div className="h-4 w-[200px]  !z-50   !mb-1">
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-sm mb-4 relative !bg-white  text-red-500">
              {message}
            </p>
          )}
        />
      </div>
    </div>
  );
};

export default AuthInputFiled;
