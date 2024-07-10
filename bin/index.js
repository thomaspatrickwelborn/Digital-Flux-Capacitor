#!/usr/bin/env node
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import '../development/utils/persist/index.js'
import Capacitor from '../development/index.js'
const argv = yargs(hideBin(process.argv)).argv
const configPath = path.join(
  process.env.PWD,
  argv.config
)
const configFile = await readFile(configPath)
.then(($file) => JSON.parse($file))
const capacitor = new Capacitor(configFile)
