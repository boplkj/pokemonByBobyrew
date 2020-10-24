import { connectDb, getClient } from './db'
import path from 'path'

const express = require('express')
const session = require('express-session')
const passport = require('passport')
const client = getClient()


const app = express()
const DIST_DIR = __dirname
const HTML_FILE = path.join(DIST_DIR, 'index.html')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: 'thisIsSecretKeY123',
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    }
  })
)
  
  require('./config-passport');
  app.use(passport.initialize());
  app.use(passport.session());


app.use(express.static(DIST_DIR))

  app.post('/join', async function (req, res, next) {
    const EMAIL_PATTERN = new RegExp("^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")
    const PASSWORD_PATTERN = new RegExp('^.*(?=.{8,})(?=..*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$')
    console.log(req.body.email)
    if (req.body.email.match(EMAIL_PATTERN ) && req.body.password.match(PASSWORD_PATTERN)){
      console.log("allOk")
      let authData = {
        email: req.body.email,
        password: req.body.password
      
      }
      const user= await client.db("pokeapp").collection('users').findOne({
        email: req.body.email 
      })
        
      if (!user) {
        client.db("pokeapp").collection('users').insertOne(authData, (err, result) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
          passport.authenticate('local', function(err, user) {
            console.log(user,'userData')
            if (err) {
              return next(err);
            }
            if (!user) {
              return res.status(401).send('Bad user data')
            }
            req.logIn(user, function(err) {
              if (err) {
                return next(err);
              }
              return res.redirect('/')
            })
          })(req, res, next)
        })
      } else {
        res.status(401).send('This login is already in use')
      }
    } else if (!req.body.email.match(EMAIL_PATTERN )) {
      if (!req.body.password.match(PASSWORD_PATTERN)) {
        res.status(401).send('Email and Password wrong')
      } else res.status(401).send('Wrong email')
    } else if (!req.body.password.match(PASSWORD_PATTERN)){
      res.status(401).send('Wrong password')
    } else res.status(401).send('Something wrong')

  })
  
  
  app.post('/login', (req, res, next) => {
    passport.authenticate('local', function(err, user) {
      console.log(user,'userData')
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).send("Bad user data");
        
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.redirect('/');
      
      });
    })(req, res, next);
  });

  const auth = (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.redirect('/');
    }
  };
  
  app.get('/favorite-pok', async function (req, res) {
    if(req.isAuthenticated()) {
      const favPok= await client.db("pokeapp").collection('users').findOne({
        _id: req.user && req.user._id
      })
      res.send(favPok.favoritePokemons)
    } else {
      res.send([])
    }
  })

  app.post('/remove-pokemon-from-db', function (req, res) {
    const pokemonId = req.body.pokemonId
    console.log(pokemonId, 'pokeid')
    if (req.isAuthenticated()){
      client.db("pokeapp").collection('users').updateOne({
        _id: req.user._id
      }, {$pull: {favoritePokemons : pokemonId}} )
      res.send('done')
    }
    else res.send('error')

  })

  app.post('/add-pokemon-to-db', function (req, res) {
    const pokemonId = req.body.pokemonId
    console.log(pokemonId, 'pokeid')
    if (req.isAuthenticated()){
      client.db("pokeapp").collection('users').updateOne({
        _id: req.user._id
      }, {$addToSet: {favoritePokemons : pokemonId}} )
      res.send('done')
    }
    else res.send('error')
   })
 
  

   app.get('/isAuth',  (req, res) => {
    if(req.isAuthenticated()){
    res.send(true)
    }
    else res.send(false)
  })

app.get('/auth/vkontakte', passport.authenticate('vkontakte'))

app.get('/auth/vkontakte/callback', (req, res, next) => {
  passport.authenticate('vkontakte', function (err, user) {
    console.log('I am in callback')
    console.log('callback user: ', user)
    if (err) {
      return next(err)
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err)
      }
      return res.redirect('/')
    })
  })(req, res, next)
})
  
  app.get('/admin', auth, (req, res) => {
    res.send('Admin page!');
  });
  
  app.get('/logout', (req, res) => {
    req.logOut();
    return res.redirect('/');
  });

app.get('*', (req, res) => {
    res.sendFile(HTML_FILE)
})



const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    connectDb()
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})