// import React, { useEffect, useState, useRef } from "react";
// import { createRoot } from "react-dom/client";
// import { Wrapper, Status } from "@googlemaps/react-wrapper";
// import { createCustomEqual } from "fast-equals";
// import { Route } from "./Route";
// import {Link, useNavigate} from 'react-router-dom';
// import {
//   Typography,
//   TextField,
//   Button,
//   Container,
//   FormControl,
//   Input,
//   Select,
//   MenuItem,
//   Grid,
//   Box, Paper, Divider, InputAdornment, InputLabel, Alert,
// } from '@mui/material';

// const render = (status) => {
//   return <h1>{status}</h1>;
// };

// export const MapService = () => {
//   const navigate = useNavigate();
//   const initialloc = {lat: 23.88, lng: 121.08} //Taiwan

//   const [clicks, setClicks] = useState([]);  // all locations
//   const locations = []; // {lat, lng}
//   const [zoom, setZoom] = useState(8); // initial zoom
//   const [center, setCenter] = useState(initialloc);
//   const [map, setMap] = useState();
//   const [iscompleted, setcompleted] = useState(false);  //only check the frontend

//   const handelmapload = (map) => {
//     setMap(map);
//   }

//   const onClick = (e) => {
//     // avoid directly mutating state
//     //get and store the latlng from the click event
//     setClicks([...clicks, e.latLng]); 
//   };

//   const onIdle = (m) => {
//     console.log("onIdle");
//     // setZoom(m.getZoom());
//     // setCenter(m.getCenter().toJSON());
//   };

//   const toinitialpage = () => {
//     navigate('/launch');
//   }

//   const handlecompleted = () => {
//     if (clicks.length < 2) {
//       alert("請至少輸入兩個地點");
//       setcompleted(false);
//     }
//     else {
//       setcompleted(true);
//     }
//   }

//   const handlecleared = () => {
//     setClicks([]);
//     setcompleted(false);
//   }

//   const form = (
//     <div
//       style={{
//         padding: "1rem",
//         flexBasis: "250px",
//         height: "100%",
//         overflow: "auto",
//       }}
//     >
//       <label htmlFor="zoom">Zoom</label>
//       <input
//         type="number"
//         id="zoom"
//         name="zoom"
//         value={zoom}
//         onChange={(event) => setZoom(Number(event.target.value))}
//       />
//       <br />
//       <label htmlFor="lat">Latitude</label>
//       <input
//         type="number"
//         id="lat"
//         name="lat"
//         value={center.lat}
//         onChange={(event) =>
//           setCenter({ ...center, lat: Number(event.target.value) })
//         }
//       />
//       <br />
//       <label htmlFor="lng">Longitude</label>
//       <input
//         type="number"
//         id="lng"
//         name="lng"
//         value={center.lng}
//         onChange={(event) =>
//           setCenter({ ...center, lng: Number(event.target.value) })
//         }
//       />
//       <p>{clicks.length === 0 ? "點選地圖以選取起終/停靠點" : "按清除以重新選擇圖標"}</p>
//       <Grid item xs={12} md={12} mb={1}>
//         <Button
//           color="error" 
//           variant="contained"
//           style={{marginRight: '2px'}}
//           onClick={handlecleared}
//         >
//           清除
//         </Button>
//         <Button
//           color="success" 
//           variant="contained"  
//           onClick={handlecompleted}
//         >
//           確認
//         </Button>
//       </Grid>
      
//       <Grid item xs={12} md={12}>
//         <Button
//           color="primary" 
//           variant="contained"  
//           onClick={toinitialpage}
//         >
//           返回發起頁
//         </Button>
//       </Grid>
//     </div>
//   );


//   return (
//     <div style={{ display: "flex", height: "100%" }}>
//       <Wrapper apiKey={"AIzaSyBanI9_v5LbSZGyULKhRwNEikCZ24abkgk"} render={render}>
//         <Map
//           center={center}
//           onClick={onClick}
//           onIdle={onIdle}
//           zoom={zoom}
//           style={{ flexGrow: "1", height: "100%" }}
//           map={map}
//           setmap={handelmapload}
//         >
//           {clicks.map((latLng, i) => (
//             <Marker key={i} position={latLng} />
//           ))}
//         </Map>
//         <Route
//           locations={clicks}
//           form={form}
//           map={map}
//           iscompleted={iscompleted}
//         >
//       </Route>
      
//       </Wrapper>
//       {/* Basic form for controlling center and zoom of map. */}
      
//     </div>
//   );
// };

// const Map = ({
//   onClick,
//   onIdle,
//   children,
//   style,
//   map,
//   setmap,
//   ...options
// }) => {
//   const ref = useRef(null);
  
//   useEffect(() => {
//     if (ref.current && !map) {
//       setmap(new window.google.maps.Map(ref.current, {}));
//     }
//   }, [ref, map, setmap]);

//   // because React does not do deep comparisons, a custom hook is used
//   // see discussion in https://github.com/googlemaps/js-samples/issues/946
//   useDeepCompareEffectForMaps(() => {
//     if (map) {
//       map.setOptions(options);
//     }
//   }, [map, options]);

//   useEffect(() => {
//     if (map) {
//       ["click", "idle"].forEach((eventName) =>
//         window.google.maps.event.clearListeners(map, eventName)
//       );

//       if (onClick) {
//         map.addListener("click", onClick);
//       }

//       if (onIdle) {
//         map.addListener("idle", () => onIdle(map));
//       }
//     }
//   }, [map, onClick, onIdle]);

//   return (
//     <>
//       <div ref={ref} style={style} />
//       {React.Children.map(children, (child) => {
//         if (React.isValidElement(child)) {
//           // set the map prop on the child component
//           // @ts-ignore
//           return React.cloneElement(child, { map });
//         }
//       })}
//     </>
//   );
// };

// const Marker = (options) => {
//   const [marker, setMarker] = useState();

//   useEffect(() => {
//     if (!marker) {
//       setMarker(new window.google.maps.Marker());
//     }

//     // remove marker from map on unmount
//     return () => {
//       if (marker) {
//         marker.setMap(null);
//       }
//     };
//   }, [marker]);

//   useEffect(() => {
//     if (marker) {
//       marker.setOptions(options);
//     }
//   }, [marker, options]);

//   return null;
// };

// const deepCompareEqualsForMaps = createCustomEqual(
//   (deepEqual) => (a, b) => {
//     if (
//       a instanceof window.google.maps.LatLng || b instanceof window.google.maps.LatLng
//     ) {
//       return new window.google.maps.LatLng(a).equals(new window.google.maps.LatLng(b));
//     }

//     // TODO extend to other types

//     // use fast-equals for other objects
//     return deepEqual(a, b);
//   }
// );

// function useDeepCompareMemoize(value) {
//   const ref = useRef();

//   if (!deepCompareEqualsForMaps(value, ref.current)) {
//     ref.current = value;
//   }
//   return ref.current;
// }

// function useDeepCompareEffectForMaps(
//   callback,
//   dependencies
// ) {
//   useEffect(callback, dependencies.map(useDeepCompareMemoize));
// }
