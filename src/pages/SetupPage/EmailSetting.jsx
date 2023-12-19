// Import necessary components and icons
import React, { useState, useContext, useEffect } from 'react';
import {
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { UseContext } from '../../State/UseState/UseContext'; // Adjust the path based on your project structure
import Setup from "../SetUpOrganization/Setup";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const EmailSetting = () => {
    const id = useParams().organisationId;
    const { setAppAlert } = useContext(UseContext);
    const [emails, setEmails] = useState([]);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [handleOpen, setHandleOpen] = useState(false);
    const [newHandleOpen, setNewHandleOpen] = useState(false);
    const [handleDeleteOpen, setHandleDeleteOpen] = useState(false);
    const [handleUpdateOpen, setHandleUpdateOpen] = useState(false);
    const [editEmailId, setEditEmailId] = useState(""); // Add state for the email to edit
    const [editEmail, setEditEmail] = useState(""); // Add state for the edited email

    useEffect(() => {
        const fetchEmails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/route/email/get/${id}`);
                setEmails(response.data.emails);
            } catch (error) {
                console.error("Error fetching emails:", error);
            }
        };

        fetchEmails();
    }, [email]);

    const handleCheck = () => {
        email ? setNewHandleOpen(true) : setNewHandleOpen(false);
        setError("Email is required");
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setError('Email is required');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError('Invalid email address');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/route/email/create`, { email, organizationId: id });
            setAppAlert({
                alert: true,
                type: 'success',
                msg: 'Email submitted successfully!',
            });

            setNewHandleOpen(false);
            setHandleOpen(false);

            setEmails([...emails, response.data.email]); // Add the newly created email to the emails state
            setEmail('');
            setError('');
        } catch (error) {
            console.error('Error submitting email:', error);
            setAppAlert({
                alert: true,
                type: 'error',
                msg: 'Error submitting email. Please try again.',
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
            await axios.delete(`${process.env.REACT_APP_API}/route/email/delete/${editEmailId}`);
            setAppAlert({
                alert: true,
                type: 'success',
                msg: 'Email Deleted Successfully.',
            });
            setEmails(emails.filter(data => data._id !== editEmailId));
            setHandleDeleteOpen(false);
        } catch (e) {
            console.log(e);
            setAppAlert({
                alert: true,
                type: 'error',
                msg: 'Failed to delete email',
            });
        }
    };

    const handleEdit = async (id) => {
        setEditEmailId(id);
        setHandleUpdateOpen(true);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API}/route/email/getone/${id}`);
            const emailDetails = response.data.email;

            setEditEmail(emailDetails.email);
        } catch (error) {
            console.log(error);
            console.log("Error occurred while fetching email details");
        }
    };

    const handleEditEmailChange = (event) => {
        setEditEmail(event.target.value); 
    };

    const handleUpdate = async () => {
        try {
            await axios.patch(`${process.env.REACT_APP_API}/route/email/edit/${editEmailId}`, { email: editEmail });
            console.log("Updated successfully");
            setAppAlert({
                alert: true,
                type: 'success',
                msg: 'Email Updated Successfully.',
            });
            setEmails(emails.map((data) => (data._id === editEmailId ? { ...data, email: editEmail } : data)));

            setHandleUpdateOpen(false);
        } catch (error) {
            console.log(error);
            console.log("Error occurred");
            setAppAlert({
                alert: true,
                type: 'error',
                msg: 'Failed to update email',
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
                                <div className="rounded-full bg-sky-500 h-[30px] w-[30px] flex items-center justify-center">
                                    <EmailOutlinedIcon className="!text-lg text-white" />
                                </div>
                                <h1 className="!text-lg tracking-wide">Add Emails</h1>
                            </div>
                            <Button
                                className="!font-semibold !bg-sky-500 flex items-center gap-2"
                                variant="contained"
                                onClick={() => setHandleOpen(true)}
                            >
                                Create Email
                            </Button>
                        </div>

                        <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                            <table className="min-w-full bg-white text-left !text-sm font-light">
                                <thead className="border-b bg-gray-200 font-medium dark:border-neutral-500">
                                    <tr className="!font-semibold ">
                                        <th scope="col" className="!text-left pl-8 py-3 w-1/12">
                                            SR NO
                                        </th>
                                        <th scope="col" className="py-3 w-8/12">
                                            Email
                                        </th>
                                        <th colSpan="2" scope="col" className="px-6 py-3 w-2/12">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {emails.map((data, idx) => (
                                        <tr className="!font-medium" key={idx}>
                                            <td className="!text-left pl-9 py-3 w-1/12" >{idx + 1}</td>
                                            <td>{data.email}</td>
                                            <IconButton
                                                color="primary"
                                                aria-label="edit"
                                                onClick={() => handleEdit(data._id)}
                                            >
                                                <EditOutlinedIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                aria-label="delete"
                                                onClick={() => handleDelete(data._id)}
                                            >
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Dialog open={handleOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                                <DialogTitle>
                                    Add Email
                                </DialogTitle>
                                <DialogContent>
                                    <div className='flex items-center justify-center gap-5'>
                                        <TextField
                                            style={{ marginBottom: "1rem", marginTop: "1rem" }}
                                            required
                                            name="emailId"
                                            size="small"
                                            className="pl-5 w-[30vw]"
                                            label="Email ID"
                                            type="text"
                                            value={email}
                                            onChange={handleEmailChange}
                                            error={Boolean(error)}
                                            helperText={error}
                                        />
                                        <Button
                                            color='warning'
                                            variant='contained'
                                            onClick={handleCheck}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={newHandleOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                                <DialogTitle>
                                    Confirmation
                                </DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Are you sure you want to add this Email?
                                    </Typography>
                                    <div className='flex gap-5 my-5'>
                                        <Button variant='contained' onClick={handleSubmit}>add</Button>
                                        <Button color='warning' variant='contained' onClick={handleClose}>cancel</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={handleUpdateOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                                <DialogTitle>
                                    Edit Email
                                </DialogTitle>
                                <DialogContent>
                                    <div className='flex flex-col gap-5 my-5'>
                                        <TextField
                                            required
                                            name="emailId"
                                            size="small"
                                            className="pl-5 w-[30vw]"
                                            label="Email ID"
                                            type="text"
                                            value={editEmail}
                                            onChange={handleEditEmailChange}
                                            error={Boolean(error)}
                                            helperText={error}
                                        />
                                        <div className='flex gap-5 mt-5'>
                                            <Button variant='contained' onClick={handleUpdate}>edit</Button>
                                            <Button color='warning' variant='contained' onClick={handleClose}>cancel</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Dialog open={handleDeleteOpen} onClose={handleClose} maxWidth="sm" fullWidth>
                                <DialogTitle>
                                    Confirmation
                                </DialogTitle>
                                <DialogContent>
                                    <Typography>
                                        Are you sure you want to delete this Email?
                                    </Typography>
                                    <div className='flex gap-5 mt-5'>
                                        <Button color='error' variant='contained' onClick={handleDeleteConfirmation}>delete</Button>
                                        <Button variant='contained' onClick={handleClose}>cancel</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </article>
                </Setup>
            </section>
        </>
    );
};

export default EmailSetting;
