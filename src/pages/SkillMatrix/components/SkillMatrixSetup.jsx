// import React, { useState } from 'react';

// const SkillMatrixSetup = () => {
//   const [skillName, setSkillName] = useState('');
//   const [skillDescription, setSkillDescription] = useState('');

//   const handleAddSkill = () => {
//     // Logic to add the skill to the skill list (state management or API)
//     console.log('Skill added:', { skillName, skillDescription });
//   };

//   return (
//     <div>
//       <h2>SkillMatrixSetup</h2>
//       <button onClick={() => { /* Logic to open the Add Skill popup */ }}>
//         Add Skill
//       </button>
//       <div>
//         <h3>Add New Skill</h3>
//         <input
//           type="text"
//           value={skillName}
//           onChange={(e) => setSkillName(e.target.value)}
//           placeholder="Skill Name"
//         />
//         <textarea
//           value={skillDescription}
//           onChange={(e) => setSkillDescription(e.target.value)}
//           placeholder="Skill Description"
//         />
//         <button onClick={handleAddSkill}>Save</button>
//       </div>
//     </div>
//   );
// };

// export default SkillMatrixSetup;

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useMutation } from "react-query";
import { useParams } from "react-router-dom";
import { z } from "zod";
// import AuthInputFiled from "../../components/InputFileds/AuthInputFiled";

import useAuthToken from "../../../hooks/Token/useAuth";
// import { TestContext } from "../../State/Function/Main";
import Setup from "../../SetUpOrganization/Setup";

import HeadingOneLineInfo from "../../../components/HeadingOneLineInfo/HeadingOneLineInfo";
import BoxComponent from "../../../components/BoxComponent/BoxComponent";

const SkillMatrixSetup = () => {
  // zod Schema
  const { organisationId } = useParams();
  const authToken = useAuthToken();
  const [skillName, setSkillName] = useState("");
  const [skillDescription, setSkillDescription] = useState("");

  const handleAddSkill = () => {
    console.log("Skill added:", { skillName, skillDescription });
  };

  return (
    <BoxComponent sx={{ p: 0 }}>
      <Setup>
        <div className="h-[90vh] overflow-y-auto scroll px-3">
          <div className="xs:block sm:block md:flex justify-between items-center ">
            <HeadingOneLineInfo
              className="!my-3"
              heading="Skill Matrix "
              info="Setup Skill Matrix  For Your Organisation."
            />
          </div>

          <div>
            <button
              onClick={() => {
                /* Logic to open the Add Skill popup */
              }}
            >
              Add Skill
            </button>
            <div>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="Skill Name"
              />
              <br /> <br />
              <textarea
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="Skill Description"
              />
              <br /> <br />
              <button onClick={handleAddSkill}>Save</button> 
    

            </div>
          </div>
        </div>
      </Setup>
    </BoxComponent>
  );
};

export default SkillMatrixSetup;
