import { EventEmitter } from 'node:events'
import path from 'node:path'
import { mkdir } from 'node:fs/promises'
import Cycle from '#core/cycle/index.js'

class Capacitor extends EventEmitter {
	#settings = {}
	constructor($settings = {}) {
		super()
		this.#settings = $settings
	}
	#project
	async #setProject($project) {
		this.#project = $project
		await mkdir($project.path, { recursive: true })
		return this
	}
	#_cycles = new Map()
	get #cycles() { return this.#_cycles }
	set #cycles($cycles) {
		const _cycles = this.#_cycles
		const [$cycleName, $cycleSettings] = $cycle
		const cycle = new Cycle($cycleSettings)
		await cycle.start()
		cycles.set($cycleName, cycle)
		return this
	}
	async start() {
		await this.#setProject(this.#settings.project)
		await this.#setCycles(this.#settings.cycle)
		return this
	}
}

export default Capacitor