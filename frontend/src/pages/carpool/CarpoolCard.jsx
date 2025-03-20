import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  Card, CardContent, Checkbox,
  Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Divider, FormControlLabel,
  Grid, TextField,
  Typography,
} from '@mui/material';
import Carpooljoinevent from "./CarpoolJoinEvent";
import {useAuth} from "../../auth/AuthContext";
import {useNavigate} from "react-router-dom";
import {Nav} from "react-bootstrap";
import dayjs from "dayjs";

const CarpoolCard = ({item, cardType, selectedCarpool, onSelect}) => {
  const {userToken} = useAuth();
  const navigate = useNavigate();
  
  const [payable, setPayable] = useState(-1);
  const [wallet, setWallet] = useState(-1);
  const [useCarpoolMoney, setUseCarpoolMoney] = useState(false);
  // Depends to show Confirm Dialog
  const [dismissConfirm, setDismissConfirm] = useState(false);
  const [endConfirm, setEndConfirm] = useState(false);
  const [leaveConfirm, setLeaveConfirm] = useState(false);
  const [payConfirm, setPayConfirm] = useState(false);
  const [Chatroomconfirm,setChatRoom] = useState(false);

  const url = 'http://localhost:8080';
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const urlDismiss = url+'/event/dismiss';
  const urlEnd = url+'/event/complete';
  const urlLeave = url+'/event/leave';
  const urlPayable = url+`/payable`;
  const urlPayment = url+`/payment/${userToken.user_id}?eventid=${item.id}`;
  

  
  // useEffect(() => {
  //   if( item.status === "end" ){
  //     fetchPayable();
  //   }

  // }, []);
  


  // fetch chatroom
  function fetchChatroom(id){
    console.log("To chatroom");
    navigate('/Chatroom',{ state: { eventId: id  }});
  }
  
  function fetchPayable() {
    fetch(urlPayment, {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.hasOwnProperty('payable')) {
          setPayable(responseText.payable);
          setWallet(responseText.carpool_money);
        } else {
          switch (responseText.detail) {
            case "無此共乘事件":
              alert("無法載入共乘資料：無此共乘事件");
              break;
            case "使用者無此權限":
              alert("使用者沒有查詢其他人payment權限");
              break;
            case "無此使用者":
              alert("無用戶資料，請重新登入");
              navigate('/ended');
              break;
            case "無此付款欄位":
              setWallet('無此付款欄位');
              break;
            default:
              alert("CarpoolEnd fetchWallet error");
          }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
  }
  function handleDismiss() {
    fetch(urlDismiss, {
      method: 'POST',
      headers: {
        // 'Authorization': `Bearer ${userToken.access_token}`,
        'Authorization': userToken.access_token,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'eventId': item.id, 'userId': userToken.user_id}),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.code == 0) {
          alert(responseText.data);
          navigate('/ended');
        // } else {
        //   switch (responseText.detail) {
        //     case "Event已結束":
        //       alert("此共乘行程已經結束");
        //       break;
        //     case "使用者無此權限":
        //       alert("您不是此共乘發起者，無法取消共乘");
        //       break;
        //   }
        // }
      }}).catch((error) => {
        alert(error);
        console.error(error);
      });
    setDismissConfirm(false);
  }



  
  function handleEnd() {
    fetch(urlEnd, {
      method: 'PUT',
      headers: {
        // 'Authorization': `Bearer ${userToken.access_token}`,
        'Authorization': userToken.access_token,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'userId': userToken.user_id, 'eventId': item.id}),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.code == 0) {
          alert(responseText.data);
          navigate('/ended');
        }
        // } else {
        //   switch (responseText.detail) {
        //     case "Event已結束":
        //       alert("此共乘行程已經結束");
        //       break;
        //     case "使用者無此權限":
        //       alert("您不是此共乘發起者，無法取消共乘");
        //       break;
        //     case "":
        //       alert(`responseText.detail:${responseText.detail}`);
        //       navigate('/ended');
        //   }
        // }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
    setEndConfirm(false);
  }

  function handleLeave() {
    fetch(urlLeave, {
      method: 'DELETE',
      headers: {
        // 'Authorization': `Bearer ${userToken.access_token}`,
        'Authorization': userToken.access_token,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({'eventId': item.id, 'userId': userToken.user_id}),
    }).then((response) => response.json())
      .then((response) => {
        if (response.code == 0) {
          alert(response.data);
          navigate('/ended');
        // } else {
        //   switch (responseText.detail) {
        //     case "Event已結束":
        //       alert("此共乘行程已經結束");
        //       break;
        //     case "使用者無此權限":
        //       alert("您不是此共乘發起者，無法取消共乘");
        //       break;
        //     case "此user不在event":
        //       alert("您不在此共乘裡");
        //       break;
        //   }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
    setLeaveConfirm(false);
  }

  function handlePay() {
    fetch(urlPayable+`/?userid=${userToken.user_id}&eventid=${item.id}&useCarpoolmoney=${useCarpoolMoney}` , {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userToken.access_token}`,
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'userid':userToken.user_id,
        'eventid': item.id,
        'useCarpoolmoney': useCarpoolMoney,
      }),
    }).then((response) => response.json())
      .then((responseText) => {
        if (responseText.payment_url) {
          window.location.replace(responseText.payment_url);
          
        } else {
          switch (responseText.detail) {
            case "使用者無此權限":
              alert("使用者沒有payable權限");
              break;
            case "無此使用者":
              alert("無用戶資料，請重新登入");
              navigate('/ended');
              break;
            case "無此共乘事件":
              alert("無法載入共乘資料：無此共乘事件");
              break;
            case "無此付款欄位":
              alert("無此付款欄位");
              break;
            case "此用戶已完成付款":
              alert("此用戶已完成付款");
              break;
            case "此用戶有未繳清款項":
              alert("此用戶有未繳清款項");
              break;
          }
        }
      }).catch((error) => {
      alert(error);
      console.error(error);
    });
    setPayConfirm(false);
  }

  const renderActionButton = () => {
    switch (cardType) {
      case 'Active':
        return (
          <Box p={2}>
            {/* <Grid container spacing={2} alignItems="center" marginBottom='20px'>
              <Grid item>
                <Button variant="contained" color="primary" onClick={onSelect}>
                  加入共乘
                </Button>
              </Grid>
            </Grid>
            <Divider /> */}
            <Grid container spacing={2} alignItems="center" marginTop='1px'>
              <Grid item>
                <Carpooljoinevent
                  itemid={item.id}  // event id
                  userid={item.initiator}
                  hasJoinedEvent={userToken.user_id }
                  // route={}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 'Joined':
        return (
          <Box p={2}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button 
                variant="contained" 
                color="primary"
                onClick={() => fetchChatroom(item.id)} 
                autoFocus
                  >
                  聊天室
                </Button>
              </Grid>
                { item.initiatorId == userToken.user_id? (
                  <React.Fragment>
                    {!dayjs(item.time).isBefore(dayjs()) && (
                      <Grid item>
                        <Button
                          variant="contained"
                          color="warning"
                          disabled={dayjs(item.time).isBefore(dayjs())}
                          onClick={() => setDismissConfirm(true)}
                        >
                          解散共乘
                        </Button>
                      </Grid>
                    )}
                    <Dialog
                      open={dismissConfirm}
                      onClose={() => setDismissConfirm(false)}
                      aria-labelledby="alert-dismiss-title"
                    >
                      <DialogTitle id="alert-dismiss-title">
                        {"確定解散共乘"}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={() => setDismissConfirm(false)}>取消</Button>
                        <Button onClick={handleDismiss} autoFocus>
                          確定
                        </Button>
                      </DialogActions>
                    </Dialog>
                    { dayjs(item.time).isBefore(dayjs()) && (
                      <Grid item>
                        <Button
                          variant="contained"
                          color="error"
                          disabled={!dayjs(item.time).isBefore(dayjs())}
                          onClick={() => setEndConfirm(true)}
                        >
                          結束共乘
                        </Button>
                      </Grid>
                    )}
                    <Dialog
                      open={endConfirm}
                      onClose={() => setEndConfirm(false)}
                      aria-labelledby="alert-end-title"
                    >
                      <DialogTitle id="alert-end-title">
                        {"確定結束共乘"}
                      </DialogTitle>
                      <DialogActions>
                        <Button onClick={() => setEndConfirm(false)}>取消</Button>
                        <Button onClick={handleEnd} autoFocus>
                          確定
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </React.Fragment>
                  ):(
                    <React.Fragment>
                      <Grid item>
                        <Button variant="contained" color="error" onClick={() => setLeaveConfirm(true)}>
                          退出共乘
                        </Button>
                      </Grid>
                      <Dialog
                        open={leaveConfirm}
                        onClose={() => setLeaveConfirm(false)}
                        aria-labelledby="alert-leave-title"
                      >
                        <DialogTitle id="alert-leave-title">
                          {"確定結束共乘"}
                        </DialogTitle>
                        <DialogActions>
                          <Button onClick={() => setLeaveConfirm(false)}>取消</Button>
                          <Button onClick={handleLeave} autoFocus>
                            確定
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </React.Fragment>
                  )
                }
            </Grid>
          </Box>
        );
      case 'Ended':
        if (item.status === "end")
          return (
            <Box p={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Button variant="contained" color="primary" onClick={() => setPayConfirm(true)}>
                    我要付款共乘
                  </Button>
                  <Dialog
                    open={payConfirm}
                    onClose={() => setLeaveConfirm(false)}
                    aria-labelledby="alert-leave-title"
                  >
                    <DialogTitle id="alert-leave-title">
                      {"確定付款共乘"}
                    </DialogTitle>
                    <DialogContent>
                      <Typography>
                        預計付款金額：{useCarpoolMoney?payable-wallet:payable}
                      </Typography>
                      <FormControlLabel
                        label="使用 Carpool-Money"
                        control={
                        <Checkbox
                          checked={useCarpoolMoney}
                          onChange={(e) => {setUseCarpoolMoney(e.target.checked);}}
                        />
                      } 
                      />
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setPayConfirm(false)}>取消</Button>
                      <Button onClick={handlePay} autoFocus>
                        確定
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
                <Grid item>
                  <Typography sx={{color: 'red'}}>
                    共乘費用(Carpool-Money): {payable}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          );
        else if (item.status === "dismiss")
          return (
            <Box p={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Typography sx={{color: 'red'}}>
                    此共乘已解散
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          );
      default:
        return null;
    }
  };

  return (
<Card
  key={item.id}
  variant="outlined"
  sx={{
    borderRadius: "16px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    marginBottom: "16px",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.15)",
    },
  }}
>
  <CardContent>
    {/* Header Section */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: "#3f51b5",
        }}
      >
        {`共乘 ID: ${item.id}`}
      </Typography>
      {cardType === 'Active' && (<Typography
        sx={{
          backgroundColor: item.currentAvailableSeat > 0 ? "#4caf50" : "#f44336",
          color: "#fff",
          fontSize: "12px",
          fontWeight: "bold",
          padding: "4px 8px",
          borderRadius: "8px",
        }}
      >
      {item.currentAvailableSeat > 0 ? "有空位" : "已滿"}
      </Typography>
      )}
    </Box>

    <Divider sx={{ marginBottom: "16px" }} />

    {/* Main Content */}
    <Grid container spacing={2}>
      {/* Column 1 */}
      <Grid item xs={6}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <strong>發起人:</strong> {item.initiator}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <strong>空位數:</strong> {item.currentAvailableSeat}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <strong>共乘方式:</strong> {item.carpool_attribute}
        </Typography>
      </Grid>

      {/* Column 2 */}
      <Grid item xs={6}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <strong>開始時間:</strong> {item.time}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <strong>出發縣市:</strong> {item.startCity}
        </Typography>
        <Typography
          sx={{
            fontSize: "14px",
            color: "#555",
            marginBottom: "8px",
          }}
        >
          <strong>到達縣市:</strong> {item.endCity}
        </Typography>
      </Grid>
    </Grid>

    <Divider sx={{ marginY: "16px" }} />

    {/* Start Locations */}
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: "bold",
        color: "#3f51b5",
        marginBottom: "8px",
      }}
    >
      中途停靠點(上車)
    </Typography>
    <Box
      component="ul"
      sx={{
        listStyleType: "disc",
        paddingLeft: "16px",
        marginBottom: "16px",
        fontSize: "14px",
        color: "#555",
      }}
    >
      {item.attendantStartLocations.length > 0 ? (
      item.attendantStartLocations.map((location, index) => (
        <li key={`start-${index}`}>{location}</li>
        ))
      ) : (
        <li>無</li>
      )}
      
    </Box>

    {/* End Locations */}
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: "bold",
        color: "#3f51b5",
        marginBottom: "8px",
      }}
    >
      中途停靠點(下車)
    </Typography>
    <Box
      component="ul"
      sx={{
        listStyleType: "disc",
        paddingLeft: "16px",
        fontSize: "14px",
        color: "#555",
      }}
    >
      {item.attendantEndLocations.length > 0 ? (
        item.attendantEndLocations.map((location, index) => (
          <li key={`end-${index}`}>{location}</li>
        ))
      ) : (
        <li>無</li>
      )}
    </Box>
  </CardContent>

  <Divider sx={{ marginY: "16px" }} />

  {/* Footer Action */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: "8px",
    }}
  >
    {renderActionButton()}
  </Box>
</Card>

  );
};

export default CarpoolCard;
