import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  Avatar,
  Button,
  Container,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../../State/Function/Main";
import { UseContext } from "../../State/UseState/UseContext";
import BackComponent from "../../components/BackComponent/BackComponent";
import { getSignedUrl, uploadFile } from "../../services/api";

const AddOrganisation = () => {
  const navigate = useNavigate();
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];
  const [selectedImage, setSelectedImage] = useState(null);
  const [url, setUrl] = useState('')
  const [uploadedFile, setUploadedFile] = useState()
  const [emailLabel, setEmailLabel] = useState("Organization Email");
  const [numberLabel, setNumberLabel] = useState("Phone Number");
  const [emailError, setEmailError] = useState(false);
  const [contactNumberError, setContactNumberError] = useState(false);
  const { handleAlert } = useContext(TestContext);

  const [firstEmptyField, setFirstEmptyField] = useState(null);
  const firstEmptyFieldRef = useRef(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);

    if (file) {
      if (!file.type.startsWith("image/")) {
        handleAlert(true, "error", "Please upload only image files.");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "lhyvmmdu");

      try {
        console.log("uploaded");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  //TODO : this is data field
  const data = {
    name: "",
    web_url: "",
    industry_type: "",
    email: "",
    location: "",
    contact_number: "",
    description: "",
    foundation_date: dayjs(),
    logo_url: "",
  };

  const isEmailValid = (email) => {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
  };

  const isContactNumberValid = (contactNumber) => {
    return /^\d{10}$/.test(contactNumber);
  };

  const [inputdata, setInputData] = useState(data);

  const handleData = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputdata,
      [name]: name === "email" ? value.toLowerCase() : value,
    });

    if (!value && firstEmptyFieldRef.current === null) {
      setFirstEmptyField(name);
    } else if (firstEmptyField === name) {
      setFirstEmptyField(null);
    }

    if (name === "contact_number") {
      if (!isContactNumberValid(value)) {
        setNumberLabel("number should be 10 digits only");
        setContactNumberError(true);
        if (e.target.value === "") {
          setNumberLabel("Phone Number");
          setContactNumberError(false);
        }
      } else {
        setNumberLabel("Phone Number");
        setContactNumberError(false);
      }
    } else if (name === "email") {
      if (!isEmailValid(value)) {
        setEmailLabel("enter valid email");
        setEmailError(true);
        if (e.target.value === "") {
          setEmailError(false);
          setEmailLabel("Organization Email");
        }
      } else {
        setEmailLabel("Organization Email");
        setEmailError(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emptyField = Object.keys(inputdata)
      .slice(0, -1)
      .find((key) => !inputdata[key]);

    if (emptyField) {
      handleAlert(true, "error", `Please fill in the ${emptyField} field.`);
      setFirstEmptyField(emptyField);
      firstEmptyFieldRef.current.focus();
      return;
    }

    try {
      let logoUrl = inputdata.logo_url;
      if (uploadedFile) {
        const response = await uploadFile(url, uploadedFile);
        logoUrl = response.Location;
      }

      const payload = {
        name: inputdata.name,
        web_url: inputdata.web_url,
        industry_type: inputdata.industry_type,
        email: inputdata.email,
        location: inputdata.location,
        contact_number: inputdata.contact_number,
        description: inputdata.description,
        foundation_date: inputdata.foundation_date,
        logo_url: logoUrl,
      };

      await axios.post(
        `${process.env.REACT_APP_API}/route/organization/create`,
        payload,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Organization created successfully");
      navigate("/organizationList");
    } catch (e) {
      console.error(e);
      handleAlert(true, "error", "Failed to create organization");
    }

    setSelectedImage(null);
    setFirstEmptyField(null);
  };

  useEffect(() => {
    (async () => {
      const response = await getSignedUrl();
      console.log(response.url.split("?")[0]);
      setUrl(response.url.split("?")[0]);
    })();
    // eslint-disable-next-line
  }, [uploadFile]);

  // useEffect(() => {
  //   uploadedFile &&
  //     (async () => {
  //       try {
  //         const response = await uploadFile(url, uploadedFile);
  //         setLogoUrl(response.Location);
  //       } catch (error) {
  //         console.error("Error uploading image:", error);
  //       }
  //     })();
  // }, [uploadedFile, url]);

  return (
    <>
      <div className="w-full h-[auto] bg-white">
        <div>
          <BackComponent style={{ zIndex: 1000 }} />
        </div>

        <form
          style={{
            display: "flex",
            alignItems: "center",
            height: "91vh",
            backgroundColor: "white",
            width: "100%",
          }}
          action="submit"
        >
          <Container
            style={{
              display: "flex",
              backgroundColor: "#fefdff",
              padding: "10px",
              paddingBottom: "30px",
              borderRadius: "20px",
              flexDirection: "column",
              justifyContent: "space-around",
              alignItems: "center",
              height: "85vh",
              position: "relative",
              border: "2px solid #dedede",
              top: "10px",
              margin: "auto",
            }}
            className="shadow-md gap-5"
            maxWidth="sm"
          >
            <Typography
              style={{
                color: "#1D6EB7",
                fontWeight: "600",
                position: "relative",
                top: "1rem",
              }}
              variant="h4"
            >
              Add Organization
            </Typography>
            <TextField
              required
              style={{ marginTop: "5px", height: "10px" }}
              name="name"
              onChange={handleData}
              value={inputdata.name}
              size="small"
              className={`w-[80%] ${firstEmptyField === "name" ? "error" : ""}`}
              label="My Organization Name"
              type="text"
              inputRef={firstEmptyField === "name" ? firstEmptyFieldRef : null}
            />
            <TextField
              required
              style={{ marginTop: "20px", height: "10px" }}
              name="web_url"
              onChange={handleData}
              value={inputdata.web_url}
              size="small"
              className={`w-[80%] ${
                firstEmptyField === "web_url" ? "error" : ""
              }`}
              label="Url Of Website"
              type="text"
              inputRef={
                firstEmptyField === "web_url" ? firstEmptyFieldRef : null
              }
            />
            <FormControl
              required
              style={{ marginTop: "20px", width: "80%", height: "10px" }}
              size="small"
            >
              <InputLabel
                id="demo-simple-select-label"
                style={{ background: "white", zIndex: 1 }}
              >
                Industry Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="industry_type"
                value={inputdata.industry_type}
                onChange={handleData}
                inputRef={
                  firstEmptyField === "industry_type"
                    ? firstEmptyFieldRef
                    : null
                }
                style={{ zIndex: 0 }}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="MECH">MECH</MenuItem>
                <MenuItem value="ACCOUNTS">ACCOUNTS</MenuItem>
              </Select>
            </FormControl>

            <TextField
              required
              style={{ marginTop: "20px", height: "10px" }}
              name="email"
              onChange={handleData}
              value={inputdata.email}
              size="small"
              className={`w-[80%] ${
                firstEmptyField === "email" ? "error" : ""
              }`}
              label={emailLabel}
              type="email"
              error={emailError}
              InputProps={{
                style: {
                  borderColor: emailError ? "red" : "blue",
                },
              }}
              inputRef={firstEmptyField === "email" ? firstEmptyFieldRef : null}
            />
            <TextField
              required
              style={{ marginTop: "20px", height: "10px" }}
              name="location"
              onChange={handleData}
              value={inputdata.location}
              size="small"
              className={`w-[80%] ${
                firstEmptyField === "location" ? "error" : ""
              }`}
              label="Location"
              type="text"
              inputRef={
                firstEmptyField === "location" ? firstEmptyFieldRef : null
              }
            />
            <TextField
              required
              style={{ marginTop: "20px", height: "10px" }}
              name="contact_number"
              onChange={handleData}
              value={inputdata.contact_number}
              size="small"
              className={`w-[80%] ${
                firstEmptyField === "contact_number" ? "error" : ""
              }`}
              label={numberLabel}
              type="number"
              error={contactNumberError}
              InputProps={{
                style: {
                  borderColor: contactNumberError ? "red" : "blue",
                },
              }}
              inputRef={
                firstEmptyField === "contact_number" ? firstEmptyFieldRef : null
              }
            />
            <TextField
              required
              style={{ marginTop: "20px", height: "10px" }}
              name="description"
              onChange={handleData}
              value={inputdata.description}
              size="small"
              className={`w-[80%] ${firstEmptyField === "description" ? "error" : ""
                }`}
              label="Organization Description"
              type="text"
              inputRef={
                firstEmptyField === "description" ? firstEmptyFieldRef : null
              }
            />
            <div style={{ marginTop: "15px", display: "block", width: "80%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  className="w-full"
                  components={["DatePicker"]}
                  required
                >
                  <DatePicker
                    label="Foundation Date"
                    value={inputdata.foundation_date}
                    onChange={(newDate) => {
                      setInputData({ ...inputdata, foundation_date: newDate });
                      console.log(newDate);
                    }}
                    slotProps={{
                      textField: { size: "small", fullWidth: true },
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <div className="flex h-[50px] pt-3 ">
                <Input
                  type="file"
                  id="imageInput"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                  required
                />
                <label htmlFor="imageInput">
                  <Button
                    variant="outlined"
                    color="primary"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Choose logo
                  </Button>
                </label>
                {selectedImage && (
                  <Avatar
                    src={selectedImage}
                    alt="Selected Image"
                    sx={{ width: 35, height: 35 }}
                    style={{ marginLeft: "4.2rem" }}
                    required
                  />
                )}
              </div>
            </div>
            <Button
              onClick={handleSubmit}
              variant="contained"
              style={{
                background: "#1D6EB7",
                color: "white",
                position: "relative",
                bottom: "1rem",
              }}
            >
              Submit
            </Button>
          </Container>
        </form>
      </div>
    </>
  );
};

export default AddOrganisation;
