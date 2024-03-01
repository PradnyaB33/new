import React from "react";
import Alert from "@mui/material/Alert";
import UserProfile from "../../hooks/UserData/useUser";
import { useQuery } from "react-query";
import axios from "axios";
import { Typography } from "@mui/material";
import { Button } from "@mui/material";
const Form16Emp = () => {
  const { getCurrentUser } = UserProfile();
  const user = getCurrentUser();
  console.log(user);
  const employeeId = user._id;
  const organizationId = user.organizationId;
  console.log(organizationId);
  console.log(employeeId);
  // Get Query
  const { data: getForm16 } = useQuery(["getForm16"], async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_API}/route/get/form16/${organizationId}/${employeeId}`
    );
    return response.data.data;
  });
  console.log(getForm16);
  const handleDownload = () => {
    // You can use any method to trigger the download, such as creating an invisible link and clicking it
    const link = document.createElement("a");
    link.href = getForm16;
    link.download = "Form16.pdf";
    link.click();
  };

  return (
    <>
      <div className=" mt-5">
        {getForm16 ? (
          <>
            <Typography variant="h4" className=" text-center pl-10  mb-6  mb-5">
              Form 16
            </Typography>
            <object
              type="application/pdf"
              width="100%"
              height="500px"
              data={`${getForm16}#toolbar=0&background=FFFFFF`}
              aria-label="Form 16 PDF"
              className="w-full"
              style={{ overflow: "hidden" }}
            />

            <div className="flex justify-center mt-4 mb-4">
              <Button
                onClick={handleDownload}
                variant="contained"
                color="primary"
              >
                Download Form 16
              </Button>
            </div>
          </>
        ) : (
          <div className="mt-1">
            <div>
              <img
                src="/payslip.svg"
                style={{ height: "550px", marginRight: "40%" }}
                alt="none"
              />
            </div>
            <div>
              <Alert
                severity="error"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  marginLeft: "10%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                "Form 16 is not available for viewing at the moment. Please
                contact your HR department to ensure that Form 16 has been
                uploaded for your profile. Thank you for your understanding."
              </Alert>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Form16Emp;
