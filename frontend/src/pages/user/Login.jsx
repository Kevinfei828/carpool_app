import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../auth/AuthContext';
import {Box, Button, Container, Link as MuiLink, Paper, TextField, Typography,} from '@mui/material';


// import {Notification} from '../Notification/NotificationUser';

export const Login = () => {
  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verification_code, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const {isLoading, userToken, login, isHandleLoginSuccess} = useAuth();

  useEffect(() => {
    if (isHandleLoginSuccess) {
      navigate('/user');
    }
  }, [isHandleLoginSuccess]);

  const handleLogin = async () => {
    await login(phone, verification_code);
  };


  return (
  <>
    {/* Display the Notification component when logged in */}
    {/* {userToken && <Notification userId={userToken.user_id} />} */}

    <Container maxWidth="sm" sx={{marginTop: 8}}>
      <Paper elevation={3} sx={{padding: 4}}>
        <Typography variant="h4" gutterBottom>
          Welcome to Carpool Service System
        </Typography>
        <hr />
        <Box mt={3}>
          <TextField
            fullWidth
            aria-required={true}
            label="手機"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={2}>
          <TextField
            fullWidth
            aria-required={true}
            label="驗證碼"
            // type="password"
            value={verification_code}
            onChange={(e) => setVerificationCode(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </Box>
        <Box mt={4}>
          <Button fullWidth variant="contained" color="primary" onClick={handleLogin}>
            Sign in
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography>
            If you are not a member, please{' '}
            <MuiLink component={Link} to="/Register" color="secondary">
              REGISTER HERE
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  </>
  );
};

export default Login;
