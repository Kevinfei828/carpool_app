import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import CarpoolCard from "./CarpoolCard";
import { useAuth } from "../../auth/AuthContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {formatSearchData} from "../../utils/formatSearchData";

import {Link, useNavigate} from 'react-router-dom';

export const CarpoolSearch = () => {
  const { isLoaded, userToken } = useAuth();
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [selectedCarpool, setSelectedCarpool] = useState(null);

  const [startCity, setStartCity] = useState('');
  const [startLocation, setStartLocation] = useState('');
  const [endCity, setEndCity] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [userdata, setuserdata] = useState([]);
  
  const [currentDate, setCurrentDate] = useState(dayjs());
  
  const [currentPage, setCurrentPage] = useState(1); // 當前頁數
  const [itemsPerPage, setItemsPerPage] = useState(10); // 每頁顯示的條數
  const [isCurrentPageChange, setIsCurrentPageChange] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (isCurrentPageChange) {
      FindCarpool();
      setIsCurrentPageChange(false);
    }
    
  }, [currentPage]);

  const FindCarpool = () => {
    const url = "http://localhost:8080";
    //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
    let url_find = url + "/event/search";
    const params = [];

    if (startCity) {
        params.push(`startCity=${encodeURIComponent(startCity)}`);
    }
    if (startLocation) {
        params.push(`startLocation=${encodeURIComponent(startLocation)}`);
    }
    if (endCity) {
        params.push(`endCity=${encodeURIComponent(endCity)}`);
    }
    if (endLocation) {
        params.push(`endLocation=${encodeURIComponent(endLocation)}`);
    }

    params.push(`page=${encodeURIComponent(currentPage)}`);
    params.push(`pageSize=${encodeURIComponent(itemsPerPage)}`);

    if (params.length > 0) {
        url_find += "?" + params.join("&");
    }

    try {

      fetch(url_find, {
        method: "GET",
        headers: new Headers({
          // 'Authorization': `Bearer ${userToken.access_token}`,
          'Authorization': userToken.access_token,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.result !== "None" && Object.keys(data.data).length > 0) {
            const formattedData = formatSearchData(data.data);
            formattedData.filter((item) =>
              dayjs(item.startTime).isAfter(currentDate)
            );
            console.log(formattedData);

            setuserdata(formattedData);
          } else {
            setuserdata(data);
          }

        })
      } catch (error) {
        alert(error);
      }
  };

  const onSearchClick = () => {
    setIsSearchClicked(true);
    setCurrentPage(1); // 重置到第一頁
    setIsCurrentPageChange(true);
    FindCarpool();
  };

  const renderSearchResult = () => {
    if (userdata.length > 0) {
      return userdata.map((item) => (
        <Box key={item.id} mt={1}>
          <Stack>
            <CarpoolCard
              item={item}
              cardType={item.attendantId.includes(userToken.user_id) ? "Joined" : "Active"}                
              selectedCarpool={selectedCarpool}
              onSelect={() => setSelectedCarpool(item)}
            ></CarpoolCard>
          </Stack>
        </Box>
      ));
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
    setIsCurrentPageChange(true);
    // FindCarpool();
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
    setIsCurrentPageChange(true);
    // FindCarpool();
  };

  return (
    <Container style={{ marginTop: 20 }}>
      <Paper elevation={3} className="search-container" style={{ padding: 20 }}>
        <Typography variant="h4" style={{ marginBottom: 20 }}>
          搜尋共乘
          使用者: {userToken ? userToken.user_display_name : "未登入"}
        </Typography>
        <Divider />
        <Grid container spacing={2} className="search-form">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="出發縣市"
              onChange={(e) => setStartCity(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">🚗</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="出發地點"
              onChange={(e) => setStartLocation(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">🚗</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="到達縣市"
              onChange={(e) => setEndCity(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">🚗</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="到達地點"
              onChange={(e) => setEndLocation(e.target.value)}
              InputProps={{
                autoComplete: 'off',
                startAdornment: (
                  <InputAdornment position="start">🚕</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="日期和時間"
                value={currentDate}
                onChange={(date) => setCurrentDate(date)}
                renderInput={(props) => (
                  <TextField
                    {...props}
                    fullWidth
                    placeholder="日期和時間"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">📅</InputAdornment>
                      ),
                    }}
                  />
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
        <hr />
        
        {/* {isSearchClicked && userdata.length > 0 && renderSearchResult()} */}
        
        <Box mt={3} display="flex" justifyContent="space-between" alignItems="center">
          <Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // 重置為第一頁
              setIsCurrentPageChange(true);
            }}
          >
            {[10, 20, 50, 100].map((num) => (
              <MenuItem key={num} value={num}>
                每頁顯示 {num} 筆
              </MenuItem>
            ))}
          </Select>
        </Box>

        {isSearchClicked && userdata.length === 0 && (
          <Box mt={2}>
            <Typography>🚗沒有搜尋結果，更換條件查查看吧!🚗</Typography>
          </Box>
        )}

        {renderSearchResult()}

        <Box mt={3} display="flex" justifyContent="center">
          {currentPage > 1 && (
            <Button variant="contained" onClick={handlePreviousPage}>
              上一頁
            </Button>
          )}
          {userdata.length === itemsPerPage && (
            <Button variant="contained" onClick={handleNextPage} style={{ marginLeft: "10px" }}>
              下一頁
            </Button>
          )}
        </Box>
      </Paper>

    </Container>
  );
};

export default CarpoolSearch;
