import EventEmitter from 'node:events'
import path from 'node:path'
import { writeFile, mkdir } from 'node:fs'
import mongoose from 'mongoose'
import Root from './Root/index.js'
import Content from './Content/index.js'

export default class Filesystem extends EventEmitter {
  #settings
  #_root
  #_database
  #_content
   constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#database
  }
  get #database() {
    if(this.#_database === undefined) {
      const database = this.#settings.database
      this.#_database = mongoose.createConnection(
        database.uri, database.options
      )
      .once(
        'connected', 
        async () => {
          await this.#_database.dropDatabase()
          this.#root
          this.content
        }
      )
    }
    return this.#_database
  }
  get #root() {
    if(this.#_root === undefined) {
      this.#_root = new Root(
        this.#settings.root
      )
    }
    return this.#_root
  }
  get content() {
    if(this.#_content === undefined) {
      this.#_content = new Content(Object.assign(
        {
          root: this.#root,
          database: this.#database
        },
        this.#settings.content
      ))
    }
    return this.#_content
  }
  
}
