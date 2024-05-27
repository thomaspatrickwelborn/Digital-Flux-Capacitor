import { EventEmitter } from 'node:events'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import Cycle from '#core/cycle/index.js'

class Capacitor extends EventEmitter {
	constructor($settings) {
		super()
		return this.#start($settings)
	}
	async #start($settings) {
		await this.#setProject($settings.project)
		await this.#setCycles($settings.cycle)
		return this
	}
	#project
	async #setProject($project) {
		this.#project = $project
		await mkdir($project.path, { recursive: true })
		return this
	}
	#cycles = new Map()
	async #setCycles($cycle) {
		const cycles = this.#cycles
		const [$cycleName, $cycleSettings] = $cycle
		const cycle = await new Cycle($cycleSettings)
		cycles.set($cycleName, cycle)
		return this
	}
}

export default Capacitor