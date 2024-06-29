import { EventEmitter } from 'node:events'
export default class Hidden extends EventEmitter {
  rows = []
  cols = []
  constructor($settings = {}) {
    super()
    this.rows = Object.freeze(
      $settings.rows.hidden.reverse()
    )
    this.cols = Object.freeze(
      $settings.cols.hidden.reverse()
    )
  }
}