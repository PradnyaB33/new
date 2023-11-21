import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FormattedMessage, IntlProvider } from "react-intl";
import Select from "react-select";

const AddOrganizationLocations = () => {
  const [open, setOpen] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [country, setCountry] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  useEffect(() => {
    // Fetch countries
    axios
      .get("http://api.geonames.org/countryInfoJSON", {
        params: {
          username: "your_geonames_username", // Replace with your Geonames username
        },
      })
      .then((response) => {
        const countryOptions = response.data.geonames.map((country) => ({
          value: country.countryCode,
          label: country.countryName,
        }));
        setCountries(countryOptions);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  useEffect(() => {
    // Fetch states based on the selected country
    if (selectedCountry) {
      axios
        .get("http://api.geonames.org/childrenJSON", {
          params: {
            username: "your_geonames_username", // Replace with your Geonames username
            geonameId: selectedCountry.value,
          },
        })
        .then((response) => {
          const stateOptions = response.data.geonames.map((state) => ({
            value: state.geonameId,
            label: state.name,
          }));
          setStates(stateOptions);
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [selectedCountry]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditIndex(null);
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPinCode("");
    // setCountry("");
    setSelectedCountry(null);
    setSelectedState(null);
  };

  const handleAddLocation = () => {
    const newLocation = {
      addressLine1,
      addressLine2,
      city,
      state: selectedState ? selectedState.label : "",
      pinCode,
      country: selectedCountry ? selectedCountry.label : "",
    };

    if (editIndex !== null) {
      const updatedList = [...locationList];
      updatedList[editIndex] = newLocation;
      setLocationList(updatedList);
    } else {
      setLocationList([...locationList, newLocation]);
    }

    handleClose();
  };

  const handleEditLocation = (index) => {
    setEditIndex(index);
    const selectedLocation = locationList[index];
    setAddressLine1(selectedLocation.addressLine1);
    setAddressLine2(selectedLocation.addressLine2);
    setCity(selectedLocation.city);
    setState(selectedLocation.state);
    setPinCode(selectedLocation.pinCode);
    // setCountry(selectedLocation.country);
    setSelectedCountry(
      countries.find((country) => country.label === selectedLocation.country) ||
        null
    );
    setSelectedState(
      states.find((state) => state.label === selectedLocation.state) || null
    );
    setOpen(true);
  };

  const handleDeleteLocation = (index) => {
    const updatedList = [...locationList];
    updatedList.splice(index, 1);
    setLocationList(updatedList);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddLocation();
      handleClose();
    }
  };

  return (
    <IntlProvider locale="en">
      <Container>
        <Typography
          variant="h4"
          gutterBottom
          color={"primary"}
          fontWeight={800}
          fontSize={20}
          className="text-2xl pt-5"
        >
          <FormattedMessage
            id="organizationLocations"
            defaultMessage="Organization Locations"
          />
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          style={{ marginBottom: "16px" }}
        >
          <FormattedMessage id="addLocation" defaultMessage="Add Location" />
        </Button>

        <List>
          {locationList.map((location, index) => (
            <ListItem key={index} style={{ marginBottom: "8px" }}>
              <Card
                variant="outlined"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography variant="body1">
                    {location.pinCode && `${location.pinCode}, `}
                    {location.country && `${location.country}`}
                    {location.addressLine1 && `${location.addressLine1}, `}
                    {location.addressLine2 && `${location.addressLine2}, `}
                    {location.city && `${location.city}, `}
                    {location.state && `${location.state} - `}
                  </Typography>
                </CardContent>
                <CardActions
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <IconButton
                      onClick={() => handleEditLocation(index)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteLocation(index)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </CardActions>
              </Card>
            </ListItem>
          ))}
        </List>

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
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
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
                style={{ flex: "1" }}
              />
              <TextField
                label={
                  <FormattedMessage id="country" defaultMessage="Country" />
                }
                variant="outlined"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                style={{ flex: "1" }}
              />
            </div>
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
              fullWidth
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
              fullWidth
              style={{ marginTop: "8px" }}
            />
            <TextField
              label={<FormattedMessage id="city" defaultMessage="City" />}
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              fullWidth
              style={{ marginTop: "8px" }}
            />
            <TextField
              label={
                <FormattedMessage
                  id="state"
                  defaultMessage="State/Province/Region"
                />
              }
              variant="outlined"
              value={state}
              onChange={(e) => setState(e.target.value)}
              fullWidth
              style={{ marginTop: "8px" }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
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
                style={{ flex: "1" }}
              />
              <Select
                options={countries}
                value={selectedCountry}
                onChange={(selectedOption) =>
                  setSelectedCountry(selectedOption)
                }
                placeholder="Select Country"
                isClearable
                style={{ flex: "1" }}
              />
            </div>
            {selectedCountry && (
              <Select
                options={states}
                value={selectedState}
                onChange={(selectedOption) => setSelectedState(selectedOption)}
                placeholder="Select State"
                isClearable
                style={{ marginTop: "8px" }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              <FormattedMessage id="cancel" defaultMessage="Cancel" />
            </Button>
            <Button onClick={handleAddLocation} color="primary">
              {editIndex !== null ? (
                <FormattedMessage
                  id="saveChanges"
                  defaultMessage="Save Changes"
                />
              ) : (
                <FormattedMessage id="add" defaultMessage="Add" />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </IntlProvider>
  );
};

export default AddOrganizationLocations;
