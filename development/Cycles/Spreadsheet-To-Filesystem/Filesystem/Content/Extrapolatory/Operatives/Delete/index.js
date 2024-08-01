import Operative from '../Operative/index.js'
import { stat, rm } from 'node:fs/promises'
export default class Update extends Operative {
  constructor($settings) {
    super($settings)
  }
  file($fileDoc) {
    console.log('$fileDoc', $fileDoc)
  }
  fold($foldDoc) {
    console.log('$foldDoc', $foldDoc)

  }
}