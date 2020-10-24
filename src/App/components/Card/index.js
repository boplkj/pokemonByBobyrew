import React, { useState, useEffect } from 'react'
import './index.styl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar as starFill} from '@fortawesome/free-solid-svg-icons'
import { faStar as starReg } from '@fortawesome/free-regular-svg-icons'
import { faPrescriptionBottleAlt as hpImage, 
  faKhanda as attackImage,
  faShieldAlt as defenceImage,
  faChessRook as specialDefenceImage,
  faSkullCrossbones as specialAttackImage,
  faTachometerAlt as speedImage
} from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'





export default  function  Card({ PokemonInfo, isFavorite, isAuth, trigger, setTrigger }){  
  
  const[star, setStar] = useState()
  const [pokoImage, setPokoImage] = useState(true)
  const [skill,setSkill] = useState('')
  const [showId, setShowId] = useState(false)
  let typeColor
  let typeArr = []

  if (PokemonInfo.types.length>1){
  
    for (let i=0; i<PokemonInfo.types.length; i++){
      typeArr.push(types(PokemonInfo.types[i].type.name))
    } 
  }else{
    typeColor = types(PokemonInfo.types[0].type.name)
  }
  useEffect(() => {
    setStar(isFavorite)
  }, [isFavorite])


  function types(name){
    switch (name){
      case "grass": 
        return 'lime'
      case "ground": 
        return 'burlywood'
      case "dragon": 
        return 'blueviolet'
      case "fairy": 
        return 'fuchsia'
      case "fire": 
        return 'darkorange'
      case "ghost": 
        return 'purple'
      case "normal": 
        return 'darkkhaki'
      case "psychic": 
        return 'deeppink'
      case "steel": 
        return 'silver'
      case "dark": 
        return 'sienna'
      case "electric": 
        return 'gold'
      case "fighting": 
        return 'red'
      case "flying": 
        return 'mediumpurple'
      case "ice": 
        return 'paleturquoise'
      case "poison": 
        return 'indigo'
      case "rock": 
        return 'saddlebrown'
      case "water": 
        return 'dodgerblue'
      case "bug": 
        return' yellowgreen'
      case 'fairy':
        return 'hotpink'
    }
    console.log(typeColor, "from in func")
  }


  async function func (){
    if (!star){
      try{
        const res = await axios.post('/add-pokemon-to-db', {
          pokemonId: PokemonInfo.id 
        })
      } catch(error){
        console.log(error.response.data,"eoro" , error.response)
      }
    }
    else{
      try{
        const res = await axios.post('/remove-pokemon-from-db', {
          pokemonId: PokemonInfo.id 
        })   
      } catch(error){
        console.log(error.response.data,"eoro" , error.response)
      }
    }
    setStar(!star)
    setTrigger(!trigger)
  }

  function stats(){
setPokoImage(!pokoImage)
  }

 return pug`
  div.flipCardContainer
    div.flipCard
      div.pocoCard.front
        div.headerCard
          if isAuth
            div.star(onClick=func)
              FontAwesomeIcon(icon= star? starFill: starReg color= 'gold' size='2x')
          div.pocoName(onClick=()=>{setShowId(!showId)})= showId? 'id: '+PokemonInfo.id : PokemonInfo.name
          
        if (PokemonInfo.types.length>1)
          div.pocoAvatar(style={background: 'linear-gradient'+ '(' + '120deg,'+ typeArr[0]+' 29%,'+ typeArr[1]+' 69%' +')'})
            img.pocoAvatarImg(src= PokemonInfo.sprites.front_default)
        if (PokemonInfo.types.length===1)
          div.pocoAvatar(style={background: typeColor })
            img.pocoAvatarImg(src= PokemonInfo.sprites.front_default)
        div.pocoTypeBox 
          each pocoType, index in PokemonInfo.types
            div.pokoTypes
              img.typeImg(src= require('../../../images/types/'+pocoType.type.name+'.png').default)
              div.pocoType(key=index)= pocoType.type.name

      div.pocoCard.back
        div.headerCard
          if isAuth
            div.star(onClick=func)
              FontAwesomeIcon(icon= star? starFill: starReg color= 'gold' size='2x')
          div.pocoName(onClick=()=>{setShowId(!showId)})= showId? 'id: '+PokemonInfo.id : PokemonInfo.name
      
        if pokoImage
          if (PokemonInfo.types.length>1)
            div.pocoAvatar(title= PokemonInfo.name +' avatar' style={background: 'linear-gradient'+ '(' + '120deg,'+ typeArr[0]+' 29%,'+ typeArr[1]+' 69%' +')'})
              img.pocoAvatarImg(src= PokemonInfo.sprites.back_default)
          if (PokemonInfo.types.length===1)
            div.pocoAvatar(title= PokemonInfo.name +' avatar' style={background: typeColor })
             img.pocoAvatarImg(src= PokemonInfo.sprites.back_default)
        if !pokoImage
          div.stats 
            div.hp.status-bar
              FontAwesomeIcon(icon= hpImage color= 'green' fixedWidth title ='HP' )
              div.statsInt(style={width:PokemonInfo.stats[0].base_stat+ 'px', backgroundColor: 'green'})=PokemonInfo.stats[0].base_stat
            div.attack.status-bar
              FontAwesomeIcon(icon= attackImage color= 'red' fixedWidth title ='Attack')
              div.statsInt(style={width:PokemonInfo.stats[1].base_stat+ 'px', backgroundColor: 'red'})=PokemonInfo.stats[1].base_stat
            div.defense.status-bar
              FontAwesomeIcon(icon= defenceImage color= 'orange' fixedWidth title ='Defense' )
              div.statsInt(style={width:PokemonInfo.stats[2].base_stat+ 'px', backgroundColor: 'orange'})=PokemonInfo.stats[2].base_stat
            div.special-attack.status-bar
              FontAwesomeIcon(icon= specialAttackImage color= 'firebrick' fixedWidth title ='Special Attack' )
              div.statsInt(style={width:PokemonInfo.stats[3].base_stat+ 'px', backgroundColor: 'firebrick'})=PokemonInfo.stats[3].base_stat
            div.special-defence.status-bar
              FontAwesomeIcon(icon= specialDefenceImage color= 'darkorange' fixedWidth title ='Special Defence')
              div.statsInt(style={width:PokemonInfo.stats[4].base_stat+ 'px', backgroundColor: 'darkorange'})=PokemonInfo.stats[4].base_stat
            div.speed.status-bar
              FontAwesomeIcon(icon= speedImage color= 'indigo' fixedWidth title ='Speed' )
              div.statsInt(style={width:PokemonInfo.stats[5].base_stat+ 'px', backgroundColor: 'indigo'})=PokemonInfo.stats[5].base_stat


        div.statsBtn(onClick=stats) stats
  `

}