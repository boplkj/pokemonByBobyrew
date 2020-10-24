import React, { useState, useEffect} from 'react'
import axios from 'axios'

 export default function isAuth (triggers = []) {
   const [isAuth, setIsAuth]= useState(false)

   useEffect (() => {
    (async function iaAuth () {
      try {
        const { data: _isAuth } = await axios.get('/isAuth')
        setIsAuth(_isAuth)      
      } catch(error) {
       setIsAuth(false)
      }
    })()
  },triggers)  
  return isAuth
} 

