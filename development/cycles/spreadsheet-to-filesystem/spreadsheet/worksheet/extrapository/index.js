import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import Schemata from './schemata/index.js'
import Translexis from './translexis/index.js'
export default class Extrapository extends EventEmitter {
  #_compository
  #options
  #databases
  #_translexis
  constructor($compository = {}, $options = {}) {
    super()
    this.#compository = $compository
    this.#options = $options
    this.#databases = this.#options.databases
    this.#setDBConnectionModels()
    this.translexis = {
      worksheet: this.#options.worksheet,
      models: this.#databases.filesystem.models,
    }
  }
  get #compository() { return this.#_compository }
  set #compository($compository) {
    this.#_compository = $compository
  }
  get translexis() { return this.#_translexis }
  set translexis($translexisSettings) {
    this.#_translexis = new Translexis($translexisSettings)
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
  #getDBConnectionModels() {
    return this.#databases.filesystem.models
  }
  #setDBConnectionModels() {
    const modelNames = ['FSElement']
    for(const $modelName of modelNames) {
      if(
        this.#databases.filesystem
        .models[$modelName] === undefined
      ) {
        this.#databases.filesystem.model(
          $modelName, 
          Schemata[`${$modelName}`]
        )
      }
    }
    return this.#getDBConnectionModels()
  }
  async #deleteDBConnectionModels() {
    await this.#databases.filesystem.dropDatabase()
    const modelNames = this.#databases.filesystem.modelNames()
    const modelNamesLength = modelNames.length
    var modelNamesIndex = 0
    while(modelNamesIndex < modelNamesLength) {
      const modelName = modelNames[modelNamesIndex]
      await this.#databases.filesystem.deleteModel(modelName)
      modelNamesIndex++
    }
    return this.#databases.filesystem.models
  }
}