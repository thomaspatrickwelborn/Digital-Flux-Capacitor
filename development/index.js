import '#utils/persist/index.js'
import path from 'node:path'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import {
	asyncReadFile,
	typeOf,
} from '#utils/index.js'
import Capacitor from '#core/capacitor/index.js'

const argv = yargs(hideBin(process.argv)).argv
const configPath = path.join(
	process.env.PWD,
	argv.config
)
const config = await asyncReadFile(configPath)
.then(($file) => JSON.parse($file))
const capacitor = await new Capacitor(config)
