import React, { useEffect, useState } from 'react';
import {auth, db} from '../firebase'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {Form , Badge, Button, Container} from 'react-bootstrap';
import {useAuth} from "../../auth/AuthContext";
import { useLocation } from 'react-router-dom';


const style = {
  form: `h-14 w-full max-w-[728px]  flex text-xl absolute bottom-0`,
  input: `w-full text-xl p-3 bg-gray-900 text-black outline-none border-none`,
  button: `w-[20%] bg-green-500`,
};



const SendMessage = ({scroll}) => {

  const {state} = useLocation();
  const { id} = state; // Read values passed on state

  



  const [input, setInput] = useState('');
  const { isLoaded, userToken} = useAuth(); /* Get Token page data*/

  const sendMessage = async (e) => {
    e.preventDefault()
    if (input === '') {
        alert('Please enter a valid message')
        return
    }
    



    const {uid, displayName } = auth.currentUser
    
    
    
    await addDoc(collection(db, 'chatroom' + String(id % 10)), {
        text: input,
        name: userToken.user_display_name,
        uid,
        timestamp: serverTimestamp()
    })

    /*
    await addDoc(collection(db, 'chatroom1'), {
      text: input,
      name: userToken.user_display_name,
      uid,
      timestamp: serverTimestamp()
    })*/

    setInput('')
    scroll.current.scrollIntoView({behavior: 'smooth'})
  }

  return (
    <Container>
    <Form onSubmit={sendMessage} >
      <Form.Group className="mb-3" controlId="formSendMessage" onChange={(e) => setInput(e.target.value)}>
        <Form.Label>Message bar</Form.Label>
        <Form.Control type="text" placeholder="Enter Message" />
      </Form.Group>
      <Button  variant="success" type = 'submit'> 
        發送訊息
      </Button>
    </Form>
    </Container>
  );
};

// type = 'submit' send to handler

/*<input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className={style.input}
        type='text'
        placeholder='Message'
      />*/
export default SendMessage;