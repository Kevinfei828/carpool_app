import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Grid } from "@mui/material";
import { useNotification } from "./NotificationContext";
import { useAuth } from "../../auth/AuthContext";

export const NotificationPage = () => {
  const { notifications, setNotifications, unreadCount, addNotification, markAsRead, notificationHandler} = useNotification();
  const { isLoading, userToken } = useAuth();
  
  useEffect(() => {
    fetchNotifications();
    markAsRead();  // 點開通知頁面=已讀所有通知
  }, []);

  // useEffect(() => {
  //     if (notifications.length > 0) {
  //         setNotifications((prevMessages) => 
  //             {return [...prevMessages, ...receivedMessage];
  //         })
        
  //     }
  
  //   }, [notifications]);

  const notificationBaseURL = "http://localhost:8080/notifications";

  const fetchNotifications = async () => {
    try {
      const getAllNotificationURL = notificationBaseURL + `/user/${userToken.user_id}`;
      const response = await fetch(
        getAllNotificationURL, {
          method: "get",
          withCredentials: true,
          credentials: "include",
          headers: new Headers({
            Authorization: userToken.access_token,
          })
      });
      const data = await response.json();
      setNotifications(data);

    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const deleteNotificationURL = notificationBaseURL + `/${notificationId}`;
      const response = await fetch(
        deleteNotificationURL, {
          method: "delete",
          withCredentials: true,
          credentials: "include",
          headers: new Headers({
            Authorization: userToken.access_token,
          })
      });

      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        通知中心
      </Typography>

      {notifications.length > 0 ? (
        <Grid container spacing={2}>
          {notifications.map((notification) => {
            const date = new Date(notification.createTime);
            const formattedTime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

            return (
              <Grid item xs={12} key={notification.id}>
                <Card
                  sx={{
                    width: "100%",
                    backgroundColor: notification.read ? "#f5f5f5" : "#e3f2fd",
                    boxShadow: notification.read ? "none" : "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {notification.title || "通知"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {formattedTime}
                    </Typography>
                    <Typography variant="body1" mt={1}>
                      {notification.content}
                    </Typography>
                    <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                      {/* <Button
                        variant="contained"
                        color="primary"
                        onClick={() => markAsRead(notification.id)}
                        disabled={notification.read}
                      >
                        標記為已讀
                      </Button> */}
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        刪除
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="body1" color="textSecondary">
          目前沒有新通知。
        </Typography>
      )}
    </Box>
  );
};

export default NotificationPage;
