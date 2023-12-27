import fs from 'fs'
import { utilService } from './utils.service.js'

export const dashboardService = {
  query,
}

const demoData = {
  pricePerLabel: {
    'On wheels': 10,
    'Box game': 20,
    Art: 30,
    Baby: 40,
    Doll: 30,
    Puzzle: 20,
    Outdoor: 10,
    'Battery Powered': 5,
  },
  inventoryByLabel: {
    'On wheels': 3,
    'Box game': 4,
    Art: 5,
    Baby: 2,
    Doll: 3,
    Puzzle: 2,
    Outdoor: 7,
    'Battery Powered': 9,
  },
  totalByLabel: {
    'On wheels': 10,
    'Box game': 6,
    Art: 15,
    Baby: 22,
    Doll: 7,
    Puzzle: 5,
    Outdoor: 10,
    'Battery Powered': 9,
  },
}

const labels = [
  'On wheels',
  'Box game',
  'Art',
  'Baby',
  'Doll',
  'Puzzle',
  'Outdoor',
  'Battery Powered',
]


function query() {
  const toys = utilService.readJsonFile('data/toys.json')
  let pricePerLabel = {}
  let inventoryByLabel = {}
  let totalByLabel = {}
  let labelCount = {}

  for (const label of labels) {
    let count = 0
    let sum = toys.reduce((acc, toy) => {
      if (toy.labels.includes(label)) {
        let price = +toy.price
        count++
        acc = acc + price
      }
      return acc
    }, 0)
    console.log(`sum: ${sum}, count:${count}, avg: ${sum/count}, label: ${label}`);
    pricePerLabel[label] = Math.floor(sum/count)
  }
  console.log(pricePerLabel);
}
