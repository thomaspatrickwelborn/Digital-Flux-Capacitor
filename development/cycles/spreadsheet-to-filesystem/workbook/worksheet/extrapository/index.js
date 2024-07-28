import { EventEmitter } from 'node:events'
import { createConnection } from 'mongoose'
import {
  File as FileSchema,
  Fold as FoldSchema,
} from './schemata/index.js'
import Translexis from './translexis/index.js'
const Schemata = { FileSchema, FoldSchema }
export default class Extrapository extends EventEmitter {
  #_compository
  get #compository() { return this.#_compository }
  set #compository($compository) {
    this.#_compository = $compository
    this.#_compository.on(
      'collect:saveCollectDoc',
      ($collectDoc) => {
        // console.log('collect:saveCollectDoc', $collectDoc)
        // this.emit('worksheet:collectDocSave', $collectDoc)
        this.translexis.saveCollectDoc($collectDoc)
      }
    )
    this.#_compository.on(
      'collect:save',
      ($collect) => {
        // console.log('collect:save', $collect)
        // this.emit('worksheet:collectSave', $collect)
        this.translexis.saveCollect($collect)
      }
    )
    this.#_compository.on(
      'saveCollects',
      ($collects) => {
        // console.log('saveCollects', $collects)
        // this.emit('worksheet:collectsSave', $collects)
        this.translexis.saveCollects($collects)
      }
    )
  }
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
  get translexis() { return this.#_translexis }
  set translexis($translexisSettings) {
    const Translexis = Translexes[
      this.#options.className
    ]
    this.#_translexis = new Translexis($translexisSettings)
    this.#_translexis.on(
      'saveCollectDoc',
      ($collectDoc) => {
        console.log('translexis:saveCollectDoc', $collectDoc)
        // this.emit('translexis:saveCollectDoc', $collectDoc)
      }
    )
    this.#_translexis.on(
      'saveCollect',
      ($collect) => {
        console.log('translexis:saveCollect', $collect)
        // this.emit('translexis:saveCollect', $collect)
      }
    )
    this.#_translexis.on(
      'save',
      ($translexis) => {
        console.log('translexis:save', $collect)
        // this.emit('translexis:save', $collect)
      }
    )
  }
  #getDBConnectionModels() {
    return this.#dbConnections.filesystem.models
  }
  #setDBConnectionModels() {
    const modelNames = ['File', 'Fold']
    for(const $modelName of modelNames) {
      if(
        this.#dbConnections.filesystem
        .models[$modelName] === undefined
      ) {
        this.#dbConnections.filesystem.model(
          $modelName, 
          Schemata[`${$modelName}Schema`]
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