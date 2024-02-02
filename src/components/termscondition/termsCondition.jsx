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
      <div className="mb-1 flex items-center gap-2 ">
        <input
          type="checkbox"
          className="form-checkbox rounded-sm h-4 w-4 text-indigo-600"
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
