import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionSummary,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const NavAccordian = ({
  icon,
  routes,
  role,
  toggleDrawer,
  valueBoolean,
  isVisible,
}) => {
  const [open, setOpen] = useState(valueBoolean);
  // const params = useMatch("/organisation/:id");
  // console.log(
  //   `🚀 ~ file: accordian.jsx:23 ~ params?.params?.id:`,
  //   params?.params?.id
  // );
  return (
    <>
      <List>
        <ListItem
          style={{ padding: "8px", borderRadius: "8px", width: "100%" }}
          components={{ Root: "div" }}
          className={`block ${!isVisible && "hidden"}`}
          onClick={(e) => {
            e.stopPropagation();
            if (open === true) {
              setOpen(false);
            } else {
              setOpen(true);
            }
          }}
        >
          <Accordion
            expanded={open}
            className="w-full !shadow-none border-[#0093d6] border-none !m-0"
            style={{ background: "rgb(14, 165, 233)" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore className="text-white" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className="flex !m-0"
            >
              <ListItemIcon className="p-4 !min-w-[25px]">{icon}</ListItemIcon>
              <Typography className="text-white flex items-center">
                {role}
              </Typography>
            </AccordionSummary>
            {routes.map((route) => (
              <ListItem
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  width: "100%",
                  paddingLeft: "24px",
                }}
                components={{ Root: "div" }}
                key={route.key}
              >
                <Link
                  onClick={() => toggleDrawer()}
                  to={route.link}
                  className="w-full"
                >
                  <ListItemButton
                    style={{
                      padding: "8px",
                      borderRadius: "8px",
                      width: "100%",
                    }}
                  >
                    <ListItemIcon className="p-2 !min-w-[25px]">
                      {route.icon}
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{
                        style: { fontSize: 13 },
                      }}
                      style={{ fontSize: "10px" }}
                      className="text-white text-sm"
                      primary={route.text}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </Accordion>
        </ListItem>
      </List>
    </>
  );
};

export default NavAccordian;
