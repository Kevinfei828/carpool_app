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

// export const Route = ({
//     locations, 
//     form, 
//     map,
//     iscompleted,
// }) => {
//     const [DirRenderer, setDirRenderer] = useState(null);
//     const [DirService, setDirService] = useState(null);
//     const DirRes = useRef(null);
//     const reset = useRef(false);

//     useEffect(() => {
//         // Initialize when the map is available
//         if (map) {
//           setDirService(new window.google.maps.DirectionsService());
//           setDirRenderer(
//             new window.google.maps.DirectionsRenderer({
//               draggable: true,
//               map,
//             })
//           );
//         }
//       }, [map]);
    
//       useEffect(() => {
//         if (reset.current && DirRenderer) {
//           console.log("clear");
//           DirRenderer.set('directions', null);
//         }
//       }, [reset.current, DirRenderer]);
    

//     //Direction Service
//     const origin = locations
//         .filter((latlng, i) => i === 0)
//         .map((latLng, i) => latLng.toJSON());
//     const destination = locations
//         .filter((latlng, i) => i === locations.length - 1 && i >= 1)
//         .map((latLng, i) => latLng.toJSON());
//     const waypoints = locations
//         .filter((latlng, i) => i !== 0 && i !== locations.length - 1)
//         .map((latLng, i) => latLng.toJSON())
//         .map((location, i, array) => ({
//             location: location,
//             // stopover: true  //true: 實際停靠, false: 可不停靠
//         }));
    
//     const dirRequest = {
//         origin: origin[0],
//         destination: destination[0],
//         waypoints: waypoints,
//         provideRouteAlternatives: false,
//         travelMode: 'DRIVING',
//         drivingOptions: {
//           departureTime: new Date(/* now, or future date */),
//           trafficModel: 'pessimistic'
//         },
//         unitSystem: window.google.maps.UnitSystem.METRIC
//       }

//     if (origin.length && destination.length) {
//         reset.current = false;
//         DirRenderer.addListener("directions_changed", () => {
//             const directions = DirRenderer.getDirections();
//         });

//         if (!waypoints.length) {
//             const {waypoints, ...dirRequestnowaypoints} = dirRequest;
//             DirRes.current = displayRoute(dirRequestnowaypoints, DirService, DirRenderer);
//         }
//         else {
//             DirRes.current = displayRoute(dirRequest, DirService, DirRenderer);
//         }
//     }

//     if (!origin.length && !waypoints.length && !destination.length) {
//         reset.current = true;
//         DirRes.current = null;
//     }

//     if (iscompleted) {
//         //process the data to be a string with {lat, Lng}
//         DirRes.current.then((res) => {
//             const routes = res.routes;
//             const overviewPath = routes[0].overview_path;
//             const strtodb = overviewPath
//                 .map((LatLng) => `${LatLng.lat()}-${LatLng.lng()}`)
//                 .join(',')
//             console.log(strtodb);
//             console.log(overviewPath.length);    
//         })
        
       



//         // fetch(urlInitiateCarpool, {
//         //     method: 'POST',
//         //     headers: {
//         //       'Authorization': `Bearer ${userToken.access_token}`,
//         //       'accept': 'application/json',
//         //       'Content-Type': 'application/json',
//         //     },
//         //     body: JSON.stringify(target),
//         //   })
//         //     .then((response) => response.json())
//         //     .then((responseText) => {
//         //       setLaunchResult(responseText);
              
//         //       if (responseText.event_id) {
//         //         console.log(`發起成功，id=${responseText.event_id}`);
                
//         //       } else  {
//         //         console.log(responseText);
//         //         switch (responseText.detail) {
//         //           case "無駕照":
//         //             alert("您還沒認證駕照,請改用非自駕或認證駕照");
//         //             break;
//         //           case "日期輸入錯誤":
//         //             alert("日期輸入錯誤, 請重新選取");
//         //             break;
//         //           case "地點不可重複":
//         //             alert("地點不可重複");
//         //             break;
//         //           case "此用戶有未繳清款項":
//         //             alert("用戶有未繳清款項");
//         //             break;
//         //         }
                
//         //       }
//         //     })
//         //     .catch((error) => {
//         //       console.error(error);
//         //     });
//     }
     
//     return (
//         <>
//         {form}
        
//         <div
//             style={{
//             padding: "1rem",
//             flexBasis: "250px",
//             height: "100%",
//             overflow: "auto",
//           }}
//         >
//             <h3>起點</h3>
//             {origin.map((latLng, i) => (
//                 <pre key={i}>{JSON.stringify(latLng, null, 2)}</pre>
//             ))}

//             <h3>停靠點</h3>
//             {waypoints.map((latLng, i) => (
//                 <pre key={i}>{JSON.stringify(latLng, null, 2)}</pre>
//             ))}

//             <h3>終點</h3>
//             {destination.map((latLng, i) => (
//                 <pre key={i}>{JSON.stringify(latLng, null, 2)}</pre>
//             ))}
//          </div>     
//         </>
//     )
// }

// const displayRoute = (request, service, display) => {
//     return service
//         .route(request)
//         .then((result) => {
//             display.setDirections(result);
//             return result;
//         })
//         .catch((e) => {
//             alert("Could not display directions due to: " + e);
//         });
 
//   }