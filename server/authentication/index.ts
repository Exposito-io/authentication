import * as passport from 'passport'
import * as googleAuth from './google'


function login(req, res){
  res.render('login')
}

function initialize(app) {
    app.use(passport.initialize())
    app.use(passport.session())

    passport.serializeUser(function(user, cb) {
      cb(null, { userId: user._id });
    })

    passport.deserializeUser(function(obj, cb) {
      cb(null, obj);
    })

    googleAuth.initialize()
}

export { login, initialize }
