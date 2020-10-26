import React from 'react'
import './index.styl'
import logo from '../../../images/pikachu.png'
import isAuth  from '../../ClientHelpers/hooks/isAuth'
import {Link} from 'react-router-dom'



export default function Header (){
  const _isAuth = isAuth()
    return pug `
      div.header
        div.menuHead(title= 'Start Page Link')
          Link(to='/')
            img.logo(src=logo)
          div.pokedex.unselectable(title = 'Start Page Link') 
            Link(to='/')
              span.yel Poke
              span.bl dex
          if !_isAuth
            div.menuItem 
              Link(to='/authss') Login
              
          if _isAuth
            a.menuItem(href = '/logout') Logout
              

            
        
    `
}