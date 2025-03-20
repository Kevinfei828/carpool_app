// ChangePassword.jsx
import React, {useState} from 'react';
import {Alert, Box, Button, Grid, Snackbar, TextField} from "@mui/material";
import {useAuth} from "../../auth/AuthContext";

const ChangePassword = ({onCancel, handleSuccess}) => {
  const { isLoading, userToken } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [SaveError, setSaveError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isFormValid = () => {
    // Check if ANY field is not empty
    const isAnyFieldNotEmpty = Object.values(passwordData).every(value => value.trim() !== '');

    // Specific validation conditions for each field
    const isCurrentPasswordValid = /^(?=.*[A-Za-z0-9@$!%*?&_.])[\w@$!%*?&_.]{8,}$/.test(passwordData.currentPassword);
    const isNewPasswordValid = /^(?=.*[A-Za-z0-9@$!%*?&_.])[\w@$!%*?&_.]{8,}$/.test(passwordData.newPassword);
    const isConfirmNewPasswordValid = /^(?=.*[A-Za-z0-9@$!%*?&_.])[\w@$!%*?&_.]{8,}$/.test(passwordData.confirmNewPassword);

    // Check is new password and confirm password are same
    const isConfirmSuccess = passwordData.newPassword === passwordData.confirmNewPassword;

    // Check if at least one condition is met
    return isCurrentPasswordValid && isNewPasswordValid && isConfirmNewPasswordValid && isConfirmSuccess;
  };
  const handleSaveClick = async () => {
    if (isFormValid()) {
      try {
        const userID = 1;
        const url = "http://localhost:8080";
        //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
        const updateUserInfo = url+"/update-user-info";
        const response = await fetch(updateUserInfo, {
          method: 'POST',
          headers: new Headers({
            // 'Authorization': `Bearer ${userToken.access_token}`,
            'Authorization': userToken.access_token,
            'Content-Type': 'application/json',
            'accept': 'application/json',
          }),
          body: JSON.stringify({
            /*
            // to be updated
             */
            user_id: userID,
            password: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            /*
            // to be updated
             */
          }),
        });

        if (response.ok) {
          // Handle successful response
          handleSuccess();
          // After saving, exit edit mode
          onCancel();
          // ...
        } else {
          // Handle error response
          const errorData = await response.json();
          console.error('API error:', errorData);
          setSaveError(true);
          setErrorMessage('API error:' + errorData.message);
        }
      } catch (error) {
        console.error('Error updating user information:', error);
        setSaveError(true);
        setErrorMessage('Error updating user information:' + error.message);
      }


    } else {
      // Display an error message or handle the case where the form is not valid
      console.error('Invalid form data');
      setSaveError(true);
      setErrorMessage('Invalid form data');
    }

  };

  const handleCancelClick = () => {
    // Exit change password mode without saving
    onCancel();
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSaveError(false);
  };

  return (
    <Box>
      <Snackbar
        open={SaveError}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert elevation={6} variant="filled" severity="error">
          Save Error! {errorMessage}
        </Alert>
      </Snackbar>
      <TextField
        label="Current Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        name="currentPassword"
        value={passwordData.currentPassword}
        onChange={handleInputChange}
      />
      <TextField
        label="New Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        name="newPassword"
        value={passwordData.newPassword}
        onChange={handleInputChange}
      />
      <TextField
        label="Confirm New Password"
        variant="outlined"
        fullWidth
        margin="normal"
        type="password"
        name="confirmNewPassword"
        value={passwordData.confirmNewPassword}
        onChange={handleInputChange}
      />
      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item>
            <Button variant="contained" onClick={handleSaveClick}>
              儲存
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" onClick={handleCancelClick}>
              取消
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ChangePassword;
