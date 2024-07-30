import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import Schemata from './schemata/index.js'
import Translexis from './translexis/index.js'
export default class Extrapository extends EventEmitter {
  #_compository
  #settings
  #databases
  #_databaseModels
  #_translexis
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#databases = this.#settings.databases
    // this.#setDBConnectionModels()
    // this.translexis = 
  }
  get translexis() {
    if(this.#_translexis === undefined) {
      this.#_translexis = new Translexis({
        worksheet: this.#settings.worksheet,
        models: this.#databases.filesystem.models,
      })
      this.#_translexis.on(
        'saveCollectDoc',
        ($collectDoc) => {
          this.emit('translexis:saveCollectDoc', $collectDoc)
        }
      )
      this.#_translexis.on(
        'saveCollect',
        ($collect) => {
          this.emit('translexis:saveCollect', $collect)
        }
      )
      this.#_translexis.on(
        'saveCollects',
        ($collects) => {
          this.emit('translexis:saveCollects', $collects)
        }
      )
    }
    return this.#_translexis
  }
  get #databaseModels() {
    const modelNames = ['FSElement']
    for(const [
      $schemaName, $schema
    ] of Object.entries(Schemata)) {
      if(
        this.#databases.filesystem
        .models[$schemaName] === undefined
      ) {
        this.#databases.filesystem.model(
          $schemaName, 
          $schema
        )
      }
    }
    return this.#databases.filesystem.models
  }
}