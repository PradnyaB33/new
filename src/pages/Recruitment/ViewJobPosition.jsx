import { Container } from "@mui/material";
import {  Box, Button, Grid } from "@mui/material";
import React from "react";

const ViewJobPosition = () => {
  return (
    <>
      <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
        <article className=" bg-white w-full h-max shadow-md rounded-sm border items-center">
          <h1 className="text-lg pl-2 font-semibold text-center modal-title py-2">
            Salary Management
          </h1>
          <p className="text-xs text-gray-600 text-center">
            Create and calculate the salary of your employee here.
          </p>
        </article>
        <Grid item className="gap-1 py-4 w-full ">
          <Box className="flex md:flex-row items-center  justify-center flex-col gap-8  md:gap-16">
            <div className="w-full flex flex-col items-center md:items-start justify-center">
              <>
                <div className="px-4">
                  <Button color="primary" variant="outlined">
                    Actively Hiring
                  </Button>
                </div>
                <h1 className="text-xl px-4 font-semibold">
                  Software Engineer
                </h1>
                <p className="px-4">Argan Technology Service IT limited</p>
              </>
            </div>
          </Box>
        </Grid>
      </Container>
    </>
  );
};

export default ViewJobPosition;
