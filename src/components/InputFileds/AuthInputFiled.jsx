import { ErrorMessage } from "@hookform/error-message";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { default as React } from "react";
import Autocomplete, { usePlacesWidget } from "react-google-autocomplete";
import { Controller } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Link } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import Datepicker from "react-tailwindcss-datepicker";
import useEmpState from "../../hooks/Employee-OnBoarding/useEmpState";
import { salaryComponentArray } from "../Modal/SalaryInputFields/SalaryInputFieldsModal";
import PlaceAutoComplete from "./places-autocomplete";
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
  daysOfWeek,
  value,
  wrapperMessage,
  min,
  max,
  className,
  visible,
  setVisible,
  center,
  selectedDays,
  setSelectedDays,
  handleDaySelection,
  isSelected,
  handleOnChange,
}) => {
  const [focusedInput, setFocusedInput] = React.useState(null);
  const { updateField } = useEmpState();

  const handleFocus = (fieldName) => {
    setFocusedInput(fieldName);
  };
  const { ref } = usePlacesWidget({
    apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => console.log(place),
  });

  if (type === "calender") {
    return (
      <>
        <div className={`space-y-1 w-full ${className}`}>
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
              <div
                className={` flex rounded-md px-2 py-2 border-gray-200 border-[.5px] bg-white items-center`}
              >
                {Icon && <Icon className="text-gray-700 mr-2 text-sm" />}
                <Datepicker
                  inputClassName={"border-none w-full outline-none"}
                  useRange={false}
                  asSingle={true}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                />
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
      </>
    );
  }

  if (type === "select") {
    return (
      <>
        <div className={`space-y-1 w-full ${className}`}>
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
                  <Icon className="text-gray-700 text-sm" />
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
                    value={field?.value}
                    onChange={(value) => {
                      updateField(name, value);
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
      </>
    );
  }
  if (type === "naresh-select") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
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
                    defaultInputValue={field.value}
                    className={`${
                      readOnly && "bg-[ghostwhite]"
                    } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    options={options}
                    onChange={(value) => {
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
  if (type === "mutltiselect") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
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
                    aria-errormessage="error"
                    placeholder={placeholder}
                    isMulti
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
                    onChange={(value) => {
                      field.onChange(
                        value.map((item) => {
                          return item.value;
                        })
                      );
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
  if (type === "location-picker") {
    return (
      <PlaceAutoComplete
        {...{
          className,
          error,
          label,
          control,
          name,
          readOnly,
          Icon,
          placeholder,
          options,
          errors,
          center,
        }}
      />
    );
  }
  if (type === "not-select") {
    return (
      <div className={`space-y-1 w-full relative  ${className}`}>
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

                <Autocomplete
                  apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                  ref={ref}
                  value={field.value}
                  rows={2}
                  placeholder="Search Places ..."
                  className={`location-search-input ${
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
  }

  if (type === "autocomplete") {
    return (
      <>
        <div className={`space-y-1 w-full  ${className}`}>
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
                  } flex rounded-md px-2 border-gray-200 border-[.5px] !bg-white items-center`}
                >
                  <Icon className="text-gray-700" />
                  <CreatableSelect
                    aria-errormessage="error"
                    options={salaryComponentArray}
                    placeholder={placeholder}
                    isMulti
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        borderWidth: "0px",
                        boxShadow: "none",
                        background: "white",
                      }),
                      menuList: (base) => ({
                        ...base,
                        backgroundColor: "white !important",
                      }),
                    }}
                    className={`${
                      readOnly && "bg-[ghostwhite]"
                    } bg-white w-full !outline-none px-2 !shadow-none !border-none !border-0`}
                    components={{
                      IndicatorSeparator: () => null,
                    }}
                    value={field?.value}
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
      </>
    );
  }

  if (type === "checkbox") {
    return (
      <div className={`space-y-1 w-full  ${className}`}>
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
              {Icon && <Icon className="text-gray-700" />}
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
                {label}{" "}
                {name === "isChecked" && (
                  <Link
                    to="/terms-policy-cookies"
                    className="font-semibold text-blue-500 hover:underline text-md  "
                  >
                    Terms and Conditions
                  </Link>
                )}
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

  if (type === "Typefile") {
    return (
      <div className={`space-y-1  ${className}`}>
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
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${
                  focusedInput === name
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
              >
                {Icon && (
                  <Icon className="text-gray-700 md:text-lg !text-[1em]" />
                )}
                <input
                  type="file"
                  accept="image/png,image/gif,image/jpeg,image/webp"
                  id="logo_url"
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  placeholder={placeholder}
                  className={`${
                    readOnly && "bg-[ghostwhite]"
                  } border-none bg-white w-full outline-none px-2  `}
                  // {...field}
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
  if (type === "textarea") {
    return (
      <div className={`space-y-1  ${className}`}>
        <label
          htmlFor={name}
          className={`${
            error && "text-red-500"
          } font-semibold  text-gray-500 text-md`}
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
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${
                  focusedInput === name
                    ? "border-blue-500 border-[2px]"
                    : "border-gray-200 border-[.5px]"
                } flex rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
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
  if (type === "time") {
    return (
      <div className={`space-y-1 min-w-11 ${className}`}>
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
          render={({ field }) => {
            return (
              <div
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${
                  focusedInput === name
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200 border-[.5px]"
                } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
              >
                {Icon && (
                  <Icon className="text-gray-700 md:text-lg !text-[1em]" />
                )}
                <input
                  type={
                    type === "password" ? (visible ? "text" : "password") : type
                  }
                  maxLength={maxLimit && maxLimit}
                  readOnly={readOnly}
                  value={field.value}
                  placeholder={placeholder}
                  className={`${
                    readOnly && "bg-[ghostwhite]"
                  } border-none bg-white w-full outline-none px-2  `}
                  {...field}
                  formNoValidate
                />
                {type === "password" && (
                  <button
                    type="button"
                    onClick={() => setVisible(visible === true ? false : true)}
                  >
                    {visible ? (
                      <VisibilityOff className="text-gray-700" />
                    ) : (
                      <Visibility className="text-gray-700" />
                    )}
                  </button>
                )}
              </div>
            );
          }}
        />
        <div className="h-4 w-max !z-50   !mb-1">
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

  if (type === "contact") {
    return (
      <div className={`space-y-1 min-w-11 ${className}`}>
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
          render={({ field }) => {
            return (
              <div
                onFocus={() => {
                  handleFocus(name);
                }}
                onBlur={() => setFocusedInput(null)}
                className={`${readOnly && "bg-[ghostwhite]"} ${
                  focusedInput === name
                    ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                    : "outline-none border-gray-200  border-[.5px]"
                } flex  rounded-md items-center   bg-white  `}
              >
                <PhoneInput
                  country={"in"}
                  onChange={(value, data, event, formattedValue) => {
                    field.onChange(value.slice(data.dialCode.length));
                  }}
                  containerStyle={{
                    height: "100%",
                    width: "100%",
                    padding: "10px 0",
                    margin: "0px",
                  }}
                  inputStyle={{
                    padding: "0 50px",
                    outline: "none",
                    border: "none",
                  }}
                  inputProps={{
                    name: field.name,
                    id: field.id,
                    placeholder: placeholder,
                    className: `md:py-[6px]`,
                  }}
                />
              </div>
            );
          }}
        />
        <div className="h-4 w-max !z-50   !mb-1">
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
    <div className={`space-y-1 min-w-11 ${className}`}>
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
        render={({ field }) => {
          return (
            <div
              onFocus={() => {
                handleFocus(name);
              }}
              onBlur={() => setFocusedInput(null)}
              className={`${readOnly && "bg-[ghostwhite]"} ${
                focusedInput === name
                  ? "outline-blue-500 outline-3 border-blue-500 border-[2px]"
                  : "outline-none border-gray-200 border-[.5px]"
              } flex  rounded-md items-center px-2   bg-white py-1 md:py-[6px]`}
            >
              {Icon && (
                <Icon className="text-gray-700 md:text-lg !text-[1em]" />
              )}
              <input
                type={
                  type === "password" ? (visible ? "text" : "password") : type
                }
                min={min}
                max={max}
                maxLength={maxLimit && maxLimit}
                readOnly={readOnly}
                value={field.value}
                placeholder={placeholder}
                className={`${
                  readOnly && "bg-[ghostwhite]"
                } border-none bg-white w-full outline-none px-2  `}
                {...field}
                formNoValidate
              />
              {type === "password" && (
                <button
                  type="button"
                  onClick={() => setVisible(visible === true ? false : true)}
                >
                  {visible ? (
                    <VisibilityOff className="text-gray-700" />
                  ) : (
                    <Visibility className="text-gray-700" />
                  )}
                </button>
              )}
            </div>
          );
        }}
      />
      <div className="h-4 w-max !z-50   !mb-1">
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
