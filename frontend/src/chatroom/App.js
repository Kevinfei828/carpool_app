// import React from 'react';
// import Navbar from './components/Navbar';
// import Chat from './components/Chat';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { auth } from './firebase';
// import { useAuthState } from 'react-firebase-hooks/auth';

// const style = {
//   appContainer: `max-w-[728px] mx-auto text-center`,
//   sectionContainer: `flex flex-col h-[90vh] bg-gray-100 mt-10 shadow-xl border relative`,
// };

// export const Chatroom= () =>   {
//   const [user] = useAuthState(auth);
//   //  console.log(user)
//   return (
//     <div className={style.appContainer}>
//       <section className='{style.sectionContainer}'>
//         {/* Navbar */}
//         <Navbar />
//         {user ? <Chat /> : null}
//       </section>
//     </div>
//   );
// }

// export default Chatroom;
