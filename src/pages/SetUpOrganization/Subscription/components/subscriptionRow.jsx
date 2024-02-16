import { Chip, Skeleton } from "@mui/material";
import React from "react";

const SubscriptionRow = ({ leftText, rightText, chip, loading }) => {
  return (
    <>
      <div className="col-span-1 !text-md !text-bold text-Brand-neutrals/brand-neutrals-3">
        {leftText}
      </div>
      <div className="col-span-1 font-bold text-Brand-neutrals/brand-neutrals-3 truncate">
        {chip === true ? (
          <Chip
            size="large"
            variant="outlined"
            color="info"
            label={loading ? <Skeleton width={100} /> : rightText}
          />
        ) : loading ? (
          <Skeleton width={100} />
        ) : (
          rightText
        )}
      </div>
    </>
  );
};

export default SubscriptionRow;
