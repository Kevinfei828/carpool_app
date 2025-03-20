import React from 'react';
import SignIn from './SignIn'
import LogOut from './LogOut'
import {Form , Badge, Button, Col,Row} from 'react-bootstrap';
import {auth} from '../firebase'
import {useAuthState} from 'react-firebase-hooks/auth'
import { useLocation } from 'react-router-dom';


const style = {
    nav: `bg-gray-800 h-20 flex justify-between items-center p-4`,
    heading: `text-black text-3xl`
}

const Navbar = () => {
    const {state} = useLocation();
    const { id } = state; // Read values passed on state
    const [user] = useAuthState(auth)
    console.log(user)
  return (

    <div >
      <Form>
      <Row>
        <Form.Group as={Col} className="mb-3" >
          <Form.Label column sm={2}>
          <h1><Badge bg="secondary">Chat Room {id}</Badge></h1>
          </Form.Label>
          </Form.Group>
          <Form.Group as={Col} className="mb-3">
            {user ? <LogOut /> : <SignIn />}
          </Form.Group>
      </Row>
      </Form>
    </div>
  );
};

export default Navbar;
