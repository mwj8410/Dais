/* global module */
'use strict'

// Core modules
const path = require('path')

// External Modules
const objectHelpers = require('@phaesynthe/object-helpers/src/Object-Helpers.module') // ToDo: correct

// Internal Modules
const FileAccumulator = require('../FileAccumulator/FileAccumulator')

// Internal Values

class Configuration {
  constructor (baseConfigPath) {
    if (!baseConfigPath) {
      // Must be instantiated with a base configuration path
      return
    }
    this._configStore = {}

    // For each *.config.js file in the baseConfigPath
    // create abase object off this._configStore with the file name
    const baseConfigFileNames = FileAccumulator(baseConfigPath)
    // and associate the exported object with that key
    baseConfigFileNames
    .filter((filePath) => /.config.js$/.test(filePath))
    .forEach((filePath) => {
      const pathObj = path.parse(filePath)
      const key = pathObj.name.split('.')[0]

      this._configStore[ key ] = require(filePath)
    })

    this.appendDir = this.appendDir.bind(this)
    this.appendLocal = this.appendLocal.bind(this)
    this.appendObject = this.appendObject.bind(this)
  }

  appendDir (dir) {
    const newConfigFileNames = FileAccumulator(dir)

    FileAccumulator(dir)
    .filter((filePath) => /.config.js$/.test(filePath))
    .forEach((filePath) => {
      const pathObj = path.parse(filePath)
      const key = pathObj.name.split('.')[0]

      if (this._configStore[ key ]) {
        this._configStore[ key ] = objectHelpers.merge(this._configStore[ key ], require(filePath))
        return
      }

      this._configStore[ key ] = require(filePath)
    })

  }

  appendLocal () {
    console.log('appending by file')

  }

  /**
   * Merges the provided config object into the and existing configuration. The provided Object will take pririty
   * over existing values.
   *
   * @param {string} key the access key for the configuration
   * @param {object} config
   * @returns boolean indicating if the operation succeeded.
   */
  appendObject (key, config) {
    console.log('appending an object')
    if (!key || typeof key !== 'string') {
      // ToDo: log
      return false
    }

    if (!config || typeof config !== 'object') {
      // ToDo: log
      return false
    }

    return true
  }

  /**
   * Retrieves a configuration
   * @param {string} name The key name for the configuration to get
   * @returns {object} Undefined or the config object
   */
  get (name) {
    return this._configStore[ name ] || {}
  }
}

module.exports = Configuration
