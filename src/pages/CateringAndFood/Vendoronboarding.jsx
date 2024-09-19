// import React, { useState } from 'react';
// import HeaderBackComponent from "../../components/header/component";
// import Button from '@mui/material/Button'; // Import MUI Button component
// import Container from '@mui/material/Container'; // Optional: for layout

// import Sign_Up_Vendor from './Sign_Up_Vendor';

// function Vendoronboarding() {
//   // State to manage the visibility of the Signup component
//   const [isSignupVisible, setSignupVisible] = useState(false);

//   const RegisterVendor = () => {
//     // Toggle the visibility of the Signup component
//     setSignupVisible(true);
//   };

//   return (
//     <div>
//       <HeaderBackComponent
//         heading={"Onboarding Component"}
//         oneLineInfo={`You can onboard a new Vendor`}
//       />

//       <Container>
//         <h1>To register vendor click here</h1>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={RegisterVendor}
//         >
//           Add Vendor
//         </Button>

//         {/* Conditionally render the Signup component */}
//         {isSignupVisible && <Sign_Up_Vendor />}
//       </Container>
//     </div>
//   );
// }

// export default Vendoronboarding;





// Vendoronboarding.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import HeaderBackComponent from "../../components/header/component";
import Button from '@mui/material/Button'; // Import MUI Button component
import Container from '@mui/material/Container'; // Optional: for layout

function Vendoronboarding() {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleRegisterClick = () => {
    navigate('/sign-up-vendor'); // Navigate to the SignUpVendor component
  };

  return (
    <div>
      <HeaderBackComponent
        heading={"Onboarding Component"}
        oneLineInfo={`You can onboard a new Vendor`}
      />

      <Container>
        <h1>To register vendor click here</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRegisterClick}
        >
          Add Vendor
        </Button>
      </Container>
    </div>
  );
}

export default Vendoronboarding;
