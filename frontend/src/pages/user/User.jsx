// User.jsx
import React, {useEffect, useState} from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Divider,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography
} from "@mui/material";
import {useNavigate} from 'react-router-dom';
import UserEdit from './UserEdit';
import ChangePassword from './ChangePassword';
import {useAuth} from "../../auth/AuthContext";

import { pusher, beamsClient } from "../../pusher_util";

export const User = () => {
  const {isLoading, userToken, logout, isHandleLoginSuccess} = useAuth();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "",
    emailAddress: "",
    phoneNumber: "",
  });
  const [img, setImg] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditSuccess, setIsEditSuccess] = useState(false);

  useEffect(() => {
    // Simulating API call to fetch user info
    // Replace the following with your actual API call
    const pseudoUserData = {
      name: "no userData",
      emailAddress: "no userData",
      phoneNumber: "no userData",
    };

    // real API call
    const fetchUserInfo = async () => {
      if (!isLoading && userToken) {
        console.log()
        try {
          // Perform API call to get user info
          const userID = userToken.user_id;
          const url = "http://localhost:8080";
          //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
          const getUserInfo = url+`/user/${userID}`;
          const response = await fetch(getUserInfo, {
            method: 'get',
            withCredentials: true,
            credentials: 'include',
            headers: new Headers({
              // 'Authorization': `Bearer ${userToken.access_token}`,
              'Authorization': userToken.access_token,
              'Content-Type': 'application/json'
            })
          });
          // console.log('fetch userInfo.');

          const return_data = await response.json();
          const data = return_data.data;
          if (data !== null && Object.keys(data).length > 0) {
            setUserInfo(data);
          } else {
            setUserInfo(pseudoUserData);
          }
        } catch (error) {
          console.error('Error fetching user information:', error);
          return null;
        }
      }
    };

    if (!isLoading && userToken) {
      fetchUserInfo();
      // fetchUserLicense();
    }
    if (!isLoading && userToken == null)
      navigate('/Login');

  }, [isLoading, userToken]);

  const handleChildSuccess = (updatedInfo) => {
    // Do something with the data received from the child
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      ...updatedInfo, // Merge the updated info with the existing data
    }));
    setIsEditSuccess(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsEditSuccess(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setIsEditSuccess(false);
    setIsChangingPassword(false);
  };

  const handleChangePasswordClick = () => {
    setIsChangingPassword(true);
    setIsEditSuccess(false);
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
  };

  const handleLogoutClick = () => {
    logout();
  }

  // const handleVerifyLicenseClick = () => {
  //   navigate('/upload');
  // };
  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} style={{padding: 20}}>
        <Typography variant="h4" style={{marginBottom: 20}}>
          用戶資料
        </Typography>
        <hr />

        <Box>
          {!isEditing && !isChangingPassword && (
            <>
              <Grid item style={{marginTop: 10}} xs={12} lg={6}>
                <Grid item xs={12}>
                  <TextField
                    label="Display Name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={userInfo?.name || ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={userInfo?.emailAddress || ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    disabled
                    value={userInfo?.phoneNumber || ""}
                  />
                </Grid>
              </Grid>
              <Box mt={2}>
                <Grid container spacing={2}>
                  <Grid item>
                    <Button variant="contained" onClick={handleEditClick}>
                      編輯
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleChangePasswordClick}>
                      更改密碼
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="contained" onClick={handleLogoutClick}>
                      登出
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
          {isEditing && (
            <UserEdit 
            userInfo={userInfo} 
            onCancel={handleCancelClick} 
            handleSuccess={(updatedInfo) => handleChildSuccess(updatedInfo)}/>
          )}
          {isChangingPassword && (
            <ChangePassword onCancel={handleCancelClick} handleSuccess={handleChildSuccess}/>
          )}
          {/* save success message */}
          <Snackbar
            open={isEditSuccess}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert elevation={6} variant="filled" onClose={handleSnackbarClose} severity="success">
              Save Success!
            </Alert>
          </Snackbar>
        </Box>
      </Paper>
    </Container>
  );
};

export default User;
