import * as express from 'express'

function controller(req: express.Request, res: express.Response, next: express.NextFunction) {

    res.render('index', {
        title: 'Express'
    })

}


export { controller }
