
/**
 * Define an error class that is user-facing, for API errors.
 *
 * @type {ContentsError}
 */

class ContentsError extends Error {

  constructor(json) {
    super(json.message)
    this.name = 'ContentsError'
    this.code = json.code
    this.message = json.message
    this.status = json.status
    Error.captureStackTrace(this, this.constructor)
  }

}

/**
 * Export.
 *
 * @type {ContentsError}
 */

export default ContentsError
