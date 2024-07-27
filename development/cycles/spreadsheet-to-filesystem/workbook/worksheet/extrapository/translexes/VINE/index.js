import { EventEmitter } from 'node:events'
import { Model } from 'mongoose'
import collectDocsToCollectObjects from './collectDocsToCollectObjects/index.js'
import assignPORProps from './assignPORProps/index.js'
import transormCollectDocs from './transformCollectDocs/index.js'

export default class VINE extends EventEmitter {
  #settings
  length = 0
  constructor($settings) {
    super()
    this.#settings = $settings
    // const { worksheet } = $settings
    // for(let $collectDoc of Array.from($collect)) {
    //   Array.prototype.push.call(this, $collectDoc)
    // }
    // collectDocsToCollectObjects(this, worksheet)
    // assignPORProps(this, worksheet)
    // transormCollectDocs(this, worksheet)
  }
  async saveCollectDoc($collectDoc) {
    console.log('saveCollectDoc', $collectDoc)
    return this
  }
  async saveCollect($collect) {
    console.log('saveCollect', $collect)
    return this
  }
  async saveCollects($collects) {
    console.log('saveCollects', $collects)
    // const { models } = this.#settings
    // const { File, Fold } = models
    // const collectDocsLength = this.length
    // var collectDocsIndex = 0
    // while(collectDocsIndex < collectDocsLength) {
    //   let collectDoc = this[collectDocsIndex]
    //   let fsDoc
    //   if(collectDoc.fs.type === 'File') {
    //     fsDoc = await File.findOneAndReplace({
    //       'fs.id': collectDoc.fs.id,
    //       'fs.path': collectDoc.fs.path,
    //     }, collectDoc, {
    //       returnDocument: 'after'
    //     })
    //     if(fsDoc === null) {
    //       fsDoc = await File.findOneAndUpdate({
    //         'fs.id': collectDoc.fs.id,
    //         'fs.path': collectDoc.fs.path,
    //       }, collectDoc, {
    //         upsert: true,
    //         new: true,
    //       })
    //     }
    //     this.emit(
    //       'saveCollectDoc',
    //       fsDoc
    //     )
    //   } else
    //   if(collectDoc.fs.type === 'Fold') {
    //     fsDoc = await Fold.findOneAndReplace({
    //       'fs.id': collectDoc.fs.id,
    //       'fs.path': collectDoc.fs.path,
    //     }, collectDoc, {
    //       returnDocument: 'after'
    //     })
    //     if(fsDoc === null) {
    //       fsDoc = await Fold.findOneAndUpdate({
    //         'fs.id': collectDoc.fs.id,
    //         'fs.path': collectDoc.fs.path,
    //       }, collectDoc, {
    //         upsert: true,
    //         new: true,
    //       })
    //     }
    //     this.emit(
    //       'saveCollectDoc',
    //       fsDoc
    //     )
    //   }
    //   this[collectDocsIndex] = fsDoc
    //   this.emit(
    //     'saveCollect',
    //     this[collectDocsIndex]
    //   )
    //   collectDocsIndex++
    // }
    // this.emit(
    //   'save',
    //   Array.from(this)
    // )
    return this
  }
}