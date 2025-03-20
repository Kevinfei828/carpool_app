// import React, { useState, useEffect, useRef } from 'react';
// import Message from './Message';
// import SendMessage from './SendMessage';
// import { db } from '../firebase';
// import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
// import { useLocation } from 'react-router-dom';
// import {Form , Badge, Button} from 'react-bootstrap';


// const style = {
//   main: `flex flex-col p-[10px]`,
// };

// const Chat = () => {
//   const [messages, setMessages] = useState([]);
//   const scroll = useRef();

//   const {state} = useLocation();
//   const { id } = state; // Read values passed on state
//   useEffect(() => {

//     /* 引入 messages firestore 的資料*/
//     //const q = query(collection(db, 'messages'), orderBy('timestamp')); //以 timesstamp 排序
//     //const q1 = query(collection(db, 'chatroom1'), orderBy('timestamp')); //以 timesstamp 排序

//     const nums = ['0','1', '2', '3','4','5','6','7','8','9'];
//     //const nums = ['1','2','3','4']
    
//     var q = [];
    

//     for(var i in nums){

//       q[parseInt(i)] = query(collection(db, 'chatroom' + nums[i]), orderBy('timestamp')); //以 timesstamp 排序
//       console.log('chatroom' + nums[i]);
      
//     }
    



    
//     const unsubscribe = onSnapshot(q[(id%10)], (querySnapshot) => {
//       let messages = [];
//       querySnapshot.forEach((doc) => {
//         messages.push({ ...doc.data(), id: doc.id });
//       });
//       setMessages(messages);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <>
//       <main className={style.main}>
//         {messages &&
//           messages.map((message) => (
//             <Message key={message.id} message={message} />
//           ))}
//       </main>
//       {/* Send Message Compoenent */}
//       <SendMessage scroll={scroll} />
//       <span ref={scroll}></span>
//     </>
//   );
// };

// export default Chat;
