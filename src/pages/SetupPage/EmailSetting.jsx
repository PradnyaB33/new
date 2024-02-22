//todo
import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  DialogActions,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import { UseContext } from "../../State/UseState/UseContext"; // Adjust the path based on your project structure
import Setup from "../SetUpOrganization/Setup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Add, Info } from "@mui/icons-material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

const EmailSetting = () => {
  const id = useParams().organisationId;
  const { setAppAlert } = useContext(UseContext);
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [handleOpen, setHandleOpen] = useState(false);
  const [newHandleOpen, setNewHandleOpen] = useState(false);
  const [handleDeleteOpen, setHandleDeleteOpen] = useState(false);
  const [handleUpdateOpen, setHandleUpdateOpen] = useState(false);
  const [editEmailId, setEditEmailId] = useState(""); // Add state for the email to edit
  const [editEmail, setEditEmail] = useState(""); // Add state for the edited email

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/route/email/get/${id}`
        );
        setEmails(response.data.emails);
      } catch (error) {
        console.error("Error fetching emails:", error);
      }
    };

    fetchEmails();
  }, [email, id]);

  const handleCheck = () => {
    email && !error ? setNewHandleOpen(true) : setNewHandleOpen(false);
    setError("Email is required");
  };

  const handleEmailChange = (event) => {
    const lowerCaseEmail = event.target.value.toLowerCase();
    setEmail(lowerCaseEmail);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    console.log(lowerCaseEmail.trim());

    if (!lowerCaseEmail.trim()) {
      setError("Email is required");
    } else if (!emailRegex.test(lowerCaseEmail)) {
      setError("Invalid email address");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/route/email/create`,
        { email, organizationId: id }
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Email created successfully.",
      });

      setNewHandleOpen(false);
      setHandleOpen(false);

      //! adding the newly created email to the emails state

      setEmails([...emails, response.data.email]);
      setEmail("");
      setError("");
    } catch (error) {
      console.error("Error creating email:", error);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Error creating email. Please try again.",
      });
      setHandleOpen(false);
      setNewHandleOpen(false);
      setEmail("");
    }
  };

  const handleClose = () => {
    setHandleOpen(false);
    setNewHandleOpen(false);
    setHandleUpdateOpen(false);
    setHandleDeleteOpen(false);
  };

  const handleDelete = async (id) => {
    setEditEmailId(id);
    setHandleDeleteOpen(true);
  };

  const handleDeleteConfirmation = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API}/route/email/delete/${editEmailId}`
      );
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Email deleted successfully.",
      });
      setEmails(emails.filter((data) => data._id !== editEmailId));
      setHandleDeleteOpen(false);
    } catch (e) {
      console.log(e);
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to delete email",
      });
    }
  };

  const handleEdit = async (id) => {
    setEditEmailId(id);

    setHandleUpdateOpen(true);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/email/getone/${id}`
      );
      const emailDetails = response.data.email;

      setEditEmail(emailDetails.email);
    } catch (error) {
      console.log(error);
      console.log("An Error occurred while fetching email details");
    }
  };



  const handleEditEmailChange = (event) => {
    const lowerCaseEditEmail = event.target.value.toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!lowerCaseEditEmail.trim()) {
      setError("Email is required");
    } else if (!emailRegex.test(lowerCaseEditEmail)) {
      setError("Invalid email address");
    } else {
      setError("");
    }
    setEditEmail(lowerCaseEditEmail);
  };
  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API}/route/email/edit/${editEmailId}`,
        { email: editEmail }
      );
      console.log("Updated successfully");
      setAppAlert({
        alert: true,
        type: "success",
        msg: "Email updated successfully.",
      });
      setEmails(
        emails.map((data) =>
          data._id === editEmailId ? { ...data, email: editEmail } : data
        )
      );

      setHandleUpdateOpen(false);
    } catch (error) {
      console.log(error);
      console.log("Error occurred");
      setAppAlert({
        alert: true,
        type: "error",
        msg: "Failed to update email",
      });
    }
  };

  return (
    <>
      <section className="bg-gray-50 overflow-hidden min-h-screen w-full">
        <Setup>
          <article className="SetupSection bg-white w-[80%] h-max shadow-md rounded-sm border items-center">
            <div className="p-4 border-b-[.5px] flex items-center justify-between gap-3 w-full border-gray-300">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <EmailOutlinedIcon />
                </div>
                <h1 className="!text-lg tracking-wide">Email</h1>
              </div>
              <Button
                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                variant="contained"
                onClick={() => setHandleOpen(true)}
              >
                <Add />
                Add Email
              </Button>
            </div>
            {emails.length > 0 ? (
              <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white text-left !text-sm font-light">
                  <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                    <tr className="!font-semibold">
                      <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                        Sr No
                      </th>
                      <th scope="col" className="py-3 w-8/12">
                        Email
                      </th>
                      <th colSpan="2" scope="col" className="px-6 py-3 w-2/12">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {emails.map((data, idx) => (
                      <tr className="!font-medium border-b" key={idx}>
                        <td className="!text-left pl-9 py-4 w-1/12">
                          {idx + 1}
                        </td>
                        <td>{data.email}</td>
                        <td className="px-2">
                          <IconButton
                            color="primary"
                            aria-label="edit"
                            style={{ paddingTop: "0.8rem" }}
                            onClick={() => handleEdit(data._id)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="delete"
                            style={{ paddingTop: "0.8rem" }}
                            onClick={() => handleDelete(data._id)}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <section className="bg-white shadow-md py-6 px-8 rounded-md w-full">
                <article className="flex items-center mb-1 text-red-500 gap-2">
                  <Info className="text-2xl" />
                  <h1 className="text-lg font-semibold">Add Email</h1>
                </article>
                <p>No email found. Please add an email.</p>
              </section>
            )}

            <Dialog
              open={handleOpen}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <h1 className="text-xl pl-2 font-semibold font-sans mt-6 ml-4">
                Add Email
              </h1>
              <DialogContent>
                <div className="flex items-center justify-center gap-5">
                  <TextField
                    style={{ marginBottom: "1rem", marginTop: "1rem" }}
                    required
                    name="emailId"
                    size="small"
                    className="pl-5 w-[30vw]"
                    label="Email ID"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    error={Boolean(error)}
                    // helperText={error}
                    helperText={
                      <div style={{ height: "5px", width: "280px" }}>
                        {error}
                      </div>
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheck}
                  >
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={newHandleOpen}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to add this Email?
                </Typography>
                <div className="flex gap-5 my-5">
                  <Button variant="contained" onClick={handleSubmit}>
                    add
                  </Button>
                  <Button
                    color="warning"
                    variant="contained"
                    onClick={handleClose}
                  >
                    cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={handleUpdateOpen}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <h1 className="text-xl pl-2 font-semibold font-sans mt-4 ml-4">
                Edit Email
              </h1>
              <DialogContent>
                <div className="flex flex-col gap-5 my-5">
                  <TextField
                    required
                    name="emailId"
                    size="small"
                    className="pl-5 w-[30vw]"
                    label="Email ID"
                    type="email"
                    value={editEmail}
                    onChange={handleEditEmailChange}
                    error={Boolean(error)}
                    // helperText={error}
                  />
                  <div className="flex gap-5 mt-5  justify-end">
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={handleClose}
                    >
                      cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUpdate}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={handleDeleteOpen} onClose={handleClose}>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogContent>
                <p>
                  Please confirm your decision to delete this email, as this
                  action cannot be undone.
                </p>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                  size="small"
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleDeleteConfirmation}
                  color="error"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            {/* <Dialog
              open={handleDeleteOpen}
              onClose={handleClose}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography>
                  Are you sure you want to delete this Email?
                </Typography>
                <div className="flex gap-5 mt-5">
                  <Button
                    color="error"
                    variant="contained"
                    onClick={handleDeleteConfirmation}
                  >
                    delete
                  </Button>
                  <Button variant="contained" onClick={handleClose}>
                    cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog> */}
          </article>
        </Setup>
      </section>
    </>
  );
};

export default EmailSetting;
