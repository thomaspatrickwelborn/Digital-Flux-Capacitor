import Operative from '../Operative/index.js'
import path from 'node:path'
import { stat, rm } from 'node:fs/promises'
export default class Delete extends Operative {
  constructor($settings) {
    super($settings)
  }
  get #root() { return this.settings.root }
  async element($fileDoc) {
    const rmFileDocPath = path.join(
      this.#root.path,
      $fileDoc
    )
    const rmFileDoc = await rm(rmFileDocPath, {
      recursion: true,
      force: true,
    })
    return rmFileDoc
  }
  async file($fileDoc) {
    const rmFileDocPath = path.join(
      this.#root.path,
      $fileDoc.fs.path
    )
    const rmFileDoc = await rm(
      rmFileDocPath, 
      {
        recursion: true,
        force: true,
      }
    )
    return rmFileDoc
  }
  async fold($foldDoc) {
    const rmFoldDocPath = path.join(
      this.#root.path,
      $foldDoc.fs.path,
    )
    const rmFoldDoc = await rm(rmFoldDocPath, {
      recursion: true,
      force: true,
    })
    return rmFoldDoc
  }
}