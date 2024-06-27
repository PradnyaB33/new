import { TextField, Button } from '@mui/material'
import React from 'react'
import { useNavigate } from "react-router-dom";

const OpenSurveyList = () => {
    //hooks
    const navigate = useNavigate();

    //handleSurveyForm function
    const handleSurveyForm = () => {
        navigate("/survey-form");
    }

    return (
        <div>
            <div className="p-4 border-y-[.5px]  border-gray-300">
                <div className="flex justify-end gap-3 mb-3 md:mb-0 w-full md:w-auto">
                    <TextField
                        // onChange={(e) => setNameSearch(e.target.value)}
                        placeholder="Search"
                        variant="outlined"
                        size="small"
                        sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 200 }}
                    />
                </div>
            </div>
            <div className="overflow-auto !p-0 border-[.5px] border-gray-200">
                <table className="min-w-full bg-white  text-left !text-sm font-light">
                    <thead className="border-b bg-gray-200  font-medium dark:border-neutral-500">
                        <tr className="!font-semibold">
                            <th scope="col" className="!text-left pl-8 py-3">
                                Title
                            </th>
                            <th scope="col" className="!text-left pl-8 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="!font-medium border-b">
                            <td className="!text-left pl-8 py-3">Employee satisfaction surveys</td>
                            <td className="py-3 pl-8"><Button variant="outlined" onClick={handleSurveyForm} sx={{ textTransform: "none", width: "140px" }}>Take Survey</Button></td>
                        </tr>
                        <tr className="!font-medium border-b">
                            <td className="!text-left pl-8 py-3">Employee performance surveys</td>
                            <td className="py-3 pl-8"><Button variant="outlined" onClick={handleSurveyForm} sx={{ textTransform: "none", width: "140px" }}>Complete Survey</Button></td>
                        </tr>
                        <tr className="!font-medium border-b">
                            <td className="!text-left pl-8 py-3">Professional development surveys</td>
                            <td className="py-3 pl-8"><Button variant="outlined" onClick={handleSurveyForm} sx={{ textTransform: "none", width: "140px" }}>Take Survey</Button></td>
                        </tr>
                        <tr className="!font-medium border-b">
                            <td className="!text-left pl-8 py-3">Employee attitude surveys</td>
                            <td className="py-3 pl-8"><Button variant="outlined" onClick={handleSurveyForm} sx={{ textTransform: "none", width: "140px" }}>Complete Survey</Button></td>
                        </tr>
                        <tr className="!font-medium border-b">
                            <td className="!text-left pl-8 py-3">Employer improvement surveys</td>
                            <td className="py-3 pl-8"><Button variant="outlined" onClick={handleSurveyForm} sx={{ textTransform: "none", width: "140px" }}>Take Survey</Button></td>
                        </tr>
                        <tr className="!font-medium border-b">
                            <td className="!text-left pl-8 py-3">Employee experience/opinion surveys</td>
                            <td className="py-3 pl-8"><Button variant="outlined" onClick={handleSurveyForm} sx={{ textTransform: "none", width: "140px" }}>Take Survey</Button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default OpenSurveyList
