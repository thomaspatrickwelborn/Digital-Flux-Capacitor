import EventEmitter from 'node:events'
import { mkdir, stat } from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'
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
    this.glob
    this.watch
  }
  get path() { return this.#settings.path }
  get glob() {
    const glob = globSync(
      path.join(this.path, '**/*'),
      {
        dot: true,
        ignore: [
          path.join(this.path, 'node_modules/**'),
          path.join(this.path, '.git/**')
        ]
      }
    )
    let globElementIndex = 0
    while(globElementIndex < glob.length) {
      const globPath = glob[globElementIndex].replace(
        new RegExp(`^${this.path}/`),
        ''
      )
      Array.prototype.push.call(this, globPath)
      globElementIndex++
    }
    return this
  }
  get stat() {
    this.#_stat = stat(
      this.path,
      ($err, $stat) => {
        if($err) {
          mkdir(this.path, {
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
      this.#_watch = chokidar.watch(this.path, {
        ignore: [
          path.join(this.path, 'node_modules/**'),
          path.join(this.path, '.git/**')
        ]
      })
      this.#_watch.on(
        'add',
        ($path) => {
          Array.prototype.unshift.call(this, $path)
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
          Array.prototype.unshift.call(this, $path)
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