// import React, { useEffect, useState, useRef } from "react";
// import { createRoot } from "react-dom/client";
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import { createCustomEqual } from "fast-equals";
// import {
//     Typography,
//     TextField,
//     Button,
//     Container,
//     FormControl,
//     Input,
//     Select,
//     MenuItem,
//     Grid,
//     Box, Paper, Divider, InputAdornment, InputLabel, Alert,
//   } from '@mui/material';

// import {useAuth} from "../../auth/AuthContext";

// export const Distance = ({
    

// }) => {
//     const {isLoading, userToken} = useAuth();
//     const url = 'http://localhost:8080';
//     // const url = 'http://localhost:8000';
//     //const url = 'https://carpool-service-test-cvklf2agbq-de.a.run.app/'

//     const [endedEvents, setEndedEvents] = useState([]);
//     const fetchEndedEvents = async () => {
//         if (!isLoading && userToken) {
//           try {
//             const userID = userToken.user_id;
//             const searchEndedEvent = url+`/search-joined-event?user_id=${userID}`;
//             const response = await fetch(searchEndedEvent, {
//               method: 'get',
//               withCredentials: true,
//               credentials: 'include',
//               headers: new Headers({
//                 'Authorization': `Bearer ${userToken.access_token}`,
//               })
//             });
//             const data = await response.json();
    
//             if (data.result !== "None" && Object.keys(data).length > 0) {
//               const formattedData = data.map(item => ({
//                 id: item.id,
//                 initiator: item.initiator.toString(),
//                 route: item.location.split(',').filter(part => part.trim() !== ''),
//                 num: item.number_of_people,
//                 time: item.start_time,
//                 is_ended: item.end_time != null,
//                 carpool_attribute: item.is_self_drive ? "發起人自駕" : "非自駕",
//                 status: item.status,
//                 available_seats: item.available_seats,
//               }));
//               setEndedEvents(formattedData);
//             } else if (data.result === "None") {
//               setEndedEvents([]);
//             } else {
//               setEndedEvents(mockResult);
//             }
//           } catch (error) {
//             console.error('Error fetching event information:', error);
//             // Handle error here, set endedEvents to empty or show a message
//             setEndedEvents([]);
//           }
//         }
//       };




    
//   //Distance Matrix
//   // const distservice = new window.google.maps.DistanceMatrixService();

//   // const distrequest = {
//   //   origins: [origin1, origin2],
//   //   destinations: [destinationA, destinationB],
//   //   travelMode: google.maps.TravelMode.DRIVING,
//   //   unitSystem: google.maps.UnitSystem.METRIC,
//   //   avoidHighways: false,
//   //   avoidTolls: false,   
//   // };





// }