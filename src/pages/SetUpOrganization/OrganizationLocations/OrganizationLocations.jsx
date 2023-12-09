import { Add, AddLocationAltOutlined, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { Country, State } from "country-state-city";
import React, { useContext, useEffect, useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import { useParams } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import Setup from "../Setup";
import Selector from "./selector";

const OrganizationLocations = () => {
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const { handleAlert } = useContext(TestContext);
  const organizationId = useParams().organisationId;
  let countryData = Country.getAllCountries();
  const continents = [
    { name: "Asia" },
    { name: "Africa" },
    { name: "Europe" },
    { name: "North America" },
    { name: "South America" },
    { name: "Australia" },
    { name: "Antarctica" },
  ];

  const [locationList, setLocationList] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [editing, setEditing] = useState(false);
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [continent, setContinent] = useState(continents[0] || "");
  const [shortName, setShortName] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState(countryData[0]);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [stateData, setStateData] = useState(
    State.getStatesOfCountry(country?.name)
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [state, setState] = useState(
    State.getStatesOfCountry(country?.isoCode)[0]
  );
  const [open, setOpen] = useState(false);

  const handleDeleteLocationConfirmation = (index) => {
    setConfirmOpen(true);
    setDeleteIndex(index);
  };

  useEffect(() => {
    const fetchLocationList = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        const filteredLocations = response.data.filter((location) => {
          return location.organizationId === organizationId;
        });
        setLocationList(filteredLocations);
        console.log(filteredLocations);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchLocationList();
    // eslint-disable-next-line
  }, [authToken]);

  useEffect(() => {
    if (open) {
      setStateData(
        (prevData) => State.getStatesOfCountry(country?.isoCode) || prevData
      );
    }

    if (!open) {
      setState("");
      setContinent(continents[0]);
      setStateData("");
    }
    // eslint-disable-next-line
  }, [open, country]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setEditing(false);
    setOpen(false);
    setEditIndex(null);
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setShortName("");
    setContinent(continents[0]?.name);
    setState("");
    setPinCode("");
    setCountry(Country.getAllCountries()[0]);
  };

  const handleAddLocation = async () => {
    const newLocation = {
      country: country?.name,
      state: state?.name,
      city,
      shortName,
      continent: continent?.name,
      pinCode,
      addressLine1,
      addressLine2,
      organizationId,
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/route/location/addOrganizationLocations`,
        newLocation,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setLocationList(response.data);

      handleAlert(true, "success", "Location added successfully");
      handleClose();
    } catch (error) {
      console.error(error.response.data.message);
      handleAlert(true, "error", error.response.data.error);
      console.log(error);
    }
  };

  const handleEditLocation = async (index) => {
    setEditing(true);
    setEditIndex(index);
    const selectedLocation = locationList[index];
    setAddressLine1(selectedLocation.addressLine1);
    setAddressLine2(selectedLocation.addressLine2);
    setCity(selectedLocation.city);
    setShortName(selectedLocation.shortName);
    setContinent(
      continents.find(
        (continent) => continent?.name === selectedLocation.continent
      )
    );
    setPinCode(selectedLocation.pinCode);
    const selectedCountry = Country.getAllCountries().find(
      (country) => country?.name === selectedLocation.country
    );
    setCountry(
      Country.getAllCountries().find(
        (country) => country?.name === selectedLocation.country
      ) || null
    );
    setStateData(Country.getAllCountries(country?.isoCode));
    setState(
      State.getStatesOfCountry(selectedCountry.isoCode).find(
        (state) => state?.name === selectedLocation.state
      )
    );

    setOpen(true);
  };

  const handleUpdateLocation = async (index) => {
    setEditIndex(index);

    const newLocation = {
      country: country?.name,
      state: state?.name,
      continent: continent?.name,
      shortName,
      city,
      pinCode,
      addressLine1,
      addressLine2,
      organizationId,
    };
    try {
      await axios.put(
        `${process.env.REACT_APP_API}/route/location/updateOrganizationLocations/${locationList[index]._id}`,
        newLocation,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setLocationList(response.data);
      handleAlert(true, "success", "Location updated successfully");
      handleClose();
    } catch (error) {
      console.error("error is: ", error.response.data.error);
      handleAlert(true, "error", error.response.data.error);
    }
  };

  const handleDeleteLocation = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/location/deleteOrganizationLocations/${locationList[deleteIndex]._id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setLocationList(response.data);

      handleAlert(true, "success", "Location deleted successfully");
    } catch (error) {
      console.error(error.response.data.message);
      handleAlert(true, "error", error.response.data.error);
    }
    setConfirmOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (editing) handleUpdateLocation();
      else handleAddLocation();
      handleClose();
    }
  };

  // return (
  //   <Setup>
  //   </Setup>
  // );
  return (
    <section className="bg-gray-50 min-h-screen w-full">
      <Setup>
        <div className="SetupSection w-[80%] h-full bg-white   shadow-xl  rounded-sm">
          <IntlProvider locale="en">
            <div className="p-4  border-b-[.5px] border-gray-300 flex items-center justify-between gap-3 w-full">
              <div className="flex gap-3">
                {" "}
                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                  <AddLocationAltOutlined className="!text-lg text-white" />
                </div>
                <h1 className="!text-lg tracking-wide">
                  Add Organization Location
                </h1>
              </div>
              <Button
                className="!bg-[#0ea5e9]"
                variant="contained"
                onClick={handleOpen}
              >
                <Add />
                Add location
              </Button>
            </div>

            {locationList.length === 0 ? (
              <Typography variant="body1">No Locations Added</Typography>
            ) : (
              <table className="min-w-full bg-white text-left text-sm font-light">
                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                  <tr className="!font-medium">
                    <th scope="col" className="px-3 py-3 whitespace-nowrap">
                      Sr No
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Continent
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Country
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      State
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Short Name
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Address
                    </th>
                    <th scope="col" className="px-3 py-3 ">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationList
                    .sort((a, b) => {
                      if (a.continent !== b.continent) {
                        return a.continent.localeCompare(b.continent);
                      }
                      return a.country.localeCompare(b.country);
                    })
                    .map((location, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } border-b dark:border-neutral-500 !font-medium`}
                      >
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="py-2 px-3">{location.continent}</td>
                        <td className="py-2 px-3">{location.country}</td>
                        <td className="py-2 px-3">{location.state}</td>
                        <td className="py-2 px-3">{location.shortName}</td>
                        <td className="py-2 px-3">
                          {`${location.addressLine1} ${location.addressLine2} ${location.pinCode}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <IconButton
                            onClick={() => handleEditLocation(index)}
                            aria-label="edit"
                          >
                            <Edit className="!text-xl" color="success" />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteLocationConfirmation(index)
                            }
                            aria-label="delete"
                          >
                            <Delete className="!text-xl" color="error" />
                          </IconButton>
                        </td>
                        <Dialog
                          open={confirmOpen}
                          onClose={() => setConfirmOpen(false)}
                        >
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              Are you sure you want to delete this location?
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button
                              onClick={() => setConfirmOpen(false)}
                              color="primary"
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={() => handleDeleteLocation(index)}
                              color="primary"
                            >
                              Delete
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </tr>
                    ))}
                  {/* {isLoading ? (
                    <SkeletonForLeaveTypes />
                  ) : (
                    <>{locationList
                      .sort((a, b) => {
                        if (a.continent !== b.continent) {
                          return a.continent.localeCompare(b.continent);
                        }
                        return a.country.localeCompare(b.country);
                      }).map((location, index) => (
                          <LeaveTypeEditBox
                            key={index}
                            leaveType={location}
                            index={index}
                          />
                        ))}
                    </>
                  )} */}
                </tbody>
              </table>
            )}

            <Dialog open={open} onClose={handleClose} onKeyDown={handleKeyDown}>
              <DialogTitle>
                {editIndex !== null ? (
                  <FormattedMessage
                    id="editLocation"
                    defaultMessage="Edit Location"
                  />
                ) : (
                  <FormattedMessage
                    id="addLocation"
                    defaultMessage="Add Location"
                  />
                )}
              </DialogTitle>
              <DialogContent>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <p>Continent:</p>
                    <Selector
                      required
                      key={continent?.name}
                      data={continents}
                      selected={continent}
                      setSelected={setContinent}
                    />
                  </div>
                  <div className="!w-[46%]">
                    <p>Short Name:</p>
                    <TextField
                      label={"short name *"}
                      className="pb-0"
                      variant="outlined"
                      size="small"
                      value={shortName}
                      onChange={(e) => setShortName(e.target.value)}
                      fullWidth
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <p>Country:</p>
                    <Selector
                      key={country?.phonecode}
                      data={Country.getAllCountries()}
                      selected={country}
                      setSelected={setCountry}
                      required
                    />
                  </div>
                  {stateData && (
                    <div>
                      <div>State:</div>
                      <Selector
                        key={country?.phonecode}
                        data={stateData}
                        selected={state}
                        setSelected={setState}
                        required
                      />
                    </div>
                  )}
                </div>
                <TextField
                  label={<FormattedMessage id="city" defaultMessage="City" />}
                  variant="outlined"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  fullWidth
                  style={{ marginTop: "8px" }}
                  required
                />
                <TextField
                  label={
                    <FormattedMessage
                      id="pinCode"
                      defaultMessage="Pin Code/Zip Code"
                    />
                  }
                  variant="outlined"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  fullWidth
                  required
                  style={{ marginTop: "8px" }}
                />
                <TextField
                  label={
                    <FormattedMessage
                      id="addressLine1"
                      defaultMessage="Address Line 1"
                    />
                  }
                  variant="outlined"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  style={{ marginTop: "8px" }}
                  fullWidth
                  required
                />
                <TextField
                  label={
                    <FormattedMessage
                      id="addressLine2"
                      defaultMessage="Address Line 2"
                    />
                  }
                  variant="outlined"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  style={{ marginTop: "8px" }}
                  fullWidth
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="secondary">
                  <FormattedMessage id="cancel" defaultMessage="Cancel" />
                </Button>
                <Button
                  onClick={() => {
                    if (editIndex !== null) {
                      handleUpdateLocation(editIndex);
                    } else {
                      handleAddLocation();
                    }
                  }}
                  color="primary"
                >
                  {editIndex !== null ? (
                    <FormattedMessage
                      id="saveChanges"
                      defaultMessage="Save Changes"
                    />
                  ) : (
                    <FormattedMessage
                      id="addLocation"
                      defaultMessage="Add Location"
                    />
                  )}
                </Button>
              </DialogActions>
            </Dialog>
          </IntlProvider>
        </div>
      </Setup>
    </section>
  );
};

export default OrganizationLocations;
