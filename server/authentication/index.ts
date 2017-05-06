import * as passport from 'passport'

passport.serializeUser(function(user, cb) {
  cb(null, user);
})

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
})

export = {
    login: function(req, res){
      res.render('login')
    },

    initialize: function(app) {
        app.use(passport.initialize())
        app.use(passport.session())
    }
}
