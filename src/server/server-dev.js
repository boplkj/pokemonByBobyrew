import path from 'path'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import { connectDb, getClient } from './db'

import redis from 'redis'
import connectRedis from 'connect-redis'
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const redisClient = redis.createClient()
const redisStore  = connectRedis(session)
const client = getClient()


const app = express()
const DIST_DIR = __dirname
const HTML_FILE = path.join(DIST_DIR, 'index.html')
const compiler = webpack(config)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


redisClient.on('error', (err) => {
console.log('Redis error: ', err);
});

app.use(session({
  secret: 'ThisIsHowYouUseRedisSessionStorage',
  name: '_redisPractice',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 1000
  }, 
  store: new redisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 }),
  
}))

require('./config-passport');
app.use(passport.initialize());
app.use(passport.session());

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))

app.use(webpackHotMiddleware(compiler))



app.post('/join', function (req, res) {
  console.log(req.body)
  let authData = {
    email: req.body.email,
    password: req.body.password
  
  };

   client.db("pokeapp").collection('users').insertOne(authData, (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send("userAdded");
  })
})


app.post('/login', (req, res, next) => {
  passport.authenticate('local', function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send('Укажите правильный email или пароль!');
    }
    req.logIn(user, function(err) {
      console.log(user, "usercserver2.0")
      if (err) {
        return next(err);
      }
      return res.redirect('/admin');
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

app.get('/admin', auth, (req, res) => {
  res.send('Admin page!');
});

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

app.get('*', (req, res, next) => {
  compiler.outputFileSystem.readFile(HTML_FILE, (err, result) => {
  if (err) {
    return next(err)
  }
  res.set('content-type', 'text/html')
  res.send(result)
  res.end()
  console.log(req.body, "hmm")
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    connectDb()
    console.log(`App listening to ${PORT}....`)
    console.log('Press Ctrl+C to quit.')
})
