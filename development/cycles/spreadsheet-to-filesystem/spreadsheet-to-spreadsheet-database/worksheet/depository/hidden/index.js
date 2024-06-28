import { EventEmitter } from 'node:events'
export default class Hidden extends EventEmitter {
  rows = []
  cols = []
  constructor($settings = {}) {
    super()
    this.rows = $settings.rows.hidden
    this.cols = $settings.cols.hidden
  }
}