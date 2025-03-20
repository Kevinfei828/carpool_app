import React, {useEffect, useState} from "react";
import {useAuth} from "../../auth/AuthContext";
import {Box, Container, Divider, Paper, Typography, Button} from "@mui/material";
import CarpoolCard from "./CarpoolCard";
import {formatSearchData} from "../../utils/formatSearchData";

export const CarpoolJoined = () => {
  const {isLoading, userToken} = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const url = 'http://localhost:8080';
  // const url = 'http://localhost:8000';
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'

  const fetchJoinedEvents = async () => {
    if (!isLoading && userToken) {
      try {
        const userID = userToken.user_id;
        const searchJoinedEvent = url+`/event/list?userId=${userID}`;
        const response = await fetch(searchJoinedEvent, {
          method: 'get',
          withCredentials: true,
          credentials: 'include',
          headers: new Headers({
            // 'Authorization': `Bearer ${userToken.access_token}`,
            'Authorization': userToken.access_token
          })
        });
        const data = await response.json();
        console.log(data);
        if (data.data.result !== "None" && Object.keys(data.data).length > 0) {
            const formattedData = formatSearchData(data.data);
          
          setJoinedEvents(formattedData);
          console.log(formattedData);
        } else {
          // setJoinedEvents(mockResult);
          setJoinedEvents([]);
        }
      } catch (error) {
        console.error('Error fetching event information:', error);
        // Handle error here, set joinedEvents to empty or show a message
        setJoinedEvents([]);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    fetchJoinedEvents();
    return () => clearInterval(intervalId);
  }, [userToken]); // Transport one empty tuple as second parameter to insure useEffect as Componet only work once

  const formattedDate = currentDate.toLocaleTimeString();

  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} className="search-container" style={{padding: 20}}>
        <Typography variant="h4" className="search-title" style={{marginBottom: 20}}>
          進行中的共乘
        </Typography>
        <hr />
        <Box style={{marginTop: 10}}>
          {joinedEvents.filter(item => !item.is_ended).length === 0 && (
            <Typography>沒有搜尋結果</Typography>
          )}
          {joinedEvents.length > 0 && joinedEvents.map((item) => (
            item.is_ended === false &&
            <Box key={item.id} mt={1}>
              <CarpoolCard key={item.id} item={item} cardType="Joined"/>
            </Box>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default CarpoolJoined;
