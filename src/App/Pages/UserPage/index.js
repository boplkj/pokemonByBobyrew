import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CardList from '../../components/CardList'
import Header from '../../components/Header'


export default function userPage() {


  return pug`
    Header
    CardList( isUserPage = true  )

    `
}
