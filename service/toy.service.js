import fs from 'fs'
import { utilService } from './utils.service.js'

export const toyService = {
  query,
  getById,
  remove,
  save
}

const toys = utilService.readJsonFile('data/toys.json')

function query() {
  console.log(toys)
  let toysToReturn = [...toys]
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
