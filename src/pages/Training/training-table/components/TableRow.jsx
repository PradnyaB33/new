import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import React from "react";

const TableRow = ({ logo, name, duration }) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  return (
    <tr
      className={`bg-white
       border-b dark:border-neutral-500`}
    >
      <td className="whitespace-nowrap px-6 py-2 grid place-items-center font-medium m-auto">
        <img
          src={logo.length > 0 ? logo : "https://via.placeholder.com/150"}
          alt="Training Logo"
          className="w-10 h-10 rounded-full"
        />
      </td>
      <td className="whitespace-nowrap px-6 py-2 text-center">{name}</td>
      <td className="whitespace-nowrap px-6 py-2 text-center">
        {duration ?? "2 h"}
      </td>

      <td className="whitespace-nowrap px-6 py-2 text-center">
        <IconButton
          onClick={(e) => {
            setOpen(true);
            setAnchorEl(e?.currentTarget);
          }}
          aria-label="edit"
        >
          <MoreVert />
        </IconButton>
        <Menu
          open={open}
          anchorEl={anchorEl}
          onClose={() => setOpen(false)}
          onClick={() => setOpen(false)}
        >
          <MenuItem onClick={() => setOpen(false)}>Update</MenuItem>
          <MenuItem onClick={() => setOpen(false)}>Delete</MenuItem>
          <MenuItem onClick={() => setOpen(false)}>Check Status</MenuItem>
        </Menu>
      </td>
    </tr>
  );
};

export default TableRow;
