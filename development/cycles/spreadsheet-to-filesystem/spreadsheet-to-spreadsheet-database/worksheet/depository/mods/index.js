import { EventEmitter } from 'node:events'
const Defaults = {
  ModRangeNameRegExp: /^MOD_[0-9]/,
}
export default class Mods extends Map {
  length = 0
  #source = new Map()
  #settings = {}
  #options = {}
  get #ranges() { return this.#settings.ranges }
  get #hidden() { return this.#settings.hidden }
  get #data() { return this.#settings.data }
  constructor($settings = {}, $options = {}) {
    super()
    this.#settings = $settings
    this.#options = $options
    const _mods = this
    const modRanges = this.#ranges
    .getRangesByName(
      new RegExp(Defaults.ModRangeNameRegExp)
    )
    .sort(($rangeA, $rangeB) => (
      $rangeA.Ref.s.r < $rangeB.Ref.s.r
    ) ? -1
      : 1
    )
    console.log('modRanges',modRanges)
    var modRangeClassName
    for(const $modRange of modRanges) {
      const { Name, Ref, Class } = $modRange
      modRangeClassName = Class
      var [$key, $index, $val] = Name.split('_', 3)
      console.log('$key, $index, $val', $key, $index, $val)
      $index = Number($index)
      let mod
      if(_mods.has($index) === true) {
        mod = _mods.get($index) 
      } else {
        _mods.set($index, {
          nom: modRangeClassName, sup: Array, com: Array
        })
        mod = _mods.get($index)
      }
      if(
        $val === 'SUP' ||
        $val === 'COM'
      ) {
        console.log(Array.from(this.#data))
        const modRangeRows = [Array.from(this.#data)]
        .slice(Ref.s.r, Ref.e.r + 1)
        .reduce(($modRangeRows, $modRangeRow) => {
          const modRangeRow = $modRangeRow.slice(
            Ref.s.c, Ref.e.c + 1
          )
          $modRangeRows.push(modRangeRow)
          return $modRangeRows
        }, [])
        var modKey = $val.toLowerCase() 
        mod[modKey] = modRangeRows
      }
      _mods.set($index, mod)
    }
  }
}