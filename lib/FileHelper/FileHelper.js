'use strict'

// Core Modules
const path = require('path')

const FileHelper = {

  pathUp: (pathString) => {
    let pathParts = pathString.split(path.sep)
    pathParts.pop()
    return pathParts.join(path.sep)
  }

}

module.exports = FileHelper
