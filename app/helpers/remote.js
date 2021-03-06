import fetch from 'isomorphic-fetch'
import auth from './auth'

const testing = process.env.NODE_ENV === 'test'
const apiUrl = testing ? 'http://localhost/api/' : 'api/'

let getConfig = (payload, typeQuery) => {
  let config = {
    headers: {}
  }
  if (payload) {
    config.body = JSON.stringify(payload)
    config.headers['Accept'] = 'application/json'
    config.headers['Content-Type'] = 'application/json'
  }
  config.method = typeQuery.toUpperCase()
  if (auth.loggedIn()) {
    config.headers['Authorization'] = `Bearer ${auth.getToken()}`
  }
  return config
}

let asyncRequest = (path, typeQuery, payload, cb) =>
  fetch(apiUrl + path, getConfig(payload, typeQuery))
  .then(response => {
    if (!response.ok) {
      throw ({
        message: response.statusText + ' (' + response.status + ')'
      })
    }
    return response.json()
  })
  .then(json => cb(json.error ? null : json, json.error ? json : null))
  .catch(error => cb(null, error))

export default asyncRequest
