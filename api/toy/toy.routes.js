import express from 'express'
import { addToy, addToyMsg, getToyById, getToys, removeToy, updateToy } from './toy.controller.js'

export const toyRoutes = express.Router()

toyRoutes.get('/', getToys)
toyRoutes.get('/:toyId', getToyById)
toyRoutes.post('/', addToy)
toyRoutes.put('/', updateToy)
toyRoutes.post('/msg', addToyMsg)
toyRoutes.delete('/:toyId', removeToy)