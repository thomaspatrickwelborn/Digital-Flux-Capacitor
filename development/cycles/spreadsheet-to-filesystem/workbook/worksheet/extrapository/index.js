import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import Schemata from './schemata/index.js'
import Translexis from './translexis/index.js'
export default class Extrapository extends EventEmitter {
  #_compository
  #options
  #dbConnections
  #_translexis
  constructor($compository = {}, $options = {}) {
    super()
    this.#compository = $compository
    this.#options = $options
    this.#dbConnections = this.#options.dbConnections
    this.#setDBConnectionModels()
    this.translexis = {
      worksheet: this.#options.worksheet,
      models: this.#dbConnections.filesystem.models,
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
        console.log('translexis:saveCollectDoc', $collectDoc)
        this.emit('translexis:saveCollectDoc', $collectDoc)
      }
    )
    this.#_translexis.on(
      'saveCollect',
      ($collect) => {
        console.log('translexis:saveCollect', $collect)
        this.emit('translexis:saveCollect', $collect)
      }
    )
    this.#_translexis.on(
      'saveCollects',
      ($translexis) => {
        console.log('translexis:saveCollects', $collect)
        this.emit('translexis:saveCollects', $collect)
      }
    )
  }
  #getDBConnectionModels() {
    return this.#dbConnections.filesystem.models
  }
  #setDBConnectionModels() {
    const modelNames = ['FSElement']
    for(const $modelName of modelNames) {
      if(
        this.#dbConnections.filesystem
        .models[$modelName] === undefined
      ) {
        this.#dbConnections.filesystem.model(
          $modelName, 
          Schemata[`${$modelName}`]
        )
      }
    }
    return this.#getDBConnectionModels()
  }
  async #deleteDBConnectionModels() {
    await this.#dbConnections.filesystem.dropDatabase()
    const modelNames = this.#dbConnections.filesystem.modelNames()
    const modelNamesLength = modelNames.length
    var modelNamesIndex = 0
    while(modelNamesIndex < modelNamesLength) {
      const modelName = modelNames[modelNamesIndex]
      await this.#dbConnections.filesystem.deleteModel(modelName)
      modelNamesIndex++
    }
    return this.#dbConnections.filesystem.models
  }
}