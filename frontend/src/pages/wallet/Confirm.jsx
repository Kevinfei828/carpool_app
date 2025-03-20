import React, {useEffect, useState} from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import {useAuth} from "../../auth/AuthContext";
import {useSearchParams} from "react-router-dom";

export const Confirm = () => {
  const url = "http://localhost:8080";
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const [searchParams, setSearchParams] = useSearchParams();
  const {isLoading, userToken} = useAuth();
  const [carpoolMoney, setCarpoolMoney] = useState(0);

  const fetchConfirm = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchBalance = url+`/linepay-confirm?userid=${userToken.user_id}&eventid=${searchParams.get("event_id")}`;
        const response = await fetch(searchBalance, {
          method: 'POST',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            'Authorization': `Bearer ${userToken.access_token}`,
            'Content-Type': 'application/json'
          }),
        });
        const data = await response.json();
        console.log(data)
        if (Object.keys(data).length > 0) {
          if (data.content)
            alert(data.content)
          if (data.detail)
            alert(data.detail)
        }
      } catch (error) {
        console.error('Error fetch linepay-confirm:', error);
        // Handle error here, set joinedEvents to empty or show a message
        return -1;
      }
    }
  }

  const token_check = async () => {
    try {
      const tokenCheck = url+`/token-check`;
      const response = await fetch(tokenCheck, {
        method: 'post',
        withCredentials: true,
        credentials: 'include',
        headers: new Headers({
          'Authorization': `Bearer ${userToken.access_token}`,
          'Content-Type': 'application/json'
        })
      });
    } catch (error) {
      console.error('Error token-check:', error);
      return null;
    }
  }

  useEffect(() => {
    if (!isLoading && userToken) {
      token_check();
    }
    if (!isLoading && userToken == null) {
      setCarpoolMoney("尚未登入")
    }
  }, [isLoading, userToken]);

  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} style={{padding: 20, height: "calc(95vh - 64px)"}}>
        <Typography variant="h4" style={{marginBottom: 20}}>
          Confirm Page
        </Typography>
        <hr />
        <Box mt={3} sx={{marginLeft: 2}}>
          <Grid container>
            <Grid item>
              <Button variant="contained" onClick={fetchConfirm}>
                確認付款
              </Button>
            </Grid>
          </Grid>
        </Box>
        <Button>

        </Button>
      </Paper>
    </Container>
  );
};

export default Confirm;
