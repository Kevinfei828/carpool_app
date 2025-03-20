import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAuth } from "../../auth/AuthContext";
import {
  Typography,
  TextField,
  Button,
  Container,
  FormControl,
  Input,
  Select,
  MenuItem,
  Grid,
  Box, Paper, Divider, InputAdornment, InputLabel, Alert,
} from '@mui/material';
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, {Dayjs} from "dayjs";
import 'dayjs/locale/zh-tw';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Link, useNavigate} from 'react-router-dom';

import { useWebSocket } from '../../webSocket/webSocketProvider';
import { useNotification } from '../Notification/NotificationContext';
import { useMessage } from '../../chatroom_self/MessageContext';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Taipei');

export const CarpoolLaunch = () => {
  const { isLoaded, userToken} = useAuth();
  const [currentDate, setCurrentDate] = useState(dayjs());
  //const [launchCarpool, setLaunchCarpool] = useState(false);
  const [maxAvailableSeat, setMaxAvailableSeat] = useState('');
  const [attendantNumber, setAttendantNumber] = useState('');
  const [isSelfDrive, setIsSelfDrive] = useState(true);
  const driveOptions = [
    { value: true, label: '發起人自駕' },
    { value: false, label: '非自駕' },
  ];
  const [startCity, setStartCity] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endCity, setEndCity] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [eventName, setEventName] = useState('');

  const [isSusbscribe, setIsSubscribe] = useState(false);

  const [otherLocate, setOtherLocate] = useState('');
  const [otherLocations, setOtherLocations] = useState([]);
  // const [acc_payable, setAcc_Payable] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [warningMessage, setWarningMessage] = useState('');
  const [isLaunchSuccess, setIsLaunchSuccess] = useState(false);

  const {connectWebSocket, subscribeToTopic, unsubscribeFromTopic} = useWebSocket();
  const {addNotification, notificationHandler} = useNotification();
  const {messages, messageHandler} = useMessage();


  // 成功發起event會回傳{eventId, chatroomId}
  const [launchResult, setLaunchResult] = useState(null);

  const navigate = useNavigate();

  const handleDateChange = (date) => {
    date.tz("Asia/Taipei");
    setSelectedDate(date);
  };
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const url = 'http://localhost:8080';
  const urlInitiateCarpool = url + '/event/create';

  useEffect(() => {
    if (isLaunchSuccess) {
    // subscribe to event queue
      subscribeToTopic(`/topic/event/notifications/${launchResult.eventId}`, notificationHandler);
      // subscribeToTopic(`/topic/chatroom/${launchResult.chatroomId}`, messageHandler);

      setIsLaunchSuccess(false);
      setIsSubscribe(true);

      // return () => {
      //   // Unsubscribe from the topic when the component unmounts or userToken changes
      //   // unsubscribeFromTopic(`/topic/event/notifications/${launchResult.eventId}`);
      //   // unsubscribeFromTopic(`topic/chatroom/${launchResult.chatroomId}`);
      // };
    }

  }, [isLaunchSuccess]);

  const onSuccess = () => {
    navigate('/joined');
  };


  const handleLaunchClick = () => {
    console.log(selectedDate.tz("Asia/Taipei").toLocaleString());

    if (selectedDate.isBefore(dayjs())) {
      setWarningMessage('選擇的時間必須晚於目前時間，請重新選擇！');
      return; // Prevent form submission
    }

    // Reset warning message
    setWarningMessage('');

    const target = {
      initiatorId: userToken.user_id,
      eventName: eventName,
      startTime: selectedDate.format("YYYY-MM-DDTHH:mm:ss"),
      isSelfDrive: isSelfDrive,
      maxAvailableSeat: maxAvailableSeat,
      attendantNumber: attendantNumber,
      startCityName_cn: startCity,
      startLocationName_cn: startLocation,
      endCityName_cn: endCity,
      endLocationName_cn: endLocation
    };
    // if (acc_payable === '') 
    //   target.acc_payable = acc_payable;
    // console.log(JSON.stringify(target));

    fetch(urlInitiateCarpool, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${userToken.access_token}`,
        'Authorization': userToken.access_token,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(target),
    })
      .then((response) => response.json())
      .then((responseText) => {
        console.log(responseText.data);

        setLaunchResult(responseText.data);
        setIsLaunchSuccess(true);
        
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleOtherLocation = () => {
    if (otherLocate.trim() === '')
      alert('欄位不可為空');
    else if (otherLocations.includes(otherLocate)) 
      alert('已存在此地點');
    else {
      setOtherLocations([...otherLocations, otherLocate]);
      setOtherLocate("");
    }
  };
  
  const onClearClick = () => {
    setSelectedDate(dayjs());
    setStartCity('');
    setStartLocation('');
    setEndCity('');
    setEndLocation('');
    setEventName('');
    setMaxAvailableSeat('');
    setIsSelfDrive(false);
    setLaunchResult('');
    setAttendantNumber('');

  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(dayjs());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formattedDate = currentDate.format('A HH:mm:ss').replace('AM', '上午').replace('PM', '下午');;

  const tomap = () => {
    navigate('/maps');
  }
  
  return (
    
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} className="search-container" style={{ padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          發起共乘
          使用者: {userToken ? userToken.user_display_name : "未登入"}
        </Typography>
        <Typography margin-bottom="10px">現在時間: {formattedDate}</Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Add your form submission logic here
            handleLaunchClick();
          }}
          autoComplete="on"
        >

        {warningMessage && (
          <Alert severity="warning" style={{ marginTop: 20 }}>
            {warningMessage}
          </Alert>
        )}

        {isSusbscribe && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "#fff",
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              textAlign: "center",
              zIndex: 1000,
              maxWidth: 400,
              width: "90%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ marginBottom: 5 }}
            >
              成功發起新共乘!
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={onSuccess}
              sx={{ width: "100%", paddingY: 0.8 }}
            >
              去已加入的共乘頁面查看
            </Button>
          </Box>
        )}

          <hr />
          <Grid container spacing={2}>
            {/* <Grid item xs={12} md={6}>
              <Typography variant="h5">Select Date and Time</Typography>
            </Grid> */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-tw">
                <DateTimePicker
                  label="選擇日期和時間"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e)}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <TextField
              required={true}
              label="共乘金額"
              variant="outlined"
              fullWidth
              margin="normal"
              value={acc_payable}
              onChange={(e) => setAcc_Payable(e.target.value)}
            />
          </Grid> */}
          <hr />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                aria-required={true}
                label="出發縣市"
                variant="outlined"
                fullWidth
                margin="normal"
                value={startCity}
                onChange={(e) => setStartCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                aria-required={true}
                label="出發地點"
                variant="outlined"
                fullWidth
                margin="normal"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                aria-required={true}
                label="到達縣市"
                variant="outlined"
                fullWidth
                margin="normal"
                value={endCity}
                onChange={(e) => setEndCity(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required={true}
                aria-required={true}
                label="到達地點"
                variant="outlined"
                fullWidth
                margin="normal"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={12} md={12}>
              <Button
                color="secondary" 
                variant="contained"  
                onClick={tomap}
              >
                選擇停靠地點
              </Button>
            </Grid> */}
            
            <Grid item xs={12} md={6}>
              <TextField
                select
                required={true}
                aria-required={true}
                label="開放空位數"
                variant="outlined"
                fullWidth
                margin="normal"
                value={maxAvailableSeat}
                onChange={(e) => setMaxAvailableSeat(e.target.value)}
              >
                {
                  [2,3,4,5,6,7].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))
                }
              </TextField>
              
                
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                required={true}
                aria-required={true}
                label="發起人乘客數"
                variant="outlined"
                fullWidth
                margin="normal"
                value={attendantNumber}
                onChange={(e) => setAttendantNumber(e.target.value)}
              >
                {
                  [2,3,4,5,6,7].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num}
                    </MenuItem>
                  ))
                }
              </TextField>
              
                
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="共乘方式 (自駕/叫車)"
                variant="outlined"
                fullWidth
                margin="normal"
                value={isSelfDrive}
                onChange={(e) => setIsSelfDrive(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">🚗</InputAdornment>
                  ),
                }}
              >
                {driveOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          
  

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Button 
              // disabled={launchResult.hasOwnProperty("eventId")}
               variant="contained" color="primary" type="submit">
                發起共乘
              </Button>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                onClick={onClearClick} 
                color="secondary" 
                variant="contained" 
              >
                重新填寫
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* {launchResult.detail === '無駕照' && <p>您還沒認證駕照,請改用非自駕或認證駕照</p>}
              { launchResult.detail === '日期輸入錯誤' && <p> 日期輸入錯誤, 請重新選取</p>} */}
              { isLaunchSuccess &&
                <Alert severity="success">
                  發起成功 聊天室ID為 : { launchResult?.data }
                </Alert>
              }
            </Grid>
          </Grid>
        </form>
        
      </Paper>
    </Container>
  )
};

export default CarpoolLaunch;



