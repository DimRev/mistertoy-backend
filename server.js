import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path,{dirname} from 'path'
import { fileURLToPath } from 'url'

import { toyService } from './service/toy.service.js'
import { userService } from './service/user.service.js'
import { dashboardService } from './service/dashboard.service.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { loggerService } from './service/logger.service.js'
loggerService.info('server.js loaded...')

const app = express()

//Express App Config
app.use(cookieParser())
app.use(express.json())
app.use(express.static('public'))

if(process.env.NODE_ENV === 'production'){
  //Express serve static files on production env
  app.use(express.static(path.resolve(__dirname, 'public')))
  console.log('__dirname: ', __dirname)
} else {
  //Configure CORS
  const corsOptions = {
    //Make sure origin contains the url of your frontend domain
    origin: [
      'http://127.0.0.1:8080',
      'http://localhost:8080',
      'http://127.0.0.1:5173',
      'http://localhost:5173',
    ],
    credentials: true,
  }
  app.use(cors(corsOptions))
}




import { toyRoutes } from './api/toy/toy.routes.js'
app.use('/api/toy', toyRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use ('/api/user', userRoutes)

import { authRoutes } from './api/auth/auth.routes.js'
app.use('/api/auth', authRoutes)

// //Get Toys
// app.get('/api/toy/', (req, res) => {
//   //get query params to filterBy
//   const filterBy = req.query.filterBy
//   const sortBy = req.query.sortBy

//   toyService
//     .query(filterBy, sortBy)
//     .then((toys) => {
//       res.send(toys)
//     })
//     .catch((err) => {
//       loggerService.error('Cannot get toys', err)
//       res.status(404).send('cannot get toys')
//     })
// })

// //Add Toy
// app.post('/api/toy/', (req, res) => {
//   const { name, price, labels, createdAt, inStock, img, stock, inventory } =
//     req.body
//   const toyToSave = {
//     name,
//     price,
//     labels,
//     createdAt,
//     inStock,
//     img,
//     stock,
//     inventory,
//   }
//   toyService
//     .save(toyToSave)
//     .then((toy) => res.send(toy))
//     .catch((err) => {
//       loggerService.error('Cannot save toy', err)
//       res.status(404).send('cannot save toy')
//     })
// })

// //Edit Toy
// app.put('/api/toy/', (req, res) => {
//   const {
//     _id,
//     name,
//     price,
//     labels,
//     createdAt,
//     inStock,
//     img,
//     stock,
//     inventory,
//   } = req.body
//   const toyToSave = {
//     _id,
//     name,
//     price,
//     labels,
//     createdAt,
//     inStock,
//     img,
//     stock,
//     inventory,
//   }
//   toyService
//     .save(toyToSave)
//     .then((toy) => res.send(toy))
//     .catch((err) => {
//       loggerService.error('Cannot save toy', err)
//       res.status(404).send('cannot save toy')
//     })
// })

// //Get Toy
// app.get('/api/toy/:toyId', (req, res) => {
//   const toyId = req.params.toyId
//   toyService
//     .getById(toyId)
//     .then((toy) => {
//       res.send(toy)
//     })
//     .catch((err) => {
//       loggerService.error('Cannot get toy', err)
//       res.status(404).send('Cannot get toy')
//     })
// })

// //Remove Toy
// app.delete('/api/toy/:toyId', (req, res) => {
//   const toyId = req.params.toyId
//   toyService
//     .remove(toyId)
//     .then((toy) => res.send(toy))
//     .catch((err) => {
//       loggerService.error('cannot remove toy', err)
//       res.status(404).send('Cannot remove toy')
//     })
// })

//Get Dashboard Data

app.get('/api/dashboard/', (req, res) => {
  //get query params to filterBy
  const sortBy = req.query.sortBy

  dashboardService
    .query()
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      loggerService.error('Cannot get dashboard data', err)
      res.status(404).send('cannot get dashboard data')
    })
})

app.get('/**', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
