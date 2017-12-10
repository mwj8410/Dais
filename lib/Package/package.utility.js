'use strict'

const pacakgeFile = require('../../package.json')

const PackageUtil = {
  getName () {
    return pacakgeFile.name
  },

  getVersion () {
    return pacakgeFile.version
  }
}

module.exports = PackageUtil
