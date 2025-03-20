import * as PusherPushNotifications from "@pusher/push-notifications-web";

export const beamsClient = new PusherPushNotifications.Client({
  instanceId: 'f6cd0c10-192e-4b49-9851-980cc7a0ab3d',
});

export const pusher = (username) => {
  const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
    url: "http://localhost:8080/pusher/beams-auth",
    queryParams: {
      "username": username, // URL query params your auth endpoint needs
    },
    // headers: {
    //   "Authorization": `Bearer ${token}`, // Headers your auth endpoint needs
    // },
  });
  beamsClient
  .start()
  .then(() => beamsClient.setUserId(username, beamsTokenProvider))
  .catch(console.error);
}

// export const notify = async (eventid) => {
//   const url = `http://localhost:8080/pusher/send-notification/${eventid}`
//   const response = await fetch(url, {
//     method: 'get',
//   });
//   const data = await response.json();
//   console.log(data)
// }

// export const pusher_checkmatchuser = (currentUserId) => {
//   beamsClient
//   .getUserId()
//   .then((userId) => {
//     // Check if the Beams user matches the user that is currently logged in
//     if (userId !== currentUserId) {
//       // Unregister for notifications
//       return beamsClient.stop();
//     }
//   })
//   .catch(console.error);
// }

//Activate and send notifications to users in ./pages/...
//pusher() should be called when user logs in
//notify() should be called when event ends or dismisses


//The following code can be tested by adding those to the CarpoolJoined.jsx
//Usage: 1. Press the "啟動Pusher" button 2. Press the "測試通知" button
//Result: The notification with the content {'title': 'Test_title', 'body': 'Test_body'},
//the content can be modified in the "send_notification" api in main.py

// CarpoolJoined.jsx
// import { pusher, beamsClient, notify } from "../../pusher_util";
{/* <Button
onClick={() => pusher(userToken.user_id.toString(), userToken.access_token)}
>
啟動Pusher

</Button>
<Button
onClick={() => notify(userToken.user_id)}
>
測試通知
</Button> */}

