import {
  GroupAdd,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Message,
  Pause,
  PlayArrow,
  Repeat,
  Subscriptions,
} from "@mui/icons-material";
import { Button, Menu, MenuItem, alpha, styled } from "@mui/material";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import DescriptionBox from "./descripton-box";
const StyledMenu = styled((props) => (
  <Menu
    style={{ background: "rgb(244 247 254 / var(--tw-bg-opacity))" }}
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 140,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const BillingCard = ({ doc }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data, isLoading } = useSubscriptionGet({ organisationId: doc._id });
  console.log(`🚀 ~ file: billing-card.jsx:71 ~ isLoading:`, isLoading);
  console.log(`🚀 ~ file: billing-card.jsx:71 ~ data:`, data);

  return (
    <div className="shadow-xl bg-Brand-Purple/brand-purple-1 rounded-md grid grid-cols-6">
      <div className=" col-span-5 pl-4 pt-4 pb-4 gap-4 flex flex-col">
        <div className="flex justify-between">
          <div className="flex gap-4 items-end">
            <img
              src={doc?.logo_url}
              alt="payment not received"
              className="h-10 w-10 rounded-md border border-brand/purple"
            />
            <div className="text-2xl font-bold">{doc?.orgName}</div>
          </div>
          <Button
            id="demo-customized-button"
            aria-controls={open ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            variant="outlined"
            disableElevation
            onClick={handleClick}
            endIcon={open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          >
            Options
          </Button>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} disableRipple>
              <Pause />
              Pause subscription
            </MenuItem>
            <MenuItem onClick={handleClose} disableRipple>
              <PlayArrow />
              Resume subscription
            </MenuItem>
          </StyledMenu>
        </div>

        <div className="bg-brand/wahsed-blue rounded-md border-brand/purple border-[0.5px] flex flex-wrap gap-2 p-2 items-center">
          <DescriptionBox
            Icon={GroupAdd}
            descriptionText={"Created by"}
            mainText={`${doc?.creator?.first_name} ${doc?.creator?.last_name}`}
          />
          <DescriptionBox
            Icon={Subscriptions}
            descriptionText={"Subscription start date"}
            mainText={moment
              .unix(data?.subscription?.charge_at)
              .format("MM/DD/YYYY")}
          />
          <DescriptionBox
            Icon={Message}
            descriptionText={"Message"}
            mainText={
              moment
                .unix(data?.subscription?.charge_at)
                .startOf("day")
                .isSame(moment().startOf("day"))
                ? "Your subscription start date is today please complete auto pay"
                : "Your subscription plan is active"
            }
          />

          {moment
            .unix(data?.subscription?.charge_at)
            .startOf("day")
            .isSame(moment().startOf("day")) && (
            <Link to={data?.subscription?.short_url} target="_blank">
              <Button
                variant="contained"
                style={{ height: "-webkit-fill-available" }}
              >
                Start subscription
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className=" col-span-1 flex justify-center items-center">
        <div className="bg-success-400 flex justify-center items-start p-8 rounded-full">
          <Repeat className="text-white " fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default BillingCard;
