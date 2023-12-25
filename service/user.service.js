import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from './utils.service.js'

const cryptr = new Cryptr(process.env.DB_KEY || 'secret-puk-1234')

let users = utilService.readJsonFile('data/user.json')

export const userService = {
  query,
  getById,
  remove,
  save,
  checkLogin,
  getLoginToken,
  validateToken,
}

function getLoginToken(user) {
  const str = JSON.stringify(user)
  const encryptedStr = cryptr.encrypt(str)
  return encryptedStr
}

function validateToken(token) {
  const str = cryptr.decrypt(token)
  const user = JSON.parse(str)
  return user
}

function checkLogin({ username, password }) {
  var user = users.find((user) => user.username === username)
  if (user && user.password === password) {
    user = {
      _id: user._id,
      fullname: user.fullname,
      isAdmin: user.isAdmin,
    }
    return Promise.resolve(user)
  }
  return Promise.reject('Invalid login / password')
}

function query() {
  return Promise.resolve(users)
}

function getById(userId) {
  const user = users.find((user) => user._id === userId)
  if (!user) return Promise.reject('User not found!')
  return Promise.resolve(user)
}

function remove(userId) {
  users = users.filter((user) => user._id !== userId)
  return _saveUsersToFile()
}

function save(userToSave) {
  let newUser
  if (userToSave._id) {
    const userIdx = users.findIndex(
      (currUser) => currUser._id === userToSave._id
    )
    users[userIdx] = userToSave
    newUser = userToSave
  } else {
    //Case: No username/password/fullname
    if (!userToSave.username || !userToSave.password || !userToSave.fullname)
      return Promise.reject('Unable to create a user')
    //Case: Username taken
    if (users.some((user) => user.username === userToSave.username))
      return Promise.reject('Username unavailable')

    const { username, password, fullname } = userToSave
    const _id = utilService.makeId()
    newUser = { _id, username, password, fullname }
    users.push(newUser)
  }

  return _saveUsersToFile().then(() => newUser)
}

function _saveUsersToFile() {
  return new Promise((resolve, reject) => {
    const usersStr = JSON.stringify(users, null, 2)
    fs.writeFile('data/user.json', usersStr, (err) => {
      if (err) {
        return console.log(err)
      }
      resolve()
    })
  })
}
