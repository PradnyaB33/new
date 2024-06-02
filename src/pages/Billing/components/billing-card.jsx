import {
  AttachMoney,
  Autorenew,
  Circle,
  ControlPoint,
  Discount,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Loop,
  People,
  PriorityHigh,
  Repeat,
  ShoppingBag,
  Subscriptions,
  TrendingUp,
} from "@mui/icons-material";
import { Button, Menu, MenuItem, alpha, styled } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import DescriptionBox from "./descripton-box";
import PaySubscription from "./package/pay-sub";
import RenewPackage from "./package/renew";
import UpgradePackage from "./package/upgrade";
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
  const [confirmOpen1, setConfirmOpen1] = useState(false);
  const [confirmOpen2, setConfirmOpen2] = useState(false);
  const [confirmOpen3, setConfirmOpen3] = useState(false);

  const checkHasOrgDisabled = () => {
    // if organization subscriptionDetails.status is pending and the difference between the current date and the expiration date is greater than 0 then return true else return false
    if (doc?.subscriptionDetails?.status === "Active") {
      // check if expired by checking subscriptionDetails.expirationDate
      if (
        moment(doc?.subscriptionDetails?.expirationDate).diff(
          moment(),
          "days"
        ) > 0
      ) {
        return false;
      } else {
        return true;
      }
    } else if (doc?.subscriptionDetails?.status === "Pending") {
      if (moment(doc?.createdAt).add(7, "days").diff(moment(), "days") > 0) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className="shadow-twe-inner bg-Brand-Purple/brand-purple-1 rounded-md grid grid-cols-6">
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
            <MenuItem
              onClick={() => {
                setConfirmOpen1(true);
              }}
              disableRipple
            >
              <Autorenew />
              Renew
            </MenuItem>
            <MenuItem
              onClick={() => {
                setConfirmOpen2(true);
                handleClose();
              }}
              disableRipple
            >
              <TrendingUp />
              Upgrade
            </MenuItem>
          </StyledMenu>
        </div>

        <div className="bg-brand/wahsed-blue rounded-md flex flex-wrap gap-2 p-2 items-center">
          <DescriptionBox
            Icon={Subscriptions}
            descriptionText={"Subscription charge date"}
            mainText={moment(doc?.subscriptionDetails?.paymentDate).format(
              "DD MMM YYYY"
            )}
          />
          <DescriptionBox
            Icon={Subscriptions}
            descriptionText={"Subscription end date"}
            mainText={moment(doc?.subscriptionDetails?.expirationDate).format(
              "DD MMM YYYY"
            )}
          />
          <DescriptionBox
            Icon={AttachMoney}
            descriptionText={"Billing frequency"}
            mainText={"Quarterly"}
          />
          <DescriptionBox
            Icon={ShoppingBag}
            descriptionText={"Purchased Plan"}
            mainText={doc?.packageInfo}
          />

          <DescriptionBox
            Icon={People}
            descriptionText={"Allowed employee count"}
            mainText={doc?.memberCount}
          />
          <DescriptionBox
            Icon={Circle}
            descriptionText={"Subscription status"}
            mainText={doc?.subscriptionDetails?.status}
          />
          {moment(doc?.subscriptionDetails?.expirationDate).diff(
            moment(new Date()),
            "days"
          ) > 0 && (
            <DescriptionBox
              Icon={Loop}
              descriptionText={"Your next renewal is after"}
              mainText={`${moment(
                doc?.subscriptionDetails?.expirationDate
              ).diff(moment(new Date()), "days")} days`}
            />
          )}
          <DescriptionBox
            Icon={Discount}
            descriptionText={"Organisation discount for next subscription"}
            mainText={`${Math.round(doc?.remainingBalance)}`}
          />
        </div>
        {!checkHasOrgDisabled() && (
          <Button onClick={() => setConfirmOpen3(true)} variant="contained">
            Pay
          </Button>
        )}
      </div>
      <div className=" col-span-1 flex justify-center items-center">
        {doc?.subscriptionDetails?.status === "Active" ? (
          <div className="bg-[#5FF062] flex justify-center items-start p-8 rounded-full animate-pulse">
            <Repeat className="text-white " fontSize="large" />
          </div>
        ) : doc?.subscriptionDetails?.status === "Pending" ? (
          <div className="bg-[#E8A454] flex justify-center items-start p-8 rounded-full animate-pulse">
            <PriorityHigh className="text-white " fontSize="large" />
          </div>
        ) : doc?.subscriptionDetails?.status === "Expired" ? (
          <div className="bg-[#6578DB] flex justify-center items-start p-8 rounded-full animate-pulse">
            <ControlPoint className="text-white " fontSize="large" />
          </div>
        ) : null}
      </div>

      <RenewPackage
        open={confirmOpen1}
        handleClose={() => {
          setConfirmOpen1(false);
          handleClose();
        }}
        organisation={doc}
      />

      <UpgradePackage
        open={confirmOpen2}
        handleClose={() => {
          setConfirmOpen2(false);
          handleClose();
        }}
        organisation={doc}
      />
      <PaySubscription
        open={confirmOpen3}
        handleClose={() => {
          setConfirmOpen3(false);
          handleClose();
        }}
        organisation={doc}
      />
    </div>
  );
};

export default BillingCard;
