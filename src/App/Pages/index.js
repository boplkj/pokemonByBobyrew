import React from 'react'
import axios from 'axios'
import './index.styl'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from 'react-router-dom'
import Home from './Home'
import Login from './Auth'
import UserPage from './UserPage'



export default  function Pages() {
  return pug`
    Router
      Switch
        Route(exact path="/")
          Home 
        Route(path='/authss')
          Login
        Route(path='/userpage')
          UserPage
`}

