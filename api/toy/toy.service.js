import { ObjectId } from 'mongodb'

import { utilService } from '../../service/utils.service.js'
import { loggerService } from '../../service/logger.service.js'
import { dbService } from '../../service/db.service.js'

export const toyService = {
  remove,
  query,
  getById,
  add,
  update,
  addToyMsg,
  removeToyMsg,
}

async function query(filterBy = { name: '' }, sortBy = 'name', page) {
  try {
    const ITEMS_PER_PAGE = 6
    const filterCriteria = {}
    let sortCriteria

    if (filterBy.name) {
      filterCriteria.name = { $regex: filterBy.name, $options: 'i' }
    }

    if (filterBy.labels.includes('All')) {
    } else if (filterBy.labels) {
      filterCriteria.labels = { $all: filterBy.labels }
    }

    if (filterBy.stockStatus === 'all') {
    } else if (filterBy.stockStatus === 'inStock') {
      filterCriteria.inStock = true
    } else if (filterBy.stockStatus === 'notInStock') {
      filterCriteria.inStock = false
    }

    if (sortBy === 'name') {
      sortCriteria = { name: 1 }
    } else if (sortBy === 'price') {
      sortCriteria = { price: 1 }
    } else if (sortBy === 'date') {
      sortCriteria = { createdAt: -1 }
    }

    const collection = await dbService.getCollection('toy');
    const totalItems = await collection.find(filterCriteria).count();

    const skipAmount = (page - 1) * ITEMS_PER_PAGE;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    const toys = await collection
      .find(filterCriteria)
      .sort(sortCriteria)
      .skip(skipAmount)
      .limit(ITEMS_PER_PAGE)
      .toArray();

    return { toys, totalPages };
  } catch (err) {
    loggerService.error('cannot find toys', err)
    throw err
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    const toy = await collection.findOne({ _id: new ObjectId(toyId) })
    return toy
  } catch (err) {
    loggerService.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.deleteOne({ _id: new ObjectId(toyId) })
  } catch (err) {
    loggerService.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.insertOne(toy)
    return toy
  } catch (err) {
    loggerService.error('cannot insert toy', err)
    throw err
  }
}

async function update(toy) {
  const toyToSave = {
    name: toy.name,
    price: +toy.price,
    labels: toy.labels,
    createdAt: toy.createdAt,
    inStock: toy.inStock,
    img: toy.img,
    stock: +toy.stock,
    inventory: +toy.inventory,
    owner: toy.owner,
  }
  try {
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: new ObjectId(toy._id) },
      { $set: toyToSave }
    )
    return toy
  } catch (err) {
    loggerService.error(`cannot update toy ${toy._id}`, err)
    throw err
  }
}

async function addToyMsg(toyId, msg) {
  try {
    msg.id = utilService.makeId()
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: new ObjectId(toyId) },
      { $push: { msgs: msg } }
    )
    return msg
  } catch (err) {
    loggerService.error(`cannot add toy msg ${toyId}`, err)
    throw err
  }
}

async function removeToyMsg(toyId, msgId) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: new ObjectId(toyId) },
      { $pull: { msgs: { id: msgId } } }
    )
    return msgId
  } catch (err) {
    loggerService.error(`cannot add toy msg ${toyId}`, err)
    throw err
  }
}
