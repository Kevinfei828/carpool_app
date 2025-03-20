import React from "react";
import {AppBar, IconButton, Toolbar, Typography, Badge} from "@mui/material";
import PaidIcon from '@mui/icons-material/Paid';
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useLocation, useNavigate} from "react-router-dom";

import { useNotification } from "../pages/Notification/NotificationContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {unreadCount} = useNotification();

  // Function to extract the page name from the URL
  const getPageName = () => {
    const paths = location.pathname.split("/");
    return paths[paths.length - 1];
  };

  return (
    <AppBar position="static" sx={{marginBottom: 0}}>
      {/* Set marginBottom to 0 to remove the default margin */}
      <Toolbar>
        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
          {getPageName()}
        </Typography>

        {/* <IconButton color="inherit" onClick={() => navigate("/top-up")}>
          <PaidIcon/>
        </IconButton> */}

        <IconButton color="inherit" onClick={() => navigate("/notifications")}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <IconButton color="inherit" onClick={() => navigate("/user")}>
          <AccountCircleIcon/>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
