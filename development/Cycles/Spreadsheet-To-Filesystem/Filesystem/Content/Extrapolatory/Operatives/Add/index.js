import { Timer } from '#Coutil/index.js'
import Operative from '../Operative/index.js'
import path from 'node:path'
import { mkdir, writeFile, stat } from 'node:fs/promises'
export default class Add extends Operative {
  constructor($settings) {
    super($settings)
  }
  async file($fileDoc) {
    const fileDocPath = path.join(
      this.settings.root.path,
      $fileDoc.fs.path,
    )
    await writeFile(fileDocPath, '')
    return 
  }
  async fold($foldDoc) {
    const foldDocPath = path.join(
      this.settings.root.path,
      $foldDoc.fs.path,
    )
    await mkdir(foldDocPath, {
      recursive: true,
    })
    return $foldDoc
  }
}