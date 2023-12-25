import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './service/toy.service.js'
import { userService } from './service/user.service.js'
import { loggerService } from './service/logger.service.js'

const app = express()

// Express Config:
const corsOptions = {
  origin: [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ],
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

//Get Toys
app.get('/api/toy/', (req, res) => {
  toyService
    .query()
    .then((toys) => {
      res.send(toys)
    })
    .catch((err) => {
      loggerService.error('Cannot get toys', err)
      res.status(404).send('cannot get toys')
    })
})

//Add Toy
app.post('/api/toy/', (req, res) => {
  const { name, price, labels, createdAt, inStock } = req.body
  const toyToSave = { name, price, labels, createdAt, inStock }
  toyService
    .save(toyToSave)
    .then((toy) => res.send(toy))
    .catch((err) => {
      loggerService.error('Cannot save toy', err)
      res.status(404).send('cannot save toy')
    })
})

//Edit Toy
app.put('/api/toy/', (req, res) => {
  const { _id, name, price, labels, createdAt, inStock } = req.body
  const toyToSave = { _id, name, price, labels, createdAt, inStock }
  toyService
    .save(toyToSave)
    .then((toy) => res.send(toy))
    .catch((err) => {
      loggerService.error('Cannot save toy', err)
      res.status(404).send('cannot save toy')
    })
})

//Get Toy
app.get('/api/toy/:toyId', (req, res) => {
  const toyId = req.params.toyId
  toyService
    .getById(toyId)
    .then((toy) => {
      res.send(toy)
    })
    .catch((err) => {
      loggerService.error('Cannot get toy', err)
      res.status(404).send('Cannot get toy')
    })
})

//Remove Toy
app.delete('/api/toy/:toyId', (req, res) => {
  const toyId = req.params.toyId
  toyService
    .remove(toyId)
    .then((toy) => res.send(toy))
    .catch((err) => {
      loggerService.error('cannot remove toy', err)
      res.status(404).send('Cannot remove toy')
    })
})

// AUTH API
// AUTH API
app.get('/api/user', (req, res) => {
  userService
    .query()
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      loggerService.error('Cannot load users', err)
      res.status(400).send('Cannot load users')
    })
})

app.post('/api/auth/login', (req, res) => {
  const credentials = req.body
  console.log(credentials);
  userService.checkLogin(credentials).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      loggerService.info('Invalid Credentials', credentials)
      res.status(401).send('Invalid Credentials')
    }
  })
})

app.post('/api/auth/signup', (req, res) => {
  const credentials = req.body
  userService.save(credentials).then((user) => {
    if (user) {
      const loginToken = userService.getLoginToken(user)
      res.cookie('loginToken', loginToken)
      res.send(user)
    } else {
      loggerService.info('Cannot signup', credentials)
      res.status(400).send('Cannot signup')
    }
  })
})

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('loginToken')
  res.send('logged-out!')
})

app.put('/api/user', (req, res) => {
  const loggedinUser = userService.validateToken(req.cookies.loginToken)
  if (!loggedinUser) return res.status(400).send('No logged in user')
  const { diff } = req.body
  if (loggedinUser.score + diff < 0) return res.status(400).send('No credit')
  loggedinUser.score += diff
  return userService.save(loggedinUser).then((user) => {
    const token = userService.getLoginToken(user)
    res.cookie('loginToken', token)
    res.send(user)
  })
})

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const PORT = 3030
app.listen(PORT, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
