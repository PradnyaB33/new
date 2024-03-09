import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  FormLabel,
  Dialog,
  DialogActions,
  DialogContent,
} from "@mui/material";
import React from "react";

const CreateLoanMgtModal = ({ handleClose, open, organisationId }) => {
  return (
    <Dialog
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: "800px!important",
          height: "100%",
          maxHeight: "85vh!important",
        },
      }}
      open={open}
      onClose={handleClose}
      className="w-full"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="flex w-full justify-between py-4 items-center  px-4">
        <h1 className="text-xl pl-2 font-semibold font-sans">
          Apply for loans
        </h1>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="px-5 space-y-4 mt-4">
          {/* {error && <p className="text-red-500">*{error}</p>} */}

          <div className="px-5 space-y-4 mt-4">
            <div className="space-y-2 ">
              <FormLabel className="text-md mb-2" htmlFor="name">
                Select loan type
              </FormLabel>
              <FormControl size="small" fullWidth>
                <InputLabel id="demo-simple-select-label">Loan type</InputLabel>
                <Select
                  id="demo-simple-select"
                  //value={empTypes}
                  //onChange={(e) => setEmpTypes(e.target.value)}
                  label="Select loan type"
                >
                  {/* {empTypeslist?.empTypes?.length > 0 ? (
                  empTypeslist?.empTypes?.map((item, id) => (
                    <MenuItem key={id} value={item?._id}>
                      {item?.title}
                    </MenuItem>
                  ))
                ) : (
                  <div className="flex w-full items-center justify-center p-2">
                    No data Found
                  </div>
                )} */}
                </Select>
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Rate of interest
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Rate of interest
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Rate of interest"
                />
              </FormControl>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Loan amount Rs
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Loan amount Rs
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Loan amount Rs"
                />
              </FormControl>
            </div>
            <div className=" flex  gap-2 w-full">
              <div className="space-y-2  w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Loan disbursement date
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Select date
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    label="Select date"
                  />
                </FormControl>
              </div>
              <div className="space-y-2 w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  No of EMIs for loan prepayment
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    No of EMIs
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    label="No of EMIs"
                  />
                </FormControl>
              </div>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Date
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Date
                </InputLabel>
                <OutlinedInput id="outlined-adornment-password" label="Date" />
              </FormControl>
            </div>
            <div className=" flex  gap-2 w-full">
              <div className="space-y-2  w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Loan principal amount monthly deducted
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Loan principal amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    label="Loan principal amount"
                  />
                </FormControl>
              </div>
              <div className="space-y-2 w-[50%]">
                <FormLabel
                  className="text-md"
                  htmlFor="demo-simple-select-label"
                >
                  Loan interest amount monthly deducted
                </FormLabel>
                <FormControl
                  size="small"
                  sx={{ width: "100%" }}
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">
                    Loan interest amount
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-password"
                    label="Loan interest amount"
                  />
                </FormControl>
              </div>
            </div>
            <div className="space-y-2 ">
              <FormLabel className="text-md" htmlFor="demo-simple-select-label">
                Total deduction monthly
              </FormLabel>
              <FormControl
                size="small"
                sx={{ width: "100%" }}
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Total deduction monthly
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="Total deduction monthly"
                />
              </FormControl>
            </div>
          </div>
          <DialogActions sx={{ justifyContent: "end" }}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>

            <Button variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLoanMgtModal;
