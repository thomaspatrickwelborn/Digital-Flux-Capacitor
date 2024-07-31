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
      const globPath = $globPath.replace(
        new RegExp(`^${this.path}/`),
        ''
      )
      Array.prototype.push.call(this, globPath)
      globElementIndex++
    }
  }
  get path() {
    return this.#settings.path
  }
  get stat() {
    this.#_stat = stat(
      this.#settings.filesystem.path,
      ($err, $stat) => {
        if($err) {
          mkdir($fsRootPath, {
            recursive: true,
          }, ($err) => {
            if($err) return $err
            this.#_stat = stat($fsRootPath)
          })
        } else {
          this.#_stat = $stat
        }
      }
    )
    return this.#_stat
  }
  get fsRootWatch() {
    if(this.#_watch === undefined) {
      this.#_watch = chokidar.watch($fsRootPath, {
        ignore: [
          path.join($fsRootPath, 'node_modules/**'),
          path.join($fsRootPath, '.git/**')
        ]
      })
      this.#_watch.on(
        'add',
        ($fsPath) => {
          Array.prototype.unshift.call(this, $fsPath)
        },
      )
      this.#_watch.on(
        'unlink', 
        ($fsPath) => {
          const fsPathIndex = Array.prototype.findIndex.call(
            this, 
            ($fsRootPath) => $fsRootPath === $fsPath
          )
          if(fsPathIndex) {
            Array.prototype.splice.call(this, fsPathIndex, 1)
          }
        }
      )
      this.#_watch.on(
        'addDir', 
        ($fsPath) => {
          Array.prototype.unshift.call(this, $fsPath)
        },
      )
      this.#_watch.on(
        'unlinkDir', 
        ($fsPath) => {
          const fsPathIndex = Array.prototype.findIndex.call(
            this, 
            ($fsRootPath) => $fsRootPath === $fsPath
          )
          if(fsPathIndex) {
            Array.prototype.splice.call(this, fsPathIndex, 1)
          }
        },
      )
    }
    return this.#_watch
  }
}