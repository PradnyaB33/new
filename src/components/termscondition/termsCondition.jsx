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
      <div>
        <Checkbox
          required
          className="!pr-2 !p-0"
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
