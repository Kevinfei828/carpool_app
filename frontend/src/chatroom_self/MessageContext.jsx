import React, { useContext, useState, createContext } from "react";
import { useWebSocket } from "../webSocket/webSocketProvider";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  
    // const [stompClient, setStompClient] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState([]);  // 所有messages
    // const [connected, stompClient] = useWebSocket();

  // websocket
  const messageHandler = (message) => {
    // console.log("test");

    const newMessage = JSON.parse(message.body);
    // console.log(newMessage);

    setReceivedMessage((prevMessages) => {
        // Check if the message is already present to avoid duplicates
        if (!prevMessages.find((msg) => msg.id === newMessage.id)) {
            return [...prevMessages, newMessage];
        }
    })
  };
  
  
  return (
    <MessageContext.Provider
      value={{messageHandler, receivedMessage, setReceivedMessage}}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

