import fs from 'fs'
import { utilService } from './utils.service.js'

export const bugService = {
  query,
  getById,
  remove,
  save,
}
const PAGE_SIZE = 3
const bugs = utilService.readJsonFile('data/bugs.json')

function query(filterBy, sortBy) {
  let bugsToReturn = bugs

  // Filter -> Sort -> Pagination

  //* Filter
  if (filterBy.title) {
    const regExp = new RegExp(filterBy.title, 'i')
    bugsToReturn = bugsToReturn.filter((bug) => {
      return regExp.test(bug.title) || regExp.test(bug.description)
    })
  }
  if (filterBy.severity) {
    bugsToReturn = bugsToReturn.filter(
      (bug) => bug.severity > filterBy.severity
    )
  }
  if (filterBy.submittedBy_id) {
    bugsToReturn = bugsToReturn.filter(
      (bug) => bug.submittedBy._id === filterBy.submittedBy_id
    )
  }

  //* Sort
  switch (sortBy.type) {
    case 'title':
      bugsToReturn.sort(
        (bugA, bugB) => bugA.title.localeCompare(bugB.title) * sortBy.dir
      )
    case 'severity':
      bugsToReturn.sort(
        (bugA, bugB) => (bugA.severity - bugB.severity) * sortBy.dir
      )
    case 'date':
      bugsToReturn.sort(
        (bugA, bugB) => (bugA.createdAt - bugB.createdAt) * sortBy.dir
      )
  }

  //* Pagination
  if (filterBy.pageIdx !== undefined) {
    const maxIdx = Math.ceil(bugsToReturn.length / PAGE_SIZE)
    let startIdx = filterBy.pageIdx * PAGE_SIZE
    if (startIdx > maxIdx) startIdx = maxIdx

    //TODO: Send maxIdx value to BugIndex

    bugsToReturn = bugsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
  }

  return Promise.resolve(bugsToReturn)
}

function getById(bugId) {
  const bug = bugs.find((bug) => {
    return bug._id === bugId
  })
  if (!bug) return Promise.reject('Bug does not exist!')

  return Promise.resolve(bug)
}

function remove(bugId) {
  const bugIdx = bugs.findIndex((bug) => bug._id === bugId)
  if (bugIdx === -1) return Promise.reject('bug does not exist')
  bugs.splice(bugIdx, 1)
  return _saveBugsToFile()
}

function save(bug) {
  if (bug._id) {
    const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
    bugs[bugIdx] = bug
  } else {
    bug._id = utilService.makeId()
    bug.createdAt = Date.now()
    bugs.unshift(bug)
  }

  return _saveBugsToFile()
    .then(() => bug)
    .catch((err) => reject(err))
}

function _saveBugsToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(bugs, null, 2)
    fs.writeFile('data/bugs.json', data, (err) => {
      if (err) {
        console.error('Could not save bug changes', err)
        return reject(err)
      }
      resolve()
    })
  })
}
