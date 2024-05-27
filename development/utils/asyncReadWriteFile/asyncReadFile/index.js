import { Buffer } from 'node:buffer'
import { createReadStream } from 'node:fs'

const asyncReadFile = function($path, $options = {
	autoClose: true,
	flush: true,
	encoding: null,
}) {
	const readStream = createReadStream($path, $options)
	return new Promise(
		($resolve, $reject) => {
			var data = []
			readStream.on('data', function readStreamData($chunk) {
				data.push($chunk)
			})
			readStream.on('end', function readStreamEnd() {
				$resolve(Buffer.concat(data))
			})
			readStream.on('error', function readStreamError($err) {
				$reject($err)
			})
		}
	)
}

export default asyncReadFile