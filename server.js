import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { toyService } from './service/toy.service.js'
import { loggerService } from './service/logger.service.js'

const app = express()

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
  console.log(req.params)
  toyService
    .remove(toyId)
    .then((toy) => res.send(toy))
    .catch((err) => {
      loggerService.error('cannot remove toy', err)
      res.status(404).send('Cannot remove toy')
    })
})

// // AUTH API
// app.get('/api/user', (req, res) => {
//   userService
//     .query()
//     .then((users) => {
//       res.send(users)
//     })
//     .catch((err) => {
//       console.log('Cannot load users', err)
//       res.status(400).send('Cannot load users')
//     })
// })

// app.put('/api/user', (req, res) => {
//   console.log(req.body)
//   const { _id, username, fullname, password, isAdmin } = req.body
//   const userToSave = { _id, username, fullname, password, isAdmin }
//   userService
//     .save(userToSave)
//     .then((user) => res.send(user))
//     .catch((err) => {
//       loggerService.error('Cannot save user', err)
//       res.status(404).send('Cannot save user')
//     })
// })

// app.delete('/api/user/:userId', (req, res) => {
//   const userId = req.params.userId
//   userService
//     .remove(userId)
//     .then((user) => res.send(user))
//     .catch((err) => {
//       loggerService.error('cannot remove user', err)
//       res.status(404).send('Cannot remove user')
//     })
// })

// app.post('/api/auth/login', (req, res) => {
//   const credentials = req.body
//   userService
//     .checkLogin(credentials)
//     .then((user) => {
//       if (user) {
//         const loginToken = userService.getLoginToken(user)
//         res.cookie('loginToken', loginToken)
//         res.send(user)
//       } else {
//         res.status(401).send('Invalid Credentials')
//       }
//     })
//     .catch((err) => {
//       res.status(401).send(err)
//     })
// })

// app.post('/api/auth/signup', (req, res) => {
//   const credentials = req.body
//   userService
//     .save(credentials)
//     .then((user) => {
//       if (user) {
//         const loginToken = userService.getLoginToken(user)
//         res.cookie('loginToken', loginToken)
//         res.send(user)
//       } else {
//         res.status(400).send('Cannot signup')
//       }
//     })
//     .catch((err) => {
//       res.status(400).send(err)
//     })
// })

// app.post('/api/auth/logout', (req, res) => {
//   res.clearCookie('loginToken')
//   res.send('logged-out!')
// })

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const PORT = 3030
app.listen(PORT, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
