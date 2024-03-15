import React, { useContext, useState } from "react";
import Setup from "../SetUpOrganization/Setup";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import {
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import PriceChangeOutlinedIcon from "@mui/icons-material/PriceChangeOutlined";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router";
import useAuthToken from "../../hooks/Token/useAuth";
import axios from "axios";
import { UseContext } from "../../State/UseState/UseContext";

const RemoteSetup = () => {
  const id = useParams().organisationId;
  const authToken = useAuthToken();
  const queryClient = useQueryClient();
  const { setAppAlert } = useContext(UseContext);
  const { data, isLoading, refetch } = useQuery(
    "remote-fetch",
    async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/remote-punch/${id}`,
          {
            headers: { Authorization: authToken },
          }
        );
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    },
    {
      onSuccess: (data) => {
        if (data && data.remotePunchingObject) {
          setFormData({
            allowance: data.remotePunchingObject.allowance || false,
            allowanceQuantity: data.remotePunchingObject.allowanceQuantity || 0,
            dualWorkflow: data.remotePunchingObject.dualWorkflow || false,
          });
        }
      },
    }
  );
  console.log(data);

  const [formData, setFormData] = useState({
    allowance: false,
    allowanceQuantity: 0,
    dualWorkflow: false,
  });

  const handleFormFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/remote-punch/${id}`,
        formData,
        {
          headers: { Authorization: authToken },
        }
      );
      refetch();
      queryClient.invalidateQueries("remote-fetch");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Changes Updated Successfully",
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex justify-between gap-3 w-full border-gray-300">
              <div className="flex gap-3">
                <div className="mt-1">
                  <FingerprintIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Remote Punching</h1>
                </div>
              </div>
            </div>
            {isLoading ? (
              <div className="p-5 flex flex-col gap-5">
                <Skeleton variant="rectangular" height={32} />
                <Skeleton variant="rectangular" height={32} />
              </div>
            ) : (
              <div className="w-full flex justify-start">
                <div className="w-[46%] p-5 ">
                  <div>
                    <PriceChangeOutlinedIcon />
                    <Checkbox
                      name="dualWorkflow"
                      checked={formData.dualWorkflow}
                      onChange={handleFormFieldChange}
                    />
                    <span className="text-[#91999F]">Dual Workflow</span>
                  </div>
                  <Typography
                    style={{ textDecoration: "underline" }}
                    className="!text-sm text-[#666C73]"
                  >
                    Enabling workflow ensures account approval after manager's
                    approval otherwise added directly as allowance.
                  </Typography>
                  <div className="mt-8">
                    <h1 className="text-[#91999F] mb-3">
                      Remote Punching Calculation Amount
                    </h1>
                    <TextField
                      sx={{ width: "100%" }}
                      size="small"
                      id="outlined-basic"
                      name="allowanceQuantity"
                      value={formData.allowanceQuantity}
                      onChange={handleFormFieldChange}
                      variant="outlined"
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton edge="start" aria-label="logo" disabled>
                              <PriceChangeOutlinedIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </div>
                <div className="w-[65%] p-5 ">
                  <div>
                    <PriceChangeOutlinedIcon />
                    <Checkbox
                      name="allowance"
                      checked={formData.allowance}
                      onChange={handleFormFieldChange}
                    />
                    <span className="text-[#91999F]">
                      Remote punching calculation
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full flex justify-center mb-4 mt-2">
              <Button variant="contained" onClick={handleSubmit}>
                Apply For Changes
              </Button>
            </div>
          </article>
        </Setup>
      </section>
    </>
  );
};

export default RemoteSetup;
