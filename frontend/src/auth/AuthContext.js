// AuthContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';
import {Cookies, useCookies} from 'react-cookie';
import { useWebSocket } from '../webSocket/webSocketProvider';
import { useNotification } from '../pages/Notification/NotificationContext';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['userToken']);
  
  const [isHandleLoginSuccess, setIsHandleLoginSuccess] = useState(false);
  const [eventIds, setEventIds] = useState([]);
  const {connected, connectWebSocket, subscribeToTopic, unsubscribeFromTopic, disconnectWebSocket} = useWebSocket();
  const {addNotification, notificationHandler} = useNotification();
  const [fetchEvent, setFetchEvent] = useState(false);
  const [handleLogout, setHandleLogOut] = useState(false);

  const url = 'http://localhost:8080';
  //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'


  // Check for the presence of the user token in cookies on mount
  useEffect(() => {
    const userId = cookies.user_id;
    const accessToken = cookies.access_token;

    if (userId && accessToken) {
      setUserToken({ user_id: userId, access_token: accessToken });
    } else {
      setUserToken(null);
    }
    setIsLoading(false);
  }, []);

  // 處理websocket
  useEffect(() => {
    const handleWebSocket = async () => {
      if (userToken && fetchEvent && !handleLogout) {
        try {
          await connectWebSocket();
          console.log('Connected to WebSocket successfully');

        } catch (error) {
          console.error('Error connecting to WebSocket or subscribing:', error);
          setIsHandleLoginSuccess(false);
        }
      }
    };

    handleWebSocket();
  }, [userToken, fetchEvent]);

  useEffect(() => {
    if (connected) {
      eventIds.map((event) =>
        subscribeToTopic(`/topic/event/notifications/${event.id}`, notificationHandler)
      )
      setIsHandleLoginSuccess(true);
    }

  }, [connected]);

  useEffect(() => {
    if (userToken && !fetchEvent) {
      const url = 'http://localhost:8080';
      const urlGetAllEventIds = url + `/event/list?userId=${userToken.user_id}`;


      fetch(urlGetAllEventIds, {
        method: 'GET',
        headers: {
          // 'Authorization': `Bearer ${userToken.access_token}`,
          'Authorization': userToken.access_token,
          'accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then((response) => response.json())
      .then((responseText) => {
        console.log(responseText.data);
        setEventIds(responseText.data);
        setFetchEvent(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }}, [userToken, fetchEvent]);

  useEffect(() => {
    if (fetchEvent && handleLogout) {
      setUserToken(null);
      setHandleLogOut(false);

      // 取消訂閱所有 event 的通知
      eventIds.forEach((event) => {
        unsubscribeFromTopic(`/topic/event/notifications/${event.id}`);
      });

      disconnectWebSocket();

      removeCookie('user_id', { path: '/' });
      removeCookie('access_token', { path: '/' });

      setEventIds([]);
      setFetchEvent(false);
      setIsHandleLoginSuccess(false);
    }

  }, [fetchEvent]);


  const login = async (phone, verification_code) => {
    try {
      let loginForm = {
        'phone': phone,
        'verifyCode': verification_code
      }
      // Make a request to login API endpoint
      const response = await fetch(url + '/login', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginForm),
      });
      console.log(response);

      // Check if the request was successful
      if (!response.ok) {
        const errorResponse = await response.json(); // Assuming the server returns error details as JSON
        const data = errorResponse.message;

        if(typeof data === 'string'){
          // throw new Error(`${errorResponse.code}\n${data}`);
          // throw new Error(data);
          alert(data);

        } else if (Array.isArray(data)) {
          const errorLines = data.map(item => `${item.type}: ${item.msg}`)
          throw new Error(`${response.status}\n` + errorLines.join('\n'));
        } else {
          throw new Error(errorResponse.error)
        }
      } else {
        setIsLoading(true);
        const data = await response.json();
        const sessionToken = data.data.token;

        if (sessionToken !== null) {
          // path: 設定cookie有效範圍
          setCookie('user_id', data.data.userId, { path: '/' });
          setCookie('access_token', sessionToken, { path: '/' });

          setUserToken({
            user_id: data.data.userId,
            access_token: sessionToken
          });
        } else {
          throw new Error('No session token received from the localhost.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      throw error
    }
  };

  const logout = () => {
    setFetchEvent(false);
    setHandleLogOut(true);
  };

  return (
    <AuthContext.Provider value={{userToken, isHandleLoginSuccess, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};