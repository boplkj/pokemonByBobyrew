import React, { useState } from 'react'
import './index.styl'
import Header from "../../components/Header"
import axios from 'axios'
import {Redirect} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVk as vk } from '@fortawesome/free-brands-svg-icons'

export default function Auth () {
  const[email, setEmail]= useState('')
  const [password, setPassword ] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [logJoin,setLogJoin] = useState('or Join')
  const [logJoinBtn, setLogJoinBtn] = useState('Login me!')
  const [adress, setAdress] = useState('/login') 
  const [alert,setAlert] = useState()
  

 async function sendData(em,pass) {
try{const res = await axios.post(adress, {
  email: em,
  password: pass
})
setRedirect(true)


} catch(error){
  console.log(error.response.data,"error" , error.response)
  setAlert(error.response.data)
}

  }

  function loginJoin() {
    setAlert('')
    if (logJoin=== 'or Join'){
      setLogJoin('or Login')
      setLogJoinBtn('Join now!')
      setAdress('/join')
      
    }
    else {
      setLogJoin('or Join')
      setLogJoinBtn('Login me!')
      setAdress('/login')
    }
  }

  async function vkLog (){
    try{const res = await axios.post('/auth/vkontakte')
    setRedirect(true)
    
    } catch(error){
      console.log(error.response.data,"error" , error.response)
      setAlert(error.response.data)
    }
  }

   return pug`
    if (redirect) 
      Redirect(to="/")
    Header 
    div.loginBlock
      div.authForm
        div.logJoin(onClick=()=>loginJoin())=logJoin
        input.email(onChange=(ev)=>{setEmail(ev.target.value)} , placeholder='Type email')
        input.password(onChange=(ev)=>{setPassword(ev.target.value)}, placeholder = 'Type password')
        div.authLine
          div.auth( onClick=()=>sendData(email, password))= logJoinBtn
        div.alert= alert
        if (logJoinBtn === 'Login me!')
          div.orLog Or Login with Vk:
          a(href='/auth/vkontakte')
            div.vkLog
              FontAwesomeIcon(icon= vk color= 'blue' size='2x')
            
            
    
      

    
  `
}
