import { useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import { MoreVert } from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  Box
} from "@mui/material";
import axios from "axios";
import moment from "moment";
// import randomColor from "randomcolor";
import { FaArrowCircleRight } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import EditOrganisation from "./edit-organization";
import styled from "styled-components";

const Organisation = ({ item }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(null);
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleCloseConfirmation = () => {
    setDeleteConfirmation(null);
    setEditConfirmation(null);
  };

  const StyledTag = styled.div`
    background-color: rgb(75 85 99);
    &::after {
      background-color: rgb(75 85 99);
    }
  `;

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

  const truncateOrgName = (orgName) => {
    // const words = orgName.split(" ");
    // if (words.length > 4) {
    //   return words.slice(0, 4).join(" ") + " ...";
    // }

    // const wordCount = (orgName.match(/\S+/g) || []).length; 
    // if (wordCount > 6) {
    //   return orgName.split(/\s+/).slice(0,6).join(" ") + " ..."; 
    // }
    // return orgName;

    const maxLength = 20;
    if (orgName.length > maxLength) {
      return orgName.slice(0, maxLength) + " ...";
    }
    return orgName;

  };

  const checkHasOrgDisabled = () => {
    if (item?.subscriptionDetails?.status === "Active") {
      if (
        moment(item?.subscriptionDetails?.expirationDate).diff(
          moment(),
          "days"
        ) > 0
      ) {
        return false;
      } else {
        return true;
      }
    } else if (item?.subscriptionDetails?.status === "Pending") {
      if (moment(item?.createdAt).add(7, "days").diff(moment(), "days") > 0) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };

  return (
    <>
      <Box sx={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', bgcolor: "white", borderRadius: "10px", p: "5%", height: "200px" }}>
        <div
          className="border-b-2 grid grid-cols-5 items-center justify-between border-[#0000002d]  pb-2 text-black"
        >
          <div className="flex col-span-4 gap-2 items-center">
            <div
              className="p-[1px] ring-1 ring-gray-300"
              initial={{ scale: 1 }}
            >
              <Avatar
                src={`${item?.logo_url}?v=${Date.now()})`}
                variant="rounded"
                className="w-12 h-12"
              />
            </div>
            <div className="flex flex-col">
              <h5
                className="text-lg font-semibold leading-tight text-blue-950 truncate w-full" > {truncateOrgName(item.orgName)}
              </h5>
              <p
                className="text-xs text-black-800 font-mono mt-1" >
                {moment(item.createdAt).format("MMMM Do, YYYY")}
              </p>
            </div>
          </div>
          <div
            className="col-span-1 flex flex-row-reverse"   >
            <MoreVert
              onClick={(e) => handleClick(e, item)}
              className="mt-1 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105"
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
                  style={{ marginRight: "8px" }}
                />
                Edit
              </MenuItem>
              <MenuItem onClick={() => handleDeleteConfirmation(item._id)}>
                <DeleteOutlineIcon
                  color="error"
                  aria-label="delete"
                  style={{ marginRight: "8px" }}
                />
                Delete
              </MenuItem>
            </Menu>
          </div>
        </div>
        <div className="py-4 ">
          <h1 className=" font-semibold text-[#1514FE]">
            {item?.packageInfo}
          </h1>
          <p className="h-4 mt-1  text-xs font-bold text-black-600">
            {item?.subscriptionDetails?.status === "Pending" &&
              moment(item?.createdAt).add(7, "days").diff(moment(), "days") > 0 &&
              moment(item?.createdAt).add(7, "days").diff(moment(), "days") <
              7 ? (
              <span>
                Your{" "}
                {moment(item?.createdAt).add(7, "days").diff(moment(), "days")}{" "}
                day trial left
              </span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#008000",
                    marginRight: "3%"
                  }}
                ></span>
                <span >Active Plan</span>
              </div>
            )}
          </p>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }} >
          <button
            disabled={checkHasOrgDisabled()}
            onClick={() => {
              let link;
              if (window.innerWidth <= 768) {
                link = `/organisation/${item._id}/setup`;
              } else {
                link = `/organisation/${item._id}/setup/add-roles`;
              }
              navigate(link);
            }}
            className="flex disabled:bg-gray-300 group justify-center gap-2 items-center rounded-md px-4 py-1 text-sm text-white bg-[#1514FE] hover:bg-gray-700 focus-visible:outline-blue-500 transition-all duration-300 ease-in-out"
          >
            Setup
          </button>

          {!checkHasOrgDisabled() ? (
            <Link to={`/organisation/${item._id}/dashboard/super-admin`}>
              <span className="flex group justify-center gap-2 items-center rounded-md px-4 py-1 text-sm font-semibold text-[#1514FE] transition-all bg-white  focus-visible:outline-blue-500 duration-300 ease-in-out">
                Go to Dashboard
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
              </span>
            </Link>
          ) : (
            <Link to={`/billing`}>
              <span className="flex group justify-center gap-2 items-center rounded-md px-4 py-1 text-sm font-semibold text-[#1514FE] transition-all bg-white  focus-visible:outline-blue-500 duration-300 ease-in-out">
                Go to Billing
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
              </span>
            </Link>
          )}
        </div>
      </Box>
    </>
  );
};

export default Organisation;
