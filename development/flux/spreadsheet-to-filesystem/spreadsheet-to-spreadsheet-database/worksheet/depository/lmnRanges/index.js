export default class LMNRanges extends EventTarget {
  length = 0
  constructor($settings) {
    super()
    for(const $lmnRange of $settings) {
      Array.prototype.push.call(this, $lmnRange)
    }
  }
  get LMN() { return Array.prototype.find.call(
    this, 
    ($lmnRange) => $lmnRange.Name.match(new RegExp(/^LMN_[0-9]*$/))
  ) }
  get SUPSET() { return Array.prototype.find.call(
    this,
    ($lmnRange) => $lmnRange.Name.match(new RegExp(/^LMN_[0-9]*_SUPSET$/))
  ) }
  get SUBSET() { return Array.prototype.find.call(
    this,
    ($lmnRange) => $lmnRange.Name.match(new RegExp(/^LMN_[0-9]*_SUBSET$/))
  ) }
  get PAT() { return Array.prototype.find.call(
    this,
    ($lmnRange) => $lmnRange.Name.match(new RegExp(/^LMN_PAT$/))
  ) }
  parseRow($row) {
    const parsement = {}
    let LMN = this.LMN
    let SUPSET = this.SUPSET
    let SUBSET = this.SUBSET
    let PAT = this.PAT
    if(LMN !== undefined) {
      parsement.LMN = $row.slice(LMN.Ref.s.c, LMN.Ref.e.c + 1)
      parsement.LMN_INDEX = parsement.LMN.findIndex(($rowCell) => {
        return $rowCell !== undefined
      })
      parsement.LMN_VAL = parsement.LMN[parsement.LMN_INDEX]
    }
    if(SUPSET !== undefined) {
      parsement.SUPSET = $row.slice(SUPSET.Ref.s.c, SUPSET.Ref.e.c + 1)[0]
    }
    if(SUBSET !== undefined) {
      parsement.SUBSET = $row.slice(SUBSET.Ref.s.c, SUBSET.Ref.e.c + 1)[0]
    }
    if(PAT !== undefined) {
      parsement.PAT = PAT
    }
    return parsement
  }
}