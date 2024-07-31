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
      this.#_extrapository = new Extrapository({
        databases: this.#databases,
      })
      this.#_extrapository.on(
        'saveCollectDoc', 
        this.#extrapositorySaveCollectDoc.bind(this)
      )
    }
    return this.#_extrapository
  }
  get extrapolatory() {
    if(this.#_extrapolatory) {
      this.#_extrapolatory = new Extrapolatory()
    }
    return this.#_extrapolatory
  }
  #extrapositorySaveCollectDoc($fileDoc) {
    const fileDoc = $fileDoc.toObject()
    console.log('extrapositorySaveCollectDoc', fileDoc)
    // const { operations, permissions, path } = fileDoc.fs
    // if(
    //   operations.add === true &&
    //   this.root.includes(path) === false
    // ) {
    //   switch(fileDoc.fs.type) {
    //     case 'File':
    //       this.addFile(fileDoc)
    //       break
    //     case 'Fold':
    //       this.addFold(fileDoc)
    //       break
    //   }
    // } else
    // if(
    //   operations.update === true &&
    //   this.root.includes(path) === true
    // ) {
    //   // 
    // } else
    // if(
    //   operations.delete === true &&
    //   this.root.includes(path) === true
    // ) {
    //   // 
    // }
  }
}
