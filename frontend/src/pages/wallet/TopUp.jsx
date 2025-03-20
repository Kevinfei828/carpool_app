import React, {useEffect, useState} from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import {useAuth} from "../../auth/AuthContext";

export const TopUp = () => {
  const url = "http://localhost:8080";
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const {isLoading, userToken} = useAuth();
  const [carpoolMoney, setCarpoolMoney] = useState(0);

  const fetchBalance = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchBalance = url+`/wallet/${userID}`;
        const response = await fetch(searchBalance, {
          method: 'get',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            'Authorization': `Bearer ${userToken.access_token}`,
            'Content-Type': 'application/json'
          }),
        });
        const data = await response.json();

        if (Object.keys(data).length > 0) {
          setCarpoolMoney(data.carpool_money);
          return data;
        } else {
          setCarpoolMoney("null")
          return 0;
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set joinedEvents to empty or show a message
        setCarpoolMoney("尚未登入")
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
      fetchBalance();
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
          儲值Carpool-Money
        </Typography>
        <hr />
        <Box mt={3} sx={{marginLeft: 2}}>
          <Grid container>
            <Grid item>
              <Typography variant="h5">我的Carpool-Money: {carpoolMoney}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Button>

        </Button>
      </Paper>
    </Container>
  );
};

export default TopUp;
