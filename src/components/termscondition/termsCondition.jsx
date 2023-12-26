import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import React, { useState } from "react";
const TermsCondition = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState("");

  const handleTermsAcceptance = (checked) => {
    setIsTermsAccepted(checked);
    if (!checked) {
      setTermsError("Please accept the Terms and Conditions to sign up.");
    } else {
      setTermsError("");
    }
  };

  return (
    <>
      <div   style={{
          paddingLeft:"0px",
          marginLeft:"0px",
          marginTop:'2px'
        }}>
        <Checkbox
      
          required
          checked={isTermsAccepted}
          onChange={(e) => handleTermsAcceptance(e.target.checked)}
        />
        I accept the
        <Link href="/terms-and-conditions">Terms and Conditions</Link>
      </div>
      {termsError && <p style={{ color: "red" }}>{termsError}</p>}
    </>
  );
};

export default TermsCondition;
