import { Button } from "@mui/material";

const Bottom = ({ nextStep, prevStep, isFirstStep, isLastStep }) => {
  return (
    <div className="w-full flex justify-between">
      <Button variant={"contained"} onClick={prevStep} disabled={isFirstStep}>
        Previous
      </Button>
      <Button variant={"contained"} onClick={nextStep} disabled={isLastStep}>
        Next
      </Button>
    </div>
  );
};

export default Bottom;
