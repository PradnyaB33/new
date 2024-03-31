import { MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import randomColor from "randomcolor";
import React, { useContext, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useSubscription from "../../../hooks/Subscription/subscription";
import EditOrganisation from "./edit-organization";
const Organisation = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(null);
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const navigate = useNavigate();
  const { subscriptionDetails, subscriptionLoading, subscriptionFetching } =
    useSubscription(item?._id);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
      handleAlert(true, "success", "Organization Deleted Successfully");
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
            <CircularProgress className=" !text-white mx-12" size={20} />
          ) : (
            getMessage()
          )}
        </tag>
        <div className="border-b-2 grid grid-cols-6 items-center justify-between border-[#0000002d] px-6 py-3 text-black">
          <div className="flex col-span-5 gap-4 items-center">
            <Avatar
              src={`${item?.logo_url}?v=${Date.now()})`}
              variant="rounded"
              className=" md:h-[35px] md:w-[35px] h-[10px] w-[10px]"
            />
            <h5 className="mb-2 text-xl font-semibold leading-tight text-black truncate">
              {item.orgName}
            </h5>
          </div>
          <div className="col-span-1 flex flex-row-reverse">
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
          <Chip
            label={item?.industry_type}
            color="primary"
            variant="contained"
          />
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
            className=" flex disabled:bg-gray-300 group justify-center gap-2 items-center rounded-md px-6 py-2 text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            {subscriptionLoading || subscriptionFetching ? (
              <CircularProgress className=" !text-white" size={20} />
            ) : (
              "Setup"
            )}
          </button>

          {subscriptionDetails?.subscription?.status === "authenticated" ? (
            (new Date(subscriptionDetails?.subscription?.charge_at * 1000) -
              new Date()) /
              (1000 * 60 * 60 * 24) <=
            0 ? (
              <Link
                target="blank"
                to={`${subscriptionDetails?.subscription?.short_url}`}
              >
                <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                  {subscriptionLoading || subscriptionFetching ? (
                    <CircularProgress size={20} />
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
                    <CircularProgress size={20} />
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
          Edit Organisation
        </DialogTitle>

        <DialogContent>
          <EditOrganisation {...{ item, handleCloseConfirmation }} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Organisation;
