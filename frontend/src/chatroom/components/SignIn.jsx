import React from 'react'


import GoogleButton from 'react-google-button'

import {auth} from '../firebase'
import {GoogleAuthProvider, signInAnonymously, getAuth ,signInWithRedirect} from 'firebase/auth'
import {Form , Badge, Button, Container, Col,Row} from 'react-bootstrap';
const style = {
    wrapper: `flex justify-center`
}

const googleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
}


// https://firebase.google.com/docs/auth/web/anonymous-auth?hl=zh-tw
const carpoolmemberSignIn = () => {
    
    const getauth = getAuth();

    signInAnonymously(getauth)
    .then(()=>{
      
    }).catch((error) =>{
      const errorCode = error.code;
      const errorMessage = error.message;
      // ... 
    })
}

const SignIn = () => {
  return (
    <div className={style.wrapper}>
        <Button onClick={carpoolmemberSignIn}>User Sign In</Button>
    </div>
  )
}

export default SignIn