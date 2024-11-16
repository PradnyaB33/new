import React, { useState } from 'react';

const SkillMatrixSetup = () => {
  const [skillName, setSkillName] = useState('');
  const [skillDescription, setSkillDescription] = useState('');

  const handleAddSkill = () => {
    // Logic to add the skill to the skill list (state management or API)
    console.log('Skill added:', { skillName, skillDescription });
  };

  return (
    <div>
      <h2>SkillMatrixSetup</h2>
      <button onClick={() => { /* Logic to open the Add Skill popup */ }}>
        Add Skill
      </button>
      <div>
        <h3>Add New Skill</h3>
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Skill Name"
        />
        <textarea
          value={skillDescription}
          onChange={(e) => setSkillDescription(e.target.value)}
          placeholder="Skill Description"
        />
        <button onClick={handleAddSkill}>Save</button>
      </div>
    </div>
  );
};

export default SkillMatrixSetup;
