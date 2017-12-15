

import fetch from 'isomorphic-fetch'
import pathToRegexp from 'path-to-regexp'
import querystring from 'query-string'

import ContentsError from './error'
import RESOURCES from './resources'

/**
 * Contents.
 *
 * @type {Contents}
 */

class Contents {

  /**
   * Constructor.
   *
   * @param {String|Object} config
   */

  constructor(config) {
    if (typeof config == 'string') {
      config = { token: config }
    }

    const {
      host = 'https://api.contents.io',
      token = null,
    } = config

    this.config = {
      host,
      token,
    }

    for (const key in RESOURCES) {
      const methods = RESOURCES[key]
      this[key] = this.constructResource(key, methods)
    }
  }

  /**
   * Construct a resource object with `methods`.
   *
   * @param {String} name
   * @param {Object} methods
   * @return {Object}
   */

  constructResource(name, methods) {
    const resource = {}

    for (let key in methods) {
      let config = methods[key]
      resource[key] = typeof config == 'string'
        ? (...args) => resource[config](...args)
        : this.constructMethod(name, key, config)
    }

    return resource
  }

  /**
   * Construct a method for a resource with `config`.
   *
   * @param {String} resource
   * @param {String} name
   * @param {Object} config
   */

  constructMethod(resource, name, config) {
    const { method, path } = config
    const hasBody = method == 'POST' || method == 'PATCH'
    const tokens = pathToRegexp.parse(path)
    const identifier = `${resource}.${name}()`

    return async (...args) => {
      let uri = ''
      let body

      tokens.forEach((token) => {
        if (typeof token == 'string') {
          uri += token
          return
        }

        const param = args.shift()
        if (typeof param != 'string') throw new Error(`Invalid parameter "${token.name}": ${param}`)
        uri += `${token.delimiter}${param}`
      })

      if (hasBody) {
        body = args.shift()
        if (!body) throw new Error(`No \`body\` parameter passed for ${identifier}.`)
      }

      const options = args.shift() || {}
      const query = querystring.stringify(options)
      if (query) uri += `?${query}`

      const res = await this.fetch(uri, { method, body })
      const json = await res.json()

      if (!res.ok) {
        const message = `${identifier} - ${json.error.message}`
        const error = { ...json.error, message }
        this.throw(error)
      }

      return json
    }
  }

  /**
   * Initiate a fetch from the API with `path` and `options`.
   *
   * @param {String} path
   * @param {Object} options
   * @return {Promise}
   */

  fetch = async (path, options = {}) => {
    const { host, token } = this.config
    const url = `${host}${path}`
    const body = options.body ? JSON.stringify(options.body) : null
    const headers = {
      ...(options.headers || {}),
      'Content-Type': 'application/json',
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return await fetch(url, { ...options, body, headers })
  }

  /**
   * Throw an error from a response's `error` JSON representation, or simply
   * re-throw an existing error object.
   *
   * @param {Error|Object} error
   */

  throw = (error) => {
    if (error instanceof Error) throw error
    throw new ContentsError(error)
  }

}

/**
 * Export.
 *
 * @type {Contents}
 */

export default Contents
