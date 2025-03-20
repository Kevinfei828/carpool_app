import 'bootstrap/dist/css/bootstrap.min.css';
// UseEffect , Router : Loader,Action
import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {RootLayout} from './layouts/RootLayout';
// Carpool
import {CarpoolSearchUI} from './pages/carpool/CarpoolSearchUI';
import {CarpoolSearch} from './pages/carpool/CarpoolSearch';
import {CarpoolLaunch} from './pages/carpool/CarpoolLaunch';
import {CarpoolJoined} from './pages/carpool/CarpoolJoined';
import {CarpoolEnded} from './pages/carpool/CarpoolEnded';
import {Carpooljoinevent} from './pages/carpool/CarpoolJoinEvent';
// import {Chatroom} from './chatroom/Chatroom';

// User
import {User} from './pages/user/User'
import {Register} from "./pages/user/Register"
import {Login} from "./pages/user/Login"
import {UploadLicense} from "./pages/user/UploadLicense"
//
import {TopUp} from './pages/wallet/TopUp'
import {Confirm} from './pages/wallet/Confirm'
// Auth
import {AuthProvider} from "./auth/AuthContext";
//chatroom 
import {Chatroom} from './chatroom_self/Chatroom';

// notification
import {NotificationPage} from './pages/Notification/NotificationPage';


import { MapService } from './pages/map/Map';
import { NotificationProvider } from './pages/Notification/NotificationContext';
import { WebSocketProvider } from './webSocket/webSocketProvider';
import { MessageProvider } from './chatroom_self/MessageContext';



const router = createBrowserRouter([
  {
    path: '/', element: <RootLayout/>, children: [
      {path: '/search', element: <CarpoolSearch/>},
      //{path: '/searchUI', element: <CarpoolSearchUI/>},
      {path: '/launch', element: <CarpoolLaunch/>},
      {path: '/joined', element: <CarpoolJoined/>},
      {path: '/ended', element: <CarpoolEnded/>},
      {path: '/user', element: <User/>},
      {path: '/top-up', element: <TopUp/>},
      {path: '/Login', element: <Login />},
      {path: '/Register', element: <Register />},
      {path: '/upload', element: <UploadLicense />},
      {path: '/Confirm', element: <Confirm />},
      {path: '/Chatroom', element :<Chatroom/>},

      // {path: '/maps', element: <MapService/>},
      {path: '/notifications', element: <NotificationPage/>},
      
      {
        path: '/loginstate', element: <RootLayout/>, children: [
          {path: '/loginstate/search', element: <CarpoolSearch/>},
          {path: '/loginstate/launch', element: <CarpoolLaunch/>},
          {path: '/loginstate/joined', element: <CarpoolJoined/>},
          {path: '/loginstate/ended', element: <CarpoolEnded/>},
          {path: '/loginstate/:id', element: < Carpooljoinevent/>},
          {path: '/loginstate/Login', element: <Login />}

        ]
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider: 
    1. inside AuthContext.js, the login function shall save userInfo inside AuthContext component
       ... // call either api/log or api/token-check to get userID from localhost
       ... setUserInfo({ userID: userID})
    2. inside other component 
       ... import { useAuth } from './AuthContext';
       ... // inside component main
       ... const { userInfo, login, logout } = useAuth();
       ... // inside useEffect()
       ... ... userID = userInfo.userID;
     */}
    
      <WebSocketProvider>
        <NotificationProvider>
          <AuthProvider>
            <MessageProvider>
              <RouterProvider router={router}/> 
            </MessageProvider>
          </AuthProvider>
        </NotificationProvider>
      </WebSocketProvider>
    
  </React.StrictMode>
);
