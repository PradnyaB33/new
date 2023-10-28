import { Add, Business, GroupAdd, Home } from "@mui/icons-material";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";

const NavItems = () => {
  return (
    <div className="bg-blue">
      {" "}
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton className="!px-2">
            <ListItemIcon>
              <IconButton>
                <Home className="text-white" />
              </IconButton>
            </ListItemIcon>
            <ListItemText className="text-white" primary={"Home"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton className="!px-2">
            <ListItemIcon>
              <IconButton>
                <GroupAdd className="text-white" />
              </IconButton>
            </ListItemIcon>
            <ListItemText className="text-white" primary={"Add Organization"} />
          </ListItemButton>
        </ListItem>
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton className="!px-2">
            <ListItemIcon>
              <IconButton>
                <Business className="text-white" />
              </IconButton>
            </ListItemIcon>
            <ListItemText className="text-white" primary={"Add Department"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton className="!px-2">
            <ListItemIcon>
              <IconButton>
                <Add className="text-white" />
              </IconButton>
            </ListItemIcon>
            <ListItemText className="text-white" primary={"Add Department"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

export default NavItems;