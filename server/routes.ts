import * as express from 'express'
import * as homepage from './homepage'
import { login } from './authentication'
import * as googleAuth from './authentication/google'

const router = express.Router()

router.get('/', homepage.controller)

router.get('/login', login)
router.get('/login/google', googleAuth.login)
router.get('/login/google/return', googleAuth.loginReturnMiddleware, googleAuth.loginReturn)




export = router
