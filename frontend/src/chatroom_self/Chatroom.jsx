import React, { useState, useEffect } from "react";
import { Box, Typography, List, ListItem, ListItemText, TextField, Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useNotification } from "../pages/Notification/NotificationContext";
import { useMessage } from "./MessageContext";
import { useWebSocket } from "../webSocket/webSocketProvider";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export const Chatroom = () => {
  const { state } = useLocation();
  const { isLoading, userToken } = useAuth();
  const carpoolId = state?.eventId; // Get carpool ID from navigation state
  const [users, setUsers] = useState([]);
  const [chatroom, setChatroom] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatroomMessages, setChatroomMessages] = useState([]);  // chatroom自己的messages

  const {messageHandler, receivedMessage, setReceivedMessage} = useMessage();  // new message
  const {connectWebSocket, stompClient, subscribeToTopic, unsubscribeFromTopic} = useWebSocket();

  useEffect(() => {
    // Set up WebSocket connection
    fetchUsers();
    fetchChatroom();
    // Fetch chat history
    fetchMessages();
  }, []);

  useEffect(() => {
    if (receivedMessage.length > 0) {
        setChatroomMessages((prevMessages) => 
            {return [...prevMessages, ...receivedMessage];
        })
        setReceivedMessage([]);
    }

  }, [receivedMessage]);

  useEffect(() => {
    // Filter messages based on chatroom ID when it becomes available
    if (chatroom.id) {
      subscribeToTopic(`/topic/chatroom/${chatroom.id}`, messageHandler);

      setChatroomMessages((prevMessages) =>
        prevMessages.filter((message) => message.chatroom?.id === chatroom.id)
      );

      return () => {
        unsubscribeFromTopic(`/topic/chatroom/${chatroom.id}`);
      };
    }
    
  }, [chatroom.id]);


  const eventBaseURL = "http://localhost:8080/event";
  const chatroomBaseURL = "http://localhost:8080/chatroom";
  const getEventUserURL = eventBaseURL + "/list/user";

  const fetchUsers = async () => {
    const userId = userToken.user_id;
    const getUsersURL = chatroomBaseURL + `/users?eventId=${carpoolId}`;
    fetch(getUsersURL, {
      method: "get",
      withCredentials: true,
      credentials: "include",
      headers: new Headers({
        Authorization: userToken.access_token,
      }),
    })
      .then((response) => response.json())
      .then((data) => setUsers(data.data))
      .catch((error) => console.error("Error fetching users:", error));
  };

  const fetchChatroom = () => {
    const userId = userToken.user_id;
    const getChatroomURL = chatroomBaseURL + `?eventId=${carpoolId}`;
    fetch(getChatroomURL, {
      method: "get",
      withCredentials: true,
      credentials: "include",
      headers: new Headers({
        Authorization: userToken.access_token,
      }),
    })
      .then((response) => response.json())
      .then((data) => setChatroom(data.data))
      .catch((error) => console.error("Error fetching chatroom:", error));
  };

   const fetchMessages = async () => {
    const url = chatroomBaseURL + `/message?eventId=${carpoolId}`;
    try {
      const response = await fetch(url, {
        method: "get",
        withCredentials: true,
        credentials: "include",
        headers: new Headers({
          Authorization: userToken.access_token,
        }),
      });
  
      const data = await response.json();
      console.log(data);
  
    //   const normalizedMessages = data.data.map((msg) => ({
    //     ...msg,
    //     chatroom: chatroom, // Associate with current chatroom
    //     sender: users.find((user) => user.id === msg.senderId), // Find sender details
    //   }));
  
      setChatroomMessages(data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = (message, chatroomId) => {
    stompClient.publish({
        destination: `/carpoolApp/chatroom/${chatroomId}`,
        body: JSON.stringify(message),
    });
  };


  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
      senderId: userToken.user_id,
      content: newMessage,
    //   timestamp: new Date().toISOString(),
    };

    sendMessage(messageData, chatroom.id);
    setNewMessage(""); // Clear the input field
  };

  return (
    <Box sx={{ padding: "16px" }}>
      <Typography variant="h5" gutterBottom>
        聊天室 - 共乘 ID: {carpoolId}
      </Typography>

      {/* Chatroom Users */}
      <Typography variant="subtitle1" gutterBottom>
        在線用戶
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.name} />
          </ListItem>
        ))}
      </List>

      {/* Chat History */}
      <Typography variant="subtitle1" gutterBottom>
        聊天記錄
      </Typography>
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "16px",
        }}
      >
        {chatroom?.id ? (
            chatroomMessages
            // .filter((message) => message.chatroom?.id === chatroom.id) // Filter messages by chatroom_id
            .map((message, index) => {
                // Convert the ISO timestamp to a JavaScript Date object
                const date = new Date(message.createTime);

                console.log(message);

                // Format the date and time as "YYYY/M/D H:mm"
                const formattedTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;

                // Check if the message is sent by the current user
                const isCurrentUser = message.sender?.id === userToken.user_id;

                return (
                <Box
                    key={index}
                    sx={{
                    display: "flex",
                    justifyContent: isCurrentUser ? "flex-end" : "flex-start", // Align messages based on sender
                    marginBottom: "8px",
                    }}
                >
                    <Box
                    sx={{
                        maxWidth: "70%",
                        padding: "8px",
                        borderRadius: "8px",
                        backgroundColor: isCurrentUser ? "#d1e7dd" : "#f8d7da", // Greenish for current user, reddish for others
                        color: isCurrentUser ? "#0f5132" : "#842029",
                    }}
                    >
                    <Typography variant="body2" color="textSecondary">
                        {formattedTime} {isCurrentUser ? "我" : message.sender?.name}:
                    </Typography>
                    <Typography>{message.content}</Typography>
                    </Box>
                </Box>
                );
            })
        ) : (
            <Typography variant="body2" color="textSecondary">
            正在加載聊天記錄...
            </Typography>
        )}


      </Box>

      {/* Send Message */}
      <Box display="flex" gap="8px">
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="輸入訊息"
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          發送
        </Button>
      </Box>
    </Box>
  );
};

export default Chatroom;
