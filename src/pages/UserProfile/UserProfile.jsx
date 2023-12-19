import { jwtDecode } from "jwt-decode";
import React, { useContext, useEffect, useState } from "react";
import { UseContext } from "../../State/UseState/UseContext";
import { Paper, Divider, FormControl, Button } from "@mui/material";
import { TextField, InputLabel } from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
const UserProfile = () => {
  const { cookies } = useContext(UseContext);
  const token = cookies["aeigs"];
  const [user, setUser] = useState();
  console.log("user info", user);
  useEffect(() => {
    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.user) {
        setUser(decodedToken.user);
      } else {
        setUser();
      }
    } catch (error) {
      console.error("Failed to decode the token:", error);
    }
  }, [token]);

  return (
    <>
      <div
        style={{
          marginTop: "10%",
          marginLeft: "20%",
        }}
      >
        <Paper
          sx={{
            width: "100%",
            maxWidth: "800px!important",
            height: "100%",
            maxHeight: "85vh!important",
          }}
          className="w-full"
        >
          <div className="w-full py-4">
            <h1 className="text-lg pl-2 font-semibold">Account Setting</h1>
          </div>

          <Paper className="border-none !pt-0 !px-0 shadow-md outline-none rounded-md">
            <div className="w-full py-4">
              <Divider variant="fullWidth" orientation="horizontal" />
            </div>

            <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6} md={4}>
                  <h1>Hello</h1>
                </Grid>
                <Grid item xs={6} md={8}>
                  <div>
                    <h1>Megha Dumbre</h1>
                    <h1>Employee</h1>
                    <div style={{ display: "flex", marginTop: "20px" }}>
                      <button
                        style={{
                          backgroundColor: "red",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      >
                        Delete Photo
                      </button>
                      <button
                        style={{
                          backgroundColor: "blue",
                          color: "white",
                          padding: "10px 20px",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      >
                        Change Photo
                      </button>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Box>

            <div className="w-full py-6">
              <Divider variant="fullWidth" orientation="horizontal" />
            </div>

            <div className="flex items-center gap-20">
              <div className="w-full px-4">
                <InputLabel>Additional Phone Number</InputLabel>
                <FormControl sx={{ width: 300 }}>
                  <TextField
                    size="small"
                    type="text"
                    fullWidth
                    margin="normal"
                  />
                </FormControl>
              </div>
              <div className="w-full">
                <InputLabel>Add Chat Id</InputLabel>
                <FormControl sx={{ width: 300 }}>
                  <TextField
                    size="small"
                    type="text"
                    fullWidth
                    margin="normal"
                  />
                </FormControl>
              </div>
            </div>

            <div className="w-full px-4">
              <InputLabel>Add Status Message</InputLabel>
              <FormControl sx={{ width: 730 }}>
                <TextField size="small" type="text" fullWidth margin="normal" />
              </FormControl>
            </div>

            <div className="w-full py-4 px-4 flex justify-center">
              <Button color="error" variant="outlined">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Change
              </Button>
            </div>
          </Paper>
        </Paper>
      </div>
    </>
  );
};

export default UserProfile;
