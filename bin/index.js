#!/usr/bin/env node
import inspector from 'node:inspector'
import '../development/utils/persist/index.js'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import Capacitor from '../development/index.js'
const argv = yargs(hideBin(process.argv)).argv
if(argv.inspect) {
  if(typeof argv.inspect === 'boolean') {
    inspector.open()
  } else {
    const [$host, $port] = argv.inspect.split(':')
    if($host && $port) {
      inspector.open($host, $port)
    } else
    if($host) {
      inspector.open($host)
    }
  } 
}
const configPath = path.join(
  process.env.PWD,
  argv.config
)
const configFile = await readFile(configPath)
.then(($file) => JSON.parse($file))
const capacitor = new Capacitor(configFile)
