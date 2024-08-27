
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
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import randomColor from "randomcolor";
import React, { useContext, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";
import { useQueryClient } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import EditOrganisation from "./edit-organization";
const Organisation = ({ item }) => {
  // to define state, hooks, import other function if needed
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editConfirmation, setEditConfirmation] = useState(null);
  const queryClient = useQueryClient();
  const { handleAlert } = useContext(TestContext);
  const { cookies } = useContext(UseContext);
  const authToken = cookies["aegis"];
  const navigate = useNavigate();
 
  // to define the handleClick function
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
 
  const checkHasOrgDisabled = () => {
    // if organization subscriptionDetails.status is pending and the difference between the current date and the expiration date is greater than 0 then return true else return false
    if (item?.subscriptionDetails?.status === "Active") {
      // check if expired by checking subscriptionDetails.expirationDate
 
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
      <div
        className={`border-b-[3px] border-${getRandomColor()} block min-w-[21rem] rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-200 relative`}
      >
        <tag className="tag">{item?.packageInfo}</tag>
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
          <p className="h-4">
            {item?.subscriptionDetails?.status === "Pending" &&
              moment(item?.createdAt).add(7, "days").diff(moment(), "days") >
                0 &&
              moment(item?.createdAt).add(7, "days").diff(moment(), "days") <
                7 && (
                <p>
                  Your{" "}
                  {moment(item?.createdAt)
                    .add(7, "days")
                    .diff(moment(), "days")}{" "}
                  day trial left
                </p>
              )}
          </p>
        </div>
        <div className="p-6 py-4  flex gap-4">
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
            className=" flex disabled:bg-gray-300 group justify-center gap-2 items-center rounded-md px-6 py-2 text-md  text-white bg-blue-500 hover:bg-blue-500 focus-visible:outline-blue-500"
          >
            Setup
          </button>
 
          {!checkHasOrgDisabled() ? (
            <Link to={`/organisation/${item._id}/dashboard/super-admin`}>
              <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                Go to Dashboard
                <FaArrowCircleRight className="group-hover:translate-x-1 transition-all" />
              </button>
            </Link>
          ) : (
            <Link to={`/billing`}>
              <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500">
                Go to Billing
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


// // ✌✌✌✌✌ 

// import { useEffect, useState, useContext } from "react";
// import { motion } from "framer-motion";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { MoreVert } from "@mui/icons-material";
// import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import {
//   Avatar,
//   Button,
//   Chip,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import axios from "axios";
// import moment from "moment";
// import randomColor from "randomcolor";
// import { FaArrowCircleRight } from "react-icons/fa";
// import { useQueryClient } from "react-query";
// import { Link, useNavigate } from "react-router-dom";
// import { TestContext } from "../../../State/Function/Main";
// import { UseContext } from "../../../State/UseState/UseContext";
// import EditOrganisation from "./edit-organization";
// import styled from 'styled-components';


// const Organisation = ({ item }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);
//   const [editConfirmation, setEditConfirmation] = useState(null);
//   const queryClient = useQueryClient();
//   const { handleAlert } = useContext(TestContext);
//   const { cookies } = useContext(UseContext);
//   const authToken = cookies["aegis"];
//   const navigate = useNavigate();

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   const handleClick = (e) => {
//     setAnchorEl(e.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDeleteConfirmation = (id) => {
//     setDeleteConfirmation(id);
//   };

//   const handleCloseConfirmation = () => {
//     setDeleteConfirmation(null);
//     setEditConfirmation(null);
//   };
  
//   const StyledTag = styled.div`
//   background-color: rgb(75 85 99);

  
//   &::after {
   
//     background-color:rgb(75 85 99);
   
//   }
// `;

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(
//         `${process.env.REACT_APP_API}/route/organization/delete/${id}`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       handleAlert(true, "success", "Organization Deleted Successfully");
//       queryClient.invalidateQueries("orgData");
//       window.location.reload();
//     } catch (error) {
//       handleAlert(true, "error", "Failed to delete Organization");
//     } finally {
//       handleCloseConfirmation();
//       setAnchorEl(null);
//     }
//   };

//   const handleEdit = async (id) => {
//     setEditConfirmation(true);
//   };

//   const getRandomColor = () => {
 
//     return randomColor();
//   };
//    console.log(getRandomColor)
//   const checkHasOrgDisabled = () => {
//     if (item?.subscriptionDetails?.status === "Active") {
//       if (
//         moment(item?.subscriptionDetails?.expirationDate).diff(
//           moment(),
//           "days"
//         ) > 0
//       ) {
//         return false;
//       } else {
//         return true;
//       }
//     } else if (item?.subscriptionDetails?.status === "Pending") {
//       if (moment(item?.createdAt).add(7, "days").diff(moment(), "days") > 0) {
//         return false;
//       } else {
//         return true;
//       }
//     }
//     return true;
//   };

//   return (
//     <>
//       <motion.div
//         // className={`border-b-[3px] border-${getRandomColor()} block min-w-[21rem] rounded-lg bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative`}
//         // className="border-b-[3px] border-white block min-w-[21rem] rounded-lg bg-gradient-to-r from-gray-50 via-slate-100 to-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative px-4"
//               className="border-b-[3px] border-white block min-w-[21rem] rounded-lg  bg-sky-100 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative px-4 "
            
//                 //  className="border-b-[3px] border-white block min-w-[21rem] rounded-l  shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out relative px-4"
//         initial={{ scale: 1 }}
//         whileHover={{ scale: 1.05 }}
//         transition={{ type: "spring", stiffness: 200 }}
//         data-aos="zoom-in"
//         data-aos-offset="100"
//         // style={{
//         //   backgroundImage: `url("https://previews.123rf.com/images/karetniy/karetniy1806/karetniy180600291/102804456-abstract-futuristic-blockchain-light-blue-background-vector-design-digital-network-technology.jpg")`,
//         //   backgroundSize: 'cover', // or 'contain', depending on your needs
//         //   backgroundPosition: 'center',
//         //   backgroundRepeat: 'no-repeat',
//         // }}
//       >
//         <StyledTag className=" tag " data-aos="zoom-in" data-aos-offset="100" style={{backgroundColor:"rgb(75 85 99)"}}>
//           {item?.packageInfo}
//         </StyledTag>

//         <div
//           className="border-b-2 grid grid-cols-6 items-center justify-between border-[#0000002d] px-6 py-3 text-black "
//           data-aos="fade-up"
//           data-aos-offset="100"
//         >
//           <div className="flex col-span-5 gap-4 items-center">
//             <motion.div
//               className="md:h-[45px] md:w-[45px] h-[40px] w-[40px] ring-2 ring-gray-300"
//               initial={{ scale: 1 }}
//               whileHover={{ scale: 1.1 }}
//               transition={{ duration: 0.2 }}
//               data-aos="zoom-in"
//               data-aos-offset="100"
//             >
//               <Avatar
//                 src={`${item?.logo_url}?v=${Date.now()})`}
//                 variant="rounded"
//                 className="w-full h-full"
//               />
//             </motion.div>
//             <div className="flex flex-col">
//               <h5
//                 className="text-base font-semibold leading-tight text-blue-950 truncate  "
//                 data-aos="fade-left"
//                 data-aos-offset="100"
//               >
//                 {item.orgName}
//               </h5>
//               <p
//                 className="text-sm text-black-800 font-mono mt-2"
//                 data-aos="fade-right"
//                 data-aos-offset="100"
//               >
//                 Established: {moment(item.createdAt).format("MMMM Do, YYYY")}
//               </p>
//             </div>
//           </div>
//           <div
//             className="col-span-1 flex flex-row-reverse"
//             data-aos="zoom-in"
//             data-aos-offset="100"
//           >
//             <MoreVert
//               onClick={(e) => handleClick(e, item)}
//               className=" mt-3 gap-4 ml-16 cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105 "
//             />
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleClose}
//               // style={{ marginRight: "10px" , marginTop: "10px" }}
//             >
//               <MenuItem onClick={() => handleEdit(item._id)}>
//                 <EditOutlinedIcon
//                   color="primary"
//                   aria-label="edit"
//                   style={{ marginRight: "10px" }}
//                 />
//                 Edit
//               </MenuItem>
//               <MenuItem onClick={() => handleDeleteConfirmation(item._id)}>
//                 <DeleteOutlineIcon
//                   color="error"
//                   aria-label="delete"
//                   style={{ marginRight: "10px" }}
//                 />
//                 Delete
//               </MenuItem>
//             </Menu>
//           </div>
//         </div>
//         <div className="p-6 pt-6 pb-4" data-aos="zoom-in" data-aos-offset="100">
//           {/*  technology*/}
//           <Chip
//             label={item?.industry_type}
//             color="primary"
//             variant="outlined"
//             sx={{ color: 'rgb(45 102 187)' }} 
        
//             className=" chip-dark-text transition-transform duration-300 ease-in-out hover:scale-105"
//           />
         
//           {/* <p className="h-4 mt-2 text-sm text-gray-600">
//             {item?.subscriptionDetails?.status === "Pending" &&
//               moment(item?.createdAt).add(7, "days").diff(moment(), "days") >
//                 0 &&
//               moment(item?.createdAt).add(7, "days").diff(moment(), "days") <
//                 7 && (
//                 <span>
//                   Your{" "}
//                   {moment(item?.createdAt)
//                     .add(7, "days")
//                     .diff(moment(), "days")}{" "}
//                   day trial left
//                 </span>
//               )}
//           </p> */}
//           <p className="h-4 mt-2 text-sm  font-bold text-black-600">
//             {item?.subscriptionDetails?.status === "Pending" &&
//             moment(item?.createdAt).add(7, "days").diff(moment(), "days") > 0 &&
//             moment(item?.createdAt).add(7, "days").diff(moment(), "days") <
//               7 ? (
//               <span>
//                 Your{" "}
//                 {moment(item?.createdAt).add(7, "days").diff(moment(), "days")}{" "}
//                 day trial left
//               </span>
//             ) : (
//               <span className="ml-3">Active Plan</span>
//             )}
//           </p>
//           {/* <Avatar
//                 src={`${item?.logo_url}?v=${Date.now()})`}
//                 variant="rounded"
//                 className="w-32 h-32 opacity-35 flex items-center justify-center" 

//               /> */}
//               {/* <div className="flex items-center justify-center "> */}
  
//   {/* <img  className="w-32 h-32 opacity-35 relative" src={`${item?.logo_url}?v=${Date.now()}`  } alt='Organization Logo ' /> */}
//           {/* variant="rounded"
//           className="w-32 h-32 opacity-35 relative" */}
         
//       {/* </div> */}
//         </div>
//         <div
//           className="p-6 py-4 flex gap-4"
//           data-aos="zoom-in"
//           data-aos-offset="100"
//         >
//           <button
//             disabled={checkHasOrgDisabled()}
//             onClick={() => {
//               let link;
//               if (window.innerWidth <= 768) {
//                 link = `/organisation/${item._id}/setup`;
//               } else {
//                 link = `/organisation/${item._id}/setup/add-roles`;
//               }
//               navigate(link);
//             }}
//             className="flex disabled:bg-gray-300 group justify-center gap-2 items-center rounded-md px-6 py-2 text-md text-white bg-gray-600 hover:bg-gray-700 focus-visible:outline-blue-500 transition-all duration-300 ease-in-out"
//           >
//             Setup
//           </button>

//           {!checkHasOrgDisabled() ? (
//             <Link to={`/organisation/${item._id}/dashboard/super-admin`}>
//               <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-black-600 transition-all bg-white hover:bg-black-700 hover:text-black focus-visible:outline-black-500 duration-300 ease-in-out">
//                 Go to Dashboard
//                 <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
//               </button>
//             </Link>
//           ) : (
//             <Link to={`/billing`}>
//               <button className="flex group justify-center gap-2 items-center rounded-md px-6 py-2 text-md font-semibold text-blue-500 transition-all bg-white hover:bg-blue-500 hover:text-white focus-visible:outline-blue-500 duration-300 ease-in-out">
//                 Go to Billing
//                 <FaArrowCircleRight className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out" />
//               </button>
//             </Link>
//           )}
//         </div>
//       </motion.div>

//       <Dialog
//         open={deleteConfirmation !== null}
//         onClose={handleCloseConfirmation}
//       >
//         <DialogTitle data-aos="zoom-in" data-aos-offset="100">
//           Confirm deletion
//         </DialogTitle>
//         <DialogContent data-aos="zoom-in" data-aos-offset="100">
//           <p>
//             Please confirm your decision to delete this Organization, as this
//             action cannot be undone.
//           </p>
//         </DialogContent>
//         <DialogActions data-aos="zoom-in" data-aos-offset="100">
//           <Button
//             variant="outlined"
//             color="primary"
//             size="small"
//             onClick={handleCloseConfirmation}
//           >
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             size="small"
//             color="error"
//             onClick={() => handleDelete(deleteConfirmation)}
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       <Dialog
//         open={editConfirmation !== null}
//         onClose={handleCloseConfirmation}
//         fullWidth
//       >
//         <DialogTitle
//           className="!font-semibold !text-2xl"
//           data-aos="zoom-in"
//           data-aos-offset="100"
//         >
//           Edit Organisation
//         </DialogTitle>

//         <DialogContent data-aos="zoom-in" data-aos-offset="100">
//           <EditOrganisation {...{ item, handleCloseConfirmation }} />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Organisation;

