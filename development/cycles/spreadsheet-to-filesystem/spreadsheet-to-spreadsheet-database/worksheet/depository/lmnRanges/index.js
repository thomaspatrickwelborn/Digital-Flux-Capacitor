import { EventEmitter } from 'node:events'
const LMNRangeDefaults = {
  DEX: Number,
  VAL: String,
  SUBSET: String,
  SUPSET: String,
  PAT: String,
}
export default class LMNRanges extends EventEmitter {
  length = 0
  constructor($settings) {
    super()
    for(const $lmnRange of $settings) {
      Array.prototype.push.call(this, $lmnRange)
    }
  }
  #_LMN
  get LMN() { if(this.#_LMN === undefined) {
    this.#_LMN = Array.prototype.filter.call(
      this,  ($lmnRange) => $lmnRange.Name.match(
        new RegExp(/^LMN_[0-9]*$/)
    ) ) }
    return this.#_LMN
  }
  #_SUPSET
  get SUPSET() { if(this.#_SUPSET === undefined) {
    this.#_SUPSET = Array.prototype.filter.call(
      this, ($lmnRange) => $lmnRange.Name.match(
        new RegExp(/^LMN_[0-9]*_SUPSET$/)
    ) ) }
    return this.#_SUPSET
  }
  #_SUBSET
  get SUBSET() { if(this.#_SUBSET === undefined) {
    this.#_SUBSET = Array.prototype.filter.call(
      this, ($lmnRange) => $lmnRange.Name.match(
        new RegExp(/^LMN_[0-9]*_SUBSET$/)
    ) ) }
    return this.#_SUBSET
  }
  #_PAT
  get PAT() { if(this.#_PAT === undefined) {
    this.#_PAT = Array.prototype.filter.call(
      this, ($lmnRange) => $lmnRange.Name.match(
        new RegExp(/^LMN_[0-9]*_PAT$/)
    ) ) }
    return this.#_PAT
  }
  parseRow($row) {
    const parsement = {}
    iterateLMNRanges: 
    for(const $LMN of this.LMN) {
      const [$rangeName, $rangeIndex] = $LMN.Name.split('_')
      // LMN
      const lmnRangeSlice = $row.slice(
        $LMN.Ref.s.c, $LMN.Ref.e.c + 1
      )
      // DEX
      const DEX = lmnRangeSlice.findIndex(($rowCellLMNRange) => {
        return $rowCellLMNRange !== undefined
      })
      if(DEX === -1) continue iterateLMNRanges
      const VAL = lmnRangeSlice[DEX]
      // SUPSET
      const lmnSupsetRange = this.SUPSET[$rangeIndex]
      let SUPSET
      if(lmnSupsetRange.Ref !== undefined) {
        const lmnSupsetSlice = $row.slice(
          lmnSupsetRange.Ref.s.c, lmnSupsetRange.Ref.e.c + 1
        )
        SUPSET = lmnSupsetSlice[0]
      } else {
        SUPSET = lmnSupsetRange.VAL
      }
      // SUBSET
      const lmnSubsetRange = this.SUBSET[$rangeIndex]
      let SUBSET
      if(lmnSubsetRange.Ref !== undefined) {
        const lmnSubsetSlice = $row.slice(
          lmnSubsetRange.Ref.s.c, lmnSubsetRange.Ref.e.c + 1
        )
        SUBSET = lmnSubsetSlice[0] 
      } else {
        SUBSET = lmnSubsetRange.VAL
      }
      // PAT
      let PAT
      if(this.PAT.length > 0) {
        const lmnPatRange = this.PAT[$rangeIndex].Ref
        const lmnPatSlice = $row.slice(
          lmnPatRange.s.c, lmnPatRange.e.c + 1
        )
        PAT = lmnPatSlice[0]
      }
      Object.assign(parsement, {
        DEX, VAL, SUPSET, SUBSET, PAT
      })
    }
    return parsement
  }
}