import React, { useState }  from 'react'
import './index.styl'

export default function Counter ({ setCounter ,counter}) {
  const[ten,setTen] = useState(true)
  const[twenty,setTwenty] = useState(false)
  const[fifty, setFifty] = useState(false)

  return pug`
    div.setCounter 
      div.sendUs(onClick=()=>{setCounter(10)
      },
       style=  counter==10? {color:'limegreen'} : {color:'black'}) 10

      div.sendUs(onClick=()=>{setCounter(20)
      },
       style=  counter==20? {color:'limegreen'} : {color:'black'}) 20

      div.sendUs(onClick=()=>{setCounter(50)
      },
       style=  counter==50? {color:'limegreen'} : {color:'black'}) 50
  `
}