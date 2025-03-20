import React, {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useAuth} from "../../auth/AuthContext";

import { useWebSocket } from '../../webSocket/webSocketProvider';
import { useNotification } from '../Notification/NotificationContext';
import { useMessage } from '../../chatroom_self/MessageContext';

import { Box, Button, TextField, Typography, Modal, Grid } from "@mui/material";

export const Carpooljoinevent = ({itemid, initiatorID}) => {
  

  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'
  const url = 'http://localhost:8080';
  const url_get_usr_info = url+"/get-user-info/";
  const url_join_the_carpool = url+"/event/join"
  // const url_get_usr_info = "http://localhost:8000/get-user-info/";
  // const url_join_the_carpool = "http://localhost:8000/join-the-carpool"

  const { userToken } = useAuth();
  const {connectWebSocket, subscribeToTopic, unsubscribeFromTopic} = useWebSocket();
  const {addNotification, notificationHandler} = useNotification();
  const {messages, messageHandler} = useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinSuccess, setIsJoinSuccess] = useState(false); 

  const [joiningData, setJoiningData] = useState({
    start_city: "",
    end_city: "",
    start_loc: "",
    end_loc: "",
    joining_time: "",
    attendant_number: 1,
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [chatroomId, setChatroomId] = useState("null");

  useEffect(() => {
    if (isJoinSuccess) {
    // subscribe to event queue
      subscribeToTopic(`/topic/event/notifications/${itemid}`, notificationHandler);
      // subscribeToTopic(`/topic/chatroom/${chatroomId}`, messageHandler);
    }

  }, [isJoinSuccess]);

    // Handles input changes in the modal form
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setJoiningData((prev) => ({ ...prev, [name]: value }));
    };
  
    // Opens the modal
    const handleOpenModal = () => {
      setIsModalOpen(true);
    };
  
    // Closes the modal
    const handleCloseModal = () => {
      setIsModalOpen(false);
      setResponseMessage(""); // Clear previous messages when closing
    };
  
    // Submits the join request
    const handleSubmit = () => {
      const target = {
        userId: userToken.user_id,
        eventId: itemid,
        getOnCity: joiningData.start_city,
        getOffCity: joiningData.end_city,
        getOnLocation: joiningData.start_loc,
        getOffLocation: joiningData.end_loc,
        getOnTime: joiningData.joining_time,
        attendantNumber: joiningData.attendant_number,
      };
      console.log(target);
  
      fetch(url_join_the_carpool, {
        method: "POST",
        headers: new Headers({
          // Authorization: `Bearer ${userToken.access_token}`,
          'Authorization': userToken.access_token,
          'accept': "application/json",
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(target),
      })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("加入行程失敗");
        }
      })
      .then((responseText) => {

        setResponseMessage(responseText.detail || "成功加入行程");
        setIsJoinSuccess(true);
        setChatroomId(responseText.data);
        setIsModalOpen(false); // Close modal after successful submission

      })
      .catch((error) => {
        setResponseMessage(error.message || "加入行程失敗");
        console.error(error);
        setIsModalOpen(false);
      });
    };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{
          marginBottom: "16px",
        }}
      >
        加入共乘
      </Button>

      {/* Response Message */}
      {responseMessage && (
        <Typography
          variant="body1"
          color={responseMessage.includes("成功") ? "green" : "red"}
          sx={{
            marginTop: "16px",
          }}
        >
          {responseMessage}
        </Typography>
      )}

      {/* {isJoinSuccess && (
        <Notification userId={userToken.user_id} eventId={itemid} />
      )} */}

      {/* 設定notification的websocket */}
      {/* {showNotification && (
        <Notification userId={userToken.user_id} eventId={itemid} />
      )} */}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="join-event-modal"
        aria-describedby="join-event-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "16px",
          }}
        >
          <Typography
            id="join-event-modal"
            variant="h6"
            component="h2"
            sx={{
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            加入共乘
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="上車縣市"
                name="start_city"
                fullWidth
                value={joiningData.start_city}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="上車地點"
                name="start_loc"
                fullWidth
                value={joiningData.start_loc}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="下車縣市"
                name="end_city"
                fullWidth
                value={joiningData.end_city}
                onChange={handleInputChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="下車地點"
                name="end_loc"
                fullWidth
                value={joiningData.end_loc}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="加入時間"
                type="datetime-local"
                name="joining_time"
                fullWidth
                value={joiningData.joining_time}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="乘客數量"
                type="number"
                name="attendant_number"
                fullWidth
                value={joiningData.attendant_number}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "16px",
            }}
          >
            <Button variant="outlined" onClick={handleCloseModal}>
              取消
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              確定
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default Carpooljoinevent;