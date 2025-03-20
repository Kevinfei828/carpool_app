import React, {useEffect, useState} from "react";
import {Box, Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";
import CarpoolCard from './CarpoolCard';
import {useAuth} from "../../auth/AuthContext";


export const CarpoolEnded = () => {
  const {isLoading, userToken} = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [endedEvents, setEndedEvents] = useState([]);
  const url = 'http://localhost:8080';
  // const url = 'http://localhost:8000';
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const [carpoolMoney, setCarpoolMoney] = useState(null);

  const fetchEndedEvents = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchEndedEvent = url+`/event/list?userId=${userID}`;
        const response = await fetch(searchEndedEvent, {
          method: 'get',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            // 'Authorization': `Bearer ${userToken.access_token}`,
            'Authorization': userToken.access_token
          })
        });
        const data = await response.json();

        if (data.result !== "None" && Object.keys(data).length > 0) {

          const formattedData = data.data.map((item) => {
            // Extract carpoolEvents-related fields
            const startLocations = item.carpoolEvents.map(attendant => attendant.getOnLocation.name_cn);
            const endLocations = item.carpoolEvents.map(attendant => attendant.getOffLocation.name_cn);
    
            return {
              id: item.id,
              initiator: item.initiator.id,
              startLocation: item.startLocation.name_cn,
              endLocation: item.endLocation.name_cn,
              startCity: item.startCity.name_cn,
              endCity: item.endCity.name_cn,
              attendantStartLocations: startLocations,
              attendantEndLocations: endLocations, 
              maxAvailableSeat: item.maxAvailableSeat,
              currentAvailableSeat: item.currentAvailableSeat,
              time: item.startTime,
              start_time: item.startTime,
              is_ended: item.completed || item.dismissed,
              carpool_attribute: item.selfDrive
                ? "發起人自駕"
                : "非自駕",
            };
          })

          setEndedEvents(formattedData);

        } else {
          setEndedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set endedEvents to empty or show a message
        setEndedEvents([]);
      }
    }
  };

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
          return data.user_id;
        } else {
          setCarpoolMoney("null")
          return 0;
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set endedEvents to empty or show a message
        setCarpoolMoney("尚未登入")
        return -1;
      }
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    // get Event Data
    if (!isLoading && userToken) {
      fetchEndedEvents();
      // fetchBalance();
    }
    if (!isLoading && userToken == null) {
      setCarpoolMoney("尚未登入")
      setEndedEvents([])
    }

    return () => clearInterval(intervalId);
  }, [isLoading, userToken]); // Transport one empty tuple as second parameter to insure useEffect as Component only work once

  const formattedDate = currentDate.toLocaleTimeString();


  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} className="search-container" style={{padding: 20}}>
        <Typography variant="h4" className="search-title" style={{marginBottom: 20}}>
          已結束的共乘
        </Typography>
        <hr />

        {/* <Box mt={3} sx={{marginLeft: 2}}>
          <Grid container>
            <Grid item>
              <Typography variant="h5">我的Carpool-Money: {carpoolMoney}</Typography>
            </Grid>
          </Grid>
        </Box> */}

        {endedEvents.length === 0 && (
          <Typography>沒有搜尋結果</Typography>
        )}
        {endedEvents.length > 0 && endedEvents.map((item) => (
          item.is_ended == true &&
          <Box key={item.id} mt={1}>
            <CarpoolCard key={item.id} item={item} cardType="Ended"/>
          </Box>

        ))}
      </Paper>
      
    </Container>
  );
};

export default CarpoolEnded;
