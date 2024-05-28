import { EventEmitter } from 'node:events'
import Subcycle from '#core/subcycle/index.js'

class Cycle extends EventEmitter {
	#settings = {}
	constructor($settings = {}) {
		super()
		this.#settings = $settings
	}
	#subcycles = new Map()
	async #setSubcycles($subcycles) {
		const subcycles = this.#subcycles
		const subcyclesLength = $subcycles.length
		var subcyclesIndex = 0
		while(subcyclesIndex < subcyclesLength) {
			const [
				$subcycleName, $subcycleSettings
			] = $subcycles[subcyclesIndex]
			if(subcyclesIndex > 0) {
				$subcycleSettings.preflux = Array.from(
					subcycles.values()
				)
				.at(subcyclesIndex - 1)
				.flux
			}
			const subcycle = new Subcycle($subcycleSettings)
			await subcycle.start()
			subcycles.set($subcycleName, subcycle)
			subcyclesIndex++
		}
		return this
	}
	async start() {
		await this.#setSubcycles(this.#settings.subcycles)
		return this
	}
}

export default Cycle