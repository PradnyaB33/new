import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

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
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

export default function SurveyDetails() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Container maxWidth="xl" className="bg-gray-50 min-h-screen">
                <article className="SetupSection bg-white w-full h-max shadow-md rounded-sm border items-center"> <Box sx={{ my: "20px" }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex", justifyContent: "center" }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="basic tabs example"
                        >
                            <Tab label="Summary" {...a11yProps(0)} />
                            <Tab label="Question Stats" {...a11yProps(1)} />
                            <Tab label="Individual Stats" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        Tab One Content
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        Tab Two Content
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        Tab Three Content
                    </CustomTabPanel>
                </Box>
                </article>
            </Container>
        </>
    );
}