import { EventEmitter } from 'node:events'
import Add from './Add/index.js'
import Update from './Update/index.js'
import Delete from './Delete/index.js'

export default class Operatives extends EventEmitter {
  #settings
  constructor($settings) {
    super()
    this.#settings = $settings
  }
  // ADD
  #_add
  get add() {
    if(this.#_add === undefined) {
      this.#_add = new Add(this.#settings)
    }
    return this.#addFace
  }
  #addFace($fileDoc) {
    switch($fileDoc.fs.type) {
      case 'file':
        this.#_add.file($fileDoc)
        break
      case 'fold':
        this.#_add.fold($fileDoc)
        break
    }
  }
  // UPDATE
  #_update
  get update() {
    if(this.#_update === undefined) {
      this.#_update = new Update(this.#settings)
    }
    return this.#updateFace
  }
  #updateFace($fileDoc) {
    switch($fileDoc.fs.type) {
      case 'file':
        this.#_update.file($fileDoc)
        break
      case 'fold':
        this.#_update.fold($fileDoc)
        break
    }
  }
  // DELETE
  #_delete
  get delete() {
    if(this.#_delete === undefined) {
      this.#_delete = new Delete(this.#settings)
    }
    return this.#deleteFace
  }
  #deleteFace($fileDoc) {
    if(typeof $fileDoc === 'string') {
      this.#_delete.element($fileDoc) 
    } else {
      switch($fileDoc.fs.type) {
        case 'file':
          this.#_delete.file($fileDoc)
          break
        case 'fold':
          this.#_delete.fold($fileDoc)
          break
      }
    }
  }
}