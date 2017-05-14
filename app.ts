/// <reference path="./types/undefined.d.ts" />

import * as express from 'express'
import * as path from 'path'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as root from 'app-root-path'
import * as cookieParser from 'cookie-parser'
import * as routes from './server/routes'
import * as authentication from './server/authentication'
import * as session from 'express-session'
import * as connectRedis from 'connect-redis'
import {Strategy as GoogleStrategy} from 'passport-google-oauth2'




const app = express()

// view engine setup
app.set('views', `${root}/server/views/`)
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(cookieParser())


// Setup session management

let RedisStore = connectRedis(session)

app.use(session({
    store: new RedisStore({ host: 'localhost', port: 6379 }),
    secret: 'keyboard  fwaefaewf awefaewf cat',
    resave: false,
    saveUninitialized: false,
    rolling: true
}))





// Initialize Passport and restore authentication state, if any, from the
// session.
authentication.initialize(app)






app.use('/', routes)


app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user })
  })


// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    let err: any = new Error('Not Found')
    err.status = 404
    next(err)
})

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status || 500)
        res.render('error', {
            message: err.message,
            error: err
        })
    })
}

app.use(function(err: any, req: express.Request, res: express.Response, next: Function) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

export = app
