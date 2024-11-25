


// import React, { useState, useEffect } from "react";
// import { useQuery } from "react-query";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { useParams } from "react-router-dom";
// import useAuthToken from "../../../hooks/Token/useAuth";
// import BoxComponent from "../../../components/BoxComponent/BoxComponent";
// import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";

// const Directory = () => {
//   const [skills, setSkills] = useState([]);
//   const { organisationId } = useParams();
//   const authToken = useAuthToken();

//   const fetchSkills = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
//         {
//           headers: {
//             Authorization: authToken,
//           },
//         }
//       );
//       return response.data; // Ensure this returns the entire API response
//     } catch (error) {
//       console.error("Error fetching skills:", error);
//       return { data: [] }; // Default to an empty array to prevent crashes
//     }
//   };

//   const { data, isLoading, isError } = useQuery("skills", fetchSkills);

//   useEffect(() => {
//     if (data && data.success && Array.isArray(data.data)) {
//       setSkills(data.data); // Properly set the skills from `data.data`
//     } else {
//       setSkills([]); // Default to an empty array if the structure is unexpected
//     }
//   }, [data]); // Re-run whenever `data` changes

//   const onDragEnd = (result) => {
//     const { destination, source } = result;

//     if (!destination) return; // No movement, do nothing.

//     const updatedSkills = Array.from(skills);
//     const [movedSkill] = updatedSkills.splice(source.index, 1);
//     updatedSkills.splice(destination.index, 0, movedSkill);

//     setSkills(updatedSkills); // Update the skills order
//   };

//   if (isLoading) return <p>Loading...</p>;
//   if (isError) return <p>Error loading skills.</p>;

//   return (
//     <div>
//       <h2>Directory</h2>
//       <p>List of skill categories, teams, or departments.</p>

//       <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="skills-list">
//           {(provided) => (
//             <ul
//               {...provided.droppableProps}
//               ref={provided.innerRef}
//               style={{ listStyle: "none", padding: 0 }}
//             >
//               {skills.map((skill, index) => (
//                 <Draggable
//                   key={skill._id} // Correct key from the API response
//                   draggableId={skill._id} // Ensure draggableId matches unique ID
//                   index={index}
//                 >
//                   {(provided) => (
//                     <li
//                       ref={provided.innerRef}
//                       {...provided.draggableProps}
//                       {...provided.dragHandleProps}
//                       style={{
//                         padding: "8px",
//                         margin: "4px",
//                         backgroundColor: "#f0f0f0",
//                         borderRadius: "4px",
//                         ...provided.draggableProps.style,
//                       }}
//                     >
//                       {skill.skillName} {/* Display the skill name */}
//                     </li>
//                   )}
//                 </Draggable>
//               ))}
//               {provided.placeholder}
//             </ul>
//           )}
//         </Droppable>
//       </DragDropContext>
//     </div>
//   );
// };

// export default Directory;



import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useParams } from "react-router-dom";
import useAuthToken from "../../../hooks/Token/useAuth";

const Directory = () => {
  const [skills, setSkills] = useState([]);
  const { organisationId } = useParams();
  const authToken = useAuthToken();

  const fetchSkills = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/route/organization/${organisationId}/skills`,
        {
          headers: {
            Authorization: authToken,
          },
        }
      );
      return response.data; // Return the response data
    } catch (error) {
      console.error("Error fetching skills:", error);
      return { data: [] }; // Default to empty data on error
    }
  };

  const { data, isLoading, isError } = useQuery("skills", fetchSkills);

  useEffect(() => {
    if (data && data.success && Array.isArray(data.data)) {
      setSkills(data.data); // Set the skills data
    } else {
      setSkills([]); // Default to empty array if data is invalid
    }
  }, [data]);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return; // If no valid drop location, do nothing

    const updatedSkills = Array.from(skills);
    const [movedSkill] = updatedSkills.splice(source.index, 1);
    updatedSkills.splice(destination.index, 0, movedSkill);

    setSkills(updatedSkills); // Update the skills order
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading skills.</p>;

  return (
    <div>
      <h2>Directory</h2>
      <p>List of skill categories, teams, or departments.</p>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Droppable wrapper */}
        <Droppable droppableId="skills-list">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ listStyle: "none", padding: 0 }}
            >
              {skills.map((skill, index) => (
                <Draggable
                  key={skill._id} // Unique key from the backend data
                  draggableId={skill._id} // Unique draggable ID
                  index={index}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        padding: "8px",
                        margin: "4px",
                        backgroundColor: "#f0f0f0",
                        borderRadius: "4px",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {skill.skillName} {/* Display skill name */}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Directory;
