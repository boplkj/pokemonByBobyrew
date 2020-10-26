import passport from 'passport'
import passportLocal from 'passport-local'
const LocalStrategy = passportLocal.Strategy
const VKontakteStrategy = require('passport-vkontakte').Strategy
import { getClient } from './db'

const client = getClient()

passport.serializeUser(function(user, done) {
  done(null, user.email);
});

passport.deserializeUser(async function(email, done) {
  const result =  await client.db("pokeapp").collection("users").findOne({email});
  done(null, result);
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async function(
    email,
    password,
    done
  ) {
    console.log(' email: ', email)
    console.log(' password: ', password)
    const result =  await client.db("pokeapp").collection("users").findOne({ email })
    if (result && password === result.password) {
      return done(null, result);
    } else {
      return done(null, false);
    }
  })
)

passport.use(
  new VKontakteStrategy(
    {
      clientID:     '7628713',
      clientSecret: 'oTfEvYwEtz6DrPr8UL2d',
      callbackURL:  "https://pokemons-by-bobyrew.herokuapp.com/auth/vkontakte/callback"
    },

    function (accessToken, refreshToken, profile, done) {
      client.db("pokeapp").collection("users").findOne({
        email: profile.username
      },
        function (err, user) {
          if (err) {
            return done(err)
          }
          // No user was found... so create a new user with values from Facebook (all the profile. stuff)
          if (!user) {
            let authData = {
              email: profile.username,
              provider: 'vkontakte',
              vkontakte: profile._json
            }
            client.db("pokeapp").collection('users').insertOne(authData, (err, result) => {
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              }
              done(null, result.ops[0])
            })
          } else {
            // found user. Return
            return done(err, user)
          }
        }
      )
    }
  )
) 

