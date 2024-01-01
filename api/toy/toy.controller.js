import { loggerService } from '../../service/logger.service.js'
import { dashboardService } from '../dashboard/dashboard.service.js'

// import { toyService } from '../../service/toy.service.js' //read from /data.json
import { toyService } from './toy.service.js'

export async function getToys(req, res) {
  const filterBy = req.query.filterBy
  const sortBy = req.query.sortBy
  const owner = req.query.owner
  const page = req.query.page
  try {
    loggerService.debug('Getting toys', '**FILTERBY:**', filterBy, '**SORTBY**', sortBy, '**OWNER**', owner ? owner : 'no owner', '**PAGE**', page)
    const toys = await toyService.query(filterBy, sortBy, owner, page)
    dashboardService.query()
    res.send(toys)
  } catch (err) {
    loggerService.error('Cannot get toys', err)
    res.status(404).send('cannot get toys')
  }
}

export async function addToy(req, res) {
  const {
    name,
    price,
    labels,
    createdAt,
    inStock,
    img,
    rating,
    stock,
    inventory,
    owner,
  } = req.body
  const toyToSave = {
    name,
    price: +price,
    labels,
    createdAt,
    inStock,
    img,
    rating :+rating,
    stock: +stock,
    inventory: +inventory,
    owner,
  }
  try {
    const toy = await toyService.add(toyToSave)
    res.send(toy)
  } catch (err) {
    loggerService.error('Cannot save toy', err)
    res.status(404).send('cannot save toy')
  }
}

export async function updateToy(req, res) {
  const {
    _id,
    name,
    price,
    labels,
    createdAt,
    inStock,
    img,
    rating,
    stock,
    inventory,
    owner,
  } = req.body
  const toyToSave = {
    _id,
    name,
    price: +price,
    labels,
    createdAt,
    inStock,
    img,
    rating: +rating,
    stock: +stock,
    inventory: +inventory,
    owner,
  }

  try {
    const toy = await toyService.update(toyToSave)
    res.send(toy)
  } catch (err) {
    loggerService.error('Cannot save toy', err)
    res.status(404).send('cannot save toy')
  }
}

export async function getToyById(req, res) {
  const toyId = req.params.toyId
  try {
    const toy = await toyService.getById(toyId)
    res.send(toy)
  } catch (err) {
    loggerService.error('Cannot get toy', err)
    res.status(404).send('Cannot get toy')
  }
}

export async function removeToy(req, res) {
  const toyId = req.params.toyId
  try {
    await toyService.remove(toyId)
    res.send(toyId)
  } catch (err) {
    loggerService.error('cannot remove toy', err)
    res.status(404).send('Cannot remove toy')
  }
}

export async function addToyMsg(req, res) {
  const {toyId, msg} = req.body
  try {
   const savedMsg = await toyService.addToyMsg(toyId, msg)
   res.send(savedMsg)
  } catch (err) {
    loggerService.error('Cannot save msg', err)
    res.status(404).send('cannot save msg')
  }
}