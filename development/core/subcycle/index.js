import path from 'node:path'
import { EventEmitter } from 'node:events'
import flux from '../../flux/index.js'
class Subcycle extends EventEmitter {
	constructor($settings) {
		super()
		this.#settings = $settings
		return this.#start($settings)
	}
	#settings
	async #start($settings) {
		const preflux = $settings.preflux
		const Flux = flux[$settings.flux]
		this.flux = await new Flux($settings)
		if(preflux !== undefined) {
			preflux.on('output', this.#prefluxOutput.bind(this))
		}
		return this
	}
	flux
	#prefluxOutput() {
		if(this.flux.input !== undefined) {
			this.flux.input(...arguments)
		}
	}
}

export default Subcycle