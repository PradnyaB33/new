import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";
import BasicButton from "../../components/BasicButton";
import { IoBag, IoLocationSharp } from "react-icons/io5";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import UserProfile from "../../hooks/UserData/useUser";

const OpenJobPosition = () => {
  const { organisationId } = useParams();
  const { authToken } = useGetUser();
  const navigate = useNavigate();
  const { useGetCurrentRole } = UserProfile();
  const role = useGetCurrentRole();
  console.log("role", role);

  const { data: openJob, isLoading, isError, error } = useQuery(
    ["openJobPosition", organisationId, authToken],
    async () => {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/job-open`,
        {
          headers: { Authorization: authToken },
        }
      );
      return response?.data?.data;
    },
    {
      enabled: Boolean(authToken),
      onSuccess: (data) => console.log("Fetched Job Openings:", data),
      onError: (err) => console.error("Error fetching job openings:", err),
    }
  );

  console.log("openJob", openJob);

  const handleDetails = (vacancyId) => {
    navigate(`/organisation/${organisationId}/view-job-details/${vacancyId}`);
  };

  // Helper to format dates
  const formatPostedDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    try {
      return `${formatDistanceToNow(parseISO(dateString))} ago`; // Example: "Posted 2 days ago"
    } catch (error) {
      console.error("Error formatting posted date:", error);
      return "Invalid Date";
    }
  };

  return (
    <BoxComponent>
      <HeadingOneLineInfo
        heading="Open Job Positions"
        info="Explore the list of open job positions below"
      />

      {/* Display loading or error states */}
      {isLoading && <p>Loading job openings...</p>}
      {isError && <p>Error fetching job openings: {error?.message}</p>}

      {/* Display job openings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "16px",
          padding: "16px 0px",
        }}
      >
        {Array.isArray(openJob) && openJob.length > 0 ? (
          openJob.map((vacancy) => (
            <div
              key={vacancy._id}
              style={{
                backgroundColor: "white",
                borderRadius: "10px",
                padding: "16px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "box-shadow 0.3s ease",
                border: "1px solid #e0e0e0",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)")
              }
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: "1.5rem",
                  color: "#333",
                }}
              >
                {vacancy.jobPosition || "Position Not Specified"}
              </h3>
              <div>
                <h4>{vacancy?.organizationId?.orgName}</h4>
              </div>
              <div style={{ color: "#555" }}>
                <p className="flex">
                  <IoBag className="m-1" />
                  {vacancy.experienceRequired || "Not Provided"}
                </p>
                <p className="flex">
                  <IoLocationSharp className="m-1" />{" "}
                  {vacancy.location?.city || "Not Provided"},{" "}
                  {vacancy.location?.state || "Not Provided"},{" "}
                  {vacancy.location?.country || "Not Provided"}
                </p>
                <div className="flex space-x-1">
                  <p>
                    <strong>Posted:</strong>{" "}
                    {formatPostedDate(vacancy?.date)}
                  </p>
                  <p>
                    <strong>Opening:</strong>{" "}
                    {vacancy?.vacancies || "Not Specified"}
                  </p>
                </div>


                {/* <div className="flex justify-between mt-3">
                  {(role === "HR" || role === "Super-Admin" || role === "Delegate-Super-Admin") && (
                    <Link
                      to={`/organisation/${organisationId}/view-job-application/${vacancy._id}`} // the destination URL
                      className="font-semibold text-blue-500 hover:underline text-md"
                    >
                      View Applications
                    </Link>
                  )}
                  <BasicButton
                    className=""
                    title="Details"
                    // variant="outlined"
                    onClick={() => handleDetails(vacancy._id)}
                  />

                </div> */}
                <div className={`flex ${role === "HR" || role === "Super-Admin" || role === "Delegate-Super-Admin" ? "justify-between" : "justify-end"} mt-3`}>
                  {(role === "HR" || role === "Super-Admin" || role === "Delegate-Super-Admin") && (
                    <Link
                      to={`/organisation/${organisationId}/view-job-application/${vacancy._id}`} // the destination URL
                      className="font-semibold text-blue-500 hover:underline text-md"
                    >
                      View Applications
                    </Link>
                  )}
                  <BasicButton
                    className=""
                    title="Details"
                    // variant="outlined"
                    onClick={() => handleDetails(vacancy._id)}
                  />
                </div>

              </div>
            </div>
          ))
        ) : (
          !isLoading && <p>No job vacancies found.</p>
        )}
      </div>
    </BoxComponent>
  );
};

export default OpenJobPosition;
