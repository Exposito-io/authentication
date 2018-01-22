/// <reference path="../../types/undefined.d.ts" />

import * as passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2'
import UserProvider from '../providers/user-provider'
import User from '../../models/user'
import * as config from 'config'

const userProvider = new UserProvider()


function initialize(): void {
    passport.use(new GoogleStrategy({
        clientID: '',
        clientSecret: '',
        callbackURL: `http://dev.login.exposito.io/login/google/return`
      },
      async function(accessToken, refreshToken, googleProfile, cb) {
        try {
          let user = await userProvider.updateGoogleProfile(googleProfile)

          console.log('access token: ' + accessToken)
          console.log('profile id: ' + googleProfile.id)
          console.log('profile: ' + JSON.stringify(googleProfile))

          return cb(null, user)
        } catch(err) {
          cb(err)
        }
      }
    ))
}


const login = passport.authenticate('google', {
  successRedirect: '/login/google/return',
  scope: [ 'email', 'profile' ]
})

const loginReturnMiddleware = passport.authenticate('google', { failureRedirect: '/login' })

function loginReturn(req, res) {
  console.log('Return!')
  res.redirect('/')
}


export { initialize, login, loginReturn, loginReturnMiddleware }
