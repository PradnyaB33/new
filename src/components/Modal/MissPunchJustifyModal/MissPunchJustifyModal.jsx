import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
} from "@mui/material";
import React , {useContext, useEffect} from "react";
import { TestContext } from "../../../State/Function/Main";
import { UseContext } from "../../../State/UseState/UseContext";
import useMissedJustifyState from "./useMissedJustifyState";
import { z } from "zod";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Person, } from "@mui/icons-material";
import AuthInputFiled from "../../InputFileds/AuthInputFiled";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";

const MissPunchJustifyModal = ({ handleClose, open,unavailableRecords  , organisationId}) => { 
    const { handleAlert } = useContext(TestContext);
    const { cookies } = useContext(UseContext);
    const authToken = cookies["aegis"];
    console.log(organisationId);
    console.log(unavailableRecords);
     
    const {
        recordDate ,
        justify , 
      } = useMissedJustifyState(); 


      const MissPunchSchema = z.object({
        justify : z.string(),
        recordDate : z.string(),
      });  


      const { control, formState, handleSubmit , setValue } = useForm({
        defaultValues: {
            recordDate : recordDate,
            justify  :  justify
        },
        resolver: zodResolver(MissPunchSchema),
      }); 


      const { errors } = formState;

      useEffect(() => {
        if (unavailableRecords) {
          const { recordDate, } = unavailableRecords;
          setValue('recordDate', recordDate);
          
        }
      }, [unavailableRecords, setValue]);

    
      const onSubmit = async (data) => {
          console.log(data);
          AddMissJustifyData.mutate(data);
      };

      const queryClient = useQueryClient();
    
      const AddMissJustifyData = useMutation(
        (data) => {
          axios.put(
            `${process.env.REACT_APP_API}/route/organization/${organisationId}/update-punching-data`,
            data,
            {
              headers: {
                Authorization: authToken,
              },
            }
          );
        },
    
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["missedJustifyData"] });
            handleClose();
            handleAlert(true, "success", "Salary Template generated succesfully.");
          },
    
          onError: () => {
            handleAlert(true, "error", "Something went wrong");
          },
        }
      );
    
     
  
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
        <h1 id="modal-modal-title" className="text-lg pl-2 font-semibold">
          Justify For Missed Data
        </h1>
        <IconButton onClick={handleClose}>
          <CloseIcon className="!text-[16px]" />
        </IconButton>
      </div>

      <DialogContent className="border-none  !pt-0 !px-0  shadow-md outline-none rounded-md">
        <div className="w-full">
          <Divider variant="fullWidth" orientation="horizontal" />
        </div> 

        <form 
        onSubmit={handleSubmit(onSubmit)}
         className=" ml-2 mr-2 mt-2">
          {/* <div className="space-y-2 ">
           <AuthInputFiled
            name="recordDate"
            icon={Person}
            control={control}
            type="text"
            placeholder="22/04/1971"
            label="Date"
            errors={errors}
             error={errors.recordDate}
            />
           </div> 
           <div className="space-y-2 ">
           <AuthInputFiled
            name="punchInTime"
            icon={Person}
            control={control}
            type="text"
            placeholder="0:0"
            label="Punch In Time"
            errors={errors}
             error={errors.punchInTime}
             />
         </div>
         <div className="space-y-2 ">
           <AuthInputFiled
            name="punchOutTime"
            icon={Person}
            control={control}
            type="text"
            placeholder="0:0"
            label="Punch Out Time "
            errors={errors}
             error={errors.punchOutTime}
            />
         </div>
         <div className="space-y-2 ">
         <AuthInputFiled
          name="status"
          icon={Person}
          control={control}
          type="text"
          placeholder="Unvailable"
          label="Status *"
          errors={errors}
           error={errors.status}
           />
         </div>
         <div className="space-y-2 ">
         <AuthInputFiled
          name="totalHours"
          icon={Person}
          control={control}
          type="text"
          placeholder="22/04/1971"
          label="Total Hours"
          errors={errors}
           error={errors.totalHours}
           />
         </div> */}
         <div className="space-y-2 ">
         <AuthInputFiled
          name="justify"
          icon={Person}
          control={control}
          type="text"
          placeholder="Forgot..."
          label="Justify"
          errors={errors}
           error={errors.justify}
           />
         </div>

       
          <DialogActions>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
            type="submit"
            variant="contained"
            color="primary"
            >
                Submit
            </Button>
          </DialogActions>
          </form>
      </DialogContent>
    </Dialog>
  );
};

export default MissPunchJustifyModal;
