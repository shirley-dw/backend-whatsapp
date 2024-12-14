
/* Logica del /api/status */

import express from 'express'
import { postPingController } from '../controllers/status.controller.js'

const statusRouter = express.Router()


statusRouter.post('/ping', postPingController)
statusRouter.get('/ping', (req, res) =>
    req.sendStatus(200)
)

export default statusRouter

