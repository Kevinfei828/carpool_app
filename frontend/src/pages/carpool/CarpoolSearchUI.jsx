import React, {useState} from 'react';
import CarpoolCard from './CarpoolCard';
import {useAuth} from "../../auth/AuthContext";


import {Box, Button, Container, Divider, Grid, Paper, TextField, Typography,} from "@mui/material";
import {DateTimePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';

export const CarpoolSearchUI = () => {
  const {userToken} = useAuth();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [currentDate, setCurrentDate] = useState(dayjs());

  
  const onSearchClick = () => {
    // Simulating API call
    const apiResult = [
      
    ];
    setIsSearchClicked(true);
    setSearchResult(apiResult);
  };

  const renderSearchResult = () => {
    return searchResult.map((item) => (
      <Box key={item.id} mt={1}>
        <CarpoolCard item={item} cardType="Active"/>
      </Box>
    ));
  };

  return (
    <Container style={{marginTop: 20}}>
      <Paper elevation={3} className="search-container" style={{padding: 20}}>
        <Typography variant="h4" style={{marginBottom: 20}}>
          搜尋共乘
          使用者: {userToken ? userToken.user_display_name : "未登入"}
        </Typography>
        <Divider/>
        <Grid container spacing={2} className="search-form">
          <Grid item xs={12} md={6}>
            <TextField
              label="上車地點"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="下車地點"
              variant="outlined"
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="日期和時間"
                value={currentDate}
                onChange={(date) => setCurrentDate(date)}
                renderInput={(props) => (
                  <TextField {...props} variant="outlined" fullWidth/>
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onSearchClick}
            >
              搜尋
            </Button>
          </Grid>
        </Grid>
        <Divider/>
        <Box mt={3}>
          <Typography variant="h5">搜尋結果</Typography>
        </Box>
        {isSearchClicked && searchResult.length === 0 && (
          <Typography>沒有搜尋結果</Typography>
        )}
        {isSearchClicked && searchResult.length > 0 && renderSearchResult()}
      </Paper>
    </Container>
  );
};

export default CarpoolSearchUI;
