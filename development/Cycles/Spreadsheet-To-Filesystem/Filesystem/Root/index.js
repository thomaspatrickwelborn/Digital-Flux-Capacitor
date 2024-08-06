import EventEmitter from 'node:events'
import { mkdir, stat } from 'node:fs'
import path from 'node:path'
import chokidar from 'chokidar'

export default class Root extends EventEmitter {
  length = 0
  #settings
  #_stat
  #_watch
  constructor($settings) {
    super()
    this.#settings = $settings
    this.stat
    this.watch
  }
  get stat() {
    this.#_stat = stat(
      this.#settings.path,
      ($err, $stat) => {
        if($err) {
          mkdir(this.#settings.path, {
            recursive: true,
          }, ($err) => {
            this.stat
          })
        } else {
          this.#_stat = $stat
        }
      }
    )
    return this.#_stat
  }
  get watch() {
    if(this.#_watch === undefined) {
      this.#_watch = chokidar.watch(this.#settings.path, {
        ignore: [
          path.join(this.#settings.path, 'node_modules/**'),
          path.join(this.#settings.path, '.git/**')
        ]
      })
      this.#_watch.on(
        'add',
        ($path) => {
          if($path === this.#settings.path) return
          $path = $path.replace(
            new RegExp(`^${this.#settings.path}/`), ''
          )
          if(Array.prototype.includes(this, $path) === false) {
            Array.prototype.unshift.call(this, $path)
          }
        },
      )
      this.#_watch.on(
        'unlink', 
        ($path) => {
          const pathIndex = Array.prototype.findIndex.call(
            this, 
            ($fsRootPath) => $fsRootPath === $path
          )
          if(pathIndex) {
            Array.prototype.splice.call(this, pathIndex, 1)
          }
        }
      )
      this.#_watch.on(
        'addDir', 
        ($path) => {
          if($path === this.#settings.path) return
          $path = $path.replace(
            new RegExp(`^${this.#settings.path}/`), ''
          )
          if(Array.prototype.includes(this, $path) === false) {
            Array.prototype.unshift.call(this, $path)
          }
        },
      )
      this.#_watch.on(
        'unlinkDir', 
        ($path) => {
          const pathIndex = Array.prototype.findIndex.call(
            this, 
            ($fsRootPath) => $fsRootPath === $path
          )
          if(pathIndex) {
            Array.prototype.splice.call(this, pathIndex, 1)
          }
        },
      )
    }
    return this.#_watch
  }
  includes($searchElement, $searchIndex) {
    return Array.prototype.includes.call(
      this, $searchElement, $searchIndex
    )
  }
}