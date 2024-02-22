import { MoreVert } from "@mui/icons-material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import axios from "axios";
import dayjs from "dayjs";
import randomColor from "randomcolor";
import React, { useContext, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useSubscription from "../../../hooks/Subscription/subscription";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const Organisation = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const navigate = useNavigate();
  const { subscriptionDetails, subscriptionLoading, subscriptionFetching } =
    useSubscription(item?._id);

  const data = {
    name: "",
    web_url: "",
    industry_type: "",
    email: "",
    location: "",
    contact_number: "",
    description: "",
    foundation_date: dayjs(),
    logo_url: logoUrl,
  };

  const [inputdata, setInputData] = useState(data);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "lhyvmmdu");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dnpj0dyxu/image/upload",
        formData
      );

      const imageURL = response.data.secure_url;

      setLogoUrl(imageURL);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleData = (e) => {
    const { name, value } = e.target;
    setInputData({
      ...inputdata,
      [name]: name === "email" ? value.toLowerCase() : value,
    });
  };
  // Delete Query for deleting single Organization
  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };
  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
    setEditConfirmation(null);
  };
  // delete query for deleting Single Organization
  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/organization/delete/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      handleAlert(true, "success", "Organization deleted successfully");
      queryClient.invalidateQueries("orgData");
      // Reload the window to reflect the updated data
      window.location.reload();
    } catch (error) {
      handleAlert(true, "error", "Failed to delete Organization");
    } finally {
      handleCloseConfirmation();
      setAnchorEl(null);
    }
  };

  const handleEdit = async (id) => {
    setEditConfirmation(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/get/${id}`
      );
      const organizationData = response.data.organizations;

      setInputData({
        name: organizationData.name,
        web_url: organizationData.web_url,
        industry_type: organizationData.industry_type,
        email: organizationData.email,
        location: organizationData.location,
        contact_number: organizationData.contact_number,
        description: organizationData.description,
        foundation_date: dayjs(organizationData.foundation_date),
        logo_url: organizationData.logo_url,
      });
    } catch (error) {
      console.error(error);
      // Handle error appropriately
    }
  };

  const handleEditConfirmation = async (id) => {
    try {
      const editedData = {
        ...inputdata,
        logo_url: logoUrl, // Include the logo_url in the payload
      };

      await axios.patch(
        `${process.env.REACT_APP_API}/route/organization/edit/${id}`,
        editedData,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );

      handleAlert(true, "success", "Organization updated successfully");
      queryClient.invalidateQueries("orgData");
      // Close the dialog
      handleCloseConfirmation();
    } catch (error) {
      handleAlert(true, "error", "Failed to update Organization");
    }
  };

  const getRandomColor = () => {
    return randomColor();
  };

  const getMessage = () => {
    let message = "";

    switch (subscriptionDetails?.subscription?.status) {
      case "authenticated":
        if (
          Math.ceil(
            new Date(subscriptionDetails?.subscription?.charge_at * 1000) -
              new Date()
          ) /
            (1000 * 60 * 60 * 24) >
          0
        ) {
          message = `${Math.ceil(
            (new Date(subscriptionDetails?.subscription?.charge_at * 1000) -
              new Date()) /
              (1000 * 60 * 60 * 24)
          )} Day Trial left`;
        } else {
          message = "Sorry but payment not received";
        }
        break;
      case "active":
        message = `Your next due is after ${Math.ceil(
          (new Date(subscriptionDetails?.subscription?.charge_at * 1000) -
            new Date()) /
            (1000 * 60 * 60 * 24)
        )} days`;
        break;
      case "pending":
        message =
          "Your payment is pending. Please update your card details. or please complete payment";
        break;
      case "halted":
        message =
          "Your subscription is halted. Please update your card details.";
        break;
      case "cancelled":
        message =
          "Your subscription is cancelled. To restart, raise query about it";
        break;
      case "paused":
        message = "Your subscription is on paused";
        break;
      default:
        message = "Basic Plan";
        break;
    }

    return message;
  };

  return (
    <>
      <div
        className={`border-b-[3px] border-${getRandomColor()} block min-w-[21rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-200 relative`}
      >
        <tag className="tag">
          {subscriptionLoading || subscriptionFetching ? (
            <CircularProgress
              className=" !text-white mx-12"
              CircularProgress
              size={20}
            />
          ) : (
            getMessage()
          )}
        </tag>
        {/* )} */}
        <div className="border-b-2 flex items-center justify-between border-[#0000002d] px-6 py-3 text-black">
          <Avatar
            src={item?.logo_url}
            variant="rounded"
            className=" md:h-[35px] md:w-[35px] h-[10px] w-[10px]"
          />
          <div>
            <MoreVert
              onClick={(e) => handleClick(e, item)}
              className="cursor-pointer"
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => handleEdit(item._id)}>
                <EditOutlinedIcon
                  color="primary"
                  aria-label="edit"
                  style={{ marginRight: "10px" }}
                />
              </MenuItem>
              <MenuItem onClick={() => handleDeleteConfirmation(item._id)}>
                <DeleteOutlineIcon
                  color="error"
                  aria-label="delete"
                  style={{ marginRight: "10px" }}
                />
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="p-6 pt-6 pb-4">
          <h5 className="mb-2 text-xl font-semibold leading-tight text-black">
            {item.orgName}
          </h5>
          <p className="text-md ">{item.description}</p>
        </div>
        <div className="p-6 py-4  flex gap-4">
          <button
            onClick={() => {
              let link;
              if (window.innerWidth <= 768) {
                link = `/organisation/${item._id}/setup`;
              } else {
                link = `/organisation/${item._id}/setup/add-roles`;
              }
              navigate(link);
            }}
            // disabled={
            //   (new Date(subscriptionDetails?.subscription?.charge_at * 1000) -
            //     new Date()) /
            //     (1000 * 60 * 60 * 24) <=
            //   0
            //     ? true
            //     : false
            // }
            className=" flex disabled:bg-gray-300 group justify-center gap-2 items-center rounded-md px-6 py-2 text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            {subscriptionLoading || subscriptionFetching ? (
              <CircularProgress
                className=" !text-white"
                CircularProgress
                size={20}
              />
            ) : (
              "Setup"
            )}
          </button>

          {subscriptionDetails?.subscription?.status === "authenticated" ? (
            (new Date(subscriptionDetails?.subscription?.charge_at * 1000) -
              new Date()) /
              (1000 * 60 * 60 * 24) <=
            0 ? (
              // Continue subscription if trial days are 0
              <Link
                target="blank"
                to={`${subscriptionDetails?.subscription?.short_url}`}
              >
                <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                  {subscriptionLoading || subscriptionFetching ? (
                    <CircularProgress CircularProgress size={20} />
                  ) : (
                    "Continue subscription"
                  )}
                  <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
            ) : (
              <Link to={`/organisation/${item._id}/dashboard/super-admin`}>
                <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                  {subscriptionLoading || subscriptionFetching ? (
                    <CircularProgress CircularProgress size={20} />
                  ) : (
                    "Go to Dashboard"
                  )}
                  <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
                </button>
              </Link>
            )
          ) : subscriptionDetails?.subscription?.status === "active" ? (
            // Display "Go to Dashboard" button if the status is "active"
            <Link to={`/organisation/${item._id}/dashboard/super-admin`}>
              <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                Go to Dashboard
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          ) : (
            // Default to "Continue subscription" button
            <Link
              target="blank"
              to={`${subscriptionDetails?.subscription?.short_url}`}
            >
              <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                Continue subscription
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          )}
        </div>
      </div>

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle>Confirm deletion</DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this Organization, as this
            action cannot be undone.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleCloseConfirmation}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => handleDelete(deleteConfirmation)}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editConfirmation !== null}
        onClose={handleCloseConfirmation}
        fullWidth
      >
        <DialogTitle className="!font-semibold !text-2xl">
          Edit Organization
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-3">
            <TextField
              required
              name="name"
              onChange={handleData}
              value={inputdata.name}
              size="small"
              label="My Organisation Name"
              type="text"
              fullWidth
            />
            <TextField
              required
              name="web_url"
              onChange={handleData}
              value={inputdata.web_url}
              size="small"
              label="Url Of Website"
              type="text"
              fullWidth
            />
            <FormControl required size="small">
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
                style={{ zIndex: 0 }}
              >
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="MECH">MECH</MenuItem>
                <MenuItem value="ACCOUNTS">ACCOUNTS</MenuItem>
              </Select>
            </FormControl>
            <TextField
              required
              label="organization email"
              name="email"
              onChange={handleData}
              value={inputdata.email}
              size="small"
              type="email"
              fullWidth
            />
            <TextField
              required
              name="location"
              onChange={handleData}
              value={inputdata.location}
              size="small"
              label="Location"
              type="text"
              fullWidth
            />
            <TextField
              required
              name="contact_number"
              onChange={handleData}
              value={inputdata.contact_number}
              size="small"
              type="number"
              label="contact number"
              fullWidth
            />
            <TextField
              required
              name="description"
              onChange={handleData}
              value={inputdata.description}
              size="small"
              label="Organisation Description"
              type="text"
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer
                className="w-full !pt-0 !mt-0"
                components={["DatePicker"]}
                required
              >
                <DatePicker
                  label="Foundation Date"
                  className="!mt-0 !pt-0"
                  value={inputdata.foundation_date}
                  onChange={(newDate) => {
                    setInputData({ ...inputdata, foundation_date: newDate });
                  }}
                  slotProps={{ textField: { size: "small", fullWidth: true } }}
                />
              </DemoContainer>
            </LocalizationProvider>
            <div className="flex h-[50px]">
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
                  className="!ml-4"
                  required
                />
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <div className="flex gap-4 mt-4 mr-4  mb-4 justify-end ">
            <Button
              onClick={handleCloseConfirmation}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleEditConfirmation(item._id)}
              variant="contained"
              color="primary"
            >
              Apply
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Organisation;
