import fs from 'fs'
import { utilService } from './utils.service.js'

export const toyService = {
  query,
  getById,
  remove,
  save,
}

const toys = utilService.readJsonFile('data/toys.json')

function query(filterBy, sortBy) {
  let toysToReturn = [...toys]
  if (filterBy.name) {
    const regex = new RegExp(filterBy.name, 'i')
    toysToReturn = toys.filter((toy) => regex.test(toy.name))
  }
  switch (filterBy.stockStatus) {
    case 'all':
      break
    case 'inStock':
      toysToReturn = toysToReturn.filter((toy) => toy.inStock)
      break
    case 'notInStock':
      toysToReturn = toysToReturn.filter((toy) => !toy.inStock)
      break
  }
  switch (sortBy) {
    case 'name':
      toysToReturn = toysToReturn.sort((t1, t2) =>
        t1.name.localeCompare(t2.name)
      )
      break
    case 'price':
      toysToReturn = toysToReturn.sort((t1, t2) => t1.price - t2.price)
      break
    case 'date':
      toysToReturn = toysToReturn.sort((t1, t2) => t2.createdAt - t1.createdAt)
      break
  }
  return Promise.resolve(toysToReturn)
}

function getById(toyId) {
  const toy = toys.find((toy) => {
    return toy._id === toyId
  })
  if (!toy) return Promise.reject('Toy does not exist')

  return Promise.resolve(toy)
}

function remove(toyId) {
  const toyIdx = toys.findIndex((toy) => toy._id === toyId)
  if (toyIdx === -1) return Promise.reject('Toy does not exist')
  toys.splice(toyIdx, 1)
  return _saveToysToFile()
}

function save(toy) {
  if (toy._id) {
    const toyIdx = toys.findIndex((currToy) => currToy._id === toy._id)
    toys[toyIdx] = toy
  } else {
    toy._id = utilService.makeId()
    toys.unshift(toy)
  }
  return _saveToysToFile()
    .then(() => toy)
    .catch((err) => reject(err))
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 2)
    fs.writeFile('data/toys.json', data, (err) => {
      if (err) {
        console.error('Could not save toy changes', err)
        return reject(err)
      }
      resolve()
    })
  })
}
