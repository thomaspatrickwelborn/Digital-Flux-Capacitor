import { Timer } from '#Coutil/index.js'
import { EventEmitter } from 'node:events'
import assignLMNProps from './assignLMNProps/index.js'
import assignPORProps from './assignPORProps/index.js'

const Translexes = [
  ["assignLMNProps", assignLMNProps],
  ["assignPORProps", assignPORProps],
]

export default class Collect extends EventEmitter {
  length = 0
  #settings = {}
  #options = {}
  #database
  constructor($settings, $options) {
    super()
    this.#settings = $settings
    this.#options = $options
    var collect = this
    const {
      mods, composits, lmnRanges
    } = $settings
    const {
      name, className, database
    } = $options
    this.#database = database
    const modsLength = mods.length
    var modsIndex = 0
    iterateMods: 
    while(modsIndex < modsLength) {
      const {
        nom, sup, com
      } = mods[modsIndex][1]
      const [
        $compositIndex, $composit
      ] = composits[modsIndex]
      const Model = database.models[nom]
      const collectRows = $composit
      const collectRowsLength = collectRows.length
      var collectRowsIndex = 0
      iterateCollectRows:
      while(collectRowsIndex < collectRowsLength) {
        const collectRow = collectRows[collectRowsIndex]
        const collectDoc = new Model(collectRow)
        Array.prototype.push.call(collect, collectDoc)
        collectRowsIndex++
      }
      modsIndex++
    }
    const translexes = Translexes
    const translexesLength = translexes.length
    var translexesIndex = 0
    while(translexesIndex < translexesLength) {
      const [
        $translexisName, $translexisMethod
      ] = translexes[translexesIndex]
      const translexisMethodType = $translexisMethod.constructor.name
      $translexisMethod(collect, {
        mods, lmnRanges, composits
      })
      translexesIndex++
    }
  }
  async delete() {
    const collectDocsLength = this.length
    var collectDocsIndex = collectDocsLength - 1
    while(collectDocsIndex > -1) {
      const collectDoc = this[collectDocsIndex]
      await this.#database.models[
        collectDoc.$collection.modelName
      ].findOneAndDelete({
        _id: collectDoc._id
      })
      Array.prototype.splice.call(this, collectDocsIndex, 1)
      this.emit(
        'deleteCollectDoc',
        collectDoc
      )
      collectDocsIndex--
    }
    this.emit(
      'delete',
      this
    )
    return this
  }
  async save() {
    const saveTimer = new Timer({
      name: 'Spreadsheet.Worksheet.Compository.Collect.Save'
    }).start()
    const collectDocsLength = this.length
    var collectDocsIndex = 0
    while(collectDocsIndex < collectDocsLength) {
      const collectDoc = this[collectDocsIndex]
      const savedCollectDoc = await this.#database.models[
        collectDoc.$collection.modelName
      ].findOneAndUpdate({
        _id: collectDoc._id
      }, collectDoc, {
        new: true,
        upsert: true,
      })
      collectDocsIndex++
    }
    saveTimer.stop().log()
    this.emit(
      'save', 
      this
    )
    return this
  }
}
