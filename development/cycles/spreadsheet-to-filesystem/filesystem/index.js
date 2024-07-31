import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir, stat } from 'node:fs'
import Root from './root/index.js'
import Extrapository from './extrapository/index.js'
import Extrapolatory from './extrapolatory/index.js'

export default class Filesystem extends EventEmitter {
  #settings
  #_root
  #_extrapository
  #_extrapolatory
   constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.root
    this.extrapository
    this.extrapolatory
  }
  get #databases() { return this.#settings.databases }
  get root() {
    if(this.#_root === undefined) {
      this.#_root = new Root(
        this.#settings.filesystem
      )
    }
    return this.#_root
  }
  get extrapository() {
    if(this.#_extrapository === undefined) {
      const extrapolatoryInputBind = this.extrapolatory.input
      .bind(this.extrapolatory)
      this.#_extrapository = new Extrapository({
        databases: this.#databases,
      })
      this.#_extrapository.on(
        'saveCollectDoc', 
        extrapolatoryInputBind
      )
    }
    return this.#_extrapository
  }
  get extrapolatory() {
    if(this.#_extrapolatory === undefined) {
      this.#_extrapolatory = new Extrapolatory({
        root: this.root
      })
    }
    return this.#_extrapolatory
  }
}
