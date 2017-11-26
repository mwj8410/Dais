#!/usr/bin/env node

'use strict'

const Plinth = require('../src/main')

if (process.argv.indexOf('generate')) {
  // console.log(process.cwd())
  Plinth.generate()
}

process.exitCode = 0
