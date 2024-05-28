import path from 'node:path'
import { EventEmitter } from 'node:events'
import flux from '../../flux/index.js'
class Subcycle extends EventEmitter {
	#settings = {}
	constructor($settings = {}) {
		super()
		this.#settings = $settings
	}
	flux
	#prefluxOutput() {
		if(this.flux.input !== undefined) {
			this.flux.input(...arguments)
		}
	}
	async start() {
		const preflux = this.#settings.preflux
		const Flux = flux[this.#settings.flux]
		this.flux = new Flux(this.#settings)
		await this.flux.start()
		if(preflux !== undefined) {
			preflux.on('output', this.#prefluxOutput.bind(this))
		}
		return this
	}
}

export default Subcycle