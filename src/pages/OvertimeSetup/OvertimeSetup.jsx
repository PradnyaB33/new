import React, { useState, useContext } from "react";
import {
  Checkbox,
  TextField,
  FormControlLabel,
  FormGroup,
  FormControl,
  RadioGroup,
  Radio,
  FormLabel,
  Tooltip,
  Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import axios from "axios";
import Setup from "../SetUpOrganization/Setup";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext";
import { useQuery } from "react-query";
import { TestContext } from "../../State/Function/Main";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BasicButton from "../../components/BasicButton";

const OvertimeSetup = () => {
  // hook
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const { handleAlert } = useContext(TestContext);
  const { organisationId } = useParams();

  //state
  const [overtimeAllowed, setOvertimeAllowed] = useState(false);
  const [minimumOvertimeHours, setMinimumOvertimeHours] = useState("");
  const [overtimeAllowanceRequired, setOvertimeAllowanceRequired] =
    useState(false);
  const [allowanceParameter, setAllowanceParameter] = useState("perHour");
  const [allowanceAmount, setAllowanceAmount] = useState("");

  // get query
  useQuery(
    ["overtimeSettings", organisationId],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/get/${organisationId}/overtime`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data.data || {};
    },
    {
      onSuccess: (settings) => {
        console.log("settiogn", settings)
        setOvertimeAllowed(settings.overtimeAllowed || false);
        setMinimumOvertimeHours(settings.minimumOvertimeHours || "");
        setOvertimeAllowanceRequired(
          settings.overtimeAllowanceRequired || false
        );
        setAllowanceParameter(settings.allowanceParameter || "perHour");
        setAllowanceAmount(settings.allowanceAmount || "");
      },
      onError: () => { },
    }
  );

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleCheckboxChange = (setter) => (event) => {
    setter(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Validate the form inputs
      if (!overtimeAllowed) {
        handleAlert(
          true,
          "error",
          "Please check 'Overtime Allowed' before proceeding."
        );
        return;
      }

      if (!overtimeAllowanceRequired) {
        handleAlert(
          true,
          "error",
          "Please check 'Overtime allowance' before proceeding."
        );
        return;
      }

      if (overtimeAllowed) {
        const minHours = Number(minimumOvertimeHours);

        if (isNaN(minHours) || minHours <= 0 || minHours > 24) {
          handleAlert(
            true,
            "error",
            "Number of Hours Allowed for Overtime must be greater than 0 and less than or equal to 24."
          );
          return;
        }
      }

      const laskh = 1000000;

      if (overtimeAllowanceRequired) {
        const allowance = Number(allowanceAmount);

        if (isNaN(allowance) || allowance <= 0 || allowance > laskh) {
          handleAlert(
            true,
            "error",
            `Overtime Allowances Amount is required, and less than or equal to ${laskh}.`
          );
          return;
        }
      }

      // Proceed with form submission if validation passes
      const overtimeSettings = {
        overtimeAllowed,
        minimumOvertimeHours: Number(minimumOvertimeHours),
        overtimeAllowanceRequired,
        allowanceParameter,
        allowanceAmount: Number(allowanceAmount),
        organizationId: organisationId,
      };

      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/overtime`,
        overtimeSettings,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Overtime setup successfully.");
    } catch (error) {
      console.log(error);
      handleAlert(
        true,
        "error",
        "Error occurred while setting up the overtime."
      );
    }
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Overtime"
              info="Configure Overtime Allowance settings"
            />
          </div>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              {/* <Tooltip */}
              {/* title="Enable or disable overtime for employees"
                      arrow
                      //  placement="left"
                    > */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={overtimeAllowed}
                    onChange={handleCheckboxChange(setOvertimeAllowed)}
                  />
                }
                label="Overtime Allowed"
              />
              {/* </Tooltip> */}
              {overtimeAllowed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                //  placement="left"
                >
                  <Grid container spacing={2} className="mb-4">
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Number of Hours Allowed for Overtime"
                        type="number"
                        value={minimumOvertimeHours}
                        onChange={handleInputChange(
                          setMinimumOvertimeHours
                        )}
                        inputProps={{ min: 0, max: 24 }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <Tooltip
                    title="Specify if overtime allowances are required"
                    arrow
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={overtimeAllowanceRequired}
                          onChange={handleCheckboxChange(
                            setOvertimeAllowanceRequired
                          )}
                        />
                      }
                      label="Overtime Allowances Required"
                    />
                  </Tooltip>
                  {overtimeAllowanceRequired && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FormControl component="fieldset" className="mb-4">
                        <FormLabel component="legend">
                          Overtime Allowances Amount Parameter
                        </FormLabel>
                        <RadioGroup
                          row
                          value={allowanceParameter}
                          onChange={handleInputChange(
                            setAllowanceParameter
                          )}
                        >
                          <FormControlLabel
                            value="perHour"
                            control={<Radio />}
                            label="Per Hour"
                          />
                          <FormControlLabel
                            value="perDay"
                            control={<Radio />}
                            label="Per Day"
                          />
                        </RadioGroup>
                      </FormControl>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            label="Overtime Allowances Amount"
                            type="number"
                            value={allowanceAmount}
                            onChange={handleInputChange(
                              setAllowanceAmount
                            )}
                            inputProps={{ min: 0 }}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </FormGroup>
            <br />
            <BasicButton type="submit" title="Save" />
          </form></div>
      </Setup>
    </BoxComponent>
  );
};

export default OvertimeSetup;
