import Schemata from './Schemata/index.js'
import {
  FSElement,
  FSElementContent,
} from './Models/index.js'
import { EventEmitter } from 'node:events'

export default class Extrapository extends EventEmitter {
  #settings
  #_models
  #_fsElement
  #_fsElementContent
  constructor($settings = {}) {
    super()
    this.#settings = $settings
    this.#models
    this.#fsElement
    this.#fsElementContent
  }
  get #models() {
    if(this.#_models === undefined) {
      this.#_models = {}
      const modelNames = ['FSElement']
      for(const [
        $schemaName, $schema
      ] of Object.entries(Schemata)) {
        let model
        if(
          this.#settings.database
          .models[$schemaName] === undefined
        ) {
          model = this.#settings.database.model(
            $schemaName, 
            $schema
          )
        } else {
          model = this.#settings.database.models[$schemaName]
        }
        this.#_models[$schemaName] = model
      }
    }
    return this.#_models
  }
  get #fsElement() {
    if(this.#_fsElement === undefined) {
      this.#_fsElement = new FSElement({
        models: this.#models
      })
    }
    return this.#_fsElement
  }
  get #fsElementContent() {
    if(this.#_fsElementContent === undefined) {
      this.#_fsElementContent = new FSElementContent({
        models: this.#models
      })
      this.#_fsElementContent.on(
        'saveFileDoc', 
        ($collectDoc) => {
          this.emit(
            'fsElementContent:saveFileDoc',
            $collectDoc
          )
        }
      )
    }
    return this.#_fsElementContent
  }
  async saveCollects($collects, $worksheet) {
    const collects = new Map()
    if(
      $worksheet.name.match(new RegExp(/^VINE/))
    ) {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collect = await this.#fsElement.save(
          $collect, $worksheet
        )
        collects.set($collectName, collect)
      }
    } else {
      for(const [
        $collectName, $collect
      ] of $collects.entries()) {
        const collect = await this.#fsElementContent.save(
          $collect, $worksheet
        )
        collects.set($collectName, collect)
      }
    }
    return collects
  }
}