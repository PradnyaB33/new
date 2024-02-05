import { Popover, Transition } from "@headlessui/react";
import { Notifications } from "@mui/icons-material";
import { Badge } from "@mui/material";
import React from "react";
import Tabs from "./Tabs";

const NotificationIcon = () => {
  return (
    <Popover className="relative">
      <Badge variant={"standerd"} color={"error"} badgeContent={"3"}>
        <Popover.Button>
          <Notifications />
        </Popover.Button>
      </Badge>

      <Transition
        enter="transition"
        enterFrom=" scale-95 opacity-0"
        enterTo=" scale-100 opacity-100"
        leave="transition"
        leaveFrom=" scale-100 opacity-100"
        leaveTo=" scale-95 opacity-0"
      >
        <Popover.Panel className={"absolute w-[400px]  right-[10px] z-0 "}>
          <Tabs />
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default NotificationIcon;
