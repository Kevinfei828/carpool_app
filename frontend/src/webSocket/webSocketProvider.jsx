import React, { createContext, useContext, useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

// Create the WebSocket context
const WebSocketContext = createContext();

// Create the WebSocket provider component
export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);  // WebSocket Client instance
  const [connected, setConnected] = useState(false);    // Connection status
  const [subscriptions, setSubscriptions] = useState({}); // Subscriptions tracked by topic

  // Connect to WebSocket server
  const connectWebSocket = () => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      debug: (str) => console.log(str),
      onConnect: () => {
        console.log("Connected to WebSocket");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
        setConnected(false);
      },
    });

    client.activate();
    setStompClient(client);
  };


  // Disconnect from WebSocket server
  const disconnectWebSocket = () => {
    if (stompClient && stompClient.connected) {
      stompClient.deactivate();
      setConnected(false);
    }
  };

  // Subscribe to a topic
  const subscribeToTopic = (topic, callback) => {
    if (stompClient && stompClient.connected) {

      // Subscribe only if it's not already subscribed to this topic
      if (!subscriptions[topic]) {
        const subscription = stompClient.subscribe(topic, callback);
        setSubscriptions((prevSubscriptions) => ({
          ...prevSubscriptions,
          [topic]: subscription,
        }));
        console.log(`Subscribed to: ${topic}`);
      }
    }
  };

  // Unsubscribe from a topic
  const unsubscribeFromTopic = (topic) => {
    const subscription = subscriptions[topic];
    if (subscription) {
      subscription.unsubscribe();
      setSubscriptions((prevSubscriptions) => {
        const newSubscriptions = { ...prevSubscriptions };
        delete newSubscriptions[topic];
        return newSubscriptions;
      });
      console.log(`Unsubscribed from: ${topic}`);
    }
  };

  // Cleanup WebSocket connection and subscriptions when unmounting
//   useEffect(() => {
//     return () => {
//       if (stompClient && stompClient.connected) {
//         // Unsubscribe all topics before disconnecting
//         Object.keys(subscriptions).forEach((topic) => unsubscribeFromTopic(topic));
//         stompClient.deactivate();
//       }
//     };
//   }, [stompClient, subscriptions]);

  return (
    <WebSocketContext.Provider
      value={{
        connectWebSocket,
        disconnectWebSocket,
        subscribeToTopic,
        unsubscribeFromTopic,
        connected,
        stompClient,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};


export const useWebSocket = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
      throw new Error("useWebSocket must be used within a WebSocketProvider");
    }
    return context;
  };