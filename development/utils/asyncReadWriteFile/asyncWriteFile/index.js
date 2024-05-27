import util from 'util'
import stream from 'stream'
import { createWriteStream } from 'fs'
import { once } from 'events'

const finished = util.promisify(stream.finished)

const asyncWriteFile = async function($filepath, $filedata, $options = {
	autoClose: true,
	flush: true,
	encoding: null,
}) {
	const writeStream = createWriteStream($filepath, $options)
	await writeStream.write($filedata, $options.encoding)
	writeStream.end()
	await finished(writeStream)
}

export default asyncWriteFile