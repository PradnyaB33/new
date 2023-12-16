import { Delete, Edit, MoreVert, Warning } from "@mui/icons-material";
import {
  Avatar,
  Button,
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
import { Link } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
const Organisation = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aeigs"];

  // const navigate = useNavigate();
  // const handleCreateProfile = () => {
  //   navigate(`/organisation/${item._id}/add-profile`, {
  //     state: { orgName: item.name },
  //   });
  // };

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // Delete Query for deleting single Organization
  const handleDeleteConfirmation = (id) => {
    console.log(id);
    setDeleteConfirmation(id);
  };
  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
  };
  // delete query for deleting Single Organization
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/route/organization/delete/${id}`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      console.log(`🚀 ~ file: Organisation.jsx:63 ~ response:`, response);
      handleAlert(true, "success", "Organization deleted successfully");
      queryClient.invalidateQueries(["orgData"]);
      // Reload the window to reflect the updated data
      window.location.reload();
    } catch (error) {
      handleAlert(true, "error", "Failed to delete Organization");
    } finally {
      handleCloseConfirmation();
      setAnchorEl(null);
    }
  };

  const getRandomColor = () => {
    return randomColor();
  };
  return (
    <>
      {/* <Card
        className="hover:shadow-lg transition-all h-max w-[320px]"
        sx={{ overflow: "visible" }}
      >
        <div className="cursor-pointer scroll-smooth transition-all">
          <CardContent className="flex justify-between items-center">
            <div className="cursor-pointer">
              <Typography
                color="#1D6EB7"
                gutterBottom
                variant="h6"
                component="div"
              >
                {item.name}
              </Typography>
            </div>
            <div>
              <MoreVertIcon
                onClick={(e) => handleClick(e, item)}
                className="cursor-pointer"
              />
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <EditIcon style={{ color: "green", marginRight: "10px" }} />
                  <span>Update</span>
                </MenuItem>
                <MenuItem onClick={() => handleDeleteConfirmation(item._id)}>
                  <Delete style={{ color: "red", marginRight: "10px" }} />
                  <span>Delete</span>
                </MenuItem>
              </Menu>
            </div>
          </CardContent>
        </div>
        <Typography variant="body2" color="text.secondary">
          Description : {item.description}
        </Typography>
        <div className="space-x-4 p-2 pb-6">
          <Link to={`/organisation/${item._id}/setup/add-roles`}>
            <Button size="small" className="cursor-pointer" variant="contained">
              Go to setuppage
            </Button>
          </Link>
          <Button
            size="small"
            className="cursor-pointer"
            variant="contained"
            onClick={handleCreateProfile}
          >
            Create Profile
          </Button>
        </div>
      </Card> */}

      <div
        className={`border-b-[3px] border-${getRandomColor()} block min-w-[21rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-200`}
      >
        <div className="border-b-2 flex items-center justify-between border-[#0000002d] px-6 py-3 text-black">
          <Avatar variant="rounded" sx={{ height: 35, width: 35 }} />
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
              <MenuItem>
                <Edit style={{ color: "green", marginRight: "10px" }} />
                <span>Update</span>
              </MenuItem>
              <MenuItem onClick={() => handleDeleteConfirmation(item._id)}>
                <Delete style={{ color: "red", marginRight: "10px" }} />
                <span>Delete</span>
              </MenuItem>
            </Menu>
          </div>
        </div>

        <div className="p-6 pt-6 pb-4">
          <h5 className="mb-2 text-xl font-semibold leading-tight text-black">
            {item.name}
          </h5>
          <p className="text-md ">{item.description}</p>
        </div>
        <div className="p-6 py-4 flex gap-4">
          <Link to={`/organisation/${item._id}/setup/add-roles`}>
            <button className=" flex  group justify-center gap-2 items-center rounded-md px-6 py-2 text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500">
              Setup
            </button>
          </Link>

          <Link to={`/organisation/${item._id}/dashboard/main`}>
            <button className=" flex  group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
              Go to Dashboard
              <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
            </button>
          </Link>
        </div>
        {/* <div className="p-6 py-2">
          <Button
            onClick={handleCreateProfile}
            variant="contained"
            color="primary"
          >
            profile
          </Button>
        </div> */}
      </div>

      <Dialog
        open={deleteConfirmation !== null}
        onClose={handleCloseConfirmation}
      >
        <DialogTitle color={"error"}>
          <Warning color="error" /> “ All information in this orgnisation will
          be deleted. Are you sure you want to delete it?”
        </DialogTitle>
        <DialogContent>
          <p>
            Please confirm your decision to delete this Organization, as this
            action cannot be retrived
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
    </>
  );
};

export default Organisation;
