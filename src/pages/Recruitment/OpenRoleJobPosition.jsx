import React from "react";
import BoxComponent from "../../components/BoxComponent/BoxComponent";
import HeadingOneLineInfo from "../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import useGetUser from "../../hooks/Token/useUser";

const OpenJobPosition = () => {
  const { organisationId } = useParams();
  const { authToken } = useGetUser();

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

              <div style={{ color: "#555" }}>
                <p>
                  <strong>Location:</strong> {vacancy.location?.city || "Not Provided"},{" "}
                  {vacancy.location?.state || "Not Provided"},{" "}
                  {vacancy.location?.country || "Not Provided"}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {vacancy.experienceRequired || "Not Provided"}
                </p>
                <p>
                  <strong>Mode of Working:</strong>{" "}
                  {vacancy.modeOfWorking || "Not Provided"}
                </p>
                <p>
                  <strong>Vacancies:</strong>{" "}
                  {vacancy.vacancies || "Not Specified"}
                </p>
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
