import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import * as React from "react";
import Tab1 from "./Tab1";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function TDSTab1() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        p: 0,
        "& .MuiTabs-root": {
          padding: 0,
        },
        "& .MuiTab-root": {
          padding: 0,
        },
      }}
    >
      <Box
        sx={{
          p: 0,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTabs-root": {
            padding: 0,
          },
          "& .MuiTab-root": {
            padding: 0,
          },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          sx={{
            "& .MuiTabs-root": {
              padding: 0,
            },
            "& .MuiTab-root": {
              padding: 0,
            },
          }}
          aria-label="basic tabs example"
          className="bg-white mt-4 space-x-4 !p-0"
        >
          <Tab
            className="!px-4"
            sx={{
              "& .MuiTabs-root": {
                padding: 0,
              },
              "& .MuiTab-root": {
                padding: 0,
              },
            }}
            label="Income Tax Declarations"
            {...a11yProps(0)}
          />
          <Tab
            className="!px-4"
            sx={{
              "& .MuiTabs-root": {
                padding: 0,
              },
              "& .MuiTab-root": {
                padding: 0,
              },
            }}
            label="Investment Proof Submission"
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <CustomTabPanel
        sx={{
          p: 0,
          "& .MuiTabs-root": {
            padding: 0,
          },
          "& .MuiTab-root": {
            padding: 0,
          },
        }}
        value={value}
        index={0}
      >
        <Tab1 />
      </CustomTabPanel>
      <CustomTabPanel
        sx={{
          "& .MuiTabs-root": {
            padding: 0,
          },
          "& .MuiTab-root": {
            padding: 0,
          },
        }}
        value={value}
        index={1}
      >
        Item Two
      </CustomTabPanel>
    </Box>
  );
}
