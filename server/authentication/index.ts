import * as passport from 'passport'
import * as googleAuth from './google'
import User from '../../models/user'


function login(req, res){
  res.render('login')
}

function initialize(app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user: User, cb) {
      cb(null, { userId: user._id, id: user._id });
    })

    passport.deserializeUser(function(obj, cb) {
      console.log(`deserializeUser: `, obj)
      cb(null, obj);
    })

    googleAuth.initialize()
}

export { login, initialize }
