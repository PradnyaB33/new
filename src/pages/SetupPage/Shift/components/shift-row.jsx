import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Avatar, AvatarGroup, Chip, IconButton } from "@mui/material";
import dayjs from "dayjs";
import React from "react";

const ShiftRow = ({
  index,
  items,
  handleEditModalOpen,
  handleDeleteConfirmation,
}) => {
  const convertTo12HourFormat = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const newDate = dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
    return newDate.format("h:mm A");
  };
  return (
    <tr
      id={index}
      key={index}
      className={`${"bg-white"} border-b dark:border-neutral-500`}
    >
      <td className="whitespace-nowrap px-6 py-2 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-6 py-2">{items.shiftName}</td>
      <td className="whitespace-nowrap px-6 py-2">{items.workingFrom}</td>
      <td className="whitespace-nowrap font-semibold px-6 py-2">
        <Chip
          // icon={<AccessTimeFilled />}
          size="small"
          variant="outlined"
          // color="success"
          label={convertTo12HourFormat(items.startTime)}
        />
      </td>
      <td className="whitespace-nowrap font-semibold px-6 py-2">
        <Chip
          // icon={<AccessTimeFilled />}
          variant="outlined"
          size="small"
          // color="success"
          label={convertTo12HourFormat(items.endTime)}
        />
      </td>

      <td className="flex items-start !text-left px-6 py-2">
        <AvatarGroup max={6}>
          {items?.selectedDays.map((item) => (
            <Avatar
              src="dsadsa"
              key={item}
              className="!text-xs !bg-sky-500 !text-white "
              sx={{
                width: 35,
                height: 35,
              }}
            >
              {item.slice(0, 3)}
            </Avatar>
          ))}
        </AvatarGroup>
      </td>

      <td className="whitespace-nowrap px-6 py-2">
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={() => handleEditModalOpen(items._id)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          color="error"
          aria-label="delete"
          onClick={() => handleDeleteConfirmation(items._id)}
        >
          <DeleteOutline />
        </IconButton>
      </td>
    </tr>
  );
};

export default ShiftRow;
