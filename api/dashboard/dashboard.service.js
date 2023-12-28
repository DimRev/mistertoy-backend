import { ObjectId } from 'mongodb'

import { utilService } from '../../service/utils.service.js'
import { loggerService } from '../../service/logger.service.js'
import { dbService } from '../../service/db.service.js'

export const dashboardService = {
  query,
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

async function query() {
  const chartData = {
    pricePerLabel: {},
    inventoryByLabel: {},
    totalByLabel: {},
  }

  for (const label of labels) {
    try {
      const filterCriteria = { labels: { $in: [label] } }
      const collection = await dbService.getCollection('toy')
      var toys = await collection.find(filterCriteria).toArray()

      let priceSum = toys.reduce((acc, currToy) => {
        return acc + currToy.price
      }, 0)

      let inventorySum = toys.reduce((acc, currToy) => {
        return acc + currToy.inventory
      }, 0)

      let stockSum = toys.reduce((acc, currToy) => {
        return acc + currToy.stock
      }, 0)

      chartData.pricePerLabel[label] = Math.floor(priceSum / toys.length)
      chartData.inventoryByLabel[label] = Math.floor(inventorySum)
      chartData.totalByLabel[label] = Math.floor(stockSum)

    } catch (err) {
      loggerService.error('cannot find toys', err)
      throw err
    }
  }
  return chartData
}
