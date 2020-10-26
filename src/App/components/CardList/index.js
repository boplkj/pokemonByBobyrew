import React, { useState, useEffect, useLayoutEffect, useMemo } from 'react'
import Card from '../Card'
import pokemon from 'pokemon'
import Select from 'react-select'
import Counter from './Counter'
import Pokedex from 'pokedex-promise-v2'
import axios from 'axios'
import {types} from './constants'
import './index.styl'
import isAuth  from '../../ClientHelpers/hooks/isAuth'
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft as firstPage,
  faArrowAltCircleLeft as prevPage,
  faArrowAltCircleRight as nextPage,
  faAngleDoubleRight as lastPage,
  faSearch as search
} from '@fortawesome/free-solid-svg-icons'

const MAX_POKEMON_INDEX = require("pokemon").all().length
const P = new Pokedex()

export default function CardList({ list, isUserPage }){
  const _isAuth = isAuth()
  const [page, setPage] = useState(1)
  const [skill ,setSkill] = useState([])
  const [trigger, setTrigger] = useState()

  const [pokemons, setPokemons]= useState([])
  const [currentPokemons, setCurrentPokemons] = useState([])
  const [favoriteList, setFavoriteList] = useState([])

  const [counter, setCounter] = useState(10)
  const [pageCount, setPageCount] = useState(1)
  const [findName, setFindName] = useState([])


  useLayoutEffect (() => {
    (async function favoriteList () {
      try {
        const { data: _favoriteList } = await axios.get('/favorite-pok')
        setFavoriteList(_favoriteList)
      } catch(error) {
        setFavoriteList([])
      }
    })()
  },[trigger])  

  useEffect(() => {
    !skill.length && setPageCount(Math.ceil(isUserPage ? favoriteList.length : MAX_POKEMON_INDEX / counter))
  }, [skill.length])

  useEffect(()=>{
    let tempCurrentPokemons = []
    let start = page * counter +1 - counter
    let end = start + counter
    if (isUserPage) {
      setPageCount(Math.ceil(favoriteList.length/ counter))
      setCurrentPokemons(favoriteList.slice(start, end))
       
    } else if (!skill.length && !findName.length){
        if (end> MAX_POKEMON_INDEX){
          start = MAX_POKEMON_INDEX - counter
          end = MAX_POKEMON_INDEX
        }
          for (let pokeIndex=start; pokeIndex<end; pokeIndex++){ 
            tempCurrentPokemons.push(pokeIndex)
          }
        setCurrentPokemons(tempCurrentPokemons)
        setPageCount(Math.ceil(MAX_POKEMON_INDEX / counter))
    }
    else
    {
      let typePromise= []
      skill.map(type=>typePromise.push(P.getTypeByName(type.label)))
      Promise.all(typePromise).then(res=>{
        res.map(pokemons => {
          // проверка повторов покемонов
          pokemons.pokemon.map(pokemon=> {
            !tempCurrentPokemons.find(name => name === pokemon.pokemon.name) && tempCurrentPokemons.push(pokemon.pokemon.name)
          })
         

          //Тут вроде логичнее считать по формуле  либо globalLength = (tempCurrentPokemons.length -1)
        })
        setPageCount(Math.ceil((tempCurrentPokemons.length -1)/counter))
        setCurrentPokemons(tempCurrentPokemons.slice(start, end))
      })
    }
  }, [page, counter, skill, JSON.stringify(favoriteList), isUserPage, findName])

  useEffect(() => {
    let promises = []
    currentPokemons.map(name=>{
      promises.push(P.getPokemonByName(name))
    })

    Promise.all(promises).then(res => {
      setPokemons(res)
    })
  }, [JSON.stringify(currentPokemons)])

  useEffect(() => {
    if (page > pageCount && pageCount!== 0 ){
      setPage(pageCount)
    }
  }, [pageCount, page])



function isFavorite(id, favoriteList){
  return _isAuth && !!(favoriteList.length && favoriteList.find(_id=> id===_id ))
}
  
  return pug`
    if _isAuth && !isUserPage
      div.menuItem.mlFavPok
        Link(to='/userpage') My Favorite Pokemons
    div.navBlock
      
      if !isUserPage
        div.selFind
          div.selected
            div.selectBlock(style = !findName.length? {}: {display: 'none'})
              Select(value = skill onChange=(types)=>{
                setSkill(types || []) 
                setPage(1)
              } isMulti options= types placeholder= 'Select pokemon type...')
          div.findPokemon
            input.findNameInput(onChange=(ev)=>{
              let tempCurrentPokemon = []
              if (ev.target.value!==""){
              tempCurrentPokemon.push(ev.target.value)
              } else tempCurrentPokemon= []
              setFindName(tempCurrentPokemon)
            })
            div.findNameButton( onClick=()=> {
              if (findName.length!=0){
              setCurrentPokemons(findName)
            }
            })
              FontAwesomeIcon(icon= search color= 'limegreen' fixedWidth title ='Find')

      if (!findName.length)
        div.counterContainer
          Counter(setCounter=setCounter counter=counter)
  
        div.pageList
          div.firstPage.cPoint(onClick=()=> setPage(1))
            FontAwesomeIcon(title= 'First Page' icon= firstPage color= 'black' fixedWidth size='2x')
          div.prevPage.cPoint(onClick=()=> { if(page>1) {setPage(page-1)}})
            FontAwesomeIcon(title= 'Previous Page' icon= prevPage color= 'gold' fixedWidth size='2x')
          div.navPages
            if page > 2
              div.pageMiTwo.ml(onClick=()=>setPage(page-2))=page-2 
            if page > 1
              div.pageMiOne.ml(onClick=()=>setPage(page-1))=page-1 
            div.currentPage.ml=page 
            if pageCount-page >= 1 
              div.pagePlOne.ml(onClick=()=>setPage(page+1))=page+1 
            if pageCount-page >= 2
              div.pagePlTwo.ml(onClick=()=>setPage(page+2))=page+2 
          div.nextPage.cPoint(onClick=()=> { if(pageCount-page >=1) {setPage(page+1)}})
            FontAwesomeIcon(title= 'Next Page' icon= nextPage color= 'gold' fixedWidth size='2x')
          div.lastPage.cPoint(onClick=()=> setPage(pageCount))
            FontAwesomeIcon(title= 'Last Page' icon= lastPage color= 'black' fixedWidth size='2x')
              
      
    div.CardList
      each pok in pokemons
        Card(
          key=pok.id
          PokemonInfo=pok
          isFavorite=isFavorite(pok.id, favoriteList)
          trigger=trigger
          setTrigger=setTrigger
          isAuth=_isAuth
        )

    if (!findName.length)
      div.pageList.mTB
        div.firstPage.cPoint(onClick=()=> setPage(1))
          FontAwesomeIcon(title = 'First Page' icon= firstPage color= 'black' fixedWidth size='2x')
        div.prevPage.cPoint(onClick=()=> { if(page>1) {setPage(page-1)}})
          FontAwesomeIcon(title= 'Previous Page' icon= prevPage color= 'gold' fixedWidth size='2x')
        div.navPages
          if page > 2
            div.pageMiTwo.ml(onClick=()=>setPage(page-2))=page-2 
          if page > 1
            div.pageMiOne.ml(onClick=()=>setPage(page-1))=page-1 
          div.currentPage.ml=page 
          if pageCount-page >= 1 
            div.pagePlOne.ml(onClick=()=>setPage(page+1))=page+1 
          if pageCount-page >= 2
            div.pagePlTwo.ml(onClick=()=>setPage(page+2))=page+2 
        div.nextPage.cPoint(onClick=()=> { if(pageCount-page >=1) {setPage(page+1)}})
          FontAwesomeIcon(title= 'Next Page' icon= nextPage color= 'gold' fixedWidth size='2x')
        div.lastPage.cPoint(onClick=()=> setPage(pageCount))
          FontAwesomeIcon(title= 'Last Page' icon= lastPage color= 'black' fixedWidth size='2x')
          


`
}

