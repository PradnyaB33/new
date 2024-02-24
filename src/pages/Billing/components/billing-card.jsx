import {
  AttachMoney,
  Circle,
  ControlPoint,
  FilterNone,
  GroupAdd,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Loop,
  Message,
  Pause,
  People,
  PlayArrow,
  PriorityHigh,
  QuestionMark,
  Repeat,
  Shield,
  ShoppingBag,
  Subscriptions,
} from "@mui/icons-material";
import { Button, Menu, MenuItem, alpha, styled } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useSubscriptionGet from "../../../hooks/QueryHook/Subscription/hook";
import useSubscriptionMutation from "../../../hooks/QueryHook/Subscription/mutation";
import DescriptionBox from "./descripton-box";
import PackageForm from "./manage-package-form";
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data } = useSubscriptionGet({ organisationId: doc._id });
  const { pauseSubscriptionMutation, resumeSubscriptionMutation } =
    useSubscriptionMutation();
  console.log(`🚀 ~ file: billing-card.jsx:84 ~ data:`, data);

  const getMessage = () => {
    let message = "";

    switch (data?.subscription?.status) {
      case "authenticated":
        if (
          Math.ceil(
            new Date(data?.subscription?.charge_at * 1000) - new Date()
          ) /
            (1000 * 60 * 60 * 24) >
          0
        ) {
          message = `${Math.ceil(
            (new Date(data?.subscription?.charge_at * 1000) - new Date()) /
              (1000 * 60 * 60 * 24)
          )} Day Trial left`;
        } else {
          message = "Sorry but payment not received";
        }
        break;
      case "active":
        message = `Your next due is after ${Math.ceil(
          (new Date(data?.subscription?.charge_at * 1000) - new Date()) /
            (1000 * 60 * 60 * 24)
        )} days`;
        break;
      case "pending":
        message =
          "Your payment is pending. Please update your card details. or please complete payment";
        break;
      case "halted":
        message =
          "Your subscription is halted. Please update your card details.";
        break;
      case "cancelled":
        message =
          "Your subscription is cancelled. To restart, raise query about it";
        break;
      case "paused":
        message = "Your subscription is on paused";
        break;
      default:
        message = "Basic Plan";
        break;
    }

    return message;
  };
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
            {data?.subscription?.status === "active" && (
              <MenuItem
                onClick={async () => {
                  await pauseSubscriptionMutation.mutate(
                    data?.subscription?.id
                  );
                  handleClose();
                }}
                disableRipple
              >
                <Pause />
                Pause subscription
              </MenuItem>
            )}
            {data?.subscription?.status === "paused" && (
              <MenuItem
                onClick={async () => {
                  await resumeSubscriptionMutation.mutate(
                    data?.subscription?.id
                  );
                  handleClose();
                }}
                disableRipple
              >
                <PlayArrow />
                Resume subscription
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                setConfirmOpen(true);
              }}
              disableRipple
            >
              <FilterNone />
              Manage Subscription
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
            mainText={getMessage()}
          />
          <DescriptionBox
            Icon={AttachMoney}
            descriptionText={"Billing frequency"}
            mainText={"Quarterly"}
          />
          <DescriptionBox
            Icon={ShoppingBag}
            descriptionText={"Purchased Plan"}
            mainText={data?.plan?.item?.name}
          />
          <DescriptionBox
            Icon={FilterNone}
            descriptionText={"Active packages"}
            mainText={data?.organisation?.packages?.length}
          />
          <DescriptionBox
            Icon={People}
            descriptionText={"Allowed employee count"}
            mainText={data?.subscription?.quantity}
          />
          <DescriptionBox
            Icon={Circle}
            descriptionText={"Subscription status"}
            mainText={data?.subscription?.status}
          />
          <DescriptionBox
            Icon={Loop}
            descriptionText={"Your next renewal is after"}
            mainText={`${moment
              .duration(
                moment.unix(data?.subscription?.charge_at).diff(moment())
              )
              .days()} days`}
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
        {data?.subscription?.status === "active" ? (
          <div className="bg-[#5FF062] flex justify-center items-start p-8 rounded-full animate-pulse">
            <Repeat className="text-white " fontSize="large" />
          </div>
        ) : data?.subscription?.status === "authenticated" ? (
          <div className="bg-[#ba67e1] flex justify-center items-start p-8 rounded-full animate-pulse">
            <Shield className="text-white " fontSize="large" />
          </div>
        ) : data?.subscription?.status === "pending" ? (
          <div className="bg-[#E8A454] flex justify-center items-start p-8 rounded-full animate-pulse">
            <PriorityHigh className="text-white " fontSize="large" />
          </div>
        ) : data?.subscription?.status === "expired" ? (
          <div className="bg-[#6578DB] flex justify-center items-start p-8 rounded-full animate-pulse">
            <ControlPoint className="text-white " fontSize="large" />
          </div>
        ) : data?.subscription?.status === "halted" ? (
          <div className="bg-[#F46B6B] flex justify-center items-start p-8 rounded-full animate-pulse">
            <QuestionMark className="text-white " fontSize="large" />
          </div>
        ) : null}
      </div>
      {data?.organisation?.packages && data?.organisation && (
        <PackageForm
          open={confirmOpen}
          handleClose={() => {
            setConfirmOpen(false);
            handleClose();
          }}
          packages={data?.organisation?.packages}
          organisation={data?.organisation}
        />
      )}
    </div>
  );
};

export default BillingCard;
