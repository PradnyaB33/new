import { Add, Info } from "@mui/icons-material";
import AddLocationAltOutlinedIcon from "@mui/icons-material/AddLocationAltOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
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
  const authToken = cookies["aegis"];
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
          `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organizationId}`,
          {
            headers: {
              Authorization: authToken,
            },
          }
        );
        setLocationList(response.data.locationsData);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchLocationList();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (open) {
      setStateData(
        (prevData) => State.getStatesOfCountry(country?.isoCode) || prevData
      );
      setState(State.getStatesOfCountry(country?.isoCode)[0]);
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
      if (
        !country ||
        !state ||
        !city ||
        !shortName ||
        !continent ||
        !pinCode ||
        !addressLine1 ||
        !organizationId
      ) {
        handleAlert(true, "error", "All fields are mandatory");
        return false;
      }
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
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setLocationList(response.data.locationsData);

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
    console.log(selectedLocation);
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
      if (
        !country ||
        !state ||
        !city ||
        !shortName ||
        !continent ||
        !pinCode ||
        !addressLine1 ||
        !organizationId
      ) {
        handleAlert(true, "error", "All fields are mandatory");
        return false;
      }
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
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      setLocationList(response.data.locationsData);
      console.log(locationList);
      handleAlert(true, "success", "Location updated successfully");
      handleClose();
    } catch (error) {
      console.error("error is: ", error.response.data.error);
      handleAlert(true, "error", error.response.data.error);
    }
  };

  const handleDeleteLocation = async (deleteIndex) => {
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
        `${process.env.REACT_APP_API}/route/location/getOrganizationLocations/${organizationId}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      setLocationList(response.data.locationsData);

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
        <div className=" w-full h-full bg-white   shadow-xl  rounded-sm">
          <IntlProvider locale="en">
            <div className="p-4  border-b-[.5px] border-gray-300 flex  justify-between gap-3 w-full">
              <div className="flex  gap-3 ">
                <div className="mt-1">
                  <AddLocationAltOutlinedIcon />
                </div>
                <div>
                  <h1 className="!text-lg">Location</h1>
                  <p className="text-xs text-gray-600">
                    Add organization location here.
                  </p>
                </div>
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
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="text-2xl" />
                  <h1 className="text-xl font-semibold">Add Location</h1>
                </article>
                <p>No location found. Please add a location.</p>
              </section>
            ) : (
              <div className="overflow-scroll">
                <table className="min-w-full bg-white text-left text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-medium">
                      <th scope="col" className="px-3 py-3 whitespace-nowrap">
                        Sr. No
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
                        City
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
                    {locationList?.map((location, index) => (
                      <tr
                        key={index}
                        className={` bg-white border-b dark:border-neutral-500 !font-medium`}
                      >
                        <td className="py-2 px-3">{index + 1}</td>
                        <td className="py-2 px-3">{location.continent}</td>
                        <td className="py-2 px-3">{location.country}</td>
                        <td className="py-2 px-3">{location.state}</td>
                        <td className="py-2 px-3">{location.city}</td>
                        <td className="py-2 px-3">{location.shortName}</td>
                        <td className="py-2 px-3">
                          {`${location.addressLine1} ${location.addressLine2} ${location.pinCode}`}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            onClick={() => handleEditLocation(index)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => {
                              handleDeleteLocationConfirmation(index);
                              setDeleteIndex(index);
                            }}
                            color="error"
                            aria-label="delete"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <form>
              <Dialog
                open={open}
                onClose={handleClose}
                onKeyDown={handleKeyDown}
              >
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
                <div className="flex gap-4 mt-4  justify-end mb-4 mr-6">
                  <Button
                    onClick={handleClose}
                    color="error"
                    variant="outlined"
                  >
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
                    variant="contained"
                    color="primary"
                  >
                    {editIndex !== null ? (
                      <FormattedMessage
                        id="saveChanges"
                        defaultMessage="Apply"
                      />
                    ) : (
                      <FormattedMessage
                        id="addLocation"
                        defaultMessage="Submit"
                      />
                    )}
                  </Button>
                </div>
              </Dialog>
              <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                {/* <DialogContent>
                  <DialogContentText>
                    Are you sure you want to delete this location?
                  </DialogContentText>
                </DialogContent> */}
                <DialogContent>
                  <p>
                    Please confirm your decision to delete this location, as
                    this action cannot be undone.
                  </p>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setConfirmOpen(false)}
                    variant="outlined"
                    color="primary"
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDeleteLocation(deleteIndex)}
                    color="error"
                  >
                    Delete
                  </Button>
                </DialogActions>
                {/* <DialogActions>
                  <Button onClick={() => setConfirmOpen(false)} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteLocation(deleteIndex)}
                    color="primary"
                  >
                    Delete
                  </Button>
                </DialogActions> */}
              </Dialog>
            </form>
          </IntlProvider>
        </div>
      </Setup>
    </section>
  );
};

export default OrganizationLocations;
