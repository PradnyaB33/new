import React from "react";
import { Link } from "react-router-dom";
import useLoanQuery from "../../hooks/LoanManagemet/useLoanQuery";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const LoanMgtNotification = () => {
  const { getEmployeeRequestLoanApltn } = useLoanQuery();
  console.log("data", getEmployeeRequestLoanApltn);

  return (
    <div className="mt-4">
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          marginTop: "10%",
        }}
      >
        {getEmployeeRequestLoanApltn?.map((loan) => (
          <React.Fragment key={loan._id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Link to={`/loan-approval/${loan._id}`}>
                  <Avatar alt={loan?.userId?.first_name} src={loan?.userId?.user_logo_url} />
                </Link>
              </ListItemAvatar>
              <ListItemText
                primary={`${loan?.userId?.first_name} ${loan?.userId?.last_name}`}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Loan
                    </Typography>
                    {` — ${loan?.userId?.first_name} ${loan?.userId?.last_name} raised a request for loan application.`}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default LoanMgtNotification;
