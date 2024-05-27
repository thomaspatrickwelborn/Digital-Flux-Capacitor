import { EventEmitter } from 'node:events'
import Subcycle from '#core/subcycle/index.js'

class Cycle extends EventEmitter {
	constructor($settings) {
		super()
		return this.#start($settings)
	}
	async #start($settings) {
		this.#setSubcycles($settings.subcycles)
		return this
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
			const subcycle = await new Subcycle($subcycleSettings)
			subcycles.set($subcycleName, subcycle)
			subcyclesIndex++
		}
		return this
	}
}

export default Cycle